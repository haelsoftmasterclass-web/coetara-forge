# PRD Part 5: Domain Architecture (Sections 17 to 27)

This part describes how each major area of the product works internally: the data it owns, the rules it enforces and the events it emits. Full table definitions are in [Section C: Database ERD](./C-database-erd.md), endpoints in [Section D: API](./D-api-specification.md), permissions in [Section E: RBAC](./E-rbac-matrix.md).

---

## 17. Database architecture

### 17.1 Principles

1. **PostgreSQL is the source of truth.** Redis and search indexes are caches that can be rebuilt.
2. **Every tenant-owned table has `organization_id uuid not null`**, a foreign key to `organizations`, an index that starts with `organization_id`, and an RLS policy (see [Part 2, 8.3](./02-prd-saas-architecture.md)).
3. **Primary keys are UUIDv7** (time-ordered, so indexes stay efficient; safe to expose in URLs; no guessable sequence numbers).
4. **Human-readable codes** where people need them: certificate numbers (`ETEN-CERT-2026-001284`), order numbers (`ORD-2026-000913`), invoice numbers. Generated per tenant via a `sequences` table, unique per tenant.
5. **Money:** `amount_minor bigint` + `currency char(3)`. ₦30,000.00 is stored as `3000000` with `NGN`. Never floats.
6. **Timestamps:** `timestamptz`, stored in UTC; displayed in the user's timezone.
7. **Soft deletes** (`deleted_at`) for user-facing content (courses, lessons) so mistakes can be undone; **hard deletes** for personal data on erasure requests (with anonymisation of linked records).
8. **Append-only** for money (`ledger_entries`), attempts, audit logs and certificate issue records. Corrections are new rows, never edits.
9. **Status columns use Postgres enums or check constraints**, with transitions enforced in the domain layer.
10. **JSONB only for genuinely flexible data** (settings, lesson content blocks, question options), validated against a schema in code. Anything queried or joined frequently is a real column.

### 17.2 Domains and their main tables

| Domain | Main tables |
| --- | --- |
| Platform | organizations, domains, organization_branding, organization_settings, feature_flags, plans, plan_features, organization_limits, subscriptions, invoices, usage_counters |
| Identity & access | users, user_identities, user_mfa_factors, sessions, organization_memberships, roles, permissions, role_permissions, membership_roles, invitations |
| Catalog | categories, courses, course_instructors, course_modules, lessons, lesson_resources, media_assets |
| Learning | enrollments, lesson_progress, course_progress, learning_paths, learning_path_steps, path_enrollments |
| Assessment | assessments, questions, question_options, assessment_questions, attempts, attempt_answers, rubrics, grades |
| Projects | projects, project_submissions, submission_files, project_reviews |
| Skills | skills, skill_levels, entity_skills (tags), learner_skills, skill_evidence |
| Mentorship | mentor_profiles, mentor_offerings, availability_rules, availability_exceptions, bookings, mentorship_sessions, session_notes, mentorship_programmes, mentorship_recommendations |
| Cohorts | cohorts, cohort_members, cohort_events, attendance |
| Credentials | credential_templates, credentials (certificates and badges), credential_events |
| Commerce | products, prices, orders, order_items, coupons, coupon_redemptions, refunds |
| Payments | payment_provider_accounts, payments, payment_events (webhooks), transactions |
| Payouts | earnings (ledger_entries), payout_accounts, payout_runs, payouts, commission_rules |
| Corporate | org_units (departments/teams), org_unit_members, assignments |
| Profiles & talent | professional_profiles, profile_visibility, talent_consents, contact_requests |
| Community | spaces, threads, posts, reactions, moderation_reports |
| Notifications | notification_templates, notifications, notification_deliveries, notification_preferences |
| Analytics | analytics_events (partitioned), daily_aggregates |
| AI | ai_conversations, ai_messages, ai_usage, content_chunks (pgvector), ai_feedback |
| Audit | audit_logs (partitioned by month) |
| Reviews | reviews (polymorphic target: course, mentor, session, expert service) |

The master prompt listed `learners`, `instructors`, `mentors`, `experts` as entities. In this design, **those are roles on a membership, not separate person tables**; the role-specific data lives in profile tables (`mentor_profiles`, `instructor_profiles`, `expert_profiles`). This avoids duplicating a person four times when they hold four roles.

### 17.3 Scaling the database

- Large, append-heavy tables (`analytics_events`, `audit_logs`, `lesson_progress` events, `ai_usage`) are **partitioned by month**, so old partitions can be archived cheaply.
- Read replicas for reporting and dashboards from Phase 2.
- Connection pooling (PgBouncer) from launch.
- Enterprise tenants can be moved to a dedicated database later because of strict tenant scoping (see Section J).

---

## 18. API architecture

Summary here; endpoint list in [Section D](./D-api-specification.md).

- **REST, JSON, versioned in the path:** `/api/v1/...`. Breaking changes go to `/api/v2`; v1 supported for at least 12 months after v2.
- **OpenAPI 3.1 spec** is the contract, generated from code annotations and published at `/api/v1/docs` (internal) and on a developer portal (Phase 3). The Next.js app uses a **typed client generated from the spec**, so frontend and backend can't drift.
- **Resource-oriented URLs**, plural nouns, nested only one level (`/courses/{id}/modules`).
- **Authentication:**
  - Web app: Laravel Sanctum **cookie session** (HttpOnly, Secure, SameSite=Lax) + CSRF token.
  - Mobile apps: Sanctum **bearer tokens** (short-lived access + refresh rotation).
  - Partner/server integrations (P3): **OAuth 2.0 client credentials** or scoped API keys per tenant.
- **Tenant context:** from hostname (web) or `X-Organization-Id` header (mobile/integrations). The API checks membership on every authenticated call.
- **Errors:** RFC 9457 "problem details" JSON with a stable `code`, e.g. `{"type": "...", "title": "Plan limit reached", "status": 402, "code": "plan_limit_reached", "detail": "...", "errors": {...}}`.
- **Validation:** Laravel Form Requests; field errors returned under `errors`.
- **Pagination:** cursor-based (`?cursor=...&limit=25`, max 100) for lists; consistent `meta.next_cursor`.
- **Filtering and sorting:** `?filter[status]=published&sort=-created_at`.
- **Idempotency:** `Idempotency-Key` header required on POSTs that create money movements (checkout, refund, payout).
- **Rate limits:** per user, per tenant and per IP; responses carry `RateLimit-*` headers; 429 on breach.
- **Webhooks out (P3):** tenants subscribe to events (`enrollment.created`, `credential.issued`), signed with HMAC.
- **GraphQL later:** the service layer (not controllers) holds the logic, so a GraphQL layer can be added on top without duplicating rules.

---

## 19. Authentication and RBAC

Summary here; the full matrix is in [Section E](./E-rbac-matrix.md).

### 19.1 Authentication

| Capability | Design | Phase |
| --- | --- | --- |
| Email + password | Argon2id hashing; minimum 10 characters; check against known breached passwords (k-anonymity API) | MVP |
| Email verification | Required before purchase or community posting | MVP |
| Social login | Google, Microsoft (OIDC); linked to the same `users` row by verified email | MVP |
| MFA | TOTP authenticator apps + recovery codes; enforceable per tenant for admin roles | MVP (Should) |
| Sessions | Server-side sessions in Redis; list and revoke; idle timeout 30 days learners, 12 hours admins (configurable) | MVP |
| Account lockout | Progressive delays after failed attempts; CAPTCHA after threshold | MVP |
| Enterprise SSO | SAML 2.0 + OIDC per tenant (Entra ID, Okta, Google Workspace); domain-based routing | P3 |
| SCIM | Automatic provisioning from the customer's identity provider | P3 |
| Passkeys | WebAuthn | P3 |

### 19.2 RBAC model

```text
permission  = an action key, e.g. "courses.publish", "payouts.approve"
role        = a named bundle of permissions, e.g. "Instructor"
membership  = a user in an organisation; has one or more roles
scope       = where the permission applies: own | team | organisation | platform
```

- **System roles** (Platform Super Admin, Platform Support, Org Owner, Org Admin, Instructor, Mentor, Expert, Learner, Corporate Manager, Reviewer, Recruiter) are defined by the platform and can't be deleted.
- **Custom roles** (P2): tenants combine permissions from the catalogue into their own roles (e.g. "Content Editor").
- **Ownership checks** are done in Laravel **Policies**, not just roles. Example: an Instructor has `courses.update` with scope `own`, so the policy also checks they are listed in `course_instructors` for that course.
- **Team scope:** a Corporate Manager has `reports.view` with scope `team`; the policy limits results to people in org units they manage (and sub-units).
- **Platform roles** live on a separate `platform_staff` record, not on a tenant membership, and use a separate admin hostname.
- New roles are added by inserting rows, not by changing code paths, as long as they reuse existing permission keys.

---

## 20. Payment architecture

Summary; full money design in [Section H](./H-monetization-architecture.md).

```text
         Commerce (what is being bought)            Payments (how money moves)
 ┌────────────────────────────────────────┐   ┌───────────────────────────────────┐
 │ products → prices → orders/order_items │──►│ PaymentGateway interface          │
 │ coupons, tax, receipts                 │   │   ├── PaystackGateway             │
 └────────────────────────────────────────┘   │   ├── FlutterwaveGateway (P2)     │
                    │                         │   └── StripeGateway               │
                    ▼                         │ payments, payment_events (webhooks)│
          Fulfilment (on payment success)     └───────────────────────────────────┘
          enrol / book / activate                            │
                    │                                        ▼
                    ▼                           Ledger (double-entry style)
          Commission engine ──────────────────► ledger_entries: who is owed what
                                                             │
                                                             ▼
                                                 Payouts (runs → transfers)
```

Key rules:
- **One interface** (`PaymentGateway`) with methods like `createCheckout`, `verifyPayment`, `refund`, `createTransferRecipient`, `transfer`, `parseWebhook`. Business code never calls Paystack/Stripe SDKs directly.
- **Provider routing:** per tenant and currency (e.g. NGN → Paystack; USD/GBP/EUR → Stripe). Configurable.
- **Webhooks are the source of truth** for success, not the browser redirect. Every webhook is signature-verified, stored raw in `payment_events`, processed once (idempotent on provider event ID), and retried by a job if processing fails.
- **Reconciliation job** runs daily: compares provider settlement reports with internal `payments`; mismatches raise alerts.
- **No card data touches our servers.** Hosted checkout / provider-hosted fields only, keeping PCI DSS scope minimal (SAQ A).

---

## 21. Mentorship architecture

### 21.1 Concepts

| Concept | Meaning |
| --- | --- |
| Mentor profile | Public profile + approval status, per tenant |
| Offering | Something a mentor sells or gives: `free_intro`, `single_session`, `monthly`, `programme`, `group_session` |
| Availability | Weekly rules (e.g. Tue/Thu 18:00 to 21:00 WAT) + exceptions (holidays) + buffers + minimum notice + maximum days ahead |
| Booking | A reserved time slot for an offering, by a learner |
| Session | The meeting itself (held, no-show, cancelled), with notes and rating |
| Programme enrolment | A purchased multi-session package (e.g. 8 sessions over 8 weeks) with session credits |
| Recommendation | A mentor's personalised suggestion after an intro, which becomes an offer page |

### 21.2 Booking engine

1. Learner opens mentor profile → sees offerings → picks one.
2. API computes **available slots**: availability rules in mentor's timezone → minus existing bookings and buffers → minus exceptions → minus synced calendar busy times (P2) → converted to the learner's timezone.
3. Learner picks slot → API places a **hold** (10 minutes, row with status `held`, protected by a unique constraint on mentor + start time to prevent double booking).
4. Free intro: eligibility check (21.3) → booking confirmed. Paid: checkout → on payment webhook, booking confirmed. Hold expires if unpaid.
5. Confirmation emails with `.ics` to both; reminders at 24 h and 1 h (configurable).
6. Meeting link: MVP uses the mentor's saved personal meeting link (stated clearly in the UI; no fake integration). P2 generates per-session Zoom/Meet/Teams links via integrations.
7. After the session time: both parties mark held / no-show. If neither does within 48 h, it's auto-marked held (configurable). Learner is prompted to rate.

### 21.3 Free 30-minute introduction model (ETEN default)

Configurable per tenant in `organization_settings.mentorship.free_intro`:

| Setting | ETEN default | Purpose |
| --- | --- | --- |
| `enabled` | true | Tenant can switch off |
| `duration_minutes` | 30 | |
| `per_learner_per_mentor` | 1 | One free intro per mentor relationship |
| `per_learner_rolling_limit` | 3 per 90 days | Stops people collecting free consultations |
| `requires_verified_email` | true | Anti-abuse |
| `requires_goal_statement` | true | Learner writes 1 to 3 sentences on goals; makes the session productive |
| `mentor_opt_in` | true | Each mentor chooses whether to offer free intros; the platform can require it for ETEN mentors |
| `mentor_max_free_per_week` | 5 | Protects mentor time |
| `no_show_penalty` | Learner loses free-intro eligibility for 30 days after a no-show | Fairness to mentors |

### 21.4 Free-to-paid conversion (the recommendation flow)

The master prompt is explicit: no "your 30 minutes are over, pay now". The design:

1. **After the intro**, the mentor's dashboard shows a **"Recommend next steps"** task (highlighted until done, nudged at 24 h).
2. Mentor fills a short form:
   - Summary of the learner's goal (shared with learner)
   - Recommended option(s): one-off session, monthly mentorship, a mentorship programme, a learning path, a certification track, a project, a career programme (from the tenant's catalogue and the mentor's offerings)
   - Optional personal note and price (within allowed range; can apply a discount)
   - Validity (default 14 days)
3. Platform creates a **Recommendation** and a **personalised offer page** for the learner:

```text
 Recommended for you by Tunde Adebayo
 "Based on our chat, you have solid fundamentals. The fastest way to your goal
  of passing AZ-104 is structured practice on networking and identity."

 ┌──────────────────────────────────────────────────────────┐
 │ Azure Cloud Architecture: 8-Week Mentorship Programme      │
 │ 8 sessions · Practical project · Certification guidance    │
 │ Technical reviews                                           │
 │ ₦150,000                    [ Start programme ]             │
 └──────────────────────────────────────────────────────────┘
 Also suggested: Azure Networking Fundamentals (course) · Free

 Not ready yet? [Save for later]  [Ask Tunde a question]
```

4. Learner gets an email and in-app notification. "Save for later" keeps the offer in My Mentorship. A reminder is sent once before expiry. No more.
5. Conversion is tracked: `recommendation.viewed`, `recommendation.accepted`, `recommendation.expired` (feeds the free-to-paid metric).

### 21.5 Pricing boundaries and commission

- Tenant sets `min/max` price per offering type and currency (ETEN example: single session ₦10,000 to ₦100,000).
- Mentor sets their price within the range. Prices outside need admin approval.
- Commission rule from `commission_rules` (ETEN default: 20% platform fee on mentorship). Worked example from the master prompt: ₦30,000 session → ETEN ₦6,000, mentor ₦24,000. Payment processing fees are handled per Section H (default: absorbed by the platform share, configurable).

### 21.6 Cancellation and no-show policy (defaults, configurable)

| Situation | Outcome |
| --- | --- |
| Learner cancels > 24 h before | Full refund or session credit |
| Learner cancels < 24 h | 50% credit (configurable) |
| Learner no-show | No refund; mentor paid |
| Mentor cancels or no-show | Full refund or rebooking; mentor reliability score reduced |
| Dispute | Admin reviews; can refund and reverse mentor earning (ledger reversal) |

---

## 22. Learning architecture

### 22.1 Content model

- Course → Modules → Items. An item is a **Lesson** (video, audio, text, PDF, file, link, embed), a **Quiz**, or an **Assignment**. Items are ordered with a `position` column.
- Lesson text is stored as structured JSON blocks (headings, paragraphs, code, callouts, images), not raw HTML, so it renders safely on web and mobile and can be split into chunks for AI later.
- Media files go to R2 (or Cloudflare Stream for video) through **direct, signed uploads** from the browser; the API only issues upload URLs and records metadata.
- Paid video uses signed, expiring playback URLs.

### 22.2 Progress model

```text
lesson_progress (per learner per lesson): status, percent, last_position_seconds, completed_at
course_progress (per enrolment): completed_items, total_items, percent, last_item_id
```

- Video: the player reports position every 15 seconds; lesson completes at 90% (configurable).
- Text/PDF: completes on "Mark complete" (optionally after a minimum time on page).
- Quiz: completes when passed (or attempted, per setting).
- Module completes when all required items complete; course completes when all required modules and the final assessment (if any) complete.
- Course progress is recalculated by an event listener on lesson completion (not on every read).
- If a course changes after a learner enrols (new lesson added), totals are recalculated; already-completed courses stay complete (versioning in P2 makes this precise).

### 22.3 Learning paths (P2)

- `learning_paths` → `learning_path_steps` (type: course | assessment | project | mentorship | cohort | external; `required` boolean; `prerequisite_step_ids`; `position`).
- Completion rule stored as structured JSON: `{"required": "all", "optional_min": 1, "min_final_score": 70, "deadline_days": 180}`.
- Path progress listens to the same events (`CourseCompleted`, `AssessmentPassed`, `ProjectApproved`, `MentorshipProgrammeCompleted`).
- On completion: `LearningPathCompleted` → credential + skill evidence.

### 22.4 Enrolment sources

`purchase`, `free`, `coupon`, `assignment` (corporate), `cohort`, `path` (enrolled as part of a path), `admin_grant`, `subscription` (P2 all-access). Source is stored for reporting and to decide access when something changes (e.g. refund revokes purchase-based enrolment, not admin grants).

---

## 23. Assessment architecture

- **Question bank per tenant**, optionally scoped to a course. Questions have type, stem (rich text), options, correct answer(s), explanation, points, difficulty, skill tags.
- **Assessment** = settings + selected questions (fixed list in MVP; random pools in P2).
- **Attempt lifecycle:** `started` → `submitted` → `auto_graded` / `awaiting_manual_grading` → `graded`. Timer enforced server-side (start time stored; late submissions beyond grace rejected).
- **Snapshotting:** each attempt stores a copy of the questions as shown (`attempt_answers.question_snapshot`), so editing a question later doesn't change past results.
- **Auto-grading:** MCQ, multi-select (all-or-nothing or partial credit, configurable), true/false, short answer (exact or keyword match, case-insensitive).
- **Manual grading (P2):** essays, scenarios, practical tasks go to the reviewer queue with a rubric (criteria × levels × points).
- **Analytics:** per attempt: score, time, per-skill-tag score → strengths/weaknesses. Per question: difficulty index and discrimination (to spot bad questions).
- **Security:** correct answers never sent to the browser before submission; answer options shuffled server-side; rate limit on attempts.

---

## 24. Credential architecture

### 24.1 Issuance

1. Trigger events: `CourseCompleted`, `LearningPathCompleted`, `CohortCompleted`, `AssessmentPassed` (if configured), or manual issue by admin.
2. Rules per course/path: which template, whether a minimum score is needed, expiry (e.g. 2 years for compliance).
3. `credentials` row created with:
   - `code`: human-readable, unique per tenant prefix, e.g. `ETEN-CERT-2026-001284` (prefix from tenant settings, year, zero-padded sequence)
   - `verification_token`: long random string used in the URL so codes can't be enumerated
   - snapshot of learner name, programme title, organisation name, dates (so later renames don't alter issued certificates)
   - `content_hash`: SHA-256 of the canonical certificate data, signed with the platform's key (tamper evidence)
4. Queue job renders the PDF from the tenant's HTML template (logo, colours, signatures), with the QR code pointing to `https://{tenant-domain}/verify/{code}?t={token}`, stores it in R2, and notifies the learner.

### 24.2 Verification

- Public page `/verify` (search by code) and `/verify/{code}`.
- Shows: status (Valid / Revoked / Expired), learner name, programme, issuer, issue/completion/expiry dates, skills (P2). It shows nothing else about the learner unless their public profile is linked and public.
- Revocation shows reason category ("issued in error", "academic misconduct") and date.
- Verification page views are logged (count, country, referrer) for the "third-party verifications" metric, without storing visitor personal data.
- If the tenant has left the platform, verification keeps working from the retained minimal record.

### 24.3 Future-proofing

- P2: badges for skills and achievements.
- P3: export as **Open Badges 3.0 / W3C Verifiable Credentials** (signed JSON) so credentials work in external wallets and with employers' systems.

---

## 25. AI architecture

Summary; full design in [Section I](./I-ai-architecture.md).

- **AI Gateway** module: the only place that talks to AI providers. Provider adapters (e.g. Anthropic, OpenAI, Azure OpenAI, open-weight models) behind one interface; model choice per feature is configuration.
- **Retrieval-augmented generation (RAG):** course content, transcripts and tenant-approved resources are chunked, embedded and stored in `pgvector`, always filtered by `organization_id` and by what the learner is enrolled in.
- **Grounded answers with citations**; if retrieval finds nothing relevant, the assistant says so rather than inventing an answer.
- **Per-tenant controls:** enable/disable per feature, monthly credit budget, data-use settings.
- **Human oversight:** AI-generated questions and AI-suggested grades require human approval before they count.

---

## 26. Corporate architecture (P2)

- A company can be served in **two ways**, using the same building blocks:
  1. **Own tenant ("Corporate Academy")**: the company is an `organization` of type `company`; private courses, internal branding, own admins.
  2. **Corporate account inside another tenant** (e.g. a company buying 50 seats in ETEN Academy): modelled as an `org_unit` of type `client_account` inside ETEN, with a seat allocation and its own managers. Employees are ETEN members who belong to that unit.
- **Org units:** a tree (`org_units` with `parent_id`, `type`: department | team | client_account | faculty | class). Members linked by `org_unit_members` with `is_manager`.
- **Assignments:** `assignments` (assignee: user or org unit; item: course, path, assessment, mentorship programme; due date; required flag). Assigning to a team creates per-person assignment records at assignment time, and new team members inherit active team assignments.
- **Reporting:** manager scope = units they manage + descendants. Aggregates computed nightly per unit.
- **Seats:** `seat_allocations` with purchased quantity, used count; enforced on invite.
- **Billing:** invoice-based contracts (PO number, net terms) via `invoices` with manual or bank-transfer payment recording.

---

## 27. Marketplace architecture

- **Sellers:** Instructors (courses), Mentors (sessions, programmes), Experts (services, P2). Each has a profile per tenant and an approval status (`applied`, `approved`, `suspended`).
- **Listings:** courses, mentor offerings, expert service offers; all are `products` in Commerce with `seller_membership_id`.
- **Commission rules** (`commission_rules` table) matched by: tenant, product type, seller (override), category, and date range. Highest-specificity rule wins. Examples (ETEN, assumptions to validate):

| Product type | Default platform share | Seller share |
| --- | --- | --- |
| Mentorship session/programme | 20% | 80% |
| Marketplace course (ETEN traffic) | 30% | 70% |
| Marketplace course (seller's own referral link) | 10% | 90% |
| Expert service | 20% | 80% |

- **Earnings ledger:** each paid order creates ledger entries: platform fee, seller earning (status `pending` until the holding period ends, default 7 days after session/purchase, or after refund window), processing fee. Refunds create reversing entries.
- **Payouts:** sellers add a verified bank account (via provider's account-resolution API). Payout runs are created weekly or monthly; MVP requires admin approval; P2 automates via provider transfers. Minimum payout threshold configurable.
- **Trust and quality:** ratings, reviews (verified purchasers only), response times, reliability scores, admin moderation, dispute workflow (P2).
- **Tax:** VAT/withholding handling depends on jurisdiction; fields exist on orders and payouts (`tax_amount_minor`, `withholding_amount_minor`). Rules to be confirmed with a tax adviser before launch.
