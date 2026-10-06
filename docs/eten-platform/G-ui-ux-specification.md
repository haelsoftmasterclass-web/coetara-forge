# G. UI/UX Specification and Design System

Part 1 defines the **design system** built on the Expervia brand. Part 2 specifies every important screen.

<p align="left"><img src="./assets/expervia-logo.png" alt="Expervia Technologies logo" width="320"></p>

---

## Part 1. Design system

### G.1 Design principles

1. **Clarity over decoration.** Every screen answers: *Where am I? What should I do next? How am I progressing? What should I learn next?*
2. **One primary action per view.** One filled violet button; everything else secondary or tertiary.
3. **Calm, spacious, premium.** Generous white space, strong type hierarchy, restrained colour. Violet is an accent, not wallpaper.
4. **Fast on real networks.** Skeletons not spinners, optimistic updates, small pages, images lazy-loaded, video adaptive.
5. **Accessible by default.** WCAG 2.2 AA minimum: contrast, focus, keyboard, screen readers, reduced motion, 44 px touch targets.
6. **Brandable without breaking.** Tenants change a small set of tokens; layout, spacing and components never change.

### G.2 Colour

#### G.2.1 Expervia brand colours (sampled from the logo)

These values were sampled directly from the logo file in `assets/expervia-logo.png`.

| Token | Hex | Where it comes from | Contrast on white | Use |
| --- | --- | --- | --- | --- |
| `brand-midnight` | **#11015F** | "Expervia" wordmark | 17.6 : 1 | Headings, primary text on light, dark surfaces (sidebar, footer, hero) |
| `brand-deep-violet` | **#360181** | Dot-grid mark | 14.2 : 1 | Hover/pressed states, secondary dark surfaces, illustrations |
| `brand-electric-violet` | **#6504E7** | Underline accent | 7.7 : 1 | Primary buttons, links, active nav, progress, focus rings |
| `brand-ink-navy` | **#060642** | "TECHNOLOGIES" tagline | 18.9 : 1 | Body text alternative, darkest surfaces |

All three main brand colours pass WCAG AA (and AAA for normal text) on white, so they can be used for text, not just decoration.

#### G.2.2 Violet scale (generated from the brand colours)

| Step | Hex | Typical use |
| --- | --- | --- |
| violet-50 | #F6F0FE | Selected row, subtle background, info banners |
| violet-100 | #EDE1FC | Hover backgrounds, tags |
| violet-200 | #D8C0F9 | Borders on selected items, progress track |
| violet-300 | #BA8EF4 | Accent text and icons **on dark surfaces** (6.9 : 1 on midnight) |
| violet-400 | #934FEE | Charts, illustrations (not for small text on white: 4.6 : 1, large text only) |
| **violet-500** | **#6504E7** | **Primary brand action colour** |
| violet-600 | #5203BE | Primary hover |
| **violet-700** | **#360181** | Primary pressed; brand mark |
| violet-800 | #240170 | Dark surface layer |
| **violet-900** | **#11015F** | **Midnight: headings, sidebar, hero bands** |
| violet-950 | #080030 | Deepest dark-mode background |

#### G.2.3 Neutrals (slightly cool, to sit well with violet)

| Token | Hex | Use |
| --- | --- | --- |
| neutral-0 | #FFFFFF | Cards, page background (light) |
| neutral-25 | #FAFAFD | App background |
| neutral-50 | #F4F4F8 | Section backgrounds, table header |
| neutral-100 | #E9E9F0 | Dividers |
| neutral-200 | #D6D6E1 | Borders, input outlines |
| neutral-400 | #9A9AAE | Placeholder text, disabled icons |
| neutral-600 | #5C5C73 | Secondary text (7.0 : 1 on white) |
| neutral-800 | #2B2B3D | Body text |
| neutral-900 | #15151F | Highest-contrast text on light |

#### G.2.4 Semantic colours

| Token | Light | Dark-mode variant | Use |
| --- | --- | --- | --- |
| success | #0F7B4A | #4ADE9B | Completed, valid certificate, payment success |
| warning | #A45A00 | #F5B54A | Due soon, plan limit approaching |
| danger | #C2272D | #FF7A7F | Errors, revoked, destructive actions |
| info | #6504E7 (brand violet) | #BA8EF4 | Neutral information |

Semantic colours are **never** overridden by tenant branding, so "valid", "revoked" and "error" always look the same across academies.

#### G.2.5 Token structure and tenant theming

```text
Brand primitives (Expervia)  →  Semantic tokens  →  Component tokens
#6504E7                         --color-primary        --button-primary-bg
#11015F                         --color-heading        --sidebar-bg
...                             --color-surface-dark   --nav-active-indicator
```

- The **platform** (marketing site, admin console, default academy theme) uses the Expervia palette.
- **Tenants** override only these semantic tokens: `--color-primary`, `--color-primary-hover`, `--color-primary-contrast` (text on primary), `--color-accent`, `--color-surface-dark`, logo, favicon, and optionally one heading font from an approved list.
- On save, the branding service **generates the full scale** (50 to 950) from the tenant's primary colour and **checks contrast**. If the primary fails 4.5 : 1 against white for text/buttons, the system automatically darkens it for text use and warns the admin, showing a preview. Tenants can never produce an inaccessible button.
- Implemented with CSS custom properties set on `<html data-tenant="…">` from `/tenant-config`, so a theme switch needs no rebuild.
- ETEN Academy can choose its own colours; if it doesn't, it inherits the Expervia palette.

#### G.2.6 Dark surfaces and dark mode

- Light mode is default. Dark mode (P2) uses violet-950 / violet-900 surfaces, neutral-50 text, violet-300 accents.
- Marketing hero bands and the platform admin sidebar use **midnight #11015F** with white text and violet-300 accents, echoing the logo.

### G.3 Typography

| Role | Font | Size / line height (desktop → mobile) | Weight |
| --- | --- | --- | --- |
| Display (marketing hero) | Plus Jakarta Sans | 56/64 → 36/44 | 700 |
| H1 | Plus Jakarta Sans | 36/44 → 28/36 | 700 |
| H2 | Plus Jakarta Sans | 28/36 → 22/30 | 700 |
| H3 | Plus Jakarta Sans | 20/28 → 18/26 | 600 |
| Body large | Inter | 18/28 | 400 |
| Body | Inter | 16/24 | 400 |
| Small / meta | Inter | 14/20 | 400–500 |
| Caption / label | Inter | 12/16 | 500, uppercase tracking +4% for overlines |
| Code | JetBrains Mono | 14/20 | 400 |

- Plus Jakarta Sans is a geometric sans close to the Expervia wordmark's rounded, bold forms; Inter is highly legible at small sizes. Both are free (Google Fonts) and self-hosted for speed.
- Minimum body size 16 px; never below 12 px.
- Tenants can switch the heading font from an approved list (e.g. Inter, Plus Jakarta Sans, Manrope, Source Serif 4); body font stays Inter for consistency and performance.

### G.4 Spacing, layout, shape, elevation

- **Spacing scale (4 px base):** 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96.
- **Grid:** 12 columns, 24 px gutters desktop; 4 columns, 16 px gutters mobile. Max content width 1280 px; reading width 720 px for lessons.
- **Breakpoints:** sm 640, md 768, lg 1024, xl 1280, 2xl 1536.
- **Radius:** 6 px (inputs, small buttons), 10 px (buttons, cards), 16 px (modals, large cards), full (avatars, pills). The rounded dots of the Expervia mark inspire generous but not bubbly radii.
- **Elevation:** level 0 (flat, border), level 1 (cards: `0 1px 2px rgba(17,1,95,.06), 0 1px 3px rgba(17,1,95,.08)`), level 2 (dropdowns), level 3 (modals). Shadows tinted with midnight, not grey.
- **Motion:** 150 ms (hover), 200 ms (open/close), 300 ms (page transitions); ease-out; `prefers-reduced-motion` disables non-essential motion.
- **Brand motif:** the dot-grid from the logo mark can be used as a subtle background pattern (violet-100 dots) on marketing heroes and empty states. Never behind body text.

### G.5 Components

| Component | Variants | Rules |
| --- | --- | --- |
| **Button** | Primary (violet-500 bg, white text), Secondary (white bg, violet-500 border/text), Tertiary (text only), Destructive (danger), Icon | Heights 32/40/48; one primary per view; loading state keeps width; disabled has reason tooltip |
| **Link** | Inline, standalone | violet-500, underline on hover and always within body text |
| **Card** | Course card, mentor card, stat card, action card, credential card | 16 px radius on large cards; whole card clickable with a single link target; focus ring on card |
| **Form inputs** | Text, email, password (show/hide), number, currency (with symbol), textarea, select, combobox, multi-select chips, date, time, timezone, file upload (drag-drop), rich text, toggle, checkbox, radio, slider | Label always visible above field; helper text below; error text replaces helper with icon + message; required marked "(required)" text, not just *; 48 px height on mobile |
| **Tables** | Data table with sort, filter, pagination, row selection, bulk actions | On mobile collapses to stacked cards; sticky header; empty and loading rows |
| **Modals / dialogs** | Standard, confirmation, destructive confirmation (type name to confirm), full-screen on mobile | Focus trap; Esc closes; return focus to trigger |
| **Drawer / sheet** | Side drawer (desktop), bottom sheet (mobile) | Filters, quick views, AI assistant |
| **Navigation** | Top nav (public), sidebar (app), bottom tab bar (mobile app), breadcrumbs, tabs, stepper (onboarding, checkout) | Active item: violet-500 indicator bar + bold label; sidebar on midnight in admin, on white in learner app |
| **Alerts / banners** | Info, success, warning, danger; inline and page-level | Icon + title + message + optional action; dismissible when non-critical |
| **Toasts** | Success, error, info | Bottom-centre mobile, bottom-right desktop; 5 s; pause on hover; announced to screen readers |
| **Badges / pills** | Status (Draft, Published, Valid, Revoked), level (Beginner…Expert), "Free", "Free intro", "Verified ✓" | Text + colour, never colour alone |
| **Progress** | Linear bar, circular ring, step tracker (paths), skill level meter (4 segments) | Always with text value ("65%", "3 of 8 sessions") |
| **Charts** | Line, bar, stacked bar, donut (sparingly), heatmap (skills) | Violet scale for single series; categorical palette: violet-500, #0EA5A4 teal, #F59E0B amber, #EC4899 pink, #3B82F6 blue, neutral-400; accessible tooltips; table alternative |
| **Avatars** | Image, initials (on violet-100 with violet-700 text) | |
| **Empty states** | Illustration (dot-grid motif), headline, one-line explanation, primary action | Tells the user exactly how to get started |
| **Loading states** | Skeletons matching final layout; inline spinners only inside buttons | Show skeleton after 150 ms to avoid flashes |
| **Error states** | Inline field, section ("Couldn't load sessions. Retry"), full page (404, 403, 500, offline, maintenance) | Plain language, what happened, what to do; include request ID on 500 for support |
| **Video player** | Custom controls over provider player | Speed, captions, quality, keyboard shortcuts, resume |
| **Calendar / slot picker** | Month/week view + slot list | Shows timezone; keyboard accessible |

### G.6 Accessibility checklist (applies to every screen)

- Contrast ≥ 4.5 : 1 text, ≥ 3 : 1 UI components and large text.
- Visible 2 px violet-500 focus ring with 2 px offset (white or midnight halo depending on surface).
- Every interactive element reachable and operable by keyboard; logical order; skip link.
- Semantic HTML first; ARIA only where needed. Form errors linked with `aria-describedby`; live regions for toasts and async results.
- Video captions; transcripts for audio; alt text for images (required field for instructors when uploading lesson images).
- Touch targets ≥ 44 × 44 px; no hover-only actions.
- Respect reduced motion; no flashing content.
- Text resizes to 200% without loss; layouts reflow at 320 px.

### G.7 Voice and microcopy

Friendly, direct, encouraging, never patronising. British English spelling (the academies serve Nigeria and Commonwealth markets). Use the learner's progress ("You're 3 lessons from finishing"). Avoid jargon in learner surfaces. Money always formatted with currency symbol and thousands separator (₦150,000).

---

## Part 2. Screen specifications

Format for each screen: **Purpose · Layout · Components · Data · User actions · Empty · Loading · Error · Mobile.**

### G.8 Platform marketing home (MK-01)

- **Purpose:** Convince organisations to start an academy or book a demo.
- **Layout:** Midnight (#11015F) hero band with dot-grid motif; headline "Build Your Own Learning & Talent Academy"; subhead "One platform for learning, skills development, mentorship, assessment, credentials and talent development."; primary CTA **Start Your Academy** (violet-500), secondary **Book a Demo** (outline, white). Below: product screenshot; logos/proof (ETEN Academy); the journey strip (Learn → Assess → Projects → Mentorship → Credentials → Profile → Discovered); pillars grid; "Built for" segments (training companies, enterprises, universities, communities); ETEN case study; pricing teaser; FAQ; final CTA band.
- **Components:** Top nav, hero, feature cards, journey diagram, testimonial, pricing cards, FAQ accordion, CTA band, footer.
- **Data:** Static CMS content; plan prices from `plans`.
- **Actions:** Start Your Academy → `/signup`; Book a Demo → form (name, email, organisation, type, size, country); track `cta_click` with UTM.
- **Empty/Loading/Error:** Static; demo form shows inline validation and success/failure messages.
- **Mobile:** Hero text 36 px; CTAs full width stacked; journey becomes vertical list; nav collapses into drawer.

### G.9 Academy home: ETEN (AP-01)

- **Purpose:** Turn visitors into learners; show what ETEN offers.
- **Layout:** Hero with ETEN branding and the promise **"Learn. Build. Get Certified. Get Mentored. Get Discovered."**; primary CTA "Get started free", secondary "Book a free mentor intro". Technology domain tiles (Cloud & Infrastructure, Modern Work, Security & Compliance, Data & AI, Business Applications, Software Development, Digital Transformation, Technology Leadership). Featured courses carousel; learning paths (P2); featured mentors with "Free 30-min intro" badges; how it works (5 steps); projects showcase (P2); certificate verification teaser; testimonials; corporate CTA ("Train your team", P2).
- **Components:** Configurable blocks (hero, tiles, course carousel, mentor grid, steps, testimonial, CTA band).
- **Data:** `/tenant-config`, featured courses and mentors, category list.
- **Actions:** Browse domain, open course, open mentor, sign up, verify certificate.
- **Empty:** Blocks with no data are hidden automatically (e.g. no mentors yet → mentor block hidden for visitors; admins see a placeholder with "Add mentors").
- **Loading:** Server-rendered; images lazy-load with blurred placeholders.
- **Error:** If a block's data fails, that block hides; the page still renders.
- **Mobile:** Domain tiles 2 per row; carousels swipeable; sticky bottom CTA "Get started".

### G.10 Course catalogue (AP-02 / in-app)

- **Purpose:** Help learners find the right course quickly.
- **Layout:** Search bar on top; filter panel left (desktop): category, level, price (free/paid, range), duration, language, rating; results grid (3 columns) with sort (relevance, newest, popular, rating, price).
- **Components:** Search input with suggestions, filter checkboxes/chips, course cards (thumbnail, title, instructor, level badge, duration, rating, price or "Free", progress if enrolled), pagination ("Load more").
- **Data:** `GET /courses` with filters.
- **Actions:** Search, filter, sort, open course, save course (P2).
- **Empty:** No results → "No courses match 'kubernetes' with these filters." + "Clear filters" + suggested categories.
- **Loading:** 6 skeleton cards.
- **Error:** "We couldn't load courses. Try again." with retry.
- **Mobile:** Filters in bottom sheet behind a "Filters (3)" button; single-column cards; sort as select.

### G.11 Course detail (AP-04)

- **Purpose:** Explain the course and drive enrolment/purchase.
- **Layout:** Two columns desktop. Left: title, subtitle, rating, learners count, instructor, last updated, level, duration; "What you'll learn" outcomes; curriculum accordion (modules → lessons with type icons, durations, preview links); requirements; description; instructor bio; reviews. Right: sticky purchase card (thumbnail/preview video, price, "Buy now" or "Enrol free" or "Continue learning", includes list: lessons, quizzes, certificate, access).
- **Data:** `GET /courses/{slug}` incl. enrolment state, price in tenant currency.
- **Actions:** Buy / enrol / continue; play preview lesson; apply coupon (in checkout); share.
- **Empty:** No reviews → "No reviews yet. Learners can review after 30% progress."
- **Loading:** Server-rendered; purchase card state (enrolled?) loads client-side with skeleton.
- **Error:** 404 page with search if course not found or unpublished.
- **Mobile:** Purchase card becomes sticky bottom bar (price + button); sections stacked.

### G.12 Learner dashboard (LA-01)

- **Purpose:** The centre of the product: what to do next and how I'm doing.
- **Layout:** Greeting ("Good evening, Chidi"); **Next step hero card** (course thumbnail, lesson title, progress ring, "Continue" primary button); row of **Upcoming** items (next mentor session with join button and time countdown, assessment due dates); **My Learning** (in-progress course cards with progress bars, "View all"); **My Mentorship** (current mentors, open offers with "Tunde recommended a programme for you"); **My Credentials** (latest certificate thumbnails, "Share"); **Recommended for you** (3 cards with reason, e.g. "Because you completed Azure Fundamentals"). P2 adds **My Development** (skills with level meters) and **My Career** (profile completeness).
- **Data:** `GET /me/dashboard` (single aggregated call).
- **Actions:** Continue, join session, view offer, open course, share certificate, browse.
- **Empty (new learner):** Next-step card becomes "Start here" with recommendation from onboarding answers; My Learning empty state "You haven't started a course yet. Browse the catalogue"; mentorship empty state "Book a free 30-minute intro with a mentor".
- **Loading:** Skeletons per block; blocks load independently.
- **Error:** Per-block retry ("Couldn't load your mentorship. Retry"); dashboard never fully blank.
- **Mobile:** Single column in priority order: Next step → Upcoming → My Learning (horizontal scroll) → Mentorship → Credentials → Recommendations. Bottom tab bar: Home, Learning, Mentorship, Credentials, More.

### G.13 Lesson player (LA-04)

- **Purpose:** Focused learning with progress saved automatically.
- **Layout:** Top bar (back to course, course title, progress %, AI assistant button (P2)); main area (video/audio/text/PDF); below: lesson title, description, resources/downloads, notes (P2), discussion (P2); right sidebar: course outline with completion ticks, current item highlighted. Footer: "Previous" / "Mark complete & next".
- **Data:** `GET /me/lessons/{id}`, signed playback URL, outline.
- **Actions:** Play, seek, speed, captions, quality, mark complete, next/previous, download resources, open assistant.
- **Empty:** Lesson with no content (shouldn't happen post-publish) shows "This lesson is being updated".
- **Loading:** Player skeleton; outline skeleton.
- **Error:** Video fails → "Video couldn't load. Try a lower quality or switch to audio" + retry; offline → banner "You're offline. Progress will sync when you reconnect" (progress queued locally).
- **Mobile:** Video full width at top; outline in a bottom sheet ("Course content"); sticky footer with Next; landscape fullscreen; low-bandwidth mode toggle in settings menu.

### G.14 Quiz taking and results (LA-05)

- **Purpose:** Fair, low-stress testing with useful feedback.
- **Layout:** Intro screen (questions count, time limit, pass mark, attempts left, "Start"); attempt screen: one question per page (default) with progress ("Question 4 of 10"), timer (if any), answer options as large selectable cards, "Flag for review", Previous/Next; review screen listing answered/unanswered/flagged; result screen: score, pass/fail, per-question feedback (if allowed), strengths/weaknesses by topic, next action ("Continue course" or "Review lessons 3 and 5").
- **Data:** `POST /assessments/{id}/attempts`, autosave `PUT .../answers`, submit.
- **Actions:** Answer, flag, navigate, submit (confirm modal if unanswered questions), retake.
- **Empty:** n/a.
- **Loading:** Answer autosave indicator ("Saved").
- **Error:** Connection lost → answers kept locally, banner "Reconnecting… your answers are saved"; time expired → auto-submit with notice.
- **Mobile:** Options full-width cards; timer pinned top; navigation in sticky footer.

### G.15 Mentor directory and profile (AP-05, AP-06)

- **Purpose:** Find and trust the right mentor.
- **Directory layout:** Search + filters (expertise, price range, language, availability "this week", "Offers free intro", rating); mentor cards: photo, name, headline, top expertise tags, rating and sessions count, from-price, "Free 30-min intro" badge, next available slot.
- **Profile layout:** Header (photo, name, headline, rating, languages, timezone, verified badge); about; expertise; experience highlights; offerings list (free intro, single session, monthly, programmes) each with duration, price and "Book"; availability preview (next 5 slots); reviews.
- **Data:** `GET /mentors`, `GET /mentors/{handle}`, eligibility (if logged in).
- **Actions:** Filter, open profile, book offering, share profile.
- **Empty:** No mentors match → "Try removing a filter"; mentor with no availability → "No open slots in the next 30 days. Get notified when Tunde adds times" (P2).
- **Loading:** Skeleton cards; profile skeleton.
- **Error:** Retry block.
- **Mobile:** Cards single column; filters in bottom sheet; "Book free intro" sticky on profile.

### G.16 Booking flow: slot picker and confirmation (LA-09)

- **Purpose:** Book a session in under a minute without timezone confusion.
- **Layout:** Stepper: 1 Choose time → 2 Your goals → 3 Confirm (free) or Pay (paid). Step 1: calendar (dates with availability highlighted) + slot list; timezone selector defaulting to device ("Times shown in West Africa Time (Lagos)"). Step 2: goal textarea (required for intro), level, what success looks like. Step 3: summary (mentor, offering, date/time in both timezones, price, cancellation policy) → "Confirm booking" or "Pay ₦30,000".
- **Data:** slots endpoint, eligibility, `POST /bookings`, checkout.
- **Actions:** Choose slot, change timezone, enter goals, confirm/pay, add to calendar.
- **Empty:** No slots → message + alternative mentors.
- **Loading:** Slot list skeleton; hold creation spinner in button.
- **Error:** Slot taken (409) → "That time was just booked. Here are the nearest times" with refreshed list; hold expired → restart step 3; not eligible → reason and paid alternative.
- **Mobile:** Calendar collapses to horizontal date strip; slots as large buttons.

### G.17 Mentor recommendation / offer page (LA-11)

- **Purpose:** Convert intros to paid mentorship respectfully and personally.
- **Layout:** Mentor photo and name; "Recommended for you by Tunde Adebayo"; mentor's goal summary and personal note in a quote card; **primary recommendation card** (title e.g. "Azure Cloud Architecture: 8-Week Mentorship Programme", includes list: 8 sessions, practical project, certification guidance, technical reviews; price ₦150,000; "Start programme"); secondary suggestions (course, path); "Not ready yet?" with "Save for later" and "Ask Tunde a question"; reassurance (cancellation policy, what happens next).
- **Explicitly excluded:** countdown timers, "your time is over" copy, pre-checked add-ons.
- **Data:** `GET /me/recommendations/mentorship/{id}`.
- **Actions:** Start programme (checkout), save, ask question, view mentor profile.
- **Empty:** n/a.
- **Loading:** Skeleton.
- **Error:** Expired (410) → "This recommendation has expired. Ask Tunde to send a new one" + message button.
- **Mobile:** Recommendation card first; sticky "Start programme" bar.

### G.18 Mentor studio: overview and session workspace (MN-01, MN-06)

- **Purpose:** Help mentors run sessions and follow up with minimum admin.
- **Overview layout:** KPI tiles (sessions this week, free intros, intro → paid conversion, average rating, earnings pending/available); **"Recommendations to send"** list (highlighted); upcoming sessions list with join buttons; new booking requests; latest reviews.
- **Session workspace layout:** Learner summary (goal, level, progress if shared); join link; timer; private notes and shared notes tabs; after session: outcome buttons (Held / Learner no-show / I couldn't attend); **Recommend next steps** form (goal summary, choose offerings/courses/paths, optional discount within limits, personal note, validity) with live preview of what the learner will see.
- **Data:** `/mentor/dashboard`, `/mentor/bookings/{id}`.
- **Actions:** Join, take notes, mark outcome, send recommendation, reschedule, cancel.
- **Empty:** New mentor → checklist (complete profile, set availability, add offerings, add meeting link).
- **Loading:** Skeletons.
- **Error:** Recommendation price out of bounds → inline error with allowed range.
- **Mobile:** KPIs as horizontal scroll; recommendation form full-screen.

### G.19 Instructor course builder (IN-03, IN-04)

- **Purpose:** Build a quality course without training.
- **Layout:** Left tabs: Details · Curriculum · Pricing · Certificate · Settings · Publish. Curriculum: module cards with lessons list, drag handles, "+ Add lesson" menu (Video, Audio, Text, PDF, File, Link, Quiz, Assignment); lesson editor opens in a side panel (desktop) with type-specific fields and upload area showing progress and processing state; autosave indicator ("All changes saved").
- **Data:** studio course endpoints, uploads.
- **Actions:** Add/edit/reorder/delete modules and lessons, upload, preview as learner, submit for review.
- **Empty:** New course → "Start with your first module" with a sample structure suggestion.
- **Loading:** Upload progress bars; processing badges.
- **Error:** Upload failed → retry; autosave failed → persistent banner "Changes not saved. Retry" (never silent).
- **Mobile:** Editing supported for text and reordering; heavy uploads recommended on desktop (notice shown).

### G.20 Instructor revenue dashboard (IN-08)

- **Purpose:** Transparent earnings.
- **Layout:** Tiles: Total Revenue, Platform Fees, Net Earnings, Pending Payouts, Paid Out, Students, Course Sales; revenue chart by month; table of sales (date, course, buyer initials, gross, fee, net, status); payout history; payout account status.
- **Data:** `/me/earnings`, ledger.
- **Actions:** Filter by period/course, export CSV, manage payout account.
- **Empty:** "No sales yet. Share your course link" + copy link button.
- **Loading/Error:** Standard skeletons; retry.
- **Mobile:** Tiles 2 per row; table → cards.

### G.21 Credentials: certificate detail and public verification (LA-13, AP-13)

- **Certificate detail purpose:** Celebrate and share.
- **Layout:** Certificate preview (rendered image); actions: Download PDF, Add to LinkedIn, Copy verification link, Share; details (ID, issued, expiry); skills (P2).
- **Verification purpose:** Let anyone confirm authenticity in seconds.
- **Verification layout:** Search field ("Enter certificate ID, e.g. ETEN-CERT-2026-001284"); result card with large status: **✓ Certificate Valid** (success green) / **✗ Revoked** (danger) / **Expired** (warning); "Issued to", "Programme", "Issued by" (with academy logo), dates, verification timestamp; optional link to public profile.
- **Empty:** Not found → "No certificate matches this ID. Check the ID and try again."
- **Loading:** Skeleton result card.
- **Error:** Rate-limited → "Too many lookups. Try again in a minute."
- **Mobile:** Result card full width, status icon large; QR scans land directly on result.

### G.22 Checkout (LA-07)

- **Purpose:** Pay with confidence.
- **Layout:** Order summary (item, price, coupon field, discount, total, currency); payment method note ("Card, bank transfer or USSD via Paystack"); terms checkbox where required; "Pay ₦45,000" button; trust notes (secure payment by provider, refund policy). Return page: "Confirming your payment…" then success (next action) or failure (reason, retry, alternative method).
- **Error states:** Coupon invalid (inline reason); payment failed; payment pending longer than expected (we'll email you).
- **Mobile:** Single column; large pay button; provider page is mobile-optimised.

### G.23 Organisation admin dashboard (OA-01)

- **Purpose:** Academy health at a glance and pending tasks.
- **Layout:** Setup guide card (until launch checklist complete); KPI tiles (learners, active learners, enrolments, completions, certificates, revenue, mentorship sessions); plan usage bars; **Needs your attention** list (approvals, failed payouts, domain unverified, plan limit warning); charts (active learners, revenue); top courses and mentors tables.
- **Empty:** New academy → setup guide prominent, charts replaced by "Data appears once learners start".
- **Mobile:** Usable for monitoring and approvals; complex configuration recommended on desktop.

### G.24 Tenant onboarding wizard (A.2)

- **Purpose:** From sign-up to launched academy in minutes.
- **Layout:** Split screen: left form step, right **live preview** of the academy home updating with name, logo and colours. Stepper at top with skip options. Steps per [B.9](./B-user-flows.md#b9-organisation-tenant-onboarding).
- **Notable components:** Subdomain field with live availability check; logo upload with automatic colour suggestion (extracts dominant colour, like the Expervia violet); contrast warning; academy type cards with icons.
- **Error:** Subdomain taken → suggestions; logo too large → resize guidance.
- **Mobile:** Preview collapses to a "Preview" button.

### G.25 Corporate dashboard (P2) and manager view

- **Purpose:** Prove skills growth for a company.
- **Layout:** KPI row (Employees 245 · Active Learners 183 · Courses Completed 1,245 · Certificates 87 · Average Completion 76%); Top Skills chips; skills heatmap (teams × skills); assignments status (on track / overdue by team); certifications progress; export.
- **Empty:** "Assign your first learning path" CTA.
- **Mobile:** Heatmap scrolls horizontally with sticky team column.

### G.26 Super admin console (PA-01)

- **Purpose:** Operate the SaaS.
- **Layout:** Midnight sidebar (Expervia logo in white variant), content on neutral-25. Dashboard: MRR, ARR, net new MRR, churn, active orgs, trials, GMV, take rate; health panel (error rate, latency, queue backlog, failed webhooks, AI spend); tenants at risk; recent sign-ups.
- **Data density:** Higher than tenant UIs (compact table density option).
- **Mobile:** Read-only monitoring layout; write actions require desktop for safety (confirmation flows).

### G.27 Global states (all surfaces)

| State | Design |
| --- | --- |
| 404 | "We can't find that page" + search + home link (tenant-branded) |
| 403 | "You don't have access to this" + who to ask (academy admin) |
| 500 | "Something went wrong on our side" + retry + request ID |
| Offline | Top banner; cached pages still viewable; queued actions |
| Maintenance | Branded page with status link |
| Suspended academy | Learners: read-only notice; admins: billing CTA |
| Session expired | Modal to log in again without losing the page |
