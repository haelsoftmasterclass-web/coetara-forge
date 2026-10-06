# B. User Flows

Each flow lists: **trigger**, **preconditions**, numbered **steps** (what the user does → what the system does), **edge cases**, and the **events** emitted (used by notifications, analytics and other modules). Screen IDs refer to the [sitemap](./A-sitemap.md) and [UI spec](./G-ui-ux-specification.md).

---

## B.1 Learner registration

**Trigger:** "Get started" on academy site, or a protected action (enrol, book).
**Preconditions:** Academy signup mode is `open` (or the learner has an invite, or their email domain is allowed when mode is `domain_restricted`).

| # | Learner | System |
| --- | --- | --- |
| 1 | Clicks "Get started" | Shows register page (AP-15) themed for the tenant |
| 2 | Chooses Google / Microsoft, or enters name, email, password | Validates; checks password strength and breached-password list; Turnstile check |
| 3 | Submits | If email already has a platform account: asks them to log in instead and then **joins this academy** (creates membership). Otherwise creates `users` row + `organization_memberships` row with Learner role |
| 4 | | Sends verification email (social sign-in emails are pre-verified) |
| 5 | Lands on onboarding questionnaire (LA-16): goal, current level, interests (domains), weekly time | Saves to learner preferences |
| 6 | | Dashboard (LA-01) shows a "Start here" recommendation based on answers |
| 7 | Clicks link in email | Marks verified; unlocks purchases and community |

**Edge cases:** invite-only academy → register page explains and offers "Request access"; email unverified after 24 h → reminder; signup from a disposable email domain → blocked (configurable).
**Events:** `user.registered`, `membership.created`, `onboarding.completed`, `email.verified`.

---

## B.2 Course purchase

**Preconditions:** Course published, paid; learner logged in and email verified.

| # | Learner | System |
| --- | --- | --- |
| 1 | Opens course detail (AP-04), clicks "Buy ₦45,000" | Creates `order` (status `pending`) with `order_item`, price snapshot, currency |
| 2 | Optionally enters coupon | Validates coupon (scope, expiry, usage limits); recalculates totals |
| 3 | Clicks "Pay" | Chooses provider by currency/tenant (NGN → Paystack). Creates `payment` (status `initiated`) with idempotency key; redirects to provider hosted checkout |
| 4 | Pays with card, bank transfer or USSD | |
| 5 | Returns to `/app/checkout/{order}` | Page shows "Confirming your payment…" and polls order status (does **not** trust the redirect) |
| 6 | | Webhook arrives → signature verified → `payment_events` stored → payment verified with provider API (amount + currency match) → payment `succeeded` → order `paid` |
| 7 | | Fulfilment: `enrollment` created (source `purchase`); ledger entries (tenant revenue, platform fee, instructor share if marketplace); receipt email |
| 8 | Sees success page with "Start learning" | |

**Edge cases:** webhook delayed → page keeps polling up to 2 minutes, then "We're confirming your payment; we'll email you", and a reconciliation job verifies with the provider; payment fails → order stays pending, retry button; duplicate webhook → ignored (idempotent); already enrolled → buy button replaced by "Continue"; 100% coupon → skip provider, order `paid` with zero amount.
**Events:** `checkout.started`, `payment.succeeded` / `payment.failed`, `order.paid`, `enrollment.created`.

---

## B.3 Course completion

| # | Learner | System |
| --- | --- | --- |
| 1 | Opens course, clicks "Continue" | Lesson player (LA-04) opens at last position |
| 2 | Watches video / reads lesson | Video position saved every 15 s; at 90% → `lesson_progress.completed` |
| 3 | Takes module quiz | Attempt graded; if pass mark met → quiz item complete |
| 4 | | After each completion: module and course progress recalculated; "Next" goes to next incomplete item |
| 5 | Completes final assessment | If all required items complete and final score ≥ pass mark → `course_progress.completed_at` set |
| 6 | | `CourseCompleted` event → certificate issued (B.11) → completion email → review prompt → next recommendation |
| 7 | Sees completion screen: certificate preview, "Share on LinkedIn", "Rate this course", "What's next" | |

**Edge cases:** failed final assessment → shows weak areas, remaining attempts, suggested lessons to review; content added after completion → stays complete; refund → access revoked, progress retained (restored if re-purchased).
**Events:** `lesson.completed`, `module.completed`, `assessment.passed/failed`, `course.completed`.

---

## B.4 Mentorship booking (paid session)

| # | Learner | System |
| --- | --- | --- |
| 1 | Browses mentors (AP-05), filters by expertise "Azure", price, language | Returns approved mentors with next available slot |
| 2 | Opens profile, chooses "60-min session · ₦30,000" | |
| 3 | Picks date and time in own timezone (LA-09) | Computes slots (availability − bookings − buffers − exceptions); shows times in learner timezone with mentor's timezone noted |
| 4 | Writes what they want to cover (required) and selects slot | Creates booking `held` for 10 min (unique constraint on mentor + time prevents double booking) |
| 5 | Pays (as B.2) | On payment success: booking `confirmed`; ledger: mentor earning `pending` (80%), platform fee (20%) |
| 6 | | Emails both with .ics, meeting link (mentor's link in MVP), agenda; reminders 24 h and 1 h before |
| 7 | Joins via "Join session" (active 10 min before) | |
| 8 | After the session: prompted to rate (1 to 5) and review | Mentor marks held/no-show; auto-held after 48 h if no dispute |
| 9 | | After holding period (7 days): mentor earning `available` for payout |

**Edge cases:** hold expires during slow payment → if payment later succeeds but slot was taken, learner is offered alternative slots or automatic refund; reschedule (> 24 h before) → pick new slot, no charge; mentor cancels → learner gets refund or rebooking, mentor reliability updated.
**Events:** `booking.held`, `booking.confirmed`, `session.reminder_sent`, `session.held`, `session.no_show`, `review.created`.

---

## B.5 Free 30-minute introduction session

| # | Learner | System |
| --- | --- | --- |
| 1 | On a mentor profile, sees "Free 30-min intro" badge | Shown only if mentor opted in and learner is eligible; otherwise shows reason ("You've used your free intro with Tunde") |
| 2 | Clicks "Book free intro" | **Eligibility check:** verified email; no previous intro with this mentor; under rolling limit (3 per 90 days); no no-show penalty active; mentor under weekly free-intro cap |
| 3 | Fills short form: goal (1 to 3 sentences), current level, what success looks like | Stored on booking; shared with mentor beforehand |
| 4 | Picks a 30-min slot | Booking `confirmed` immediately (no payment) |
| 5 | | Confirmation + reminders. Mentor sees learner's goal and (if learner allows) their learning progress summary |
| 6 | Attends session | |
| 7 | | Mentor prompted to mark held and **recommend next steps** (B.6). Learner receives a short "How was your intro?" rating prompt |

**Edge cases:** learner no-show → free-intro eligibility suspended 30 days and they are told why; mentor no-show → learner can rebook a free intro with any mentor (doesn't count towards limit); tenant has free intros disabled → badge hidden.
**Events:** `intro.booked`, `intro.held`, `intro.no_show`.

---

## B.6 Paid mentorship conversion (after free intro)

| # | Mentor / Learner | System |
| --- | --- | --- |
| 1 | Mentor opens session workspace (MN-06) after intro | Shows "Recommend next steps" card, learner's stated goal and mentor's private notes field |
| 2 | Mentor writes a goal summary and selects recommendation(s): e.g. "Azure Cloud Architecture: 8-Week Programme ₦150,000" + "Azure Networking Fundamentals (course)" | Validates price within tenant bounds; optional personal discount (within allowed range) |
| 3 | Mentor sends | Creates `mentorship_recommendation` (valid 14 days) + personalised offer page (LA-11); notifies learner (email + in-app) |
| 4 | Learner opens offer page | Shows mentor's note, recommended programme with what's included, price, and alternatives. **No countdown timers, no "your time is over" messaging** |
| 5a | Learner clicks "Start programme" | Checkout (B.2). On payment: `programme_enrollment` with 8 session credits; learner is prompted to book the first session; mentor notified |
| 5b | Learner clicks "Save for later" | Offer stays in My Mentorship → Offers; one reminder 3 days before expiry |
| 5c | Learner clicks "Ask a question" | Opens message to mentor (in-app message thread, P2; MVP uses email relay through platform) |
| 6 | | Offer expires after 14 days; mentor can re-send |

**Events:** `recommendation.sent`, `recommendation.viewed`, `recommendation.accepted`, `recommendation.expired`, `programme.purchased`. The free-to-paid metric = programmes or paid sessions purchased within 30 days of an intro ÷ intros held.

---

## B.7 Instructor onboarding

| # | Applicant / Admin | System |
| --- | --- | --- |
| 1 | Applicant visits `/teach`, clicks "Apply" (must log in or register) | |
| 2 | Fills application: expertise, topics, sample content link, LinkedIn, why | Creates `seller_application` (type instructor, status `submitted`) |
| 3 | | Notifies org admins |
| 4 | Admin reviews in OA-03, approves (or rejects with reason / requests more info) | On approve: adds Instructor role to membership; creates `instructor_profile`; sends welcome email |
| 5 | Instructor completes profile (bio, photo, headline) and payout account (bank, verified via provider account-resolve) | |
| 6 | Accepts instructor terms (revenue share, content policy) | Stores acceptance with version and timestamp |
| 7 | Lands on instructor overview with a "Create your first course" checklist | |

Tenants can set instructor signup to `invite_only` (most corporate and university tenants) which skips the application.
**Events:** `application.submitted`, `application.approved/rejected`, `instructor.activated`.

---

## B.8 Course creation

| # | Instructor | System |
| --- | --- | --- |
| 1 | "New course" → title, category, level | Creates course `draft` |
| 2 | Details: description, outcomes, prerequisites, thumbnail, language, duration | Autosaves |
| 3 | Curriculum: add modules; add lessons (video upload, text, PDF, link…), quizzes, assignments; drag to reorder | Video: direct upload to streaming provider; processing status shown; captions optional |
| 4 | Builds quiz: questions from bank or new; pass mark, attempts, time limit | |
| 5 | Pricing: free or paid (within tenant rules); preview lessons | |
| 6 | Certificate: on/off, template, rule (complete all + pass final ≥ 70%) | |
| 7 | Publish checklist: thumbnail present, ≥ 1 module with ≥ 1 lesson, all videos processed, price set, description length | Blocks submission until checklist passes |
| 8 | "Submit for review" (or "Publish" if tenant doesn't require review or instructor is trusted) | Course `in_review`; admins notified |
| 9 | Admin reviews, approves or requests changes with comments | `published` → appears in catalogue; instructor notified |

**Events:** `course.created`, `course.submitted`, `course.published`, `course.changes_requested`.

---

## B.9 Organisation (tenant) onboarding

| # | Founder | System |
| --- | --- | --- |
| 1 | `expervia.app` → "Start Your Academy" | |
| 2 | Create account (email or Google/Microsoft) | Global user created |
| 3 | Create organisation: name, country, currency (defaults from country), subdomain (checked live for availability) | Creates `organization` (status `trial`), subdomain `domain`, Org Owner + Org Admin roles; trial subscription (14 days, Starter/Professional choice) |
| 4 | Choose industry (Technology, Finance, Health…) | Used for templates and recommendations |
| 5 | Choose academy type: Training company · Company academy · University · Professional community | Sets defaults: signup mode, terminology, enabled modules, landing page template |
| 6 | Brand: upload logo, pick colours (suggested from logo), live preview of academy home | Validates colour contrast; generates accessible palette (G.2) |
| 7 | Create first course: from blank, from a template, or skip | |
| 8 | Invite instructors (emails) | Invitations sent |
| 9 | Invite learners (emails, CSV or shareable link) | |
| 10 | Connect payments (Paystack subaccount / Stripe Connect) or "Later" | Required before first paid sale |
| 11 | Launch checklist → "Launch academy" | Status `active` (still on trial billing); academy publicly reachable |

Target: steps 1 to 11 in **under 15 minutes** excluding content creation. Each step can be skipped and resumed from an admin "Setup guide" widget.
**Events:** `tenant.signup_started`, `tenant.created`, `tenant.onboarding_step_completed`, `tenant.launched`.

---

## B.10 Corporate employee onboarding (P2)

| # | Admin / Employee | System |
| --- | --- | --- |
| 1 | Company admin uploads CSV (name, email, department, team, manager email, job title) | Validates rows; shows preview with errors; checks seat limit |
| 2 | Confirms import | Creates/links users, memberships (Learner), org unit memberships, manager flags; queues invitations |
| 3 | | Employees with SSO (P3) skip invitations and are provisioned on first login |
| 4 | Employee clicks invite, sets password or uses Microsoft login | Membership activated |
| 5 | Employee sees dashboard with **"Assigned to you"** section first: e.g. "Cloud Security Essentials path, due 30 Nov" | Assignments inherited from their team |
| 6 | Manager sees team progress in `/app/manage` | |

**Edge cases:** employee already has a personal account on another academy → same login, new membership; company data stays separate from personal academies. Leaver → admin deactivates; company retains records per its policy; learner keeps certificates (issued to them personally).
**Events:** `import.completed`, `membership.created`, `assignment.created`.

---

## B.11 Certificate generation

| # | System |
| --- | --- |
| 1 | Receives `CourseCompleted` (or path/cohort completion, or admin manual issue) |
| 2 | Loads credential rules for the course: template, minimum score, expiry |
| 3 | Checks not already issued (idempotent on learner + course + version) |
| 4 | Generates code `{PREFIX}-CERT-{YYYY}-{seq}` using the tenant's sequence (e.g. `ETEN-CERT-2026-001284`) and a random verification token |
| 5 | Snapshots learner name, programme title, organisation name, dates, skills (P2); computes content hash and signature |
| 6 | Creates `credentials` row `issued` |
| 7 | Queues PDF render: tenant template + logo + signatures + QR (verification URL) → stores in R2 |
| 8 | Notifies learner: "You've earned a certificate" with download and "Add to LinkedIn" |

**Edge cases:** learner's name has changed → learner can request reissue with new name (admin-approved), old one marked `superseded`; render failure → retried; learner can still see the certificate page while PDF is processing.
**Events:** `credential.issued`, `credential.pdf_rendered`.

---

## B.12 Certificate verification

| # | Verifier (e.g. employer) | System |
| --- | --- | --- |
| 1 | Scans QR or visits `{academy}/verify` and types `ETEN-CERT-2026-001284` | Rate-limited lookup |
| 2 | | Finds credential by code (+ token if from QR). Checks status, expiry, signature |
| 3 | Sees result | **Valid:** ✓ Certificate Valid, issued to, programme, issued by, dates. **Revoked:** ✗ with reason category and date. **Expired:** shows expiry. **Not found:** "No certificate matches this ID. Check for typos." |
| 4 | Optionally clicks "View learner's profile" (only if learner made it public) | |

Phase 3: verifiable credential JSON download for automated checking.
**Events:** `credential.verified` (count only, no verifier personal data).

---

## B.13 Learning path completion (P2)

| # | Learner | System |
| --- | --- | --- |
| 1 | Enrols on "Azure Cloud Engineer" path (purchase or assignment) | Creates `path_enrollment`; enrols learner in included courses (source `path`) |
| 2 | Sees path map: steps with status (locked, available, in progress, done), required vs optional | Prerequisites determine locks |
| 3 | Completes "Azure Fundamentals" | `CourseCompleted` → path step done → next step unlocks |
| 4 | Continues through Administration, Networking, Cloud Security | |
| 5 | Submits Practical Project | Reviewer flow (approve / request changes) |
| 6 | Takes path assessment | Scored; skills evidence recorded |
| 7 | Mentorship step: books included programme sessions | Session credits consumed |
| 8 | Certification preparation step (practice exams) | |
| 9 | | Completion rule evaluated (all required + min score). `LearningPathCompleted` → path credential issued ("Azure Cloud Engineer, Verified"), skill levels updated with evidence, profile updated (if public), mentor can add a recommendation |

**Edge cases:** course in path already completed earlier → counts immediately; path updated after enrolment → learner stays on the version they enrolled in; deadline missed (corporate) → status `overdue`, manager notified.
**Events:** `path.enrolled`, `path.step_completed`, `path.completed`.
