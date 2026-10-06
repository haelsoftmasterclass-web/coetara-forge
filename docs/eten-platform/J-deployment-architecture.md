# J. Deployment Architecture

A production architecture that starts simple for Nigeria, serves Africa well, and grows to global scale and many tenants without a rewrite.

## J.1 Stage 1: Launch architecture (MVP to ~30 tenants)

```text
                        Users (Lagos, Abuja, Nairobi, Accra, London…)
                                        │
                     ┌──────────────────▼───────────────────┐
                     │ Cloudflare                            │
                     │  DNS · CDN (edge PoPs incl. Lagos,    │
                     │  Abuja, Nairobi, Johannesburg) · WAF ·│
                     │  bot mgmt · Turnstile · rate limits · │
                     │  Cloudflare for SaaS (tenant custom   │
                     │  hostnames + automatic SSL)           │
                     │  R2 (files) · Stream (video)          │
                     └──────────────────┬───────────────────┘
                                        │ origin (TLS, authenticated origin pulls)
               ┌────────────────────────▼────────────────────────┐
               │ Cloud region (primary)                           │
               │                                                  │
               │  Load balancer                                   │
               │    ├── web service (Next.js containers) × 2+     │
               │    └── api service (Laravel Octane containers) ×2+│
               │  worker service (Horizon queues) × 2+            │
               │  scheduler (1)                                   │
               │  PDF renderer worker (headless Chromium)         │
               │  malware scan worker (ClamAV)                    │
               │                                                  │
               │  Managed PostgreSQL 16 (primary + standby, PITR) │
               │    └── PgBouncer                                 │
               │  Managed Redis (cache, sessions, queues)         │
               │  Secrets manager · container registry · logs     │
               └──────────────────────────────────────────────────┘
                                        │
      External: Paystack · Stripe · Flutterwave (P2) · email provider · AI providers (P2)
      Observability: Sentry · metrics/logs platform · uptime checks · status page
```

### J.1.1 Recommended services (one concrete option)

| Need | Recommendation | Simpler alternative for a small team |
| --- | --- | --- |
| Containers | AWS ECS on Fargate (no servers to patch) | Laravel Cloud (API) + Vercel/Netlify (Next.js) |
| Database | Amazon RDS / Aurora PostgreSQL, Multi-AZ | Managed Postgres from the same simpler platform (must support RLS, pgvector, PITR) |
| Redis | Amazon ElastiCache (Valkey/Redis) | Platform-managed Redis |
| Files / video | Cloudflare R2 + Cloudflare Stream | Same |
| Edge / domains | Cloudflare (incl. Cloudflare for SaaS) | Same |
| IaC | Terraform / OpenTofu | Platform config files |
| CI/CD | GitHub Actions | Same |

Either option keeps the same application design; the choice is about operational effort versus control. **Recommendation:** start on the simpler managed platform only if no one on the team can own AWS operations; otherwise go straight to ECS + RDS to avoid a migration at Stage 2.

### J.1.2 Choosing the primary region

There is no single right answer for Nigeria today; it's a trade-off between latency, service maturity, cost and data-residency obligations.

| Option | Pros | Cons |
| --- | --- | --- |
| **Europe (e.g. London or Frankfurt)** | Full managed-service catalogue, lower cost, strong subsea connectivity to West Africa; common choice for Nigerian startups | Data leaves Africa (needs NDPA cross-border transfer basis) |
| **South Africa (e.g. AWS Cape Town, Azure Johannesburg, Google Johannesburg)** | Data stays in Africa; good for Southern/East Africa | Latency from Lagos can be similar to or worse than Europe depending on routing; fewer services; higher cost |
| **Nigeria (local data centres / local cloud providers)** | Satisfies strict in-country requirements (some banks, government) | Fewer managed services; more operational work |

**Decision process (Sprint 0):** measure real latency from Lagos, Abuja, Nairobi and Accra to candidate regions (simple ping/HTTP tests from local networks and mobile carriers), confirm legal position on cross-border transfers with counsel, then pick. **Default assumption** for planning: a European region for Stage 1, with Cloudflare's African edge serving cached pages, assets and video close to users. Dynamic API calls are the only traffic that travels to the region, and they're kept small.

### J.1.3 Making it fast for African users regardless of region

- Static assets, images and catalogue/marketing pages cached at the Cloudflare edge (many African PoPs).
- Video via Cloudflare Stream with adaptive bitrate (starts low on poor connections).
- API payloads small and aggregated (e.g. one `/me/dashboard` call instead of ten).
- HTTP/3 and Brotli at the edge.
- Optimistic UI and offline queueing for lesson progress.
- Performance budget: learner pages < 200 KB JavaScript on first load; LCP < 2.5 s on a mid-range Android over 4G.

## J.2 Environments

| Environment | Purpose | Data |
| --- | --- | --- |
| Local | Developer machines (Docker Compose: Postgres, Redis, MinIO, Mailpit) | Seeded demo tenants |
| Preview | Per pull request, auto-created and destroyed | Seeded demo data |
| Staging | Mirrors production config; provider sandboxes | Synthetic data only, never real personal data |
| Production | Live | Real data |

Separate cloud accounts/projects for production and non-production; least-privilege IAM; production access only via SSO with MFA and break-glass procedure.

## J.3 Deployment process

- Container images built once per commit, scanned, signed and promoted (preview → staging → production).
- **Rolling or blue/green** deploys behind the load balancer; health checks gate traffic; automatic rollback on failed checks.
- **Migrations:** expand/contract pattern; run as a one-off task before the new version receives traffic; long data backfills run as queued jobs.
- Feature flags decouple deploy from release (per tenant rollout: ETEN first, then pilots, then all).
- Deploy windows avoid peak learning hours for the main markets (evenings WAT) for risky changes.

## J.4 Horizontal scaling

| Component | Scales by | Trigger |
| --- | --- | --- |
| Web (Next.js) | More containers | CPU > 60% or p95 latency |
| API (Laravel Octane) | More containers | CPU, request rate, p95 latency |
| Workers | More containers per queue | Queue depth / age per queue (critical: emails, payments; bulk: imports, PDFs; ai) |
| PostgreSQL | Vertical first; read replicas for analytics/reporting; PgBouncer | CPU > 70%, connections, replica lag |
| Redis | Vertical; cluster mode later | Memory, ops/sec |
| Search | Postgres FTS → dedicated engine | Catalogue size / query latency |
| Video & files | Provider-managed | n/a |

Queues are separated so a 10,000-learner import never delays a password reset or a payment webhook.

## J.5 Stage 2: Growth (~30 to 300 tenants, Africa-wide)

- Read replicas serve dashboards and reports.
- Analytics events streamed to a warehouse (ClickHouse/BigQuery) for heavy queries.
- Second region as **warm standby** (database replica + infrastructure ready) for disaster recovery; RTO target 1 hour.
- Dedicated search engine.
- Media processing and AI workers scaled independently (or extracted as services if needed).
- Status page and formal on-call.

## J.6 Stage 3: Global and enterprise (300+ tenants, multi-region)

### J.6.1 Cell-based architecture

```text
                       Global layer
        ┌───────────────────────────────────────────────┐
        │ Cloudflare (edge) · Tenant router              │
        │ Global directory: hostname → tenant → cell     │
        │ Global identity service (users, login, SSO)    │
        │ Platform billing & admin                       │
        └───────┬───────────────┬───────────────┬────────┘
                ▼               ▼               ▼
         Cell: Europe     Cell: Africa     Cell: Nigeria (regulated)
         (shared tenants) (South Africa)   (local DC, for banks/gov)
         full app stack   full app stack   full app stack
         own Postgres     own Postgres     own Postgres
                                        + Dedicated cells for large enterprise tenants
```

- A **cell** is a complete copy of the application stack with its own database, serving a group of tenants.
- `organizations.data_region` / `cell_id` decides where a tenant lives; the router sends traffic there.
- Benefits: data residency per tenant, blast-radius containment (an incident affects one cell), and near-linear scaling by adding cells.
- **Tenant migration between cells** is a supported operation (export tenant's rows by `organization_id`, import, switch router), possible because every table is tenant-scoped.
- Users who belong to tenants in different cells authenticate through the global identity service; each cell holds only memberships for its tenants.

### J.6.2 Enterprise options

- Dedicated cell or dedicated database for a single tenant (premium).
- Customer-specific region.
- Private connectivity and IP allow-listing for admin access.
- Bring-your-own identity provider (SSO/SCIM).

## J.7 Security in deployment

- All traffic HTTPS; origin only accepts Cloudflare traffic (authenticated origin pulls / tunnel).
- Private subnets for databases and Redis; no public database endpoints.
- Secrets in a secrets manager, injected at runtime; rotated on schedule and on staff departure.
- Encrypted storage and backups; backup copies in a separate account/region.
- Container images minimal, non-root, scanned; dependency patches applied regularly.
- WAF rules for OWASP Top 10 classes; rate limiting at edge and app.
- Audit trail of infrastructure changes (IaC + cloud audit logs).

## J.8 Backup, DR and business continuity

| Asset | Backup | Restore target |
| --- | --- | --- |
| PostgreSQL | Continuous PITR (35 days) + daily snapshots copied cross-region + monthly long-term | RPO ≤ 15 min; RTO ≤ 4 h (Stage 1), ≤ 1 h (Stage 2+) |
| R2 files | Versioning on certificates/submissions; replication of certificates bucket | Restore by version |
| Redis | Not a source of truth; rebuilt from DB | Minutes |
| Configuration | IaC in git | Rebuild environment from code |
| Provider outages | Payment provider fallback (Paystack ⇄ Flutterwave for NGN in P2); email provider fallback | Switch via config |

Quarterly restore drills; documented runbooks; incident communications templates for tenants.

## J.9 Cost awareness (Stage 1, order of magnitude)

Costs depend heavily on provider, region and usage, so they should be estimated with current price calculators during Sprint 0. The main drivers to model are: managed Postgres (Multi-AZ), container hours, Redis, video minutes stored and delivered, email volume, observability, and AI tokens (Phase 2+). R2's zero egress fees and Cloudflare caching keep file/video delivery costs predictable, which matters for video-heavy learning in markets where bandwidth is expensive.

## J.10 Launch readiness checklist

- [ ] Region decided with latency data and legal sign-off
- [ ] Production, staging, preview environments via IaC
- [ ] Backups verified by restore drill
- [ ] Monitoring, alerting, on-call rota, status page
- [ ] WAF, rate limits, Turnstile configured
- [ ] Load test passed at 2× expected launch peak
- [ ] Pen test completed; critical/high issues fixed
- [ ] Payment providers in live mode with webhooks verified; reconciliation running
- [ ] Email domain authentication (SPF, DKIM, DMARC) for platform and tenant sender domains
- [ ] Privacy policy, terms, DPA published; NDPA obligations confirmed
- [ ] Runbooks written; support process defined
- [ ] ETEN Academy and pilot tenant configured and smoke-tested on their own domains
