# F. MVP Development Plan

**10 sprints of 2 weeks (about 20 weeks)**, assuming the core team in [Part 7, Section 40](./07-prd-commercial.md#40-product-roadmap): 2 backend, 2 frontend, 1 product designer, part-time QA/DevOps, 1 product manager. Design runs one sprint ahead of build.

### Definition of Done (applies to every story in every sprint)

- Code reviewed and merged behind a feature flag if incomplete
- Unit and feature tests written; tenant-isolation tests pass for new endpoints
- New endpoints in the OpenAPI spec; typed client regenerated
- Permissions mapped (RBAC CI check passes)
- Audit log entries for sensitive actions
- Responsive (360 px to 1440 px) and keyboard accessible; axe has no serious violations
- Empty, loading and error states implemented
- Deployed to staging and demoed with the two seeded tenants ("ETEN Demo", "Acme Training Demo")

### Overview

| Sprint | Theme | Key outcome |
| --- | --- | --- |
| S0 | Foundations | Repos, CI/CD, environments, design system base |
| S1 | Tenancy, identity, RBAC | Two isolated tenants; users log in and switch academies |
| S2 | Catalogue and course builder | Instructors build courses |
| S3 | Learning experience | Learners enrol in free courses and track progress |
| S4 | Assessments and learner dashboard | Quizzes, final assessment, dashboard v1 |
| S5 | Payments and commerce | Paid courses with Paystack + Stripe, ledger |
| S6 | Mentorship I | Profiles, availability, booking, free intro |
| S7 | Mentorship II and payouts | Paid sessions, recommendations, earnings, payouts |
| S8 | Credentials and SaaS | Certificates, verification, plans, tenant onboarding, branding, domains |
| S9 | Analytics, notifications and launch hardening | Dashboards, security, performance, launch |

---

## S0. Foundations

**Objective:** Everything needed to build safely and quickly.

| Area | Work |
| --- | --- |
| Features | None user-facing; engineering platform |
| Backend | Laravel app skeleton with module folders; config for Postgres, Redis, Horizon; structured logging; Sentry; health endpoint; base exception → problem+json handler |
| Frontend | Next.js app with route groups; Tailwind with design tokens (Expervia palette, G.2); base components: Button, Input, Card, Modal, Toast, Table, Skeleton, EmptyState; Storybook |
| Database | Migrations framework; `organizations`, `users` baseline; RLS helper migration; seed framework |
| API | `/api/v1` routing, versioning, error format, request IDs, rate limiter scaffolding; OpenAPI generation pipeline; generated TS client |
| DevOps | Monorepo, CI (lint, types, tests, security scans), preview environments per PR, staging environment, IaC baseline, secrets manager |
| Testing | Pest + Vitest + Playwright set up; first smoke test |

**Acceptance criteria**
- A PR automatically runs lint, type-check, tests and deploys a preview URL.
- Staging deploys on merge; production pipeline exists (not yet public).
- Storybook shows base components in light theme and one tenant theme.
- No secrets in the repo (secret scan passes).

---

## S1. Tenancy, identity and RBAC

**Objective:** The multi-tenant spine. Nothing tenant-owned gets built before this works.

| Area | Work |
| --- | --- |
| Features | PLT-01, PLT-03, PLT-09, IAM-01, 02, 03, 05, 06, 07 |
| Backend | Tenant resolution middleware (host → org; header for mobile); `TenantContext`; `BelongsToTenant` trait; `SET LOCAL app.current_org_id` per request/job; registration, login, logout, email verification, password reset, Google OAuth; memberships; system roles and permission seeding; policies base class; invitations; audit log service |
| Frontend | Tenant theming loader (`/tenant-config`); register, login, forgot/reset password, verify email, accept invitation pages; app shell (sidebar, top bar, academy switcher, user menu) |
| Database | `domains`, `organization_*`, `organization_memberships`, `roles`, `permissions`, `role_permissions`, `membership_roles`, `invitations`, `user_identities`, `audit_logs`; RLS policies |
| API | D.1 auth endpoints; `/me`, `/me/memberships`; `/admin/members`, `/admin/invitations` |
| Testing | **Tenant isolation suite** (two tenants, identical data); RLS policy CI check; auth feature tests; rate limit tests |

**Acceptance criteria**
- A user registered at `eten-demo.localhost` and invited to `acme-demo.localhost` can log in once and switch academies; each academy shows only its own data.
- Requesting another tenant's member by ID returns 404.
- With the application's query scope deliberately disabled in a test, RLS still blocks cross-tenant reads.
- Org Admin can invite a user as Instructor; the user accepts and sees the Teaching workspace.
- Failed logins are throttled; all admin actions appear in the audit log.

---

## S2. Catalogue and course builder

**Objective:** Instructors can build and publish a complete course.

| Area | Work |
| --- | --- |
| Features | CRS-01, 03, 04, 07, 12, 13; MKT-01 (instructor application), MKT-03 (review) |
| Backend | Categories; courses with status workflow; modules; lessons by type; resources; signed direct uploads to R2; Cloudflare Stream integration for video (upload, processing webhook, signed playback); malware scan worker; seller applications |
| Frontend | Instructor workspace: courses list; course builder (details, curriculum with drag-and-drop, lesson editors per type, rich text block editor); upload progress and processing states; publish checklist; admin review queue; instructor application form |
| Database | `categories`, `courses`, `course_instructors`, `course_modules`, `lessons`, `lesson_resources`, `media_assets`, `seller_applications` |
| API | D.3 studio endpoints, `/uploads`, `/admin/applications` |
| Testing | Course workflow transitions; instructor can't edit others' courses; upload type/size validation; video processing webhook idempotency |

**Acceptance criteria**
- An approved instructor creates a course with 2 modules, a video lesson, a PDF lesson and a text lesson, reorders lessons, and submits for review.
- Org Admin approves; the course status becomes Published.
- Uploading a `.exe` renamed to `.pdf` is rejected.
- Video shows "Processing" until ready; playback URL expires.

---

## S3. Learning experience

**Objective:** Learners find, enrol in and complete free courses with tracked progress.

| Area | Work |
| --- | --- |
| Features | LRN-01, 02, 03 (free), 04, 05, 06, 11; academy public pages AP-01 to AP-04 (basic) |
| Backend | Public catalogue with Postgres full-text search and filters; enrolment service (sources); lesson progress heartbeat; progress recalculation listener; `CourseCompleted` event |
| Frontend | Academy home (template blocks), catalogue with filters, course detail, lesson player (video, audio, text, PDF viewer, downloads), outline sidebar, mark complete, next/previous, resume; low-bandwidth toggle; My Learning page |
| Database | `enrollments`, `lesson_progress`, `course_progress` |
| API | D.3 public catalogue; D.4 learning endpoints |
| Testing | Progress maths unit tests (including added lessons); player E2E on mobile viewport; catalogue isolation |

**Acceptance criteria**
- A learner enrols in a free course, watches a video to 90% (auto-completes), marks a text lesson complete, leaves and returns to resume at the right lesson and timestamp.
- Course progress percentages are correct at lesson, module and course level.
- Catalogue search "azure" returns only the current tenant's published courses.
- Lesson player is usable at 360 px width.

---

## S4. Assessments and learner dashboard

**Objective:** Learners are tested and see one clear home screen.

| Area | Work |
| --- | --- |
| Features | CRS-05, CRS-06 (Should), ASM-01 to 04, LRN-08 (reviews), LA-01 dashboard v1, LA-16 onboarding questionnaire |
| Backend | Question bank; assessment builder; attempt lifecycle with server-side timer; auto-grading; question snapshots; assignments with manual grading; final assessment in completion rule; dashboard aggregation endpoint; rule-based recommendations; reviews |
| Frontend | Quiz builder; quiz-taking UI (autosave, timer, review screen, result with explanations); assignment submission + grading queue; learner dashboard (next step, upcoming, my learning, credentials placeholder, recommendations); onboarding questionnaire; course reviews |
| Database | `assessments`, `questions`, `question_options`, `assessment_questions`, `attempts`, `attempt_answers`, `assignments_course`, `assignment_submissions`, `reviews` |
| API | D.5 (MVP subset), `/me/dashboard`, `/me/recommendations`, reviews |
| Testing | Grading unit tests for each question type; correct answers never in pre-submit payload; attempt limit and timer enforcement; dashboard performance (< 300 ms server time) |

**Acceptance criteria**
- Instructor creates a 10-question quiz (MCQ, multi-select, true/false, short answer) with pass mark 70% and 2 attempts.
- Learner fails attempt 1, sees which questions were wrong with explanations (if enabled), passes attempt 2; a third attempt is blocked.
- Course with a final assessment completes only after passing it.
- Dashboard "Continue" card opens the exact next lesson.

---

## S5. Payments and commerce

**Objective:** Sell courses in Naira and USD, safely.

| Area | Work |
| --- | --- |
| Features | PAY-01, 02, 03, 05, 06, 07, 08, 09, 10 |
| Backend | `PaymentGateway` interface; Paystack adapter (checkout, verify, refund, webhooks); Stripe adapter; provider routing by currency; checkout service; order state machine; webhook ingestion (signature, idempotency, raw storage, retry); fulfilment listeners; coupons; refunds; receipts (PDF); commission rules engine; ledger entries; daily reconciliation job |
| Frontend | Buy button states; checkout page (order summary, coupon); provider redirect; return page polling; success/failure; purchases & receipts; admin orders, refunds and coupons |
| Database | `products`, `prices`, `orders`, `order_items`, `coupons`, `coupon_redemptions`, `payment_provider_accounts`, `payments`, `payment_events`, `refunds`, `commission_rules`, `ledger_entries`, `sequences` |
| API | D.7 checkout, orders, webhooks, admin commerce |
| Testing | Commission and coupon unit tests (worked examples incl. ₦30,000 → ₦6,000/₦24,000); webhook replay and out-of-order tests; amount-tamper test; sandbox E2E for Paystack and Stripe; refund reverses ledger and revokes purchase enrolment |

**Acceptance criteria**
- Learner buys a ₦45,000 course with Paystack test card; enrolment appears only after the verified webhook; receipt emailed.
- Same flow in USD via Stripe.
- Replaying the same webhook 5 times creates one payment and one enrolment.
- Changing the amount in the browser cannot reduce the price charged.
- Admin issues a partial refund; ledger shows reversing entries; order status `partially_refunded`.
- Reconciliation job flags a deliberately mismatched test payment.

---

## S6. Mentorship I: profiles, availability, booking, free intro

**Objective:** Learners can find a mentor and book a free 30-minute intro.

| Area | Work |
| --- | --- |
| Features | MNT-01 to 05, 07, 08, 09, 13 (rating) |
| Backend | Mentor applications → profiles; offerings with price-bound validation; availability rules/exceptions; slot generation with timezones and buffers; booking holds with exclusion constraint; free-intro eligibility service (configurable rules); .ics generation; reminders (scheduled jobs); session outcome (held/no-show); ratings |
| Frontend | Mentor directory with filters; mentor profile with offerings; slot picker (timezone aware); booking form with goal; My Mentorship (upcoming/past); session detail with join button; mentor studio: profile editor, offerings, availability editor (weekly grid + exceptions), bookings list |
| Database | `mentor_profiles`, `mentor_offerings`, `availability_rules`, `availability_exceptions`, `bookings`, `mentorship_sessions`, `session_notes` |
| API | D.6 (booking, availability, eligibility) |
| Testing | Slot generation unit tests (DST-free WAT plus a DST timezone like London); concurrent booking test (two learners, same slot, one wins); eligibility rule tests; reminder scheduling |

**Acceptance criteria**
- Mentor in Lagos sets Tue/Thu 18:00 to 21:00; a learner in London sees the correct local times.
- Learner books a free intro after writing a goal; both receive emails with calendar invites and the mentor's meeting link.
- Second free intro with the same mentor is refused with a clear reason; rolling limit enforced.
- Two simultaneous bookings for the same slot: exactly one succeeds, the other gets `slot_unavailable`.
- Learner no-show suspends free-intro eligibility for 30 days.

---

## S7. Mentorship II: paid sessions, recommendations, earnings and payouts

**Objective:** Turn intros into paid mentorship and pay mentors correctly.

| Area | Work |
| --- | --- |
| Features | MNT-06, 10, 11, 12, 14, 15; PAY-11; MKT-02 (revenue dashboard) |
| Backend | Paid booking via checkout (hold → payment → confirm); programmes with session credits; recommendation creation, offer page data, expiry and single reminder; cancellation/reschedule policy engine; ledger holding period → `available`; payout accounts with bank account resolve; payout runs with approval; Paystack transfer (manual trigger in MVP) |
| Frontend | Session workspace with private/shared notes and "Recommend next steps" form; personalised offer page; offers list; programme progress; mentor dashboard; instructor revenue dashboard; earnings and payout account pages; admin payout runs |
| Database | `mentorship_recommendations`, `mentorship_programmes`, `programme_enrollments`, `payout_accounts`, `payout_runs`, `payouts` |
| API | D.6 recommendations, programmes; D.7 earnings, payouts |
| Testing | End-to-end: intro → recommendation → purchase → 8 credits → book session; holding-period jobs; payout run totals equal sum of available ledger entries; four-eyes approval |

**Acceptance criteria**
- After an intro, the mentor sends a recommendation for an 8-week programme at ₦150,000; the learner sees a personalised offer page (no countdown, no "time is over" message), buys it and books session 1 of 8.
- Mentor earnings show ₦120,000 pending (80%), becoming available after the holding period.
- Admin creates and approves a payout run; mentor sees it as Paid (sandbox transfer).
- Learner cancelling > 24 h before gets a session credit back; < 24 h follows policy.

---

## S8. Credentials and SaaS

**Objective:** Certificates that can be verified, and tenants that can sign up, brand, pay and launch.

| Area | Work |
| --- | --- |
| Features | CRD-01 to 06; PLT-02, 04, 05, 06, 07, 10; BIL-01 to 05 |
| Backend | Credential issuing listener; code sequences; signature/hash; PDF rendering worker with QR; verification endpoint + public index; revoke/reissue; plans and features; limits service; trial and subscriptions (Paystack/Stripe recurring); dunning jobs; onboarding wizard API; branding (colour contrast validation, palette generation); custom domains via Cloudflare for SaaS API (create hostname, DNS verification polling, SSL status) |
| Frontend | Credentials pages, certificate detail, LinkedIn share; public verify pages; onboarding wizard (10 steps); branding editor with live preview; landing page block editor (basic); domains page with DNS instructions; billing page; plan limit prompts |
| Database | `credential_templates`, `credentials`, `credential_events`, `credential_verification_index`, `plans`, `plan_features`, `organization_limits`, `subscriptions`, `invoices`, `usage_counters` |
| API | D.8; D.2 onboarding, branding, domains, billing |
| Testing | Certificate idempotency; verification for valid/revoked/expired/not found; limit enforcement at boundaries; trial expiry → past_due → suspended transitions; custom domain flow against Cloudflare sandbox |

**Acceptance criteria**
- Completing a course issues `ETEN-CERT-2026-000001` with a PDF in ETEN branding; scanning the QR opens a "✓ Certificate Valid" page.
- Revoked certificate shows "Revoked" with reason; unknown code shows a helpful not-found message.
- A new tenant goes from sign-up to launched academy with branding in under 15 minutes (timed usability test with 3 people).
- Starter plan blocks the 251st active learner with an upgrade prompt.
- `learn.pilot-tenant.com` serves the pilot academy over HTTPS after DNS verification.

---

## S9. Analytics, notifications and launch hardening

**Objective:** Ready for real customers and real money.

| Area | Work |
| --- | --- |
| Features | ANL-01, 02; NTF-01, 02, 03; ADM-01, 02; IAM-08, 09 (if not done); AUD-01 complete |
| Backend | Analytics events; daily aggregates; dashboard endpoints (platform, org, instructor, mentor, learner); notification router, templates, preferences, in-app SSE; super admin APIs; impersonation; MFA; session management; data export |
| Frontend | Org admin dashboard; super admin console (orgs, users, plans, transactions, payouts, certificates, reports, flags, system); notification centre; settings (security, notifications, privacy); product analytics instrumentation |
| Database | `analytics_events` (partitioned), `daily_aggregates`, notification tables, `platform_staff` |
| API | Dashboards, notifications, platform admin (D.11) |
| Testing | Load test (k6): 500 concurrent learners on lesson player and catalogue, 50 checkouts/min; external DAST scan; penetration test (external firm); accessibility audit of MVP screens; backup restore drill; full E2E regression |

**Acceptance criteria**
- Super admin sees MRR, ARR, organisations, GMV and health; numbers match a manual SQL check.
- Every MVP event in [Section 29](./06-prd-operations.md#29-notifications) sends the right tenant-branded email and in-app notification; transactional emails can't be disabled, reminders can.
- p95 API latency < 500 ms (reads) at target load from a Lagos test location.
- No critical/high findings open from the pen test.
- Database restored from backup to staging within RTO.
- **Launch:** ETEN Academy live on `academy.eten.com` (or chosen domain) and one pilot tenant live on its own domain.

---

## After MVP: Phase 2 sprint outline (indicative)

| Sprint | Focus |
| --- | --- |
| S10 to S11 | Learning paths; course versioning |
| S12 to S13 | Projects + reviewer workflow; rubrics; advanced question types |
| S14 | Skills framework and evidence; external certifications |
| S15 to S16 | Corporate: org units, imports, assignments, manager/corporate dashboards, invoicing, seats |
| S17 | Cohorts |
| S18 | Professional profiles; expert marketplace |
| S19 | Community + moderation; Flutterwave; calendar sync and meeting link integrations |
| S20 | AI gateway + "Ask about this lesson" pilot (ETEN only, opt-in) |
