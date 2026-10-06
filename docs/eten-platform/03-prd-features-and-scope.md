# PRD Part 3: Feature Requirements and Scope (Sections 9 to 12)

Each requirement has an ID (used in sprint plans and tests), a phase and a priority:
- **Phase:** MVP, P2 (Phase 2), P3 (Phase 3).
- **Priority within the phase:** Must (launch blocker), Should (expected, can slip one sprint), Could (nice to have).

Acceptance criteria for MVP items are in [Section F: MVP sprint plan](./F-mvp-sprint-plan.md).

---

## 9. Feature requirements

### 9.1 Platform and tenancy (PLT)

| ID | Requirement | Phase | Priority |
| --- | --- | --- | --- |
| PLT-01 | Create, view, suspend and delete organisations (super admin) | MVP | Must |
| PLT-02 | Self-serve organisation sign-up with guided onboarding (Section 39 flow) | MVP | Must |
| PLT-03 | Every tenant gets a platform subdomain (`{slug}.expervia.app`) | MVP | Must |
| PLT-04 | Custom domain connection with DNS verification and automatic SSL | MVP | Should |
| PLT-05 | Branding: logo, favicon, primary and accent colours, email sender name | MVP | Must |
| PLT-06 | Branded certificate templates (choose template, add logo and signatures) | MVP | Must |
| PLT-07 | Configurable landing page built from content blocks (hero, featured courses, mentors, testimonials, FAQ) | MVP | Should |
| PLT-08 | Custom navigation menu | P2 | Should |
| PLT-09 | Per-tenant feature flags and module toggles | MVP | Must |
| PLT-10 | Plan limits enforced (users, storage, courses, AI credits, branding, custom domain) | MVP | Must |
| PLT-11 | Tenant data export (CSV/JSON) for admins | P2 | Must |
| PLT-12 | Dedicated database option for enterprise | P3 | Could |

### 9.2 Identity and access (IAM)

| ID | Requirement | Phase | Priority |
| --- | --- | --- | --- |
| IAM-01 | Register and log in with email and password (hashed with Argon2id) | MVP | Must |
| IAM-02 | Email verification and password reset | MVP | Must |
| IAM-03 | Log in with Google | MVP | Must |
| IAM-04 | Log in with Microsoft (personal and work accounts) | MVP | Should |
| IAM-05 | Invitations (email link) with a pre-assigned role | MVP | Must |
| IAM-06 | Role-based access control with system roles (Section 19) | MVP | Must |
| IAM-07 | Users can belong to several tenants and switch between them | MVP | Must |
| IAM-08 | MFA with authenticator app (TOTP); required for admins on request | MVP | Should |
| IAM-09 | Session management: view and revoke active sessions | MVP | Should |
| IAM-10 | Custom roles per tenant (combine permissions) | P2 | Should |
| IAM-11 | Enterprise SSO (SAML 2.0 and OIDC, incl. Microsoft Entra ID) | P3 | Must |
| IAM-12 | SCIM user provisioning | P3 | Could |
| IAM-13 | Passkeys (WebAuthn) | P3 | Could |

### 9.3 Course management (CRS)

| ID | Requirement | Phase | Priority |
| --- | --- | --- | --- |
| CRS-01 | Create course: title, subtitle, description, thumbnail, category, level, estimated duration, language, outcomes, prerequisites | MVP | Must |
| CRS-02 | Pricing: free or paid; one-time price in tenant currency; optional second currency | MVP | Must |
| CRS-03 | Modules and lessons with drag-and-drop ordering | MVP | Must |
| CRS-04 | Lesson types: video, audio, rich text, PDF, downloadable file, external link, embed | MVP | Must |
| CRS-05 | Quizzes inside modules; final assessment at course end | MVP | Must |
| CRS-06 | Assignments (file or text submission, graded by instructor) | MVP | Should |
| CRS-07 | Course status workflow: draft → in review → published → archived | MVP | Must |
| CRS-08 | Preview lessons (free sample) on paid courses | MVP | Should |
| CRS-09 | Drip scheduling (lesson unlocks after N days or on date) | P2 | Could |
| CRS-10 | Course versioning (edit published course without breaking learners mid-course) | P2 | Should |
| CRS-11 | Co-instructors and revenue splits between instructors | P2 | Should |
| CRS-12 | Unlimited categories, nested one level (e.g. Cloud & Infrastructure > Azure) | MVP | Must |
| CRS-13 | Captions/transcripts upload for video (accessibility, and later AI grounding) | MVP | Should |
| CRS-14 | SCORM/xAPI import | P3 | Could |

### 9.4 Learning experience and progress (LRN)

| ID | Requirement | Phase | Priority |
| --- | --- | --- | --- |
| LRN-01 | Course catalogue with search, filter (category, level, price, duration) and sort | MVP | Must |
| LRN-02 | Course detail page (outline, instructor, reviews, price, enrol/buy) | MVP | Must |
| LRN-03 | Enrolment (free, paid, assigned, coupon, admin-granted) | MVP | Must |
| LRN-04 | Lesson player with sidebar outline, next/previous, mark complete, resume where left off | MVP | Must |
| LRN-05 | Progress tracked at lesson, module and course level | MVP | Must |
| LRN-06 | Video progress auto-completes at configurable threshold (default 90% watched) | MVP | Must |
| LRN-07 | Learner notes per lesson | P2 | Could |
| LRN-08 | Course reviews and ratings (only by enrolled learners, after 30% progress) | MVP | Should |
| LRN-09 | Learning paths (Section 9 of master prompt) | P2 | Must |
| LRN-10 | Offline download for mobile app | P3 | Could |
| LRN-11 | Low-bandwidth mode (audio-only, lower video quality default) | MVP | Should |

### 9.5 Learning paths (PTH), Phase 2

| ID | Requirement | Phase | Priority |
| --- | --- | --- | --- |
| PTH-01 | Path made of ordered steps; step types: course, assessment, project, mentorship, cohort, external activity | P2 | Must |
| PTH-02 | Required vs optional steps | P2 | Must |
| PTH-03 | Prerequisites between steps (step 3 locked until step 2 done) | P2 | Must |
| PTH-04 | Completion rules (all required + N optional; minimum score; deadline) | P2 | Must |
| PTH-05 | Path-level certificate and badge | P2 | Must |
| PTH-06 | Path pricing (bundle price) and inclusion of paid mentorship | P2 | Should |
| PTH-07 | Assign path to individuals, teams, departments with due dates | P2 | Must |

### 9.6 Assessments (ASM)

| ID | Requirement | Phase | Priority |
| --- | --- | --- | --- |
| ASM-01 | Quiz builder with question bank per course | MVP | Must |
| ASM-02 | Question types MVP: multiple choice, multiple select, true/false, short answer (exact/keyword match) | MVP | Must |
| ASM-03 | Settings: pass mark, attempts allowed, time limit, shuffle questions/answers, show answers after | MVP | Must |
| ASM-04 | Attempt record with score, time, per-question results | MVP | Must |
| ASM-05 | Essay, scenario and practical-task questions with manual grading by reviewer | P2 | Must |
| ASM-06 | Rubrics for manual grading | P2 | Must |
| ASM-07 | Strengths/weaknesses by skill tag; recommendations | P2 | Should |
| ASM-08 | Standalone skill assessments (not inside a course) | P2 | Must |
| ASM-09 | Question pools and random draws per attempt | P2 | Should |
| ASM-10 | AI-generated questions from approved content, reviewed by a human before use | P3 | Should |
| ASM-11 | Basic integrity controls (tab-switch logging, randomisation); proctoring integrations later | P3 | Could |

### 9.7 Projects (PRJ), Phase 2

| ID | Requirement | Phase | Priority |
| --- | --- | --- | --- |
| PRJ-01 | Project brief: instructions, resources, skills assessed, rubric, due date | P2 | Must |
| PRJ-02 | Submission: files, GitHub link, URL, text write-up | P2 | Must |
| PRJ-03 | Reviewer assignment (manual or round-robin) | P2 | Must |
| PRJ-04 | Review: rubric score, written feedback, status (submitted, in review, changes requested, approved, rejected) | P2 | Must |
| PRJ-05 | Resubmission with version history | P2 | Must |
| PRJ-06 | Approved project becomes skill evidence and can be shown on profile | P2 | Must |
| PRJ-07 | Paid expert review of a project (marketplace) | P2 | Should |

### 9.8 Skills framework (SKL), Phase 2

| ID | Requirement | Phase | Priority |
| --- | --- | --- | --- |
| SKL-01 | Platform skill taxonomy (domain > skill), tenants can add their own skills | P2 | Must |
| SKL-02 | Levels: Beginner, Intermediate, Advanced, Expert with written level descriptors per skill | P2 | Must |
| SKL-03 | Courses, assessments, projects and certificates tagged with skills and target level | P2 | Must |
| SKL-04 | Learner skill level is **computed from evidence** (Section 12 rules), not self-declared | P2 | Must |
| SKL-05 | Self-assessment allowed but shown separately as "self-reported" | P2 | Should |
| SKL-06 | Mentor verification of a skill level (with note) | P2 | Must |
| SKL-07 | Evidence list per skill (courses, scores, projects, external certs, mentor verifications) | P2 | Must |
| SKL-08 | External certification upload (e.g. AZ-104) with verification status (unverified, verified by admin, verified via issuer link) | P2 | Should |

### 9.9 Mentorship (MNT)

| ID | Requirement | Phase | Priority |
| --- | --- | --- | --- |
| MNT-01 | Mentor application and approval by tenant admin | MVP | Must |
| MNT-02 | Mentor profile: headline, bio, photo, expertise (skills), industries, years of experience, languages, links, intro video | MVP | Must |
| MNT-03 | Mentor directory with filters (expertise, price, availability, language, rating) | MVP | Must |
| MNT-04 | Weekly availability, time-off dates, buffer between sessions, minimum notice, timezone handling | MVP | Must |
| MNT-05 | Session types: free intro (30 min), one-off paid session, monthly mentorship, multi-week programme | MVP | Must |
| MNT-06 | Pricing within tenant-set min/max boundaries | MVP | Must |
| MNT-07 | Free intro eligibility rules (Section 16 of master prompt; detailed in Part 5, 21.3) | MVP | Must |
| MNT-08 | Booking with calendar invite (.ics), reminders, reschedule and cancel policies | MVP | Must |
| MNT-09 | Meeting link: mentor's own link (Google Meet/Zoom/Teams) in MVP; auto-generated links via integrations in P2 | MVP | Must |
| MNT-10 | Post-intro recommendation by mentor (offer: programme, one-off, monthly, path, project, certification track) | MVP | Must |
| MNT-11 | Personalised offer page for learner (not a paywall) | MVP | Must |
| MNT-12 | Session notes: private mentor notes and shared notes | MVP | Should |
| MNT-13 | Ratings and reviews after each session | MVP | Must |
| MNT-14 | Mentor dashboard: upcoming sessions, requests, earnings, mentees | MVP | Must |
| MNT-15 | No-show and cancellation handling (policy-based refunds/credits) | MVP | Should |
| MNT-16 | Mentorship goals and progress tracking per mentee | P2 | Should |
| MNT-17 | Group mentorship sessions | P2 | Should |
| MNT-18 | Calendar sync (Google, Microsoft) to block busy times | P2 | Should |
| MNT-19 | AI mentor matching | P3 | Should |

### 9.10 Cohorts (COH), Phase 2

| ID | Requirement | Phase | Priority |
| --- | --- | --- | --- |
| COH-01 | Cohort: linked course/path, start and end dates, capacity, price, instructor(s), mentor(s) | P2 | Must |
| COH-02 | Application or direct enrolment; waitlist when full | P2 | Must |
| COH-03 | Schedule with live sessions (meeting links), assignments, deadlines | P2 | Must |
| COH-04 | Cohort dashboard with progress per member | P2 | Must |
| COH-05 | Cohort discussion space | P2 | Should |
| COH-06 | Attendance tracking | P2 | Should |
| COH-07 | Completion rules and cohort certificate | P2 | Must |

### 9.11 Credentials (CRD)

| ID | Requirement | Phase | Priority |
| --- | --- | --- | --- |
| CRD-01 | Automatic certificate issue on course completion (rules configurable per course) | MVP | Must |
| CRD-02 | Certificate fields: ID, learner, course/programme, organisation, completion date, issue date, optional expiry, verification URL, QR code | MVP | Must |
| CRD-03 | PDF and image download; share to LinkedIn ("Add to profile" link) | MVP | Must |
| CRD-04 | Public verification page by ID or QR | MVP | Must |
| CRD-05 | Revoke certificate with reason (shown on verification page) | MVP | Must |
| CRD-06 | Manual issue by admin (e.g. for offline programmes) | MVP | Should |
| CRD-07 | Badges (skill/achievement) | P2 | Should |
| CRD-08 | Open Badges 3.0 / W3C Verifiable Credentials export | P3 | Should |
| CRD-09 | Bulk issue (cohort completion) | P2 | Should |

### 9.12 Commerce and payments (PAY)

| ID | Requirement | Phase | Priority |
| --- | --- | --- | --- |
| PAY-01 | Checkout for courses, mentorship, programmes (single item, MVP) | MVP | Must |
| PAY-02 | Paystack integration (cards, bank transfer, USSD where offered) | MVP | Must |
| PAY-03 | Stripe integration for international cards and tenant SaaS billing in USD | MVP | Should |
| PAY-04 | Flutterwave integration | P2 | Should |
| PAY-05 | Payment gateway abstraction (adding a provider requires a new adapter, no changes elsewhere) | MVP | Must |
| PAY-06 | Webhook handling with signature verification and idempotency | MVP | Must |
| PAY-07 | Coupons (percentage/fixed, limits, expiry, scope) | MVP | Should |
| PAY-08 | Refunds (full/partial) by admin with reason; access revoked where appropriate | MVP | Must |
| PAY-09 | Receipts and invoices (PDF, emailed) | MVP | Must |
| PAY-10 | Commission rules engine (platform fee, tenant/marketplace commission) | MVP | Must |
| PAY-11 | Earnings ledger and payouts to instructors/mentors (manual approval of payout runs in MVP) | MVP | Must |
| PAY-12 | Automated payouts via provider transfers | P2 | Should |
| PAY-13 | Cart with multiple items, bundles | P2 | Could |
| PAY-14 | Learner subscriptions (e.g. "ETEN All-Access" monthly) | P2 | Should |
| PAY-15 | Corporate invoicing (bank transfer, PO numbers, net-30) | P2 | Must |

### 9.13 SaaS billing (BIL)

| ID | Requirement | Phase | Priority |
| --- | --- | --- | --- |
| BIL-01 | Plans with configurable limits and features (no hard-coding) | MVP | Must |
| BIL-02 | Monthly/annual billing, trial, upgrade/downgrade with proration | MVP | Must |
| BIL-03 | Dunning: retries, emails, grace period, suspension | MVP | Must |
| BIL-04 | Usage tracking against limits; overage or upgrade prompts | MVP | Must |
| BIL-05 | Enterprise custom plans and manual invoices | MVP | Should |
| BIL-06 | Add-ons (AI credits, storage, custom domain) | P2 | Should |

### 9.14 Corporate (CRP), Phase 2

| ID | Requirement | Phase | Priority |
| --- | --- | --- | --- |
| CRP-01 | Departments and teams (tree), managers per team | P2 | Must |
| CRP-02 | Bulk employee import (CSV), invites, deactivation | P2 | Must |
| CRP-03 | Assign courses, paths, assessments, mentors to people/teams with due dates | P2 | Must |
| CRP-04 | Manager dashboard (team progress, overdue, skills, certificates) | P2 | Must |
| CRP-05 | Org dashboard (Section 19 metrics) and exportable reports | P2 | Must |
| CRP-06 | Private internal courses (onboarding, compliance) | P2 | Must |
| CRP-07 | Compliance training with recurring re-certification | P2 | Should |
| CRP-08 | Corporate seats bought in ETEN Academy without own tenant | P2 | Should |

### 9.15 Marketplace (MKT)

| ID | Requirement | Phase | Priority |
| --- | --- | --- | --- |
| MKT-01 | Instructor application and approval | MVP | Must |
| MKT-02 | Instructor revenue dashboard (total, fees, net, pending, paid, students, sales) | MVP | Must |
| MKT-03 | Course review/approval before publishing (tenant setting) | MVP | Must |
| MKT-04 | Expert services: catalogue of service offers (architecture review, code review, consulting, workshop) with fixed price or quote | P2 | Must |
| MKT-05 | Service order workflow: request → accept → deliver → approve → payout | P2 | Must |
| MKT-06 | Dispute handling | P2 | Should |
| MKT-07 | Cross-tenant content syndication (tenant licenses marketplace courses) | P3 | Could |

### 9.16 Profiles and talent (PRF / TAL)

| ID | Requirement | Phase | Priority |
| --- | --- | --- | --- |
| PRF-01 | Professional profile: headline, summary, skills with verified levels, certifications, projects, courses, experience, mentorship completed | P2 | Must |
| PRF-02 | Per-section privacy controls (public, academy members only, private) | P2 | Must |
| PRF-03 | Public URL (`/p/{handle}`) with "Verified by {Academy}" marks on verified items | P2 | Must |
| PRF-04 | Mentor recommendations (endorsements) on profile | P2 | Should |
| TAL-01 | Opt-in to talent discovery, per tenant, with granular consent | P3 | Must |
| TAL-02 | Recruiter search with filters (skills, level, certifications, projects, scores, paths, location, availability) | P3 | Must |
| TAL-03 | Anonymised results until learner accepts a contact request | P3 | Must |
| TAL-04 | Contact request workflow and audit | P3 | Must |

### 9.17 AI (AI)

| ID | Requirement | Phase | Priority |
| --- | --- | --- | --- |
| AI-01 | AI gateway service with provider adapters, logging, cost metering | P2 (foundation) | Must |
| AI-02 | "Ask about this lesson": explain, summarise, examples, grounded in lesson content with citations | P2 pilot / P3 | Should |
| AI-03 | Practice questions and "explain why my answer was wrong" | P3 | Must |
| AI-04 | Study plan generation | P3 | Should |
| AI-05 | Recommendations (courses, paths, mentors, projects) | P3 | Must |
| AI-06 | AI assessment generator (human-approved) | P3 | Should |
| AI-07 | AI mentor matching | P3 | Should |
| AI-08 | AI career assistant | P3 | Could |
| AI-09 | Per-tenant AI enable/disable, credit limits, data controls | P2 | Must |

### 9.18 Notifications, community, analytics, admin

| ID | Requirement | Phase | Priority |
| --- | --- | --- | --- |
| NTF-01 | Email and in-app notifications for all MVP events (Section 30) | MVP | Must |
| NTF-02 | User notification preferences | MVP | Should |
| NTF-03 | Tenant-branded email templates | MVP | Must |
| NTF-04 | SMS, WhatsApp, push | P2 to P3 | Should |
| COM-01 | Lesson discussions (Q&A) | P2 | Should |
| COM-02 | Groups and cohort discussions | P2 | Should |
| COM-03 | Moderation (report, hide, ban, keyword filter) | P2 | Must (with COM) |
| ANL-01 | Platform, organisation, instructor and learner dashboards (Section 28) | MVP (basic) | Must |
| ANL-02 | Exportable reports (CSV) | MVP | Should |
| ADM-01 | Super admin console (Section 28 of master prompt) | MVP (core) | Must |
| ADM-02 | Impersonation ("view as") for support, with consent banner and audit | MVP | Should |
| AUD-01 | Audit log of security-sensitive and financial actions | MVP | Must |

---

## 10. MVP scope

### 10.1 MVP goal

> **ETEN Academy goes live on the multi-tenant platform, sells courses and mentorship in Naira, issues verifiable certificates, and at least one external pilot tenant runs its own branded academy on the same platform.**

The second clause matters: launching with only ETEN would not prove multi-tenancy. The MVP is done when a pilot tenant (e.g. a training company) is live alongside ETEN.

### 10.2 In scope

| Area | Included |
| --- | --- |
| Platform | Multi-tenancy with RLS, tenant sign-up and onboarding, subdomains, custom domains (Should), branding, feature flags, plan limits, super admin core |
| Identity | Email/password, Google, Microsoft (Should), invitations, RBAC with system roles, multi-tenant membership switching, MFA (Should) |
| LMS | Categories, course builder, modules, lessons (video, audio, text, PDF, files, links), quizzes, final assessment, assignments (Should), publish workflow, enrolment, progress tracking |
| Learner | Dashboard (My Learning, My Mentorship, My Credentials sections), catalogue, course pages, lesson player, progress, certificates |
| Instructor | Application, dashboard, course builder, student list, revenue dashboard |
| Mentorship | Mentor application, profiles, directory, availability, free 30-minute intro, paid one-off and programme sessions, post-intro recommendation and offer page, ratings, mentor dashboard |
| Payments | Paystack (Must), Stripe (Should), gateway abstraction, course/mentorship/subscription payments, coupons (Should), refunds, receipts, commission engine, earnings ledger, manual-approval payouts |
| Credentials | Auto-issue, branded PDF, QR, verification page, revoke, LinkedIn share |
| SaaS | Plans, trials, subscriptions, dunning, tenant management |
| Analytics | Basic dashboards for platform, organisation, instructor, mentor and learner; CSV exports |
| Notifications | Email + in-app for MVP events; tenant branding |
| Security | Audit log, rate limiting, secure uploads, backups, monitoring |

### 10.3 Explicitly out of MVP (and why)

| Excluded | Reason | When |
| --- | --- | --- |
| Learning paths | Needs courses, assessments and mentorship to exist first; large feature on its own | P2 (first item) |
| Cohorts | Can be run manually in MVP (course + manual live sessions) | P2 |
| Projects and reviewer workflow | Large workflow; MVP assignments cover simple submissions | P2 |
| Skills framework | Needs assessments/projects data to compute levels meaningfully | P2 |
| Corporate departments/teams | First pilot tenants are training orgs; corporate pilots in P2 | P2 |
| Professional profiles | Depends on skills and projects | P2 |
| Expert marketplace | Mentorship covers the main use case first | P2 |
| Community | Moderation burden; WhatsApp/Telegram groups suffice early | P2 |
| All AI features | Need clean content and usage data first; cost control needed | P2 pilot, P3 |
| Talent discovery | Needs enough verified profiles and a privacy model in production | P3 |
| SSO, SCIM, mobile apps | Enterprise/university needs; API is ready for them | P3 |

### 10.4 MVP success metrics (first 90 days after launch)

| Metric | Target (initial assumption, to validate) |
| --- | --- |
| Tenants live | ETEN + 2 pilot tenants |
| Registered learners (ETEN) | 1,000 |
| Paying learners (ETEN) | 150 |
| Free intro sessions completed | 100 |
| Free-to-paid mentorship conversion | ≥ 15% |
| Course completion rate (paid courses) | ≥ 35% |
| Certificates verified by third parties | ≥ 50 verification page views from outside the academy |
| Tenant time to first published course | Median < 1 day |
| Cross-tenant data leaks | 0 (tested continuously) |
| API p95 latency (Lagos) | < 500 ms for read endpoints |

---

## 11. Phase 2 scope

**Theme: from courses to capability, and from individuals to organisations.**

1. Learning paths (PTH-*)
2. Projects and reviewer workflow (PRJ-*)
3. Skills framework with evidence (SKL-*)
4. Advanced assessments: essays, scenarios, practical tasks, rubrics, skill assessments (ASM-05 to 09)
5. Cohorts (COH-*)
6. Corporate: departments, teams, assignments, manager and org dashboards, internal courses, invoicing (CRP-*, PAY-15)
7. Professional profiles (PRF-*)
8. Instructor marketplace maturity: co-instructors, automated payouts, course versioning
9. Expert marketplace: service offers and orders (MKT-04 to 06)
10. Community and moderation (COM-*)
11. Flutterwave adapter; learner subscriptions; multi-item cart
12. AI foundation: AI gateway, usage metering, per-tenant controls, and a **limited pilot of "Ask about this lesson"** for ETEN (grounded, cited, opt-in)
13. Integrations: Google/Microsoft calendar sync; Zoom/Teams/Meet link generation
14. Custom roles; tenant data export
15. SMS and WhatsApp notifications (Nigeria-first: high open rates)

## 12. Phase 3 scope

**Theme: intelligence, discovery and enterprise scale.**

1. AI tutor (full) and AI course assistant across all content
2. AI recommendations (courses, paths, mentors, projects, assessments)
3. AI assessment generation and AI-assisted grading (human-in-the-loop)
4. AI mentor matching and AI career assistant
5. Talent marketplace (recruiter search, contact requests, employer subscriptions)
6. University deployments (bulk academic structures, faculty roles, semester cohorts, student information system import)
7. Enterprise: SSO (SAML/OIDC, Entra ID), SCIM, dedicated database option, data residency cells, advanced audit exports, SLAs
8. Public API and API marketplace (partner keys, webhooks, developer portal)
9. Native iOS and Android apps (with offline downloads and push)
10. Open Badges 3.0 / Verifiable Credentials
11. Microsoft Learn, LinkedIn and GitHub deep integrations
12. Cross-tenant content syndication
