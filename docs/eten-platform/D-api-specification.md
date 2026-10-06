# D. API Specification (REST v1)

This lists the major endpoints. The authoritative contract will be the OpenAPI 3.1 file generated from the Laravel code (`/api/v1/openapi.json`); this document is the design that code must match.

## D.0 Standards

**Base URL:** `https://{academy-host}/api/v1` (tenant from hostname) or `https://api.expervia.app/v1` with header `X-Organization-Id` (mobile, integrations). Platform admin: `https://admin.expervia.app/api/v1/platform/...`.

**Auth:**
- Web: Sanctum session cookie (call `GET /auth/csrf` first; send `X-XSRF-TOKEN`).
- Mobile: `Authorization: Bearer <access_token>` (15 min) + refresh token rotation (`POST /auth/token/refresh`).
- Integrations (P3): OAuth2 client credentials, scoped (`courses:read`, `enrollments:write`).

**Request/response conventions**

```http
GET /api/v1/courses?filter[category]=cloud&filter[level]=beginner&sort=-published_at&limit=20&cursor=eyJpZCI6...
Accept: application/json
```

```json
{
  "data": [ { "id": "0190f8...", "type": "course", "title": "Azure Fundamentals", "price": { "amount_minor": 4500000, "currency": "NGN", "formatted": "₦45,000" } } ],
  "meta": { "next_cursor": "eyJpZCI6...", "limit": 20 }
}
```

**Errors (RFC 9457 problem details):**

```json
{
  "type": "https://docs.expervia.app/errors/validation",
  "title": "The given data was invalid.",
  "status": 422,
  "code": "validation_failed",
  "errors": { "email": ["The email has already been taken."] },
  "request_id": "req_01J..."
}
```

| HTTP | `code` examples | When |
| --- | --- | --- |
| 400 | `bad_request` | Malformed request |
| 401 | `unauthenticated` | No/expired session |
| 402 | `plan_limit_reached`, `payment_required` | Tenant plan limit; paid content |
| 403 | `forbidden`, `mfa_required`, `email_unverified` | Lacks permission |
| 404 | `not_found` | Missing **or in another tenant** |
| 409 | `conflict`, `slot_unavailable`, `already_enrolled` | State conflict |
| 410 | `offer_expired` | Expired recommendation/invite |
| 422 | `validation_failed`, `not_eligible_free_intro` | Validation/business rule |
| 429 | `rate_limited` | Too many requests (`Retry-After`) |
| 5xx | `server_error`, `provider_unavailable` | Our fault / upstream outage |

**Headers:** `Idempotency-Key` (required on money-moving POSTs), `X-Request-Id` (echoed), `RateLimit-Limit/Remaining/Reset`, `Accept-Language`.
**Versioning:** path (`/v1`). Additive changes don't bump version. Deprecations announced with `Deprecation` and `Sunset` headers.
**Default rate limits:** anonymous 60/min/IP; authenticated 300/min/user; login 10/min/IP + progressive lockout; verification lookup 30/min/IP; tenant-wide ceiling per plan.

Permission names below refer to [Section E](./E-rbac-matrix.md). "Own" means the policy also checks ownership.

---

## D.1 Tenant config and auth

| Method | Path | Purpose | Auth / permission |
| --- | --- | --- | --- |
| GET | `/tenant-config` | Public config for current host: name, branding, enabled modules, terminology, auth methods | Public |
| GET | `/auth/csrf` | CSRF cookie | Public |
| POST | `/auth/register` | Register (+ join academy) | Public (signup mode) |
| POST | `/auth/login` | Email/password login | Public |
| POST | `/auth/logout` | Log out current session | User |
| GET | `/auth/oauth/{provider}/redirect` · `/callback` | Google / Microsoft login | Public |
| POST | `/auth/email/verify` · `/auth/email/resend` | Email verification | Public / User |
| POST | `/auth/password/forgot` · `/auth/password/reset` | Password reset | Public |
| POST | `/auth/mfa/totp/setup` · `/confirm` · `/challenge` · DELETE `/auth/mfa/totp` | MFA | User |
| GET | `/auth/sessions` · DELETE `/auth/sessions/{id}` | List/revoke sessions | User |
| POST | `/auth/token` · `/auth/token/refresh` | Mobile tokens | Public / refresh token |
| GET | `/me` | Current user, membership, roles, permissions, memberships list | User |
| PATCH | `/me` | Update name, avatar, locale, timezone | User |
| GET | `/me/memberships` | Academies the user belongs to (for switcher) | User |
| POST | `/invitations/{token}/accept` | Accept invite | Public + login |
| GET | `/me/export` · POST `/me/deletion-request` | Data export / erasure | User |

## D.2 Organisation administration

| Method | Path | Purpose | Permission |
| --- | --- | --- | --- |
| POST | `/onboarding/organizations` | Create organisation (signup wizard) | User (global) |
| PATCH | `/onboarding/organizations/{id}/steps/{step}` | Save wizard step | org.settings.manage |
| GET/PATCH | `/admin/organization` | Org profile & general settings | org.settings.manage |
| GET/PATCH | `/admin/branding` | Branding & landing page blocks | org.branding.manage |
| GET/POST | `/admin/domains` · POST `/admin/domains/{id}/verify` · DELETE | Custom domains | org.domains.manage |
| GET | `/admin/members` | List members (filter by role, status, unit) | members.view |
| GET/PATCH | `/admin/members/{id}` | Member detail; status | members.manage |
| PUT | `/admin/members/{id}/roles` | Set roles | roles.assign |
| POST | `/admin/invitations` · GET · DELETE `/{id}` | Invitations (bulk supported) | members.invite |
| POST | `/admin/imports/members` · GET `/admin/imports/{id}` | CSV import (P2) | members.invite |
| GET/POST/PATCH/DELETE | `/admin/roles` | Custom roles (P2) | roles.manage |
| GET | `/admin/permissions` | Permission catalogue | roles.manage |
| GET | `/admin/applications` · POST `/{id}/approve` · `/{id}/reject` | Instructor/mentor/expert applications | applications.review |
| GET/PATCH | `/admin/settings/mentorship` | Price bounds, free intro rules, policies | mentorship.settings.manage |
| GET/POST/PATCH | `/admin/commission-rules` | Commission configuration | commerce.settings.manage |
| GET/PATCH | `/admin/payment-accounts` · POST `/connect/{provider}` | Connect Paystack/Stripe | commerce.settings.manage |
| GET | `/admin/billing` · `/admin/billing/invoices` · POST `/admin/billing/change-plan` | SaaS plan & invoices | billing.manage |
| GET | `/admin/usage` | Usage vs limits | billing.view |
| GET | `/admin/audit-logs` | Tenant audit log | audit.view |
| GET | `/admin/dashboard` | Admin KPIs | analytics.org.view |
| GET | `/admin/reports/{report}` · POST `/admin/reports/{report}/export` | Reports + CSV export | reports.view / reports.export |

## D.3 Catalogue, courses and content

| Method | Path | Purpose | Permission |
| --- | --- | --- | --- |
| GET | `/categories` | List categories | Public |
| POST/PATCH/DELETE | `/categories[/{id}]` | Manage | categories.manage |
| GET | `/courses` | Public catalogue (published, visible) with filters & search `q` | Public |
| GET | `/courses/{slugOrId}` | Course detail (outline, instructors, price, rating; enrolled state if logged in) | Public |
| GET | `/courses/{id}/reviews` | Reviews | Public |
| GET | `/studio/courses` | Courses I teach (or all, for admins) | courses.view (own/org) |
| POST | `/studio/courses` | Create draft | courses.create |
| GET/PATCH/DELETE | `/studio/courses/{id}` | Edit (draft or published) | courses.update (own/org) |
| POST | `/studio/courses/{id}/submit` | Submit for review | courses.update (own) |
| POST | `/studio/courses/{id}/publish` · `/unpublish` · `/archive` | Publish workflow | courses.publish |
| POST | `/studio/courses/{id}/request-changes` | Review feedback | courses.publish |
| GET/POST | `/studio/courses/{id}/modules` · PATCH/DELETE `/studio/modules/{id}` | Modules | courses.update |
| POST | `/studio/courses/{id}/curriculum/reorder` | Reorder modules/items | courses.update |
| GET/POST | `/studio/modules/{id}/lessons` · PATCH/DELETE `/studio/lessons/{id}` | Lessons | courses.update |
| POST/DELETE | `/studio/lessons/{id}/resources[/{rid}]` | Resources | courses.update |
| PUT | `/studio/courses/{id}/instructors` | Co-instructors and splits (P2) | courses.update (owner) |
| GET | `/studio/courses/{id}/students` | Enrolled students + progress | courses.students.view (own) |
| GET | `/studio/courses/{id}/analytics` | Completion, drop-off, quiz stats | analytics.course.view (own) |
| POST | `/uploads` | Get signed upload URL (returns `media_asset` id + URL) | uploads.create |
| POST | `/uploads/{id}/complete` | Confirm upload → scanning/processing | uploads.create |
| GET | `/media/{id}/playback` | Signed, expiring playback URL (checks enrolment) | Enrolled / instructor |

## D.4 Learning and progress

| Method | Path | Purpose | Permission |
| --- | --- | --- | --- |
| POST | `/courses/{id}/enroll` | Enrol in free course (paid → checkout) | learning.enroll |
| GET | `/me/enrollments` | My courses (filter status) | User |
| GET | `/me/enrollments/{id}` | Enrolled course view with progress per item | Own |
| GET | `/me/lessons/{id}` | Lesson content for player | Enrolled (or preview) |
| POST | `/me/lessons/{id}/progress` | Heartbeat `{position_seconds, percent}` | Enrolled |
| POST | `/me/lessons/{id}/complete` | Mark complete | Enrolled |
| GET | `/me/dashboard` | Aggregated learner dashboard payload (next step, upcoming, courses, mentorship, credentials, recommendations) | User |
| GET | `/me/recommendations` | Rule-based (MVP) / AI (P3) | User |
| POST | `/courses/{id}/reviews` | Add review (after 30% progress) | Enrolled |
| GET | `/paths` · `/paths/{slug}` | Paths (P2) | Public |
| POST | `/paths/{id}/enroll` · GET `/me/paths[/{id}]` | Path enrolment & progress (P2) | learning.enroll |
| POST/PATCH/DELETE | `/studio/paths[/{id}]` · `/studio/paths/{id}/steps` | Manage paths (P2) | paths.manage |

## D.5 Assessments, assignments, projects, skills

| Method | Path | Purpose | Permission |
| --- | --- | --- | --- |
| GET/POST/PATCH/DELETE | `/studio/questions[/{id}]` | Question bank | assessments.manage (own course/org) |
| GET/POST/PATCH/DELETE | `/studio/assessments[/{id}]` · PUT `/studio/assessments/{id}/questions` | Assessment builder | assessments.manage |
| GET | `/assessments/{id}` | Intro: rules, attempts left, best score | Enrolled |
| POST | `/assessments/{id}/attempts` | Start attempt (returns questions without answers, deadline) | Enrolled |
| PUT | `/attempts/{id}/answers/{questionId}` | Save answer (autosave) | Own attempt |
| POST | `/attempts/{id}/submit` | Submit → graded result or `awaiting_grading` | Own attempt |
| GET | `/attempts/{id}` | Result, feedback, per-skill breakdown | Own / grader |
| GET | `/grading/queue` · POST `/grading/attempts/{id}` | Manual grading | assessments.grade |
| POST | `/assignments/{id}/submissions` · GET `/me/assignments` | Submit assignment | Enrolled |
| POST | `/grading/assignment-submissions/{id}` | Grade assignment | assessments.grade |
| GET | `/projects/{id}` · POST `/projects/{id}/submissions` | Project brief & submit (P2) | Enrolled |
| GET | `/review/queue` · POST `/review/submissions/{id}/reviews` | Reviewer workflow (P2) | projects.review |
| GET | `/skills` · GET `/me/skills` · GET `/me/skills/{id}` | Skills & evidence (P2) | User |
| POST | `/me/external-certifications` | Upload external cert (P2) | User |
| POST | `/mentor/skill-verifications/{id}` | Mentor verifies skill (P2) | skills.verify |

## D.6 Mentorship

| Method | Path | Purpose | Permission |
| --- | --- | --- | --- |
| GET | `/mentors` | Directory: filters `skill`, `price_max`, `language`, `has_free_intro`, `available_within_days`, sort by rating/price/next availability | Public |
| GET | `/mentors/{handle}` | Profile + offerings + reviews | Public |
| GET | `/mentors/{handle}/offerings/{id}/slots?from=&to=&tz=` | Available slots | Public |
| GET | `/mentors/{handle}/free-intro/eligibility` | Eligibility + reason if not | User |
| POST | `/bookings` | Create booking hold `{offering_id, starts_at, goal}`; free intro → confirmed; paid → returns `order_id` for checkout | mentorship.book |
| GET | `/me/bookings` · GET `/me/bookings/{id}` | My bookings/sessions | Own |
| POST | `/me/bookings/{id}/cancel` · `/reschedule` | Per policy | Own |
| POST | `/me/sessions/{id}/rating` | Rate session | Own |
| GET | `/me/recommendations/mentorship` · GET `/me/recommendations/mentorship/{id}` | Offers (marks viewed) | Own |
| POST | `/me/recommendations/mentorship/{id}/accept` | Accept → order for checkout | Own |
| POST | `/me/recommendations/mentorship/{id}/save` | Save for later | Own |
| GET | `/me/programmes` · `/me/programmes/{id}` | Programme credits & sessions | Own |
| POST | `/mentor/applications` | Apply as mentor | User |
| GET/PATCH | `/mentor/profile` | Edit profile | mentor.profile.manage (own) |
| GET/POST/PATCH/DELETE | `/mentor/offerings[/{id}]` | Offerings & prices (validated vs bounds) | mentor.profile.manage |
| GET/PUT | `/mentor/availability` · POST/DELETE `/mentor/availability/exceptions[/{id}]` | Availability | mentor.profile.manage |
| GET | `/mentor/bookings` · POST `/mentor/bookings/{id}/confirm` · `/cancel` | Bookings | mentor.sessions.manage |
| POST | `/mentor/sessions/{id}/outcome` | Mark held / no-show | mentor.sessions.manage |
| POST/GET | `/mentor/sessions/{id}/notes` | Private/shared notes | mentor.sessions.manage |
| POST | `/mentor/sessions/{id}/recommendations` | Send recommendation | mentor.recommend |
| GET | `/mentor/mentees` · `/mentor/mentees/{id}` | Mentees | mentor.sessions.manage |
| GET | `/mentor/dashboard` | KPIs | Own |
| GET | `/admin/mentorship/sessions` · POST `/admin/mentorship/sessions/{id}/resolve-dispute` | Oversight | mentorship.manage |

## D.7 Commerce, payments, payouts

| Method | Path | Purpose | Permission |
| --- | --- | --- | --- |
| POST | `/checkout` | Create order `{items:[{product_id, price_id}], coupon_code}` → `{order, payment_url}` (Idempotency-Key) | commerce.purchase |
| POST | `/coupons/validate` | Validate coupon for cart | User |
| GET | `/orders/{id}` | Order status (polled by checkout return page) | Own |
| GET | `/me/orders` · `/me/orders/{id}/receipt` | Purchases & receipts (PDF) | Own |
| POST | `/webhooks/payments/{provider}` | Provider webhooks (signature verified; no session) | Provider signature |
| GET | `/admin/orders` · `/admin/orders/{id}` | Orders | commerce.orders.view |
| POST | `/admin/orders/{id}/refunds` | Refund (Idempotency-Key) | commerce.refund |
| GET/POST/PATCH | `/admin/coupons[/{id}]` | Coupons | commerce.coupons.manage |
| GET/POST/PATCH | `/admin/products[/{id}]` · `/prices` | Products/prices | commerce.products.manage |
| GET | `/me/earnings` | Seller earnings summary + ledger (instructor/mentor/expert) | Own (seller roles) |
| GET/POST | `/me/payout-accounts` · POST `/me/payout-accounts/resolve` | Bank account (account-name resolve) | Own (seller roles) |
| GET | `/me/payouts` | Payout history | Own |
| GET | `/admin/payouts/runs` · POST `/admin/payouts/runs` · POST `/{id}/approve` | Payout runs | payouts.manage / payouts.approve |
| GET | `/admin/ledger` | Ledger view & export | finance.view |

## D.8 Credentials and verification

| Method | Path | Purpose | Permission |
| --- | --- | --- | --- |
| GET | `/me/credentials` · `/me/credentials/{id}` | My certificates/badges | Own |
| GET | `/me/credentials/{id}/download` | Signed PDF URL | Own |
| POST | `/me/credentials/{id}/share` | Log share; returns LinkedIn add-to-profile URL | Own |
| GET | `/verify/{code}` | Public verification (optional `?t=` token) | Public (rate-limited) |
| GET/POST/PATCH | `/admin/credential-templates[/{id}]` | Templates | credentials.templates.manage |
| GET | `/admin/credentials` | Issued list | credentials.view |
| POST | `/admin/credentials` | Manual issue | credentials.issue |
| POST | `/admin/credentials/{id}/revoke` | Revoke with reason | credentials.revoke |
| POST | `/admin/credentials/{id}/reissue` | Reissue (name change) | credentials.issue |

## D.9 Corporate, cohorts, profiles, talent (P2/P3)

| Method | Path | Purpose | Permission |
| --- | --- | --- | --- |
| GET/POST/PATCH/DELETE | `/admin/org-units[/{id}]` · PUT `/{id}/members` | Departments/teams | org_units.manage |
| GET/POST/DELETE | `/admin/assignments[/{id}]` | Assign learning | assignments.manage |
| GET | `/manage/team` · `/manage/team/members/{id}` · `/manage/skills` · `/manage/reports/{r}` | Manager views (team scope) | reports.view (team) |
| GET | `/me/assignments` | My assigned learning | User |
| GET | `/cohorts` · `/cohorts/{slug}` · POST `/cohorts/{id}/apply` | Cohorts | Public / learning.enroll |
| GET/POST/PATCH | `/studio/cohorts[/{id}]` · `/events` · `/members` · `/attendance` | Manage cohorts | cohorts.manage |
| GET/PATCH | `/me/profile` · PUT `/me/profile/items` | Profile & privacy | Own |
| GET | `/profiles/{handle}` | Public profile (only public items) | Public |
| PUT | `/me/talent-consent` | Opt in/out | Own |
| GET | `/talent/search` | Recruiter search (anonymised) | talent.search |
| POST | `/talent/contact-requests` · POST `/me/contact-requests/{id}/accept` · `/decline` | Contact workflow | talent.contact / Own |

## D.10 Notifications, AI, community

| Method | Path | Purpose | Permission |
| --- | --- | --- | --- |
| GET | `/me/notifications` · POST `/me/notifications/read` | In-app notifications | User |
| GET/PUT | `/me/notification-preferences` | Preferences | User |
| GET | `/me/notifications/stream` | Server-sent events for real-time | User |
| POST | `/ai/assistant/messages` | Ask the assistant `{context:{type:'lesson', id}, message}` → streamed answer with citations (P2 pilot) | ai.assistant.use + tenant feature enabled + credits |
| GET | `/ai/assistant/conversations[/{id}]` | History | Own |
| POST | `/ai/feedback` | Thumbs up/down + reason | Own |
| GET/PATCH | `/admin/ai/settings` · GET `/admin/ai/usage` | AI controls | ai.settings.manage |
| GET/POST | `/spaces/{id}/threads` · `/threads/{id}/posts` · POST `/posts/{id}/report` | Community (P2) | community.participate |
| POST | `/admin/moderation/{reportId}/resolve` | Moderation (P2) | community.moderate |

## D.11 Platform admin (`admin.expervia.app/api/v1/platform`)

| Method | Path | Purpose | Platform role |
| --- | --- | --- | --- |
| GET | `/dashboard` | MRR, ARR, churn, GMV, health | super_admin, finance, readonly |
| GET/POST/PATCH | `/organizations[/{id}]` · POST `/{id}/suspend` · `/reactivate` · DELETE | Tenants | super_admin |
| PUT | `/organizations/{id}/limits` · `/feature-flags` | Overrides | super_admin |
| GET | `/users` · POST `/users/{id}/lock` · `/reset-mfa` | Global users | super_admin, support |
| POST | `/impersonations` `{organization_id, user_id, reason}` · DELETE `/impersonations/{id}` | Time-limited impersonation | support (audited) |
| GET/POST/PATCH | `/plans[/{id}]` · `/plans/{id}/features` | Plans | super_admin |
| GET | `/subscriptions` · `/invoices` · `/transactions` · `/payouts` | Finance | super_admin, finance |
| GET | `/certificates?code=` · POST `/certificates/{id}/revoke` | Credential oversight | super_admin, support |
| GET | `/ai/usage` · PATCH `/ai/config` | AI cost & models | super_admin |
| GET | `/system/queues` · `/system/webhooks/failed` · POST `/system/webhooks/{id}/retry` | Operations | super_admin |
| GET | `/audit-logs` | Platform audit | super_admin |

## D.12 Outbound webhooks (P3)

Tenants register endpoints (`/admin/webhooks`). Events: `enrollment.created`, `course.completed`, `credential.issued`, `credential.revoked`, `order.paid`, `booking.confirmed`, `assignment.completed`, `member.created`. Payload signed with `X-Expervia-Signature: t=timestamp,v1=HMAC-SHA256`, retried with exponential backoff for 24 h.
