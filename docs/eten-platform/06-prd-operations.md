# PRD Part 6: Analytics, Notifications, Security and Operations (Sections 28 to 36)

---

## 28. Analytics

### 28.1 Three layers of data

| Layer | What | Where | Used for |
| --- | --- | --- | --- |
| Operational data | Orders, enrolments, progress, sessions | PostgreSQL tables | The app itself |
| Event stream | Every meaningful action (`lesson.completed`, `checkout.started`) | `analytics_events` (partitioned) | Funnels, engagement, product analytics |
| Aggregates | Daily/monthly rollups per tenant, course, mentor, org unit | `daily_aggregates` + materialised views | Dashboards (fast) |

Phase 3: stream events to a warehouse (e.g. BigQuery, ClickHouse or Snowflake) for heavy analysis. Tables are designed so this is an export, not a redesign.

### 28.2 Metrics by level

**Platform (super admin)**

| Metric | Definition |
| --- | --- |
| Total / active organisations | Active = subscription active or trialing and ≥1 learner action in 30 days |
| Total learners / active learners | Unique users with Learner role / with a learning event in period |
| MRR | Sum of normalised monthly value of active subscriptions (annual ÷ 12), by currency and converted to a reporting currency at a stated daily rate |
| ARR | MRR × 12 |
| Net new MRR | New + expansion − contraction − churned MRR |
| Revenue churn / logo churn | Lost MRR ÷ starting MRR; cancelled tenants ÷ starting tenants |
| Trial conversion | Trials that became paid ÷ trials ended |
| Transactions, GMV, take rate | Count and value of successful learner payments; platform fees ÷ GMV |
| Mentorship sessions | Held sessions (free and paid) |
| DAU / WAU / MAU | Unique active users |

**Organisation:** learners, active learners, enrolments, completion rate, engagement (lesson views per active learner, learning hours), skills distribution (P2), certificates issued, assessment pass rates and average scores, revenue, mentorship stats.

**Instructor:** students, completion rate per course, drop-off by lesson (where learners stop), quiz pass rates, revenue, ratings.

**Mentor:** sessions, utilisation, free-to-paid conversion, repeat mentee rate, rating, earnings.

**Learner:** progress, time spent, streak, skills (P2), assessment history, certificates.

### 28.3 Definitions are code

Each metric has one definition, implemented once in the Analytics module and reused by every dashboard and export. A "metrics dictionary" page in the admin console shows each definition in plain English.

---

## 29. Notifications

### 29.1 Architecture

```text
Domain event (e.g. BookingConfirmed)
   → NotificationRouter: which template, which recipients, which channels?
   → checks user preferences + tenant settings + quiet hours
   → creates `notifications` row (in-app) and `notification_deliveries` per channel
   → channel adapters on queues:
        EmailChannel (Resend/Postmark/SES adapter)
        InAppChannel (DB + real-time push to browser via WebSocket/SSE)
        SmsChannel (P2: e.g. Termii, Africa's Talking, Twilio adapter)
        WhatsAppChannel (P2: WhatsApp Business Platform via provider)
        PushChannel (P3: FCM/APNs)
   → delivery status tracked (sent, delivered, bounced, failed) with retries
```

- Templates per event and channel, with tenant overrides (branding, sender name, wording) and localisation-ready strings.
- **Transactional** notifications (receipts, password reset, booking confirmations) can't be turned off. **Engagement** notifications (reminders, recommendations) respect preferences and are rate-limited (e.g. max 1 nudge email per learner per day).
- All emails include tenant branding; the platform name appears only in a small "Powered by" footer, removable on higher plans.

### 29.2 Event catalogue (MVP)

| Event | Learner | Mentor/Instructor | Admin |
| --- | --- | --- | --- |
| Account created / email verify | Email | | |
| Invitation | Email | | |
| Course enrolment | Email + in-app | In-app (instructor, digest) | |
| Lesson/course completion | In-app; email on course completion | | |
| Assessment reminder (due in 48 h) | Email + in-app | | |
| Assessment graded | In-app + email | | |
| Mentorship booking requested/confirmed | Email (.ics) + in-app | Email (.ics) + in-app | |
| Session reminder (24 h, 1 h) | Email + in-app | Email + in-app | |
| Recommendation received | Email + in-app | | |
| Payment success / failure / refund | Email (receipt) | | In-app (large/failed) |
| Certificate issued | Email + in-app | | |
| Cohort session upcoming (P2) | Email + in-app | Email | |
| Subscription renewal / failed payment | | | Email (org owner/billing) |
| Payout processed | | Email + in-app | |
| Application approved/rejected | | Email | |
| Plan limit approaching | | | Email + in-app |

---

## 30. Security

> No system is "100% secure". The aim is defence in depth, least privilege, fast detection and tested recovery. Security claims made to customers must describe controls actually in place.

### 30.1 Controls

| Area | Control |
| --- | --- |
| Tenant isolation | App-level scopes + Postgres RLS + automated cross-tenant tests (Part 2, 8.3) |
| Authentication | Argon2id; breached-password check; MFA (TOTP) with admin enforcement; lockout; secure password reset (single-use, 30-min tokens) |
| Authorisation | RBAC + Laravel Policies on every endpoint; deny by default; 404 for other tenants' resources |
| Sessions | HttpOnly, Secure, SameSite cookies; rotation on login and privilege change; revoke all sessions on password change |
| Transport | TLS 1.2+ everywhere (Cloudflare edge and origin); HSTS |
| Data at rest | Managed DB and storage encryption; application-level encryption for secrets (payment provider keys of tenants, MFA secrets, SSO certificates) using Laravel's encrypter with keys in a secrets manager |
| Secrets | Never in code or repo; environment secrets in the hosting platform's secrets manager; rotation procedure; secret scanning in CI |
| File uploads | Signed direct uploads; type allow-list by MIME and magic bytes; size limits per plan; malware scanning (e.g. ClamAV worker) before files are served; served from a separate domain; images re-encoded; no executable content |
| Input/output | Validation on every request; parameterised queries (Eloquent); output encoding; rich text sanitised server-side; strict Content Security Policy |
| API | Rate limits per IP/user/tenant; CORS allow-list; idempotency keys; request size limits |
| Web | Cloudflare WAF and bot management; CAPTCHA (Turnstile) on sign-up, login after failures, and public forms |
| Payments | Hosted checkout only (no card data); webhook signature checks; amount re-verification server-side; reconciliation |
| Audit logs | Who did what, when, from where, on which tenant, for security-sensitive and financial actions; immutable (append-only, no update/delete grants); retained 1 year online, longer in archive |
| Admin access | Platform staff use SSO + MFA; impersonation requires reason, shows a banner to the impersonated session, is time-limited and logged |
| Privacy | Consent records; data export and erasure requests; data minimisation; privacy by default for profiles and talent discovery |
| Dependencies | Automated dependency updates and vulnerability scanning; lockfiles committed |
| Testing | SAST and dependency scanning in CI; annual external penetration test before enterprise sales; bug-disclosure contact |

### 30.2 Data privacy

- Align with **Nigeria Data Protection Act 2023**, and design compatible with GDPR, Kenya DPA, Ghana DPA and South Africa POPIA for expansion. Confirm obligations (e.g. registration with NDPC, data protection officer, cross-border transfer basis) with counsel.
- Roles: for tenant learner data, **the tenant is the data controller and Expervia is the processor** (Data Processing Agreement in the contract). For ETEN, Expervia is both.
- Learner rights: download my data, delete my account (with clear explanation that issued certificates are retained in minimal form for verification unless revoked), correct my data.
- Talent discovery and public profiles are **off by default**.

### 30.3 Backup and disaster recovery

| Item | Target |
| --- | --- |
| Database backups | Continuous WAL archiving / point-in-time recovery (managed service) + daily snapshots; retained 35 days; monthly snapshot retained 12 months |
| Object storage | Versioning on critical buckets (certificates, submissions); replication to a second location for certificates |
| RPO (max data loss) | ≤ 15 minutes |
| RTO (max downtime) for a regional failure | ≤ 4 hours MVP; ≤ 1 hour Phase 3 |
| Restore drills | Quarterly restore test to a staging environment, documented |
| Runbooks | Database failover, provider outage (payments, email), credential leak, tenant data incident |

### 30.4 Incident response

Severity levels (SEV1 to SEV3), on-call rota, status page, tenant notification within contractual timelines (and regulator timelines for data breaches, e.g. NDPA's 72-hour notification), post-incident reviews.

---

## 31. Scalability

### 31.1 Planning assumptions

| Stage | Tenants | Total learners | Peak concurrent users | Notes |
| --- | --- | --- | --- | --- |
| MVP launch | 3 | 2,000 | 200 | |
| Year 1 | 30 | 50,000 | 3,000 | One large corporate |
| Year 3 | 300+ | 1,000,000 | 30,000 | Multi-region |

### 31.2 Approach

- **Stateless app servers** (web and API containers) behind a load balancer; scale horizontally on CPU/latency.
- **Queues** absorb spikes (emails, PDFs, imports, video, AI); workers scale on queue depth.
- **Caching:** tenant config and catalogue pages cached at the edge (Cloudflare) and in Redis; invalidated on change.
- **Database:** vertical scaling first (cheap, simple), PgBouncer pooling, read replicas for analytics, partitioned large tables, then tenant "cells" (Section J).
- **Video:** served by a streaming CDN, never through the API.
- **Search:** move from Postgres FTS to a dedicated engine when catalogue or query volume requires.
- **Load testing** before launch and before large tenant onboarding (e.g. 5,000 learners starting a compliance course on Monday 9 am).

---

## 32. Deployment architecture

Summary; full design in [Section J](./J-deployment-architecture.md).

- Containers for web (Next.js), API (Laravel, PHP-FPM/Octane), workers, scheduler.
- Managed PostgreSQL, managed Redis, Cloudflare R2, Cloudflare Stream, Cloudflare CDN/WAF/custom hostnames.
- Environments: local → preview (per pull request) → staging → production.
- Infrastructure as code (Terraform/OpenTofu).
- Start in one region; add regional cells for data residency and latency.

---

## 33. DevOps and CI/CD

### 33.1 Repository strategy

- **Recommendation:** a new monorepo for the platform (e.g. `expervia-platform`) with `apps/web` (Next.js), `apps/api` (Laravel), `packages/ui`, `packages/api-client`, `infra/`, `docs/`. This repository (`coetara-forge`) holds the Coetara Forge website; the ETEN platform documents live here under `docs/eten-platform/` until the platform repo exists, then move with it.

### 33.2 Pipeline

```text
Pull request opened
  → lint (ESLint, Prettier, PHP-CS-Fixer/Pint), type-check (TypeScript, PHPStan level 8)
  → unit + feature tests (Pest/PHPUnit, Vitest)
  → tenant-isolation test suite + RLS policy check on migrations
  → OpenAPI spec diff (flags breaking changes)
  → security: dependency audit, secret scan, SAST
  → build containers
  → deploy preview environment (seeded demo tenants)
  → E2E smoke tests (Playwright) against preview
Merge to main
  → deploy to staging automatically → full E2E suite
  → manual approval → production (rolling/blue-green), migrations run first
  → post-deploy smoke tests; automatic rollback on failed health checks
```

### 33.3 Practices

- Trunk-based development with short-lived branches and feature flags for unfinished work.
- **Database migrations must be backward compatible** with the previous release (expand → migrate → contract), so rollbacks are safe.
- Semantic versioning for the public API; changelog.
- Every production change is traceable to a PR.
- Seed scripts create demo tenants ("ETEN Demo", "Acme Corp Demo") so anyone can test realistically.

---

## 34. Testing strategy

| Level | Tooling | What | Coverage goal |
| --- | --- | --- | --- |
| Unit | Pest/PHPUnit, Vitest | Pure business rules: commission calculation, progress maths, eligibility for free intro, completion rules, plan limits, slot generation, certificate codes | ≥ 90% on domain services |
| Feature/API | Pest with database | Every endpoint: auth, permissions per role, validation, tenant isolation | Every endpoint × every role in the RBAC matrix (generated tests) |
| Tenant isolation | Custom suite | Two identical tenants; assert no cross-reads/writes on every endpoint | 100% of endpoints |
| Contract | OpenAPI validation | Responses match the spec | All endpoints |
| Integration | Provider sandboxes (Paystack test mode, Stripe test mode) | Checkout → webhook → fulfilment → ledger | All payment flows |
| E2E | Playwright | Critical journeys: sign up, buy course, complete lesson, take quiz, get certificate, verify certificate, book free intro, convert to paid, tenant onboarding | Critical journeys on desktop + mobile viewport |
| Accessibility | axe-core in Playwright, manual screen reader checks | WCAG 2.2 AA on key screens | All MVP screens |
| Performance | k6 | Login, catalogue, lesson player, checkout under load | p95 targets in Section 35 |
| Security | Dependency scan, SAST, DAST (OWASP ZAP baseline), pen test | | Before launch and annually |
| Visual regression | Playwright screenshots / Storybook | Design system components in default and tenant themes | All components |

**Critical business logic that must have tests before merge:** money (pricing, coupons, commissions, refunds, ledger, payouts), access control, tenant isolation, progress and completion, certificate issuance and verification, free-intro eligibility, plan limits.

---

## 35. Monitoring

| What | Tool (examples) | Alerts when |
| --- | --- | --- |
| Errors | Sentry (web + API) | New error type; error rate spike |
| Metrics & dashboards | Grafana Cloud / Datadog / Better Stack | p95 API latency > 800 ms for 5 min; 5xx > 1%; queue age > 2 min (critical queues) |
| Logs | Structured JSON logs with `request_id`, `organization_id`, `user_id` (no secrets or personal content) | Log-based alerts on payment and auth failures |
| Uptime | External checks from Lagos, Nairobi, Johannesburg, London | Any public endpoint down 2 min |
| Business health | Scheduled checks | Webhook failures, payout failures, email bounce rate > 5%, zero orders in 24 h for an active tenant |
| AI | AI usage dashboard | Spend > 80% of tenant or platform budget; error rate from provider |
| Database | Managed DB metrics | CPU > 75%, connections > 80%, replication lag, slow queries |

**Service level objectives (initial):** 99.5% monthly availability (MVP), 99.9% (Phase 3 enterprise); API p95 < 500 ms for reads, < 1,000 ms for writes (excluding provider calls).

---

## 36. Product analytics

Separate from business dashboards, this answers "how are people using the product and where do they get stuck?"

- **Tool:** PostHog (self-hostable or cloud, EU region available) or similar, fed by both frontend and backend events. Respect consent: no tracking cookies before consent where law requires.
- **Event naming:** `object.action` in past tense, e.g. `course.viewed`, `checkout.started`, `checkout.completed`, `lesson.completed`, `intro.booked`, `recommendation.accepted`, `credential.shared`, `tenant.onboarding_step_completed`.
- **Standard properties:** `organization_id`, `tenant_type`, `plan`, `role`, `platform` (web/ios/android), `utm_*` (first and last touch, a pattern already used on the Coetara Forge site).
- **Key funnels:**
  1. Learner acquisition: visit → sign up → onboarding complete → first lesson → first purchase.
  2. Mentorship: mentor profile view → intro booked → intro held → recommendation sent → recommendation viewed → paid.
  3. Course: enrolled → 25% → 50% → completed → certificate shared.
  4. Tenant: sign up → org created → branded → first course published → first learner → first sale → paid plan.
- **Experimentation:** feature flags support A/B tests (e.g. offer page layouts), with guardrails so experiments never change prices shown to the same user inconsistently.
- **Marketing attribution:** UTM capture on sign-up and checkout; GA4 and ad-platform conversion events (sign-up, purchase, demo booked) via Google Tag Manager per tenant, with server-side conversion APIs (Meta CAPI, Google Enhanced Conversions) in Phase 2 for accurate paid-media optimisation.
