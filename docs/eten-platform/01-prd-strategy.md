# PRD Part 1: Strategy (Sections 1 to 6)

> Product Requirements Document for the Expervia learning and talent platform, with ETEN Academy as the flagship tenant.
> Status: Draft v0.1 · Owner: Expervia Technologies product team · Last updated: 2026-10-06

This part answers *why* the product exists, *who* it serves and *how it makes money*. Every later part (architecture, database, API, sprints) traces back to the decisions made here.

**Working name.** The master prompt does not name the SaaS product itself, only the company (Expervia Technologies) and the flagship academy (ETEN Academy). These documents use **"Expervia Platform"** for the SaaS product and **"ETEN Academy"** for the first tenant. Swap the name in later; nothing in the design depends on it.

---

## 1. Product vision

### 1.1 Vision statement

> **An operating system for professional learning and talent development.**
> Any organisation can launch its own branded academy where people learn, practise, get assessed, get mentored, build real projects, earn verifiable credentials and get discovered for opportunities.

### 1.2 The journey the product owns

```text
Learn → Practise → Assess → Get Mentored → Build Projects → Get Certified
      → Build Professional Profile → Get Discovered → Get Opportunities
```

Most learning platforms stop at "Learn" or at "Get Certified". The commercial bet of the Expervia Platform is that **the value (and the willingness to pay) sits in the whole chain**: an employer does not pay for course completions, it pays for *evidence that a person can do the work*. Every module of the product produces or consumes that evidence.

### 1.3 What we are and are not building

| We are building | We are not building |
| --- | --- |
| A multi-tenant SaaS that many organisations run their academies on | A single website for ETEN |
| An evidence-based skills system (skills backed by assessments, projects, mentor verification) | A self-declared "skills tags" list |
| Mentorship integrated into learning paths | A separate, disconnected booking tool |
| Verifiable digital credentials | Downloadable PDFs with no way to check them |
| An API-first backend that web, mobile and partners use | Business logic buried in web pages |
| A modular AI layer that can switch providers | A product hard-wired to one AI vendor |

### 1.4 Strategic principle

> **ETEN proves the platform. The platform is the product.**

Every feature request from ETEN is evaluated with one question: *"Would a university or a company academy also need this, configured differently?"* If yes, build it as a configurable platform capability. If no, it becomes tenant configuration or content, never code that checks `if tenant == ETEN`.

### 1.5 Product principles (the filter for every feature)

1. **Does it help the learner learn, build skills, prove capability or reach opportunity?**
2. **Does it create value an organisation will pay for?**
3. If a feature passes neither test, it does not ship, even if "every LMS has it".

---

## 2. Problem statement

### 2.1 Problems for learners and professionals

1. **Learning does not convert into opportunity.** People finish online courses but cannot prove what they can actually do. Certificates are easy to fake and hard to verify.
2. **No guidance.** Learners do not know what to learn next, in what order, or whether they are ready for a certification or a job.
3. **Mentorship is hard to access and hard to trust.** Finding a credible senior professional, agreeing a price and scheduling time happens over WhatsApp and LinkedIn DMs with no structure, no quality signal and no protection for either side.
4. **Practical experience is missing.** Especially in technology, employers want proof of hands-on work (deployed systems, architectures, code), not just theory.
5. **Payment friction in Africa.** Many global platforms price in USD and accept only international cards. Local payment methods (bank transfer, USSD, local cards) are often unsupported.

### 2.2 Problems for organisations

1. **Companies** cannot see the real skills of their workforce, cannot prove training ROI, and stitch together a generic LMS, spreadsheets and external mentors.
2. **Universities** struggle to connect students with industry practitioners and to issue credentials employers trust.
3. **Training companies and professional communities** want their own branded academy but cannot afford to build and run one. Existing LMS products look dated, are priced for the US/EU market, and rarely include mentorship, projects or talent discovery.
4. **Instructors, mentors and experts** have expertise to sell but no trusted marketplace with payments, scheduling and payouts that work locally.

### 2.3 The opportunity

A single platform, priced and built for Africa first but architected for global use, that combines learning, assessment, projects, mentorship, credentials and talent discovery, and lets any organisation run it under its own brand.

---

## 3. Target users

### 3.1 Customer segments (who pays the platform)

| Segment | Example | What they buy | Priority |
| --- | --- | --- | --- |
| Flagship tenant | ETEN Academy | Runs on the platform (internal customer, reference case) | MVP |
| Training organisations | Bootcamps, certification training providers | Branded academy, course sales, cohorts, certificates | MVP to Phase 2 |
| Professional communities | Tech associations, user groups | Branded academy, member learning, mentorship | Phase 2 |
| Companies (enterprise) | Banks, telcos, consultancies, tech firms | Corporate academy, assigned learning, skills reporting | Phase 2 |
| Universities | Private and public universities | Student/faculty academy, industry mentorship, credentials | Phase 3 |
| Recruiters / employers | Hiring companies | Access to opted-in, verified talent | Phase 3 |

### 3.2 User roles (who uses the platform)

Defined fully in [Section E: RBAC matrix](./E-rbac-matrix.md). Summary:

| Role | Lives at | One-line description |
| --- | --- | --- |
| Platform Super Admin | Platform | Runs the whole SaaS (Expervia staff) |
| Platform Support (added) | Platform | Expervia staff who help tenants, with limited, audited access |
| Organisation Owner (added) | Tenant | The person who signed the contract; controls billing and can't be locked out |
| Organisation Admin | Tenant | Runs one academy |
| Instructor | Tenant | Creates and teaches courses |
| Mentor | Tenant | Offers mentorship sessions and programmes |
| Expert | Tenant | Sells reviews, consulting, workshops |
| Learner | Tenant | Learns, gets assessed, gets mentored |
| Corporate Manager | Tenant (team scope) | Sees and manages a team's learning |
| Reviewer / Assessor | Tenant | Grades projects and open-ended assessments |
| Recruiter | Tenant or platform | Searches opted-in talent |

Two roles are added to the master prompt's list: **Organisation Owner** (so billing and ownership are protected separately from day-to-day admin) and **Platform Support** (so Expervia staff can help tenants without full super-admin power).

> **Key design decision.** A *person* has one account across the platform, but holds *roles per organisation*. Ada can be a Learner at ETEN Academy, a Mentor at the same academy, and an employee-Learner in her employer's corporate academy, all with one login. This is called "global identity, tenant-scoped membership" and is detailed in [Part 2](./02-prd-saas-architecture.md).

---

## 4. Personas

The personas are fictional composites used to make decisions concrete. Each has a goal, a frustration and what success looks like.

### P1. Chidi, the career-switching learner (ETEN Academy)

- 27, Lagos. IT support analyst, wants to become an Azure cloud engineer.
- Pays for learning himself; price-sensitive; mostly on a mid-range Android phone; patchy data.
- **Goal:** get AZ-104 certified and land a cloud role within a year.
- **Frustration:** "I've done three Udemy courses and I still don't know if I'm job-ready."
- **Success looks like:** a learning path that tells him what to do each week, a mentor who reviews his project, a verified profile he can send to recruiters.
- **Key features:** learning paths, free 30-minute intro, projects, verifiable credentials, professional profile, mobile-friendly UI, Naira pricing with local payment methods.

### P2. Amaka, the L&D manager (Corporate academy)

- 38, Head of Learning at a mid-size Nigerian bank. 250 technology staff.
- **Goal:** upskill the tech team on cloud and security; prove to the CIO that training spend produces skills.
- **Frustration:** "Our old LMS tells me who clicked through a video, not who can actually secure an Azure tenant."
- **Success looks like:** assign learning paths to teams, see a skills dashboard per department, export reports for the board.
- **Key features:** corporate academy, departments/teams, assignments, skills reporting, SSO (later), invoice billing.

### P3. Tunde, the mentor and expert (ETEN Academy)

- 41, Lagos and remote. Principal cloud architect, Microsoft MVP.
- **Goal:** earn extra income and give back, without admin overhead.
- **Frustration:** "People message me on LinkedIn for 'quick advice' that becomes three hours of free consulting."
- **Success looks like:** a profile with clear packages, a calendar that only shows the hours he chooses, the free 30-minute intro leading to paid programmes, and reliable payouts.
- **Key features:** mentor profile, availability, pricing within boundaries, post-session recommendations, mentor dashboard, payouts.

### P4. Sarah, the instructor (ETEN Academy and marketplace)

- 33, Nairobi. Data engineer who teaches on the side.
- **Goal:** publish a paid "Data Engineering with Azure" course and grow an audience.
- **Success looks like:** an easy course builder, quizzes, student analytics, transparent revenue and payouts.
- **Key features:** course builder, quiz builder, instructor dashboard, revenue dashboard.

### P5. Femi, the academy founder (Training organisation tenant)

- 45, runs a certification training company with 2,000 past students.
- **Goal:** move off WhatsApp groups and Google Drive onto a professional branded academy at `learn.femitraining.com`.
- **Success looks like:** signs up, brands the academy, uploads the first course and takes the first payment in an afternoon.
- **Key features:** self-serve onboarding, white-labelling, payments into his own account, cohorts, certificates.

### P6. Dr. Bello, the university programme lead (Phase 3)

- Dean of a computing faculty.
- **Goal:** give 3,000 students industry-aligned learning and credentials employers recognise.
- **Key features:** bulk enrolment, faculty instructors, industry mentors, credentials, SSO with university identity.

### P7. Grace, the recruiter (Phase 3)

- Talent partner at a cloud consultancy.
- **Goal:** find three mid-level Azure engineers with *verified* project experience.
- **Key features:** talent search over opted-in profiles, filters by verified skills, contact requests that the learner accepts.

### P8. Platform operator (Expervia staff)

- **Goal:** onboard tenants, monitor revenue and platform health, resolve support issues, control AI cost.
- **Key features:** super admin dashboard, tenant management, plans, transactions, payouts, AI usage, audit log.

---

## 5. User journeys

High-level journeys here; step-by-step flows with screens and system actions are in [Section B: User flows](./B-user-flows.md).

### J1. Chidi: from visitor to verified cloud engineer (ETEN, spans MVP to Phase 3)

| Stage | What Chidi does | What the platform does | Phase |
| --- | --- | --- | --- |
| Discover | Lands on ETEN Academy from a LinkedIn post | Shows "Learn. Build. Get Certified. Get Mentored. Get Discovered." with Cloud as a domain | MVP |
| Sign up | Registers with Google | Creates a global account and a Learner membership at ETEN | MVP |
| Orient | Answers 3 onboarding questions (goal, level, interests) | Personalises the dashboard; recommends a starting course | MVP (rules), Phase 3 (AI) |
| Learn | Buys "Azure Fundamentals" with a Paystack card or bank transfer | Enrols him, tracks lesson progress | MVP |
| Practise | Takes module quizzes | Scores, shows weak areas | MVP |
| Get mentored | Books a free 30-minute intro with Tunde | Checks eligibility, books, sends calendar invites | MVP |
| Convert | Receives Tunde's recommendation: 8-week programme, ₦150,000 | Shows a personalised offer page; takes payment; schedules sessions | MVP |
| Follow a path | Enrols on the "Azure Cloud Engineer" learning path | Tracks required/optional items and completion rules | Phase 2 |
| Build | Submits a "Deploy an Azure application" project with a GitHub link | Routes it to a reviewer; feedback; resubmission | Phase 2 |
| Prove | Passes final assessment | Issues a certificate with QR and verification URL; updates skill to Intermediate with evidence | MVP (certificate), Phase 2 (skills) |
| Show | Turns on a public professional profile | Shows only what he marks public | Phase 2 |
| Get discovered | Opts into talent discovery | Recruiters can find him; he approves each contact request | Phase 3 |

### J2. Femi: launching a branded academy (Training organisation)

Sign up → create organisation → choose industry and academy type → upload logo and pick colours → create first course → connect payout account → invite instructors → invite learners → launch at a subdomain → later connect custom domain. Target: **first course published in under 60 minutes** of sign-up.

### J3. Amaka: rolling out a corporate academy (Phase 2)

Sales-assisted contract → tenant provisioned on Enterprise plan → bulk import 250 employees (CSV) → create departments and teams → assign "Cloud Security Essentials" path to the Security team with a deadline → managers see progress → Amaka exports a quarterly skills report.

### J4. Tunde: mentor from application to payout (ETEN)

Applies as mentor → ETEN admin approves → sets expertise, packages and prices (within ETEN's allowed range) → sets weekly availability → receives free intro bookings → after each intro, records a short note and a recommendation → learner buys → sessions happen → learner rates → earnings become available after the holding period → payout to his bank account.

### J5. Sarah: instructor to earning (ETEN)

Applies as instructor → approved → builds course (modules, lessons, video, quiz) → submits for review → ETEN approves → course goes live → sales → revenue dashboard shows gross, fees, net, pending, paid.

### J6. Grace: verified hiring (Phase 3)

Recruiter account approved by the tenant → searches "Azure, Intermediate+, project evidence, Lagos or remote" → sees anonymised cards → requests contact → learner accepts → profile and contact unlocked.

---

## 6. Business model

### 6.1 Revenue streams

| # | Stream | Who pays | How it's charged | Phase |
| --- | --- | --- | --- | --- |
| R1 | SaaS subscription | Tenants (organisations) | Monthly or annual plan (Starter / Professional / Enterprise) | MVP |
| R2 | Transaction fee on tenant sales | Tenants | % of each sale a tenant makes to its learners (lower on higher plans) | MVP |
| R3 | Marketplace commission (ETEN) | Instructors, mentors, experts selling at ETEN | % of each sale (e.g. 20% on mentorship) | MVP |
| R4 | Direct sales (ETEN-owned content) | Learners | ETEN's own courses, paths, cohorts, programmes | MVP |
| R5 | Enterprise contracts | Companies, universities | Annual contract: platform + seats + services | Phase 2 |
| R6 | Corporate seats on ETEN | Companies | Buy seats for employees in ETEN Academy (no own tenant) | Phase 2 |
| R7 | Talent access | Recruiters/employers | Subscription or per-contact fee | Phase 3 |
| R8 | Add-ons | Tenants | Extra AI credits, extra storage, custom domain, SSO | Phase 2 to 3 |
| R9 | Professional services | Tenants | Setup, content migration, custom integrations | Any |

### 6.2 Two hats Expervia wears

It's important to keep these apart, in the data and in the accounts:

1. **Expervia as SaaS vendor.** Sells subscriptions to tenants (R1, R2, R5, R8). Revenue is platform revenue.
2. **Expervia as operator of ETEN Academy.** ETEN is *a tenant like any other* on the platform. ETEN's course sales and marketplace commissions (R3, R4, R6) are ETEN's revenue, recorded inside the ETEN tenant.

In the system, ETEN is a normal tenant on an internal "Flagship" plan. This keeps ETEN honest as a reference customer: if something is awkward for ETEN, it is awkward for every tenant, and we fix the platform.

### 6.3 Who is the "merchant of record"

This decides who legally sells to the learner and who holds the money. The recommended default:

| Sale | Merchant of record | Money flow |
| --- | --- | --- |
| Tenant sells a course to its learner (e.g. Femi's academy) | **The tenant** | Payment goes to the tenant's own payment account via a provider split; platform fee is deducted automatically by the provider |
| ETEN sells its own course | ETEN (Expervia) | Payment goes to ETEN's account |
| A mentor/instructor sells via ETEN's marketplace | ETEN (Expervia) | Payment to ETEN; ETEN pays the creator their share after a holding period |
| Tenant pays its subscription | Expervia | Card/bank/invoice to Expervia |

Using the payment provider's split or "connected account" features (Paystack subaccounts and splits, Flutterwave subaccounts, Stripe Connect) means the platform does not hold other tenants' money, which reduces regulatory and financial risk. Marketplace payouts at ETEN do involve holding creators' money for a period, so Expervia should get **legal and regulatory advice** (CBN rules, tax/VAT, withholding) before launch. This document is not legal advice.

Detailed money flows: [Section H: Monetization architecture](./H-monetization-architecture.md).

### 6.4 Unit economics to track from day one

| Metric | Definition |
| --- | --- |
| MRR / ARR | Sum of active subscription value per month / ×12 |
| GMV | Total value of all learner purchases across tenants |
| Take rate | Platform revenue from transactions ÷ GMV |
| Net revenue retention | Revenue from last year's tenants this year ÷ their revenue last year |
| Tenant CAC and payback | Sales and marketing spend ÷ new tenants; months to recover |
| Free-to-paid mentorship conversion | Paid mentorship purchases ÷ completed free intros |
| Learner LTV | Average revenue per learner over their lifetime |

Full metrics design: [Part 6, Sections 28 and 36](./06-prd-operations.md).
