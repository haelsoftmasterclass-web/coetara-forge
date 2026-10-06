# E. Role and Permission Matrix

## E.1 Roles

| Code | Role | Level | Granted by | Notes |
| --- | --- | --- | --- | --- |
| SA | Platform Super Admin | Platform | Expervia (platform_staff) | Full platform control; MFA + SSO required; every action audited |
| PS | Platform Support | Platform | SA | Read most tenant data for support; impersonation with reason; no billing/plan changes, no payouts |
| OO | Organisation Owner | Tenant | Created at sign-up / transfer by OO | Everything OA can do + billing, plan, delete organisation, transfer ownership. At least one OO always exists |
| OA | Organisation Admin | Tenant | OO / OA | Runs the academy day to day |
| IN | Instructor | Tenant | OA (approval or invite) | Own courses only (or co-instructed) |
| MN | Mentor | Tenant | OA | Own mentor profile, sessions, mentees |
| EX | Expert (P2) | Tenant | OA | Own service offers and orders |
| LR | Learner | Tenant | Self-signup / invite | Default role for every member |
| CM | Corporate Manager (P2) | Tenant, team scope | OA | Sees and assigns for the org units they manage (and sub-units) |
| RV | Reviewer / Assessor | Tenant | OA | Grades assigned submissions/attempts |
| RC | Recruiter (P3) | Tenant (or platform-wide via partner agreement) | OA / SA | Searches opted-in talent only |

Roles are additive: a person with LR + MN gets both sets. Every member has LR implicitly unless the tenant disables it for staff accounts.

## E.2 Legend

| Symbol | Meaning |
| --- | --- |
| **V** | View |
| **C** | Create |
| **E** | Edit |
| **D** | Delete / archive |
| **A** | Approve / publish / reject |
| **M** | Manage (configure, assign, export, everything above) |
| *own* | Only records they own or are attached to |
| *team* | Only people in org units they manage |
| *enrolled* | Only content they are enrolled in |
| *pub* | Only published/public items |
| *opt-in* | Only data the person has chosen to share |
| — | No access |

## E.3 Platform-level resources

| Resource | SA | PS | OO/OA | Others |
| --- | --- | --- | --- | --- |
| Organisations (all tenants) | M | V | V *own org* | — |
| Plans & plan features | M | V | V (current plan) | — |
| Subscriptions & SaaS invoices | M | V | V, E (change plan: OO only) | — |
| Tenant limits & feature flags | M | V | V | — |
| Global users | M (lock, reset MFA) | V, E (reset MFA, resend verification) | — | — |
| Impersonation | M | C (with reason, time-limited) | — | — |
| Platform transactions & payouts | M | V | — | — |
| Platform reports (MRR, ARR, churn, GMV) | V | — | — | — |
| AI provider config & global AI usage | M | V | — | — |
| System health, queues, webhooks | M | V | — | — |
| Platform audit log | V | V (own actions) | — | — |
| Platform staff | M | — | — | — |

## E.4 Tenant resources

| Resource | OO | OA | IN | MN | EX | LR | CM | RV | RC |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Organisation settings | M | M | — | — | — | — | — | — | — |
| Billing & plan | M | V | — | — | — | — | — | — | — |
| Delete organisation / transfer ownership | M | — | — | — | — | — | — | — | — |
| Branding, landing page, domains | M | M | — | — | — | — | — | — | — |
| Members & invitations | M | M | V *own students* | V *own mentees* | V *own clients* | — | V, C (invite) *team* | V *assigned learners* | — |
| Role assignment | M | M (cannot grant OO) | — | — | — | — | — | — | — |
| Custom roles (P2) | M | M | — | — | — | — | — | — | — |
| Seller applications (instructor/mentor/expert) | A | A | C (apply) | C (apply) | C (apply) | C (apply) | — | — | — |
| Categories | M | M | V | V | V | V | V | V | — |
| Courses | M | M (A: publish) | C, V, E, D *own*; submit | V *pub* | V *pub* | V *pub*; learn *enrolled* | V; assign *team* | V *assigned* | — |
| Modules, lessons, resources | M | M | C, E, D *own course* | — | — | V *enrolled* | — | — | — |
| Media uploads | M | M | C *own content* | C *own profile* | C *own* | C (submissions, avatar) | — | — | — |
| Learning paths (P2) | M | M | C, E *own* (if allowed) | V *pub* | V *pub* | V *pub*; enrol | V; assign *team* | — | — |
| Enrolments | M | M (grant/revoke) | V *own courses* | — | — | C (self enrol/buy), V *own* | V *team*; C (assign) *team* | — | — |
| Learner progress | V | V | V *own courses* | V *mentees, if learner allows* | — | V *own* | V *team* | V *assigned* | — |
| Question bank & assessments | M | M | C, E, D *own courses* | — | — | take *enrolled* | V results *team* | V | — |
| Attempts & grading | M | M | V, E (grade) *own courses* | — | — | C, V *own* | V *team* | V, E (grade) *assigned* | — |
| Projects (P2) | M | M | C, E *own courses* | V *mentees* | V (paid review) | C submission *own* | V *team* | V, A *assigned* | — |
| Skills framework (P2) | M | M | tag *own content* | verify *mentees* | — | V *own* | V *team* | — | V *opt-in* |
| Mentor profiles | M | M (A: approve, suspend) | — | C, E *own* | — | V *pub* | V *pub* | — | — |
| Mentor offerings & pricing | M | M (set bounds) | — | C, E, D *own*, within bounds | — | V *pub* | — | — | — |
| Availability | V | V | — | M *own* | M *own* | — | — | — | — |
| Bookings & sessions | M | M (resolve disputes) | — | V, E (confirm, outcome, cancel) *own* | — | C (book), V, E (cancel/reschedule) *own* | V *team* (P2) | — | — |
| Session notes | — (private) | V shared only | — | C, E *own*; private stays private | — | V shared *own*; C own notes | — | — | — |
| Mentorship recommendations | V | V | — | C *own sessions* | — | V, accept *own* | — | — | — |
| Cohorts (P2) | M | M | M *own cohorts* | V *assigned* | — | V *pub*; apply | V; assign *team* | V *assigned* | — |
| Credential templates | M | M | V | — | — | — | — | — | — |
| Credentials (issued) | M | M (issue, revoke) | V *own courses* | — | — | V, download, share *own* | V *team* | — | V *opt-in* |
| Products, prices, coupons | M | M | E price *own course* (within rules); C coupons *own course* | E price *own offerings* | E price *own services* | — | — | — | — |
| Orders & payments | M | V, refund | V *own sales* (no buyer payment details) | V *own sales* | V *own sales* | V *own* | V *team* (corporate orders) | — | — |
| Refunds | M | C, A | — | — | — | request *own* | — | — | — |
| Commission rules | M | M | V *own* | V *own* | V *own* | — | — | — | — |
| Earnings ledger | V | V | V *own* | V *own* | V *own* | — | — | — | — |
| Payout accounts | V (masked) | V (masked) | M *own* | M *own* | M *own* | — | — | — | — |
| Payout runs | M (A) | M (C; A if granted `payouts.approve`) | V *own payouts* | V *own payouts* | V *own payouts* | — | — | — | — |
| Org units & assignments (P2) | M | M | — | — | — | V *own assignments* | M *team* | — | — |
| Reports & analytics | M | M | V *own courses* | V *own mentoring* | V *own services* | V *own* | V, export *team* | V *own grading* | — |
| Reviews & ratings | M (hide) | M (hide) | V *own courses*; reply | V *own*; reply | V *own*; reply | C *own purchases*, E, D *own* | — | — | — |
| Community (P2) | M | M (moderate) | moderate *own course spaces* | participate | participate | C, E, D *own posts*; report | participate | participate | — |
| Professional profile (P2) | V *pub* | V *pub* | V *pub* | V *pub* | V *pub* | M *own* | V *pub* | V *pub* | V *opt-in* |
| Talent search & contact (P3) | V (oversight) | V (oversight) | — | — | — | consent M *own*; accept/decline | — | — | V *opt-in*, C contact requests |
| AI assistant (P2/P3) | settings M | settings M | V usage *own courses*; approve AI questions | use | use | use (credits) | use | approve AI-suggested grades | — |
| Notifications (own) | M | M templates | M *own prefs* | M *own prefs* | M *own prefs* | M *own prefs* | M *own prefs* | M *own prefs* | M *own prefs* |
| Tenant audit log | V | V | — | — | — | — | — | — | — |
| Data export (tenant) | M | M | — | — | — | own data export | — | — | — |

## E.5 Permission keys (catalogue excerpt)

Permissions are stored as keys with a scope. System roles map to these keys; custom roles (P2) are built from them.

```text
org.settings.manage        org.branding.manage        org.domains.manage       billing.view
billing.manage             members.view               members.invite           members.manage
roles.assign               roles.manage               applications.review      categories.manage
courses.view               courses.create             courses.update           courses.publish
courses.delete             courses.students.view      uploads.create           paths.manage
learning.enroll            assessments.manage         assessments.grade        projects.review
skills.manage              skills.verify              mentor.profile.manage    mentor.sessions.manage
mentor.recommend           mentorship.book            mentorship.manage        mentorship.settings.manage
cohorts.manage             credentials.view           credentials.issue        credentials.revoke
credentials.templates.manage                          commerce.purchase        commerce.orders.view
commerce.refund            commerce.coupons.manage    commerce.products.manage commerce.settings.manage
payouts.manage             payouts.approve            finance.view             org_units.manage
assignments.manage         reports.view               reports.export           analytics.org.view
analytics.course.view      community.participate      community.moderate       talent.search
talent.contact             ai.assistant.use           ai.settings.manage       audit.view
```

## E.6 Rules that sit outside the matrix

1. **Separation of duties for money:** the person who creates a payout run can't approve it if the tenant enables four-eyes approval (default on for runs over a threshold).
2. **OO protection:** OA can't remove or demote an OO; the last OO can't leave without transferring ownership.
3. **Mentor notes privacy:** a mentor's private notes are visible only to that mentor, not to admins (except via a formal dispute process recorded in the audit log).
4. **Learner consent for manager visibility in non-corporate tenants:** at ETEN, a mentor sees a mentee's course progress only if the learner switches on "Share my progress with my mentors".
5. **Impersonation limits:** impersonated sessions can't change passwords, MFA, payout accounts or make payments.
6. **Platform staff never appear as tenant members** and can't be granted tenant roles through the tenant UI.
7. **Recruiters only see opted-in fields**, and contact details only after the learner accepts.
8. **Default deny:** any endpoint without a mapped permission returns 403. A CI test lists every route and fails if one has no policy.
