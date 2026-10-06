# H. Monetization Architecture

How money enters, is split, is recorded and leaves the platform. Prices and percentages are **configurable assumptions**, not final commercial terms. Regulatory and tax treatment must be confirmed by Expervia's legal and tax advisers before launch; this document is not legal or tax advice.

## H.1 Building blocks

```text
 Product  ─►  Price  ─►  Order  ─►  Payment (provider)  ─►  Fulfilment
                              │
                              └─► Commission engine ─► Ledger entries ─► Payouts
 Plan ─► Subscription ─► Invoice ─► Payment ─► Tenant access/limits
```

| Block | Description |
| --- | --- |
| **Product** | Anything sellable: course, path, mentor offering, programme, cohort, expert service, learner subscription, seat pack |
| **Price** | Amount + currency (+ interval for subscriptions). A product can have prices in several currencies (₦ and $) |
| **Order** | The purchase record (snapshot of items, prices, discounts, tax) |
| **Payment** | A provider transaction attempt against an order or invoice |
| **Commission engine** | Decides who gets what from each order item |
| **Ledger** | Append-only record of balances owed (sellers, tenant, platform, fees, tax) |
| **Payout** | Money sent to a seller's bank account, settling ledger entries |
| **Subscription / invoice** | Tenant's SaaS plan billing (and later learner subscriptions) |

## H.2 Two money circuits

### Circuit 1: SaaS billing (tenant → Expervia)

| Item | Design |
| --- | --- |
| Plans | `plans` + `plan_features` (limits & features), prices per currency and interval |
| Collection | NGN via Paystack recurring (card authorisation) or bank transfer invoices; USD/GBP/EUR via Stripe Billing |
| Trial | 14 days, no card required for Starter (configurable); card required to activate |
| Proration | Upgrades immediate and prorated; downgrades at period end, blocked if usage exceeds the lower plan's limits (with guidance) |
| Dunning | Retry day 1, 3, 5, 7; emails to Org Owner and billing contacts; `past_due` with banner; `suspended` at day 14 (configurable) |
| Enterprise | Custom plan; manual invoices with PO number, net 30; payment recorded by finance (bank transfer); contract dates and seat counts stored |
| Add-ons (P2) | AI credit packs, extra storage, extra video minutes, extra custom domains, priced as subscription items |
| Revenue recognition | Annual plans recognised monthly in reporting (MRR = annual ÷ 12) |
| Tax | VAT applied per tenant billing country where Expervia is registered; tax IDs captured on invoices |

### Circuit 2: Learner commerce (learner → tenant/seller, with platform fee)

Who is the merchant of record and where the money lands depends on the tenant's setup:

| Setup | Who it suits | Money flow | Platform fee collection |
| --- | --- | --- | --- |
| **A. Connected account (default for external tenants)** | Training companies, communities, corporates selling externally | Learner pays → provider splits at source → tenant's own Paystack subaccount / Stripe Connected Account receives its share | Provider deducts platform transaction fee (e.g. 5% Starter) automatically into Expervia's account |
| **B. Platform-collected (ETEN and marketplace sales)** | ETEN Academy (Expervia is merchant), and any tenant marketplace with many small sellers | Learner pays ETEN's account → ledger records seller shares → payouts to sellers after holding period | Retained before payout |
| **C. Invoice (corporate/B2B)** | Seat packs, enterprise contracts | Bank transfer against invoice | Included in contract |

Connected accounts (A) keep other tenants' money out of Expervia's balance sheet, reducing regulatory exposure. Setup B means Expervia holds creators' funds temporarily; confirm requirements with counsel (e.g. CBN payment regulations, escrow/holding rules, KYC of sellers).

## H.3 Commission engine

### H.3.1 Rule matching

`commission_rules` rows, most specific match wins (seller override > product > category > product type > tenant default > platform default), each with `platform_bps`, `tenant_bps`, `seller_bps` (basis points; 10,000 = 100%) and `fee_bearer` (who absorbs the payment processor's fee).

### H.3.2 Worked examples

**1. ETEN mentorship session (master prompt example)**

```text
Session price:                 ₦30,000
Commission rule (ETEN mentorship): ETEN 20% / Mentor 80%, fee bearer = platform
ETEN (platform share):         ₦6,000
Mentor earning:                ₦24,000
Paystack fee (example 1.5% + ₦100, capped ₦2,000): ₦550 → absorbed by ETEN
ETEN net:                      ₦5,450
```

Ledger entries for this order:

| account | direction | amount | status |
| --- | --- | --- | --- |
| `seller:tunde` | credit | ₦24,000 | pending → available after holding period |
| `tenant:eten` (platform share) | credit | ₦6,000 | available |
| `processor_fees` | debit (charged to tenant:eten) | ₦550 | settled |

(Paystack's actual fee schedule must be read from current provider terms; the figure above illustrates the mechanics.)

**2. 8-week programme from a recommendation:** ₦150,000 → ETEN ₦30,000, mentor ₦120,000. Mentor earning released **per session held** (₦15,000 each) rather than all at once, protecting learners if a programme stops early. (Configurable: per session or at end.)

**3. External tenant course sale (Starter plan, connected account):** ₦50,000 course sold by Femi's academy → provider split: platform transaction fee 5% = ₦2,500 to Expervia; ₦47,500 minus processor fee to Femi's account. If Femi's instructor is a third party, the tenant's own commission rule splits Femi's ₦47,500 in Femi's ledger for Femi to pay out.

**4. Coupon:** Discounts reduce the gross before commission (everyone shares the discount proportionally) unless the coupon is marked `seller_funded` or `platform_funded`.

**5. Refund:** Reversing ledger entries in the same proportions. If the seller earning was already paid out, the seller's balance goes negative and is netted from future earnings (policy shown in seller terms).

### H.3.3 Holding periods and release

| Product | Release trigger |
| --- | --- |
| Course | 7 days after purchase (refund window), configurable |
| Single session | 48 h after session marked held (dispute window) |
| Programme | Per session held + 48 h |
| Cohort | Per milestone or at end (configurable) |
| Expert service | On learner approval of delivery or auto-approve after 5 days |

## H.4 Payouts

| Step | Detail |
| --- | --- |
| Payout account | Seller adds bank; account name resolved via provider API (Paystack Resolve Account Number) and must match the seller's verified name (or admin review) |
| KYC | Seller identity and tax details collected before first payout (threshold-based); stored encrypted |
| Run creation | Weekly (ETEN default: every Friday) or monthly; includes sellers with `available` balance ≥ minimum (e.g. ₦5,000) |
| Approval | MVP: admin approves run; four-eyes over threshold. P2: automated with anomaly checks |
| Execution | Provider transfer per seller (Paystack Transfers; Stripe Connect payouts internationally); idempotent references |
| Results | `paid` or `failed` with reason (e.g. invalid account); failed amounts return to `available` |
| Statements | Monthly statement PDF per seller; withholding tax lines where applicable |

## H.5 Each revenue type

| Revenue type | Product/plan | Collection | Split | Notes |
| --- | --- | --- | --- | --- |
| **SaaS subscriptions** | `plans` | Circuit 1 | 100% Expervia | Limits enforced from plan features |
| **Course sales** | `course` products | A (tenant) or B (ETEN/marketplace) | Tenant/seller vs platform fee | Instructor share via commission rules |
| **Mentorship** | `mentor_offering`, programmes | B (ETEN), A for tenants that run their own | 80/20 ETEN default | Free intros create no order; tracked for conversion |
| **Cohorts** | `cohort` | A or B | Tenant/instructor/mentor splits (multiple sellers per order item) | Instalments (P2): 2–3 payments via saved card authorisation |
| **Marketplace commissions** | All seller products | B | Per rules | Referral-link rate (10%) vs platform traffic rate (30%) for courses |
| **Instructor payouts** | Ledger → payouts | H.4 | | Revenue dashboard shows gross, fees, net, pending, paid |
| **Expert payouts** | `expert_service` orders | B | 80/20 default | Quote-based services create a custom price on acceptance |
| **Corporate contracts** | Enterprise plan + seat packs + services | C (invoice) | Expervia (own tenant) or ETEN (seats in ETEN) | Contract record: term, seats, price, renewal date, owner |
| **Learner subscriptions (P2)** | `subscription` product (e.g. ETEN All-Access) | B | Instructor pool: revenue shared by minutes watched (pro-rata), configurable | Requires usage-based royalty calculation monthly |
| **Talent access (P3)** | Recruiter plans | Circuit 1 style (to tenant or platform) | | Per-contact fees possible |

## H.6 Currency handling

- Prices are set per currency; no live FX conversion at checkout (avoids price drift for learners).
- Ledger balances are kept per currency; payouts are made in the currency earned (NGN to Nigerian banks; USD via Stripe where supported).
- Reporting converts to a reporting currency (USD and NGN views) using a daily rate stored in `fx_rates`, clearly labelled.

## H.7 Fraud and risk controls

- Velocity limits on checkout per user/card/IP; Turnstile on checkout for suspicious sessions.
- Free-intro abuse controls ([Part 5, 21.3](./05-prd-domain-architecture.md#213-free-30-minute-introduction-model-eten-default)).
- Self-dealing detection: seller buying own products with coupons; mentor booking self via second account (same device/IP/payment fingerprint flags).
- Chargeback handling: provider dispute webhooks freeze related seller earnings.
- Payout anomaly checks: first payout, sudden spike, bank account changed in last 72 h → manual review.

## H.8 Monetisation metrics produced

MRR, ARR, net new MRR, churn, expansion revenue, GMV, take rate, revenue by stream, ARPU per tenant and per learner, mentor/instructor earnings, payout liability (owed but unpaid), refund rate, chargeback rate, free-to-paid mentorship conversion, average order value, coupon cost.
