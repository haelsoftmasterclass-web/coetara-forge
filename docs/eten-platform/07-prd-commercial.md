# PRD Part 7: Pricing, Go-to-Market, Differentiation and Roadmap (Sections 37 to 40)

> All prices below are **starting assumptions** to test with pilot customers, not final pricing. They are stored in the `plans` table, so changing them is configuration, not code.

---

## 37. Pricing model

### 37.1 SaaS plans for tenants

| | Starter | Professional | Enterprise |
| --- | --- | --- | --- |
| For | Small training businesses, communities | Growing academies, mid-size companies | Large companies, universities, governments |
| Price (NGN, monthly) | ₦75,000 | ₦250,000 | Custom (annual contract) |
| Price (USD, monthly) | $59 | $199 | Custom |
| Annual discount | 2 months free | 2 months free | Negotiated |
| Active learners / month included | 250 | 1,500 | Custom (seat or tiered) |
| Admin/instructor seats | 3 | 15 | Unlimited |
| Storage | 50 GB | 500 GB | Custom |
| Video streaming minutes | 5,000 / month | 50,000 / month | Custom |
| Transaction fee on tenant sales | 5% | 2% | 0 to 1% |
| Branding | Logo, colours | + custom domain, remove "Powered by" | + multiple domains, custom email domain |
| Mentorship marketplace | Yes | Yes | Yes |
| Learning paths, cohorts, projects (P2) | Paths only | Yes | Yes |
| Corporate teams & assignments (P2) | No | Yes | Yes |
| AI credits (P2/P3) | Add-on | 10,000 credits / month | Custom |
| Analytics | Basic | Advanced + exports | Advanced + API/warehouse export |
| API access (P3) | No | Read-only | Full |
| SSO / SCIM (P3) | No | No | Yes |
| Support | Email | Email + chat, 1 business day | Named CSM, SLA |
| Trial | 14 days | 14 days | Pilot by agreement |

Rules:
- "Active learner" = a learner who did anything in the month. Organisations pay for usage, not for dormant accounts, which suits African markets where many sign-ups go inactive.
- Overages: soft limit with notification at 80% and 100%; automatic upgrade prompt; Enterprise contracts set overage rates.
- Prices set per currency (not converted live), so a Nigerian tenant sees a stable Naira price.

### 37.2 ETEN Academy learner pricing (examples)

| Product | Example price |
| --- | --- |
| Short course | ₦15,000 to ₦60,000 |
| Learning path bundle (P2) | ₦120,000 to ₦300,000 |
| Free intro mentorship | Free (30 min) |
| Single mentorship session (60 min) | ₦20,000 to ₦60,000 (mentor sets within bounds) |
| 8-week mentorship programme | ₦150,000 (master prompt example) |
| Cohort (8 weeks) (P2) | ₦200,000 to ₦450,000 |
| Expert architecture review (P2) | ₦75,000 to ₦300,000 |
| ETEN All-Access subscription (P2) | ₦15,000 / month (all self-paced courses) |
| Corporate seats in ETEN (P2) | ₦60,000 to ₦120,000 per seat per year |

### 37.3 Marketplace commission (ETEN defaults)

Mentorship and expert services 20% · Courses sold through ETEN's own traffic 30% · Courses sold via the instructor's own referral link 10%. Configurable per tenant, product type and seller.

---

## 38. Go-to-market strategy

### 38.1 Sequence

```text
Stage 1 (MVP, months 0 to 6):   ETEN Academy proves value with tech professionals
Stage 2 (months 4 to 12):       Training companies & communities (self-serve + assisted)
Stage 3 (months 9 to 18):       Corporate academies (sales-led), using ETEN case study
Stage 4 (months 15+):           Universities, recruiters/talent, pan-African and global
```

### 38.2 Stage 1: ETEN as the proof

- **Audience:** Nigerian and African technology professionals (cloud, security, data, Microsoft ecosystem).
- **Hook:** Free 30-minute mentorship intro with a verified senior practitioner. This is the lowest-friction, highest-trust entry point, and it feeds the recommendation flow.
- **Channels:** LinkedIn (organic thought leadership by mentors + paid), tech communities and user groups, WhatsApp and Telegram communities, partnerships with Microsoft-ecosystem communities, webinars, referral programme (credit for each referred paying learner).
- **Paid acquisition:** Meta and LinkedIn campaigns optimised on server-side conversion events (`intro.booked`, `checkout.completed`); Google Search on certification intent ("AZ-104 training Lagos").
- **Proof to collect:** completion rates, free-to-paid conversion, certificates verified by employers, learner job outcomes (with consent).

### 38.3 Stage 2: Training companies and communities

- **Offer:** "Launch your branded academy in an afternoon." Free trial, migration help, Naira pricing, local payment methods.
- **Channels:** founder-led sales, content ("How to move your training business off WhatsApp"), partner referral programme (revenue share for agencies and consultants who bring tenants), Product Hunt-style launches in African tech media.
- **Motion:** product-led with onboarding calls for Professional plan.

### 38.4 Stage 3: Corporate

- **Buyer:** Head of L&D, CIO/CTO, HR Director.
- **Pitch:** "Prove skills, not completions." Evidence-based skills dashboard, practical projects, access to ETEN's mentor network for employees.
- **Sales motion:** outbound to banks, telcos, fintechs, consultancies; pilots with one department; ETEN case study; partnerships with Microsoft partners and system integrators.
- **Contract:** annual, invoice-based, with onboarding services.

### 38.5 Stage 4: Universities and talent

- University partnerships (industry mentorship + credentials) and recruiter subscriptions once enough verified profiles exist (target: 5,000 opted-in profiles with at least one verified project before launching recruiter access).

### 38.6 Key commercial metrics per stage

| Stage | North-star metric |
| --- | --- |
| 1 | Paying ETEN learners and free-to-paid mentorship conversion |
| 2 | Tenants with ≥ 1 sale in their first 30 days |
| 3 | Corporate ARR and seat activation rate |
| 4 | Verified profiles and recruiter contact acceptance rate |

---

## 39. Competitive differentiation

### 39.1 The landscape (categories)

| Category | Examples | What they do well | Gap we fill |
| --- | --- | --- | --- |
| Course creator platforms | Thinkific, Teachable, Kajabi, Podia | Easy course selling | No mentorship marketplace, skills evidence, talent discovery; USD-centric |
| Corporate LMS | TalentLMS, Docebo, Moodle Workplace, Cornerstone | Compliance, assignments, reporting | Completion-focused, not capability evidence; expensive; dated UX for many |
| Content libraries | Coursera for Business, Udemy Business, Pluralsight | Huge catalogues | Not a branded academy; no local mentors; little local payment support |
| Mentorship platforms | MentorCruise, ADPList | Mentor discovery | Disconnected from learning, assessment and credentials |
| Credential platforms | Credly, Accredible | Digital badges | Not a learning or mentorship platform |
| Local/regional players | Various African edtechs | Local market knowledge | Usually single-academy, not a white-label SaaS |

(Competitors evolve quickly; validate this table with current research before investor or sales use.)

### 39.2 Our differentiators

1. **The full chain in one place:** learn → assess → project → mentor → credential → profile → discovered. Competitors own one or two links.
2. **Evidence-based skills:** skill levels backed by scores, projects, credentials and mentor verification, not self-declared tags.
3. **Mentorship built in**, with the free-intro-to-personalised-offer model that respects learners and converts.
4. **Africa-first commerce:** Naira (and other local) pricing, Paystack/Flutterwave, bank transfer and USSD, "active learner" pricing, low-bandwidth mode.
5. **White-label multi-tenant SaaS** with a flagship proof (ETEN) and a shared mentor/expert network that tenants can tap into (Phase 3 syndication).
6. **Verifiable credentials** with public verification and, later, open standards.
7. **Modern product experience** that feels like current SaaS, not a legacy LMS.

### 39.3 Defensibility over time

- **Network effects:** more verified learners attract recruiters; more learners attract mentors and instructors; more tenants increase the syndication marketplace.
- **Data:** evidence-based skills data per role and region becomes valuable for recommendations and workforce insights (with strict privacy).
- **Switching costs:** credentials, learning history and skills records accumulate inside a tenant's academy.

---

## 40. Product roadmap

Timeline assumes a core team of roughly 2 backend, 2 frontend, 1 designer, 1 QA/DevOps (part-time), 1 product manager. Adjust after team is confirmed. Sprints are 2 weeks.

```text
             Q1                Q2                 Q3                 Q4                 Year 2+
        ┌──────────────┬──────────────────┬─────────────────┬──────────────────┬─────────────────┐
MVP     │ S0–S5        │ S6–S9  Launch    │                 │                  │                 │
        │ Foundations, │ Mentorship,      │                 │                  │                 │
        │ LMS, payments│ credentials, SaaS│                 │                  │                 │
Phase 2 │              │                  │ Paths, projects,│ Corporate, cohorts,                 │
        │              │                  │ skills, adv.    │ profiles, expert │                 │
        │              │                  │ assessments     │ marketplace, AI  │                 │
        │              │                  │                 │ pilot            │                 │
Phase 3 │              │                  │                 │                  │ AI tutor & recs,│
        │              │                  │                 │                  │ talent, SSO,    │
        │              │                  │                 │                  │ universities,   │
        │              │                  │                 │                  │ mobile, API     │
        └──────────────┴──────────────────┴─────────────────┴──────────────────┴─────────────────┘
```

| Milestone | Contents | Exit criteria |
| --- | --- | --- |
| M0 Foundations (S0 to S1) | Repo, CI/CD, environments, auth, tenancy, RBAC, design system base | Two demo tenants isolated; tests green |
| M1 Learn (S2 to S4) | Catalogue, course builder, lessons, quizzes, enrolment, progress | Instructor publishes; learner completes a free course |
| M2 Pay (S5 to S6) | Paystack + Stripe, checkout, coupons, refunds, receipts, ledger | Paid course end-to-end in test and live mode |
| M3 Mentor (S6 to S7) | Mentor profiles, availability, booking, free intro, recommendations, paid sessions | Intro → recommendation → paid programme flow works |
| M4 Credential & SaaS (S8) | Certificates, verification, plans, subscriptions, tenant onboarding, branding, domains | Pilot tenant self-onboards and goes live |
| M5 Launch hardening (S9) | Analytics dashboards, notifications polish, security review, load test, pen test, docs | Launch checklist complete; ETEN + pilot live |
| Phase 2a | Learning paths, projects, skills framework, advanced assessments | Azure Cloud Engineer path live on ETEN |
| Phase 2b | Corporate, cohorts, profiles, expert marketplace, community, AI pilot, Flutterwave | First corporate customer live |
| Phase 3 | AI tutor and recommendations, talent marketplace, SSO/SCIM, universities, public API, mobile apps, Open Badges | First university and first recruiter customers |

The sprint-by-sprint MVP plan is in [Section F](./F-mvp-sprint-plan.md).
