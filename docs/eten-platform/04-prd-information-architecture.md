# PRD Part 4: Information Architecture, Navigation, Pages and Dashboards (Sections 13 to 16)

The full tree of pages is in [Section A: Sitemap](./A-sitemap.md). Screen-level detail (layout, components, empty/loading/error states) is in [Section G: UI/UX specification](./G-ui-ux-specification.md). This part sets the rules that both follow.

---

## 13. Information architecture

### 13.1 Five "surfaces"

The product is one web app with five surfaces. Each has its own hostname or path prefix, navigation and audience.

| Surface | Where | Audience | Purpose |
| --- | --- | --- | --- |
| 1. Platform marketing site | `expervia.app` (placeholder) | Prospective tenants | Sell the SaaS: "Build Your Own Learning & Talent Academy" |
| 2. Academy public site | `{tenant domain}/` | Prospective learners | The tenant's branded storefront: home, catalogue, mentors, verification |
| 3. Academy app | `{tenant domain}/app/...` | Signed-in members | Learner, instructor, mentor, manager and admin workspaces in one shell |
| 4. Platform admin console | `admin.expervia.app` | Expervia staff | Run the SaaS |
| 5. Public verification and profiles | `{tenant domain}/verify/...`, `/p/{handle}` | Anyone | Prove credentials and show profiles |

### 13.2 Core objects and how they relate (the mental model)

```text
Organisation (academy)
 ├── Category ──► Course ──► Module ──► Lesson / Quiz / Assignment
 │                  │
 │                  └──► Assessment (final)
 ├── Learning Path ──► Steps (course | assessment | project | mentorship | cohort)
 ├── Mentor ──► Offerings (free intro, session, monthly, programme) ──► Bookings ──► Sessions
 ├── Cohort ──► Members, Schedule, Live sessions
 ├── Project ──► Submissions ──► Reviews
 ├── Skill ──► Learner skill level ◄── Evidence (scores, projects, certificates, mentor verification)
 ├── Credential (certificate, badge) ──► Verification page
 └── People (memberships with roles) ──► Departments / Teams (corporate)
```

The learner always sees these objects through **four questions** (from the master prompt's UX direction), which shape navigation labels and dashboard order:

1. **Where am I?** Breadcrumbs, highlighted nav item, page title, academy branding.
2. **What should I do next?** A single "Continue" / "Next step" card at the top of the dashboard and at the end of every lesson.
3. **How am I progressing?** Progress bars on every course, path and skill.
4. **What should I learn next?** Recommendations block (rules-based in MVP, AI later).

### 13.3 Naming conventions (UI vocabulary)

Consistent words avoid confusion across tenants. Tenants can rename a few labels (e.g. "Learner" to "Student", "Academy" to "University") through a terminology setting; code always uses the canonical name.

| Canonical | Tenant can rename to (examples) |
| --- | --- |
| Academy | Learning Hub, University, Institute |
| Learner | Student, Employee, Member |
| Course | Module, Class |
| Learning path | Track, Programme, Curriculum |
| Mentor | Coach, Advisor |
| Cohort | Class, Batch |

---

## 14. Navigation structure

### 14.1 Platform marketing site

Top nav: **Product** (Learning, Mentorship, Assessments, Credentials, Talent, AI) · **Solutions** (Training companies, Enterprises, Universities, Communities) · **Pricing** · **Customers** (ETEN case study) · **Resources** · **Log in** · primary CTA **Start Your Academy** · secondary **Book a Demo**.

### 14.2 Academy public site (tenant storefront)

Top nav (configurable, these are defaults): **Courses** · **Learning Paths** (P2) · **Mentors** · **Cohorts** (P2) · **Experts** (P2) · **For Business** (P2) · **Verify a Certificate** · **Log in** · CTA **Get Started**.

ETEN default nav: Courses · Paths · Mentorship · Projects · Certifications · Experts · For Teams.

### 14.3 Academy app shell (signed-in)

A single app shell with:
- **Left sidebar** (desktop) / **bottom tab bar** (mobile, up to 5 items + "More").
- **Workspace switcher** at the top of the sidebar for users with several roles: *Learning* · *Teaching* (instructor) · *Mentoring* · *Managing* (corporate manager) · *Admin*. Only workspaces the user has permission for are shown.
- **Academy switcher** (avatar menu) for users in several tenants.
- **Global search** (⌘K / Ctrl+K): courses, lessons, mentors, people (by permission).
- **Notification bell** and **user menu** (profile, settings, billing, log out).

Navigation per workspace:

| Workspace | Sidebar items |
| --- | --- |
| Learning (Learner) | Home · My Learning · Catalogue · Paths (P2) · Mentorship · Projects (P2) · Credentials · Skills (P2) · Profile (P2) · Community (P2) |
| Teaching (Instructor) | Overview · Courses · Students · Assessments & grading · Revenue · Reviews |
| Mentoring (Mentor) | Overview · Requests & bookings · Calendar & availability · Mentees · Offerings & pricing · Earnings · Reviews |
| Expert (P2) | Overview · Service offers · Orders · Earnings |
| Reviewing (Reviewer, P2) | Queue · Completed · Rubrics |
| Managing (Corporate manager, P2) | Team overview · People · Assignments · Skills · Reports |
| Admin (Org admin) | Dashboard · People · Courses · Paths · Mentorship · Cohorts · Assessments · Credentials · Commerce · Payouts · Reports · Branding · Settings · Billing · Audit log |

### 14.4 Platform admin console

Dashboard · Organisations · Users · Plans & subscriptions · Transactions · Payouts · Content oversight (Courses, Mentors, Experts, Instructors) · Certificates · Assessments · Reports · Support (tickets, impersonation log) · AI usage · System health · Feature flags · Platform settings · Audit log.

### 14.5 Navigation rules

1. Every page has a unique title and, when nested, breadcrumbs.
2. Maximum **two clicks** from dashboard to resume learning (one click via "Continue").
3. Items the user can't access are hidden, not disabled, except upsell features for admins on lower plans, which show a lock and an "Upgrade" explanation.
4. Back button and deep links always work (URL reflects state: filters, tabs, pagination).
5. Keyboard accessible: skip-to-content link, visible focus, logical tab order.

---

## 15. Page inventory

Each page has an ID used in sprints and UI specs. Phase marks when it ships. (A = auth required, P = public.)

### 15.1 Platform marketing (P)

| ID | Page | Phase |
| --- | --- | --- |
| MK-01 | Home ("Build Your Own Learning & Talent Academy") | MVP |
| MK-02 | Product overview + one page per pillar (Learning, Mentorship, Assessments, Credentials, Talent, AI) | MVP (Learning, Mentorship, Credentials), P2/P3 others |
| MK-03 | Solutions: Training companies, Enterprises, Universities, Communities | MVP (Training), P2 others |
| MK-04 | Pricing | MVP |
| MK-05 | Customer story: ETEN Academy | MVP |
| MK-06 | Book a demo | MVP |
| MK-07 | Sign up (start your academy) | MVP |
| MK-08 | Legal: terms, privacy, DPA, acceptable use, cookie policy | MVP |
| MK-09 | Resources/blog, help centre | P2 |
| MK-10 | Security & trust page | MVP |

### 15.2 Academy public (P)

| ID | Page | Phase |
| --- | --- | --- |
| AP-01 | Academy home (configurable blocks; ETEN: "Learn. Build. Get Certified. Get Mentored. Get Discovered.") | MVP |
| AP-02 | Course catalogue | MVP |
| AP-03 | Category page | MVP |
| AP-04 | Course detail | MVP |
| AP-05 | Mentor directory | MVP |
| AP-06 | Mentor profile | MVP |
| AP-07 | Instructor profile | MVP |
| AP-08 | Learning path directory / detail | P2 |
| AP-09 | Cohort directory / detail | P2 |
| AP-10 | Expert directory / service detail | P2 |
| AP-11 | For business (corporate seats) | P2 |
| AP-12 | Become an instructor / mentor (application) | MVP |
| AP-13 | Certificate verification (search + result) | MVP |
| AP-14 | Public professional profile | P2 |
| AP-15 | Log in, register, forgot password, accept invitation | MVP |
| AP-16 | Academy legal pages (tenant-provided) | MVP |

### 15.3 Learner app (A)

| ID | Page | Phase |
| --- | --- | --- |
| LA-01 | Learner home / dashboard | MVP |
| LA-02 | My Learning (in progress, completed, saved) | MVP |
| LA-03 | Course overview (enrolled view) | MVP |
| LA-04 | Lesson player | MVP |
| LA-05 | Quiz / assessment taking + results | MVP |
| LA-06 | Assignment submission | MVP (Should) |
| LA-07 | Checkout, payment status, receipt | MVP |
| LA-08 | My Mentorship (upcoming, past, offers, mentors) | MVP |
| LA-09 | Book a session (calendar picker) | MVP |
| LA-10 | Session detail (join link, notes, rate) | MVP |
| LA-11 | Mentor recommendation / offer page | MVP |
| LA-12 | My Credentials (certificates, badges) | MVP |
| LA-13 | Certificate detail (download, share) | MVP |
| LA-14 | Account settings (profile, password, MFA, sessions, notifications, privacy) | MVP |
| LA-15 | Purchases and invoices | MVP |
| LA-16 | Onboarding questionnaire (goal, level, interests) | MVP |
| LA-17 | My Paths + path detail | P2 |
| LA-18 | My Projects + project brief + submission + feedback | P2 |
| LA-19 | My Skills + skill detail with evidence | P2 |
| LA-20 | My Profile editor + privacy | P2 |
| LA-21 | Cohort dashboard | P2 |
| LA-22 | Community | P2 |
| LA-23 | AI assistant panel | P2 pilot / P3 |
| LA-24 | Career page (talent opt-in, contact requests) | P3 |

### 15.4 Instructor studio (A)

| ID | Page | Phase |
| --- | --- | --- |
| IN-01 | Instructor overview | MVP |
| IN-02 | Courses list | MVP |
| IN-03 | Course builder: details, curriculum, pricing, settings, publish | MVP |
| IN-04 | Lesson editor (per type) | MVP |
| IN-05 | Quiz builder + question bank | MVP |
| IN-06 | Students list + student detail | MVP |
| IN-07 | Grading queue (assignments) | MVP (Should) |
| IN-08 | Revenue dashboard | MVP |
| IN-09 | Course analytics | MVP |
| IN-10 | Reviews | MVP |
| IN-11 | Payout settings (bank account) | MVP |

### 15.5 Mentor studio (A)

| ID | Page | Phase |
| --- | --- | --- |
| MN-01 | Mentor overview | MVP |
| MN-02 | Profile editor | MVP |
| MN-03 | Offerings & pricing | MVP |
| MN-04 | Availability & calendar | MVP |
| MN-05 | Bookings (requests, upcoming, past) | MVP |
| MN-06 | Session workspace (notes, recommendation form) | MVP |
| MN-07 | Mentees list + mentee detail | MVP |
| MN-08 | Earnings & payouts | MVP |
| MN-09 | Reviews | MVP |

### 15.6 Organisation admin (A)

| ID | Page | Phase |
| --- | --- | --- |
| OA-01 | Admin dashboard | MVP |
| OA-02 | People (members, roles, invitations, import) | MVP (import P2) |
| OA-03 | Applications (instructor/mentor approvals) | MVP |
| OA-04 | Courses (all, review queue) | MVP |
| OA-05 | Categories | MVP |
| OA-06 | Mentorship settings (price bounds, free-intro rules, commission) | MVP |
| OA-07 | Credentials (templates, issued, revoke) | MVP |
| OA-08 | Commerce (products, orders, coupons, refunds) | MVP |
| OA-09 | Payouts (earnings, payout runs) | MVP |
| OA-10 | Reports | MVP |
| OA-11 | Branding & landing page editor | MVP |
| OA-12 | Domains | MVP |
| OA-13 | Settings (general, signup mode, terminology, integrations, payments connection) | MVP |
| OA-14 | Billing (plan, usage, invoices) | MVP |
| OA-15 | Audit log | MVP |
| OA-16 | Departments & teams; assignments | P2 |
| OA-17 | Paths, cohorts, projects, skills admin | P2 |
| OA-18 | Community moderation | P2 |
| OA-19 | AI settings and usage | P2 |
| OA-20 | SSO configuration | P3 |

### 15.7 Platform admin (A, staff only)

| ID | Page | Phase |
| --- | --- | --- |
| PA-01 | Platform dashboard | MVP |
| PA-02 | Organisations list + organisation detail (plan, usage, domains, flags, status) | MVP |
| PA-03 | Users (global search, lock, reset MFA) | MVP |
| PA-04 | Plans & features editor | MVP |
| PA-05 | Subscriptions & invoices | MVP |
| PA-06 | Transactions | MVP |
| PA-07 | Payouts oversight | MVP |
| PA-08 | Certificates (lookup, revoke on abuse) | MVP |
| PA-09 | Content oversight (courses, mentors, instructors, experts) | MVP (basic) |
| PA-10 | Reports (MRR, ARR, churn, GMV) | MVP |
| PA-11 | Support: impersonation sessions, tickets link | MVP |
| PA-12 | AI usage and cost | P2 |
| PA-13 | System health (links to monitoring, queue status) | MVP |
| PA-14 | Feature flags | MVP |
| PA-15 | Platform settings (currencies, providers, email) | MVP |
| PA-16 | Audit log | MVP |

---

## 16. Dashboard requirements

Each dashboard has a **primary question** it answers. Widgets that don't serve that question don't belong on it. All figures respect the viewer's permissions and tenant. Default period: last 30 days with a selector (7d, 30d, 90d, 12m, custom).

### 16.1 Learner dashboard (the centre of the product)

**Primary question:** *What should I do next, and how am I doing?*

| Order | Block | Content | Phase |
| --- | --- | --- | --- |
| 1 | Next step hero | One card: "Continue: Azure Fundamentals, Lesson 4 (12 min left)" or, if nothing in progress, "Start here" recommendation | MVP |
| 2 | Upcoming | Next mentorship session (with join button 10 min before), upcoming quiz/assignment deadlines, cohort sessions | MVP (cohorts P2) |
| 3 | My Learning | Current courses with progress bars; recently accessed | MVP |
| 4 | My Mentorship | Current mentor(s), open offers ("Tunde recommended…"), past sessions count | MVP |
| 5 | My Credentials | Latest certificates; count; "Share" | MVP |
| 6 | Recommended for you | Courses/mentors (rules: same category, next level, popular in tenant) | MVP (rules), P3 (AI) |
| 7 | My Development | Skills radar/list with levels and evidence counts; learning goals | P2 |
| 8 | My Career | Profile completeness, projects, talent visibility status | P2 / P3 |

Learning streak and time-spent this week shown as small stats, not gamified clutter.

### 16.2 Instructor dashboard

**Primary question:** *How are my courses and students doing, and what am I earning?*

KPIs: Students (total, new this period) · Active learners · Average completion rate · Average rating · Revenue: gross, platform fees, net, pending payout, paid out · Course sales.
Lists: Courses table (status, students, completion, rating, revenue) · Grading queue count · Latest reviews · Questions needing reply (P2).
Charts: Enrolments over time; revenue over time.

### 16.3 Mentor dashboard

**Primary question:** *Who am I meeting next, and what should I follow up on?*

KPIs: Upcoming sessions (this week) · Free intros completed · Intro-to-paid conversion % · Active mentees · Average rating · Earnings: pending, available, paid.
Lists: Next 5 sessions (join, notes) · **Recommendations to send** (intros completed without a recommendation, highlighted) · New booking requests · Reviews.
Utilisation: booked hours ÷ available hours (shown as a percentage).

### 16.4 Organisation admin dashboard

**Primary question:** *Is our academy healthy and growing?*

KPIs: Learners (total, active 30d) · New sign-ups · Enrolments · Course completions · Average completion % · Certificates issued · Revenue (gross, net of fees) · Mentorship sessions (free, paid) · Plan usage (learners, storage, AI credits vs limits).
Lists: Pending approvals (instructors, mentors, courses) · Top courses · Top mentors · Recent orders · Alerts (failed payouts, domain not verified, nearing plan limit).
Charts: Active learners over time; revenue over time; completions by category.

### 16.5 Corporate dashboard (P2)

**Primary question:** *Are our people building the skills we need?*

Matches the master prompt example:

```text
Employees: 245          Active Learners: 183        Courses Completed: 1,245
Certificates: 87        Average Completion: 76%
Top Skills: Azure · Cybersecurity · AI · Power Platform · Data
```

Plus: overdue assignments by team · skills coverage heatmap (team × skill, coloured by average level) · certification progress · learning hours · export to CSV/PDF. Managers see only their teams.

### 16.6 Super admin dashboard

**Primary question:** *Is the business growing and is the platform healthy?*

Business: Organisations (total, active, trial, churned) · MRR · ARR · Net new MRR · Churn (logo and revenue) · Trial conversion · GMV · Platform transaction revenue · Payouts pending.
Usage: Total learners · Active users (DAU/MAU) · Courses · Mentorship sessions · Certificates issued.
Health: API error rate · p95 latency · queue backlog · failed webhooks · failed emails · AI spend vs budget.
Lists: Tenants at risk (past due, usage drop) · Largest tenants · Recent sign-ups.

### 16.7 Shared dashboard rules

- Numbers come from pre-computed daily aggregates (fast) plus "today so far" from live tables. Each widget shows "Updated {time}".
- Every KPI tile links to the list behind it.
- Empty states explain how to get the first data ("No enrolments yet. Share your course link" with a copy button).
- Currency shown in the tenant's currency; multi-currency totals are shown per currency, never silently converted.
