# PRD Part 2: SaaS Architecture and Multi-Tenancy (Sections 7 and 8)

This is the most important technical part of the PRD. If multi-tenancy is wrong, every later feature inherits the problem, and fixing it after launch is very expensive. Read this before any database or API work.

---

## 7. SaaS architecture

### 7.1 The shape of the system

```text
                         ┌─────────────────────────────┐
  academy.eten.com  ───► │                             │
  learn.uni.edu     ───► │   Cloudflare (DNS, CDN,     │
  acme.expervia.app ───► │   WAF, custom hostnames)    │
                         └──────────────┬──────────────┘
                                        │
                  ┌─────────────────────┴─────────────────────┐
                  ▼                                           ▼
       ┌─────────────────────┐                     ┌─────────────────────┐
       │  Web app (Next.js)  │  ── REST /api/v1 ─► │  API (Laravel)      │
       │  - marketing site   │                     │  - business logic   │
       │  - tenant academies │                     │  - auth, RBAC       │
       │  - dashboards       │                     │  - tenant resolution│
       └─────────────────────┘                     └─────────┬───────────┘
                                                             │
     Future: iOS / Android apps, partner integrations ──────►│ (same API)
                                                             │
        ┌──────────────────┬──────────────────┬──────────────┼─────────────────┐
        ▼                  ▼                  ▼              ▼                 ▼
  ┌───────────┐     ┌────────────┐     ┌────────────┐  ┌───────────┐   ┌──────────────┐
  │PostgreSQL │     │ Redis      │     │ Queue      │  │ Object    │   │ External     │
  │(primary + │     │ cache,     │     │ workers    │  │ storage   │   │ providers    │
  │ replicas) │     │ sessions,  │     │ (emails,   │  │ (R2)      │   │ Paystack,    │
  │ + RLS     │     │ rate limit │     │ PDFs, AI,  │  │ files,    │   │ Stripe, email│
  └───────────┘     └────────────┘     │ webhooks)  │  │ certs     │   │ video, AI    │
                                       └────────────┘  └───────────┘   └──────────────┘
```

### 7.2 Technology choices

The stack follows the master prompt. Reasons are given so the choices can be challenged later.

| Layer | Choice | Why |
| --- | --- | --- |
| Frontend | **Next.js (App Router, TypeScript)**, Tailwind CSS | Server rendering for fast pages and SEO on marketing and catalogue pages; one codebase for marketing site and app; the team already uses Next.js in this repo |
| Backend API | **Laravel (PHP 8.4+, Laravel 12+)** | Mature, batteries included (auth, queues, mail, policies, migrations), strong local hiring pool in Nigeria |
| Database | **PostgreSQL 16+** | Relational integrity, JSONB for flexible settings, Row-Level Security for tenant isolation, full-text search, `pgvector` for AI retrieval later |
| Cache, sessions, rate limits, queues | **Redis** + Laravel Horizon | Standard, fast, observable queues |
| File storage | **Cloudflare R2** (S3-compatible) | No egress fees (important for video and downloads), S3 API so we can switch provider |
| Video | **Cloudflare Stream** (recommended) or Mux | Adaptive streaming for low bandwidth, signed URLs so paid videos can't be shared. Raw video files in R2 alone would not adapt to slow connections |
| CDN, WAF, DNS, custom domains | **Cloudflare**, including Cloudflare for SaaS (custom hostnames) | Automatic SSL for tenant custom domains like `learn.uni.edu`; DDoS protection; edge presence in Lagos and across Africa |
| Search | PostgreSQL full-text search (MVP); Meilisearch or OpenSearch later | Avoid an extra system until the catalogue is large |
| Email | Provider abstraction; Resend, Postmark or Amazon SES | Swappable; per-tenant sender branding |
| PDF certificates | Headless Chromium render of an HTML template (e.g. Browsershot) | Certificates are designed in HTML/CSS, so tenant branding is easy |
| AI | Internal AI Gateway service with provider adapters | See [Section I](./I-ai-architecture.md) |
| Hosting | Containers (Docker) on a managed platform; see [Section J](./J-deployment-architecture.md) | Horizontal scaling, repeatable deployments |

### 7.3 Why two applications (Next.js + Laravel) instead of one

- **All business rules live in the Laravel API.** The web app only displays data and calls the API. When the iOS and Android apps arrive, they call the same API and get the same rules (prices, permissions, eligibility for a free mentorship session) with no duplication.
- The Next.js app *never* talks to the database directly.
- Trade-off: two codebases and two deployments. Accepted, because the master prompt explicitly requires that business logic is not coupled to the web frontend.

### 7.4 Backend module structure (a "modular monolith")

The API is **one deployable application split into modules** with clear boundaries. This gives the organisation of microservices without the operational cost. A module can be extracted into its own service later if it needs to scale separately (AI and video processing are the likely first candidates).

```text
app/
  Modules/
    Platform/        tenants, domains, plans, feature flags, platform settings
    Identity/        users, auth, social login, MFA, sessions, invitations
    Access/          roles, permissions, policies (RBAC)
    Catalog/         categories, courses, modules, lessons, resources
    Learning/        enrolments, progress, learning paths
    Assessment/      quizzes, exams, questions, attempts, grading
    Projects/        projects, submissions, reviews
    Skills/          skills framework, learner skills, evidence
    Mentorship/      mentor profiles, availability, bookings, programmes, offers
    Cohorts/         cohorts, members, schedules, live sessions
    Credentials/     certificates, badges, verification
    Commerce/        products, prices, orders, coupons
    Payments/        gateway abstraction, transactions, webhooks, refunds
    Billing/         SaaS subscriptions, invoices, usage, plan limits
    Payouts/         earnings ledger, payout accounts, payout runs
    Corporate/       departments, teams, assignments, manager reporting
    Profiles/        professional profiles, privacy settings
    Talent/          talent search, contact requests (Phase 3)
    Community/       discussions, moderation (Phase 2)
    Notifications/   templates, channels, preferences, delivery log
    Analytics/       event ingestion, aggregates, reports
    AI/              AI gateway, retrieval, prompts, usage metering
    Audit/           audit log
    Integrations/    calendar, video meetings, SSO, Microsoft Learn, GitHub
```

Rules between modules:
- A module exposes **services and events**, not its database tables. `Learning` asks `Catalog` for a course through a service class; it does not query `courses` directly in its own code.
- Cross-module side effects use **domain events**. Example: `Assessment` emits `AssessmentPassed`; `Credentials` listens and issues a certificate; `Skills` listens and adds evidence; `Notifications` listens and emails the learner.

### 7.5 Frontend structure

One Next.js application with route groups:

```text
app/
  (marketing)/      platform marketing site (expervia domain)
  (academy)/        tenant public pages: academy home, catalogue, course pages, mentor directory
  (learner)/        learner app (dashboard, learn player, mentorship, credentials, profile)
  (studio)/         instructor and mentor workspace
  (org-admin)/      organisation admin console
  (platform-admin)/ super admin console (separate subdomain, e.g. admin.expervia.app)
  verify/           public certificate verification
packages/
  ui/               design system components (tenant-themable)
  api-client/       typed client generated from the OpenAPI spec
```

The web app decides which tenant it is serving from the request hostname, fetches that tenant's public config (name, logo, colours, enabled features) from the API, and applies the theme.

### 7.6 Architecture decision records (summary)

| ID | Decision | Status |
| --- | --- | --- |
| ADR-001 | Modular monolith in Laravel; extract services only when needed | Accepted |
| ADR-002 | Shared database, shared schema, `organization_id` column, with Postgres Row-Level Security | Accepted |
| ADR-003 | Global user identity, tenant-scoped memberships and roles | Accepted |
| ADR-004 | All money stored as integer minor units (kobo, cents) plus ISO currency code | Accepted |
| ADR-005 | Payment, email, AI, video, storage and meetings accessed only through internal interfaces (adapters) | Accepted |
| ADR-006 | REST `/api/v1` with OpenAPI spec; GraphQL deferred | Accepted |
| ADR-007 | UUID primary keys (time-ordered UUIDv7) for all tables | Accepted |
| ADR-008 | Separate Next.js frontend; no direct DB access from the frontend | Accepted |
| ADR-009 | Video hosted on a streaming provider (Cloudflare Stream) not raw files | Proposed |
| ADR-010 | Use provider split payments so tenants are merchant of record for their own sales | Proposed (needs legal review) |

---

## 8. Multi-tenancy strategy

### 8.1 Vocabulary

- **Platform:** the whole SaaS run by Expervia.
- **Tenant / Organisation:** one customer academy (ETEN Academy, Acme Corp Academy). Stored in `organizations`. The two words mean the same thing in these docs.
- **Tenant-owned data:** anything that belongs to one academy (courses, enrolments, payments, certificates). Must never leak to another tenant.
- **Global data:** shared by the platform (user login identities, plans, the platform skills taxonomy, currencies, countries).

### 8.2 Options considered

| Model | How it works | Pros | Cons | Verdict |
| --- | --- | --- | --- | --- |
| A. Database per tenant | Each tenant gets its own database | Strongest isolation; easy per-tenant backup/restore | Thousands of databases to migrate and monitor; expensive; cross-tenant analytics hard | Offer later as an **Enterprise "dedicated" option** only |
| B. Schema per tenant | One database, one Postgres schema per tenant | Good isolation | Migrations across thousands of schemas are slow and fragile | Rejected |
| C. **Shared schema with `organization_id`** | All tenants share tables; every tenant-owned row carries `organization_id` | Simple, cheap, scales to many tenants, easy platform analytics | Isolation depends on discipline | **Chosen, with three layers of enforcement** |

### 8.3 Three layers of tenant isolation (defence in depth)

A single mistake (one query missing a `where organization_id = ?`) must not leak data. So isolation is enforced three times:

**Layer 1: Application (Laravel).**
- Every tenant-owned model uses a `BelongsToTenant` trait that:
  - adds a global query scope `where organization_id = current_tenant_id`, and
  - fills `organization_id` automatically on create, and refuses to save if it differs from the current tenant.
- The current tenant is resolved once per request by middleware (see 8.4) and stored in a request-scoped `TenantContext`. Background jobs carry the tenant ID explicitly and restore the context before running.
- Route-model binding only finds records in the current tenant, so `/api/v1/courses/{id}` returns 404 (not 403) for another tenant's course, which avoids revealing that it exists.

**Layer 2: Database (PostgreSQL Row-Level Security).**
- RLS is enabled on every tenant-owned table:
  ```sql
  alter table courses enable row level security;
  alter table courses force row level security;
  create policy tenant_isolation on courses
    using (organization_id = current_setting('app.current_org_id', true)::uuid)
    with check (organization_id = current_setting('app.current_org_id', true)::uuid);
  ```
- At the start of each request or job, the API runs `set local app.current_org_id = '<uuid>'` inside the transaction.
- The application connects with a database role that is **not** the table owner and **not** a superuser, so RLS cannot be bypassed by the app.
- Platform-level work (super admin dashboards, cross-tenant analytics, migrations) uses a separate, tightly controlled database role, and every use is audit-logged.

**Layer 3: Tests and tooling.**
- An automated test suite creates two tenants with identical data and asserts that every API endpoint, as tenant A, never returns tenant B's records.
- A CI check fails the build if a new migration creates a table with an `organization_id` column but no RLS policy.
- Caches are keyed by tenant: `t:{org_id}:course:{id}`. File storage paths are prefixed by tenant: `orgs/{org_id}/...`. Search indexes filter by tenant.

### 8.4 Tenant resolution: how a request knows its tenant

```text
Request: https://learn.uni.edu/courses
   │
   ▼
1. Cloudflare routes the custom hostname to the platform.
2. Next.js reads the Host header → calls GET /api/v1/tenant-config?host=learn.uni.edu
3. API looks up `domains` table: learn.uni.edu → organization_id = 7f3c…
4. API responses for this host are scoped to organization 7f3c…
5. For authenticated API calls, the API checks the user has an active
   membership in that organisation; otherwise 403.
```

| Source | Example | Used for |
| --- | --- | --- |
| Platform subdomain | `femi.expervia.app` | Every tenant gets one automatically at sign-up |
| Custom subdomain/domain | `academy.eten.com`, `learn.uni.edu` | Paid plans; verified via DNS (CNAME + TXT), SSL issued automatically by Cloudflare for SaaS |
| Header (mobile apps, integrations) | `X-Organization-Id: 7f3c…` | Mobile apps and API clients where there is no tenant hostname |

The platform admin console runs on its own hostname (e.g. `admin.expervia.app`) and is not reachable through tenant domains.

### 8.5 Global identity, tenant-scoped membership

```text
users (global)                 organization_memberships (per tenant)
┌───────────────────┐          ┌─────────────────────────────────────────────┐
│ id                │ 1 ─── *  │ user_id, organization_id, status, joined_at │
│ email (unique)    │          │ roles via membership_roles                  │
│ password_hash     │          └─────────────────────────────────────────────┘
│ name, avatar      │
└───────────────────┘
```

- One email = one account across the platform. Ada logs in once and can switch between academies she belongs to.
- **Roles live on the membership**, so Ada can be an Instructor at ETEN but only a Learner at her employer's academy.
- **Privacy rule:** a tenant sees only its own members and the data created inside that tenant. Ada's progress at ETEN is invisible to her employer's academy unless she explicitly shares it (for example by linking her public professional profile).
- **Tenant-branded login:** the login page is themed for the tenant. Enterprise tenants can require SSO for their domain (Phase 3).
- **Option for strict tenants:** some enterprises will not accept a shared identity. For them, the membership can be marked `managed_by_org = true`, meaning the company controls the account lifecycle (create, suspend, delete) within its tenant. This is a Phase 3 enterprise feature but the column exists from the start.

### 8.6 What is global and what is tenant-owned

| Global (no `organization_id`) | Tenant-owned (`organization_id` required) |
| --- | --- |
| `users`, `user_identities` (social logins), `user_mfa_factors` | `organization_memberships`, `roles` (custom ones), `membership_roles` |
| `organizations`, `domains`, `plans`, `plan_features` | `categories`, `courses`, `course_modules`, `lessons`, `lesson_resources` |
| `permissions` (the catalogue of permission keys) | `enrollments`, `lesson_progress`, `learning_paths` |
| System `roles` (templates) | `assessments`, `questions`, `attempts`, `answers` |
| `skills` platform taxonomy (tenants can extend) | `projects`, `project_submissions`, `learner_skills`, `skill_evidence` |
| `currencies`, `countries`, `timezones` | `mentor_profiles`, `mentorship_sessions`, `mentorship_programmes`, `cohorts` |
| `subscriptions` (tenant ↔ platform) are platform-level records that reference a tenant | `products`, `prices`, `orders`, `payments`, `ledger_entries`, `payouts`, `coupons` |
| `audit_logs` (carry `organization_id` when relevant, readable by platform) | `certificates`, `professional_profiles` (tenant view), `notifications`, `reviews` |

Rule of thumb: **if it was created inside an academy, it carries `organization_id`.**

### 8.7 Tenant configuration (no tenant-specific code)

Everything that differs between ETEN and other tenants is **data**, stored in:

| Table | Holds |
| --- | --- |
| `organizations` | Name, slug, type (training, company, university, community, flagship), status, country, default currency, timezone |
| `organization_branding` | Logo, favicon, colours, fonts (from an allowed list), email sender name, certificate template choice, landing page blocks |
| `organization_settings` (JSONB, validated by schema) | Commission rates, mentor price boundaries, free-intro rules, certificate ID prefix, enabled modules, signup mode (open / invite-only / domain-restricted) |
| `feature_flags` | Per-tenant feature toggles, used to roll out features gradually |
| `plan_features` + `organization_limits` | What the plan allows (users, storage, AI credits, custom domain, SSO) |

Example: ETEN's "first 30-minute session is free" rule is a **setting** (`mentorship.free_intro.enabled = true`, `duration_minutes = 30`). A university tenant can switch it off or make it 15 minutes without a code change.

### 8.8 Plan limits enforcement

- Limits are read from `plan_features` (defaults per plan) overridden by `organization_limits` (per-tenant deals).
- A `Limits` service is checked before the action: inviting the 251st learner on a 250-learner plan returns a clear error with an upgrade prompt, not a crash.
- Usage counters (active learners this month, storage bytes, AI credits) are maintained by queued jobs and cached, so checks are fast.
- Soft limits (warn at 80% and 100%) and hard limits (block) are both configurable.

### 8.9 Tenant lifecycle

```text
trial → active → past_due → suspended → cancelled → (data retained N days) → deleted
                     ↑            │
                     └── payment ─┘
```

| State | Learners can | Admins can | Notes |
| --- | --- | --- | --- |
| Trial (14 days) | Everything within trial limits | Everything | No custom domain |
| Active | Everything in plan | Everything in plan | |
| Past due (grace 14 days) | Everything | Everything + banner to pay | Dunning emails |
| Suspended | Read-only access to purchased content and certificates | Billing page only | Certificates stay verifiable |
| Cancelled | No access | Export data | Retained 90 days (configurable) |
| Deleted | n/a | n/a | Personal data deleted; financial records kept as legally required; certificate verification shows "issuer no longer active, certificate was valid at issue" |

**Certificates must keep verifying** even if the tenant leaves, because the learner earned them. Verification records are kept in a minimal, separate form.

### 8.10 Noisy neighbours and fairness

- Rate limits per tenant and per user (Redis).
- Queue fairness: heavy jobs (bulk imports, video processing, PDF generation, AI) go to separate queues with per-tenant concurrency caps, so one tenant's import of 10,000 users doesn't delay another tenant's password-reset email.
- Enterprise tenants can later be moved to a dedicated database or "cell" (see [Section J](./J-deployment-architecture.md)) without code changes, because every query is already tenant-scoped.

### 8.11 Data residency

- MVP: one primary region for all tenants (see Section J for region choice).
- The `organizations.data_region` column exists from day one. When Expervia opens a second region (e.g. for a client who must keep data in Nigeria or the EU), new tenants are placed in that region's "cell" and the router sends their traffic there.
- Nigeria Data Protection Act 2023 and similar laws (Kenya, Ghana, South Africa POPIA, EU GDPR) affect cross-border transfer. Expervia should confirm obligations with counsel; the architecture supports regional placement when needed.
