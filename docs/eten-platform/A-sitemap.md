# A. Complete Sitemap

Legend: **[MVP]** ships in MVP · **[P2]** Phase 2 · **[P3]** Phase 3. Page IDs match the [page inventory](./04-prd-information-architecture.md#15-page-inventory).
`{academy}` means the tenant's domain (e.g. `academy.eten.com` or `femi.expervia.app`).

---

## A.1 Platform marketing website (`expervia.app`, placeholder domain)

```text
/                                   Home: "Build Your Own Learning & Talent Academy"   [MVP] MK-01
├── /product                        Platform overview                                   [MVP] MK-02
│   ├── /product/learning           Courses, paths, cohorts                             [MVP]
│   ├── /product/mentorship         Mentorship marketplace, free intro model            [MVP]
│   ├── /product/assessments        Quizzes, exams, projects, skills                    [P2]
│   ├── /product/credentials        Certificates, verification, badges                  [MVP]
│   ├── /product/talent             Profiles and talent discovery                       [P3]
│   └── /product/ai                 AI tutor, recommendations                           [P3]
├── /solutions
│   ├── /solutions/training-companies                                                   [MVP] MK-03
│   ├── /solutions/enterprise       Corporate academies                                 [P2]
│   ├── /solutions/universities                                                         [P2]
│   └── /solutions/communities      Professional associations                           [P2]
├── /pricing                        Plans, comparison table, FAQ                        [MVP] MK-04
├── /customers                      Customer stories                                    [MVP] MK-05
│   └── /customers/eten-academy
├── /security                       Security & trust                                    [MVP] MK-10
├── /demo                           Book a demo                                         [MVP] MK-06
├── /signup                         Start your academy (→ onboarding wizard)            [MVP] MK-07
├── /login                          Find my academy (email → list of academies)         [MVP]
├── /resources                      Blog, guides, webinars                              [P2]  MK-09
├── /help                           Help centre                                         [P2]
├── /partners                       Agency/referral partner programme                   [P2]
├── /developers                     API docs & developer portal                         [P3]
└── /legal
    ├── /legal/terms                                                                     [MVP] MK-08
    ├── /legal/privacy
    ├── /legal/dpa                  Data processing agreement
    ├── /legal/acceptable-use
    └── /legal/cookies
```

## A.2 Tenant onboarding wizard (`expervia.app/onboarding`)

```text
/onboarding/account        Create account (or Google/Microsoft)                         [MVP]
/onboarding/organisation   Organisation name, country, currency, subdomain              [MVP]
/onboarding/industry       Choose industry                                              [MVP]
/onboarding/type           Choose academy type (training, company, university, community)[MVP]
/onboarding/brand          Logo, colours, live preview                                  [MVP]
/onboarding/first-course   Create first course (or use a template / skip)               [MVP]
/onboarding/instructors    Invite instructors                                           [MVP]
/onboarding/learners       Invite learners (emails or CSV) / share link                 [MVP]
/onboarding/payments       Connect payout account (can skip, needed before first sale)  [MVP]
/onboarding/launch         Review checklist → Launch academy                            [MVP]
```

## A.3 Academy public site (`{academy}`)

```text
/                                   Academy home (configurable blocks)                  [MVP] AP-01
│                                   ETEN: "Learn. Build. Get Certified. Get Mentored. Get Discovered."
├── /courses                        Catalogue (search, filters)                         [MVP] AP-02
│   ├── /courses/category/{slug}    Category page                                       [MVP] AP-03
│   └── /courses/{slug}             Course detail                                       [MVP] AP-04
├── /paths                          Learning paths                                      [P2]  AP-08
│   └── /paths/{slug}
├── /mentors                        Mentor directory                                    [MVP] AP-05
│   └── /mentors/{handle}           Mentor profile + offerings + booking entry          [MVP] AP-06
├── /instructors/{handle}           Instructor profile                                  [MVP] AP-07
├── /cohorts                        Upcoming cohorts                                    [P2]  AP-09
│   └── /cohorts/{slug}
├── /experts                        Expert directory                                    [P2]  AP-10
│   └── /experts/{handle}/services/{slug}
├── /projects                       Practical project showcase (public briefs)          [P2]
├── /domains/{slug}                 Technology domain landing (ETEN: Cloud, Security…)  [MVP]
├── /business                       For teams / corporate seats                         [P2]  AP-11
├── /teach                          Become an instructor (application)                  [MVP] AP-12
├── /mentor                         Become a mentor (application)                       [MVP] AP-12
├── /verify                         Verify a certificate (search)                       [MVP] AP-13
│   └── /verify/{code}              Verification result                                 [MVP]
├── /p/{handle}                     Public professional profile                         [P2]  AP-14
├── /login  /register  /forgot-password  /reset-password  /invite/{token}             [MVP] AP-15
├── /about  /contact  /faq          Tenant content pages                                [MVP]
└── /legal/{terms|privacy}          Tenant legal pages                                  [MVP] AP-16
```

## A.4 Learner application (`{academy}/app`)

```text
/app                                Learner home / dashboard                            [MVP] LA-01
├── /app/welcome                    Onboarding questionnaire                            [MVP] LA-16
├── /app/learning                   My Learning: in progress | completed | saved        [MVP] LA-02
│   └── /app/learning/{course}      Course overview (enrolled)                          [MVP] LA-03
│       ├── /lessons/{lesson}       Lesson player                                       [MVP] LA-04
│       ├── /quizzes/{quiz}         Quiz: intro → attempt → result                      [MVP] LA-05
│       └── /assignments/{id}       Assignment submission                               [MVP] LA-06
├── /app/catalogue                  In-app catalogue (same data as public)              [MVP]
├── /app/paths                      My paths                                            [P2]  LA-17
│   └── /app/paths/{path}           Path progress map
├── /app/mentorship                 My Mentorship: upcoming | past | offers | my mentors[MVP] LA-08
│   ├── /book/{mentor}/{offering}   Slot picker → confirm / checkout                    [MVP] LA-09
│   ├── /sessions/{id}              Session detail (join, notes, rate, reschedule)      [MVP] LA-10
│   ├── /offers/{id}                Personalised recommendation / offer                 [MVP] LA-11
│   └── /programmes/{id}            Programme progress (sessions used/remaining)        [MVP]
├── /app/projects                   My projects                                         [P2]  LA-18
│   └── /app/projects/{id}          Brief → submission → feedback → resubmit
├── /app/assessments                Skill assessments                                   [P2]
├── /app/skills                     My skills                                           [P2]  LA-19
│   └── /app/skills/{skill}         Level + evidence
├── /app/credentials                Certificates & badges                               [MVP] LA-12
│   └── /app/credentials/{id}       Certificate detail, download, share                 [MVP] LA-13
├── /app/cohorts/{id}               Cohort dashboard: schedule, sessions, discussion    [P2]  LA-21
├── /app/community                  Discussions & groups                                [P2]  LA-22
├── /app/profile                    Professional profile editor + privacy               [P2]  LA-20
├── /app/career                     Talent visibility, contact requests                 [P3]  LA-24
├── /app/assistant                  AI assistant (also a side panel in lesson player)   [P2 pilot/P3] LA-23
├── /app/checkout/{order}           Checkout → payment → success/failure                [MVP] LA-07
├── /app/purchases                  Orders, receipts, invoices                          [MVP] LA-15
├── /app/notifications              Notification centre                                 [MVP]
└── /app/settings                   Account, security (password, MFA, sessions),        [MVP] LA-14
                                    notifications, privacy, connected accounts, data export
```

## A.5 Instructor dashboard (`{academy}/app/teach`)

```text
/app/teach                          Overview                                            [MVP] IN-01
├── /courses                        My courses                                          [MVP] IN-02
│   ├── /courses/new                Create course                                       [MVP]
│   └── /courses/{id}
│       ├── /details                Title, description, thumbnail, category, level    [MVP] IN-03
│       ├── /curriculum             Modules, lessons, quizzes (drag & drop)             [MVP]
│       │   └── /lessons/{lesson}   Lesson editor                                       [MVP] IN-04
│       ├── /quizzes/{quiz}         Quiz builder                                        [MVP] IN-05
│       ├── /pricing                Free/paid, price, coupons                           [MVP]
│       ├── /certificate            Certificate rules                                   [MVP]
│       ├── /students               Enrolled students                                   [MVP] IN-06
│       ├── /analytics              Drop-off, completion, quiz stats                    [MVP] IN-09
│       └── /publish                Checklist → submit for review                       [MVP]
├── /questions                      Question bank                                       [MVP]
├── /grading                        Assignment / manual grading queue                   [MVP] IN-07
├── /students                       All students                                        [MVP]
├── /revenue                        Revenue dashboard                                   [MVP] IN-08
├── /payouts                        Payout account & history                            [MVP] IN-11
├── /reviews                        Course reviews                                      [MVP] IN-10
└── /cohorts                        Cohorts I teach                                     [P2]
```

## A.6 Mentor dashboard (`{academy}/app/mentor`)

```text
/app/mentor                         Overview                                            [MVP] MN-01
├── /profile                        Profile editor + preview                            [MVP] MN-02
├── /offerings                      Free intro, sessions, monthly, programmes, pricing  [MVP] MN-03
├── /availability                   Weekly hours, exceptions, buffers, meeting link     [MVP] MN-04
├── /bookings                       Requests | upcoming | past                          [MVP] MN-05
│   └── /bookings/{id}              Session workspace: notes, mark held/no-show,        [MVP] MN-06
│                                   "Recommend next steps"
├── /recommendations                Sent recommendations and status                     [MVP]
├── /mentees                        Mentees                                             [MVP] MN-07
│   └── /mentees/{id}               Mentee detail: goals, sessions, shared notes        [MVP]
├── /earnings                       Earnings & payouts                                  [MVP] MN-08
├── /reviews                        Ratings & reviews                                   [MVP] MN-09
└── /verifications                  Skill verification requests                         [P2]
```

Expert (`/app/expert`) [P2]: overview · service offers · orders (request → accept → deliver) · earnings · reviews.
Reviewer (`/app/review`) [P2]: queue · in progress · completed · rubrics.
Corporate manager (`/app/manage`) [P2]: team overview · people · assignments · skills heatmap · reports.

## A.7 Organisation (tenant) admin dashboard (`{academy}/app/admin`)

```text
/app/admin                          Dashboard                                           [MVP] OA-01
├── /people                         Members, roles, invitations                         [MVP] OA-02
│   ├── /people/{id}                Member detail (roles, enrolments, purchases, audit)
│   └── /people/import              CSV import                                          [P2]
├── /applications                   Instructor / mentor / expert approvals              [MVP] OA-03
├── /courses                        All courses, review queue                           [MVP] OA-04
├── /categories                     Categories                                          [MVP] OA-05
├── /paths                          Learning paths                                      [P2]  OA-17
├── /cohorts                        Cohorts                                             [P2]
├── /projects                       Projects & reviewer assignment                      [P2]
├── /skills                         Skills framework                                    [P2]
├── /assessments                    Assessments overview                                [MVP]
├── /mentorship                     Mentors, sessions, settings (price bounds,          [MVP] OA-06
│                                   free-intro rules, policies)
├── /credentials                    Templates, issued, revoke, manual issue             [MVP] OA-07
├── /commerce                       Products, orders, coupons, refunds                  [MVP] OA-08
├── /payouts                        Earnings ledger, payout runs, approvals             [MVP] OA-09
├── /teams                          Departments, teams, managers, assignments           [P2]  OA-16
├── /reports                        Learning, revenue, mentorship, exports              [MVP] OA-10
├── /community                      Moderation                                          [P2]  OA-18
├── /branding                       Logo, colours, favicon, email branding,             [MVP] OA-11
│                                   landing page builder, navigation [P2]
├── /domains                        Subdomain, custom domains, DNS status               [MVP] OA-12
├── /settings                       General, signup mode, terminology, commission,      [MVP] OA-13
│                                   payment provider connection, integrations
├── /ai                             AI features & usage                                 [P2]  OA-19
├── /security                       MFA enforcement, SSO [P3]                           [MVP] OA-20
├── /billing                        Plan, usage, invoices, payment method               [MVP] OA-14
└── /audit-log                      Audit log                                           [MVP] OA-15
```

## A.8 Super Admin dashboard (`admin.expervia.app`)

```text
/                                   Platform dashboard                                  [MVP] PA-01
├── /organisations                  List, filters (plan, status, country)               [MVP] PA-02
│   └── /organisations/{id}         Overview · plan & limits · usage · domains ·
│                                   feature flags · members · billing · audit
├── /users                          Global user search, lock, reset MFA                 [MVP] PA-03
├── /plans                          Plans & features editor                             [MVP] PA-04
├── /subscriptions                  Subscriptions, invoices, dunning                    [MVP] PA-05
├── /transactions                   All payments, refunds, disputes                     [MVP] PA-06
├── /payouts                        Payout runs across tenants                          [MVP] PA-07
├── /content                        Courses, instructors, mentors, experts oversight    [MVP] PA-09
├── /certificates                   Lookup, revoke                                      [MVP] PA-08
├── /assessments                    Oversight                                           [P2]
├── /reports                        MRR, ARR, churn, GMV, cohorts                       [MVP] PA-10
├── /support                        Impersonation log, support tools                    [MVP] PA-11
├── /ai                             AI usage, cost, model config                        [P2]  PA-12
├── /system                         Health, queues, failed jobs, webhooks               [MVP] PA-13
├── /feature-flags                                                                       [MVP] PA-14
├── /settings                       Currencies, providers, email, platform content      [MVP] PA-15
├── /staff                          Platform staff & roles                              [MVP]
└── /audit-log                                                                           [MVP] PA-16
```
