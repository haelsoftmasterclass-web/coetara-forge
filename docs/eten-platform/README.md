# Expervia Platform: PRD and Design Documents

<img src="./assets/expervia-logo.png" alt="Expervia Technologies" width="280">

The product and technical plan for the **Expervia learning and talent development SaaS platform**, with **ETEN Academy** (Expervia Technology Experts Network) as the flagship tenant.

> **Status:** Draft v0.1, 2026-10-06. No application code has been written yet; these documents come first so the code has a solid plan to follow.
> **Promise:** Learn. Build. Get Certified. Get Mentored. Get Discovered.

## How these documents are organised

### Product Requirements Document (sections 1 to 40)

| File | Sections | What it covers |
| --- | --- | --- |
| [01-prd-strategy.md](./01-prd-strategy.md) | 1 to 6 | Vision, problem, target users, personas, user journeys, business model |
| [02-prd-saas-architecture.md](./02-prd-saas-architecture.md) | 7 to 8 | System architecture, technology choices, **multi-tenancy strategy** (most important technical decision) |
| [03-prd-features-and-scope.md](./03-prd-features-and-scope.md) | 9 to 12 | Every feature requirement with IDs, MVP scope, Phase 2, Phase 3 |
| [04-prd-information-architecture.md](./04-prd-information-architecture.md) | 13 to 16 | Information architecture, navigation, page inventory, dashboard requirements |
| [05-prd-domain-architecture.md](./05-prd-domain-architecture.md) | 17 to 27 | Database, API, auth & RBAC, payments, mentorship, learning, assessment, credentials, AI, corporate, marketplace |
| [06-prd-operations.md](./06-prd-operations.md) | 28 to 36 | Analytics, notifications, security, scalability, deployment, CI/CD, testing, monitoring, product analytics |
| [07-prd-commercial.md](./07-prd-commercial.md) | 37 to 40 | Pricing, go-to-market, competitive differentiation, roadmap |

### Design deliverables (A to J)

| File | Deliverable |
| --- | --- |
| [A-sitemap.md](./A-sitemap.md) | Complete sitemap: marketing site, learner app, instructor, mentor, organisation admin, super admin |
| [B-user-flows.md](./B-user-flows.md) | 13 detailed user flows (registration to learning path completion) |
| [C-database-erd.md](./C-database-erd.md) | Entities, relationships, keys and tenant boundaries (with diagrams) |
| [D-api-specification.md](./D-api-specification.md) | REST v1 endpoints, standards, errors, auth, rate limits |
| [E-rbac-matrix.md](./E-rbac-matrix.md) | What every role can view, create, edit, delete, approve and manage |
| [F-mvp-sprint-plan.md](./F-mvp-sprint-plan.md) | 10 two-week sprints with backend, frontend, database, API, testing and acceptance criteria |
| [G-ui-ux-specification.md](./G-ui-ux-specification.md) | **Design system in Expervia brand colours** + screen-by-screen specs |
| [H-monetization-architecture.md](./H-monetization-architecture.md) | Subscriptions, course sales, mentorship, commissions, payouts, corporate contracts |
| [I-ai-architecture.md](./I-ai-architecture.md) | AI services, retrieval, prompts, permissions, costs, oversight, privacy |
| [J-deployment-architecture.md](./J-deployment-architecture.md) | Production architecture for Nigeria, Africa and global expansion |

## Suggested reading order

1. **Decision makers:** 01 → 03 (sections 10 to 12) → 07 → H.
2. **Designers:** 01 (personas) → 04 → A → B → G.
3. **Engineers:** 02 → 05 → C → D → E → F → J → I.

## Brand

The platform's default look uses the Expervia palette sampled from the logo (details in [G.2](./G-ui-ux-specification.md#g2-colour)):

| | Hex | Use |
| --- | --- | --- |
| Midnight | `#11015F` | Headings, dark surfaces |
| Deep violet | `#360181` | Hover/pressed, brand mark |
| Electric violet | `#6504E7` | Primary buttons, links, progress |
| Ink navy | `#060642` | Darkest text and surfaces |

Each tenant academy (including ETEN) can override primary and accent colours; the system checks contrast so no tenant can produce an inaccessible interface.

## Key decisions at a glance

| Decision | Choice |
| --- | --- |
| Product shape | Multi-tenant SaaS; ETEN is a normal tenant, never special-cased in code |
| Stack | Next.js (web) + Laravel (API) + PostgreSQL + Redis + Cloudflare (R2, Stream, CDN, custom domains) |
| Tenant isolation | Shared database with `organization_id` on every tenant table, enforced by app scopes **and** Postgres Row-Level Security **and** automated tests |
| Identity | One account per person, roles per academy |
| Money | Integer minor units, append-only ledger, payment provider abstraction (Paystack first, Stripe, Flutterwave) |
| MVP | Multi-tenancy, LMS, quizzes, mentorship with free 30-minute intro and personalised offers, payments, certificates with verification, SaaS plans; ETEN + 1 pilot tenant live |
| AI | Provider-agnostic gateway; grounded answers with citations; humans approve anything affecting grades |

## Open questions for Expervia

1. Final product name for the SaaS (these docs use "Expervia Platform").
2. Primary hosting region (Europe vs South Africa vs Nigeria): needs latency tests and legal advice ([J.1.2](./J-deployment-architecture.md#j12-choosing-the-primary-region)).
3. Merchant-of-record model and holding of mentor funds: needs legal/regulatory advice ([H.2](./H-monetization-architecture.md#h2-two-money-circuits)).
4. Pricing validation with 5 to 10 prospective tenants ([Section 37](./07-prd-commercial.md#37-pricing-model)).
5. ETEN's own brand colours, or use the Expervia palette for ETEN too.
6. First pilot tenant for the MVP launch.
7. Team size and start date (the roadmap assumes about 7 people).

## Glossary (plain English)

| Term | Meaning |
| --- | --- |
| **Tenant / organisation** | One customer academy on the platform (e.g. ETEN Academy, a company's academy) |
| **Multi-tenant** | Many customers share one system, but each only sees its own data |
| **White-label** | A customer can put its own brand (logo, colours, domain) on the platform |
| **RBAC** | Role-based access control: what you can do depends on your role (Learner, Instructor…) |
| **RLS** | Row-Level Security: a database feature that hides rows from other tenants even if application code makes a mistake |
| **API** | The set of URLs the web and mobile apps call to read and change data |
| **REST** | A common style for APIs using URLs and HTTP verbs (GET, POST…) |
| **MVP** | Minimum viable product: the smallest version that delivers real value and can be sold |
| **Sprint** | A fixed 2-week block of development work |
| **Ledger** | An append-only record of who is owed what, like an accountant's book |
| **Webhook** | A message a service (like Paystack) sends to our server when something happens (a payment succeeded) |
| **Idempotent** | Doing something twice has the same effect as doing it once (prevents double charges) |
| **RAG** | Retrieval-augmented generation: the AI first finds relevant course content, then answers using it |
| **Embedding** | A numeric representation of text that lets the system find similar meaning |
| **CI/CD** | Automated checks and deployments every time code changes |
| **MRR / ARR** | Monthly / annual recurring revenue from subscriptions |
| **GMV** | Gross merchandise value: total value of all sales through the platform |
| **Take rate** | The share of GMV the platform keeps as revenue |
| **p95 latency** | 95% of requests are faster than this time |
| **RPO / RTO** | How much data we could lose / how long we could be down in a disaster |
