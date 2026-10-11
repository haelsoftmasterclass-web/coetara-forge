# Haelsoft EdTech — Phase 1 (public website)

The first module of the Haelsoft EdTech learning platform: a 10-page public website backed by a Django REST API and PostgreSQL.

```
haelsoft/
  backend/            Django 5.2 + Django REST Framework + PostgreSQL
  frontend/           Next.js 16 (App Router) + React 19 + TypeScript (strict) + Tailwind CSS v4
  docker-compose.yml  Optional local PostgreSQL
```

This folder is self-contained. It lives in the `coetara-forge` repository but shares no code or build with the Coetara Forge site at the repository root. It reuses Coetara Forge's look and feel (editorial grid, type scale, spacing, buttons, ink bands) with Haelsoft branding. Before production, consider moving `haelsoft/` into its own repository so each site deploys independently; no code changes are needed for that.

## Pages

| Route | Page | Data |
| --- | --- | --- |
| `/` | Homepage | Site settings, featured instructors, testimonials, partners |
| `/about` | About Haelsoft EdTech | Site settings (markets) |
| `/our-story` | Our Story | Content blocks (milestones) |
| `/our-impact` | Our Impact | Verified impact metrics |
| `/team` | Our Team | Team members |
| `/instructors` | Our Instructors (search, expertise filter, pagination) | Instructors, expertise areas |
| `/instructors/[slug]` | Instructor Profile (real HTTP 404 for unknown or unpublished slugs) | Instructor |
| `/partners` | Our Partners | Partners |
| `/testimonials` | Testimonials | Testimonials |
| `/contact` | Contact Us (validated form, POSTs to Django) | Site settings |

Supporting routes: `/privacy` (privacy notice linked from the contact form's consent box, **draft pending legal review**), `/sitemap.xml`, `/robots.txt`, branded 404 and error pages.

"Explore Courses" and "Apply for a Scholarship" are not live yet. Until staff mark them open in Django Admin (Site settings), they lead to homepage sections that say so and offer an interest form, and they carry a "Soon" badge.

## Prerequisites

- Python 3.12 or newer (developed on 3.13)
- Node.js 22 and npm 10
- PostgreSQL 16 (local install, or `docker compose up -d` in this folder)

## 1. Database

With Docker:

```bash
cd haelsoft
docker compose up -d
```

Or with a local PostgreSQL:

```bash
sudo -u postgres psql -c "CREATE ROLE haelsoft LOGIN PASSWORD 'haelsoft' CREATEDB;"
sudo -u postgres psql -c "CREATE DATABASE haelsoft OWNER haelsoft;"
```

`CREATEDB` lets the test runner create its throwaway test database.

## 2. Backend (Django API)

```bash
cd haelsoft/backend
python3 -m venv .venv
source .venv/bin/activate            # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env                 # then review the values
python manage.py migrate
python manage.py createsuperuser     # staff login for Django Admin
python manage.py runserver 8000
```

- API: http://localhost:8000/api/v1/
- Health check: http://localhost:8000/api/health/
- API docs (Swagger, development only): http://localhost:8000/api/docs/
- Django Admin: http://localhost:8000/admin/

### Demo data (development only)

```bash
python manage.py seed_demo           # add --clear to recreate
```

Creates sample instructors, team members, a partner and a testimonial. Every record is flagged `is_demo`, its name starts with `[Demo]`, and the website shows a "Demo content" badge on it. Demo records are hidden from every API response unless `SHOW_DEMO_CONTENT=true`, and the command refuses to run when `DJANGO_DEBUG` is off, so demo data cannot reach production by accident. Without demo data each page shows its honest empty state.

### Backend environment variables (`backend/.env`)

| Variable | Purpose |
| --- | --- |
| `DJANGO_DEBUG` | `true` locally, `false` in production |
| `DJANGO_SECRET_KEY` | Required in production. Generate with `python -c "import secrets; print(secrets.token_urlsafe(50))"` |
| `DJANGO_ALLOWED_HOSTS` | Comma-separated hostnames of the API |
| `DJANGO_ADMIN_URL_PATH` | Admin path, default `admin/` |
| `DATABASE_URL` | `postgres://user:password@host:5432/dbname` (PostgreSQL only) |
| `CORS_ALLOWED_ORIGINS` | Exact origin(s) of the Next.js site, comma-separated. No wildcards |
| `CSRF_TRUSTED_ORIGINS` | HTTPS origin of the admin if served behind a different domain |
| `MEDIA_PUBLIC_BASE_URL` | Public base URL for uploaded images in API responses |
| `CONTACT_THROTTLE_RATE` | Contact form limit per IP, default `5/hour` |
| `CONTACT_NOTIFICATION_EMAILS` | Staff inboxes alerted about new enquiries (alerts never include the message) |
| `ADMIN_BASE_URL` | Used for the admin link in alerts |
| `EMAIL_*`, `DEFAULT_FROM_EMAIL` | SMTP settings for alerts (console backend in development) |
| `DJANGO_NUM_PROXIES` | Trusted proxies in front of Django, so rate limiting sees the real client IP |
| `CACHE_BACKEND`, `CACHE_LOCATION` | Shared cache (e.g. Redis) so rate limits hold across processes |
| `ENABLE_API_DOCS` | Serve `/api/schema/` and `/api/docs/` (defaults to `DJANGO_DEBUG`) |
| `SHOW_DEMO_CONTENT` | Show `seed_demo` records. Keep `false` in production |

## 3. Frontend (Next.js)

```bash
cd haelsoft/frontend
npm install
cp .env.example .env.local
npm run dev                          # http://localhost:3000
```

Production build: `npm run build && npm start`.

### Frontend environment variables (`frontend/.env.local`)

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public URL of the site (canonical URLs, sitemap, Open Graph) |
| `NEXT_PUBLIC_API_BASE_URL` | Django API as the browser reaches it (contact form) |
| `API_BASE_URL` | Optional private address the Next.js server uses for the API |
| `API_REVALIDATE_SECONDS` | How long the server caches API content, default 60 |
| `NEXT_PUBLIC_NOINDEX` | `true` on staging to block search engines |

Only `NEXT_PUBLIC_*` values reach the browser; none of them are secrets.

## 4. Tests and checks

Backend (needs PostgreSQL running):

```bash
cd haelsoft/backend
python manage.py test                                  # 46 tests
python manage.py makemigrations --check --dry-run
DJANGO_DEBUG=false DJANGO_SECRET_KEY=... DJANGO_ALLOWED_HOSTS=api.example.org \
  python manage.py check --deploy
```

Frontend:

```bash
cd haelsoft/frontend
npm run lint
npm run typecheck
npm test                     # Vitest + Testing Library (17 tests)
npm run build
```

End-to-end smoke tests (Playwright) run against both servers. Start Django with demo data and the production frontend first, then:

```bash
npx playwright install chromium      # once
npx playwright test                  # 26 checks, desktop and mobile
```

They check every page renders with no console errors or horizontal overflow, the 404 for unknown instructors, internal links, the mobile menu and a real contact submission. Note the contact test sends a real enquiry, so raise `CONTACT_THROTTLE_RATE` locally if you run it often.

GitHub Actions (`.github/workflows/haelsoft.yml`) runs the backend tests on PostgreSQL 16 and the frontend lint, typecheck, unit tests and build on every change under `haelsoft/`.

## API

| Method | Endpoint | Notes |
| --- | --- | --- |
| GET | `/api/health/` | `{"status","database"}` only |
| GET | `/api/v1/site-settings/` | Public contact details (blank = hidden), launch statuses, target markets |
| GET | `/api/v1/content/{page}/` | Published content blocks for `home`, `about`, `our-story`, `our-impact` |
| GET | `/api/v1/impact-metrics/` | Published **and** verified figures, with date and source |
| GET | `/api/v1/team/` | Published team members, leadership first |
| GET | `/api/v1/instructors/` | Paginated; `search`, `expertise`, `featured`, `page`, `page_size` |
| GET | `/api/v1/instructors/{slug}/` | 404 for unknown, draft, archived or demo profiles |
| GET | `/api/v1/expertise-areas/` | Areas used by published instructors |
| GET | `/api/v1/partners/` | Published, confirmed partners; `category` filter |
| GET | `/api/v1/testimonials/` | Published testimonials with recorded consent |
| POST | `/api/v1/contact/` | Validated enquiry; 201 only when stored; 429 when rate limited |

## Managing content (Django Admin)

Staff manage everything in Django Admin. It is an internal tool, not a public CMS.

- **Publication workflow.** Content records have Draft / Published / Archived status and a display order. Only Published records reach the website. Bulk "Publish" runs the same validation as the edit form.
- **Built-in safeguards** (enforced in forms and by database constraints):
  - Testimonials cannot be published without the learner's consent and its date. Programme names show only when verified; photos only with photo consent.
  - Partners cannot be published until the partnership is confirmed. Logos show only when the partner authorised their use.
  - Impact metrics cannot be published until verified, and always show their date and source.
  - Instructor qualifications show only when marked verified; profile photos only when approved.
  - Internal notes, consent records and verifier names never appear in the API.
- **Site settings.** Contact email, phone, address, response-time note and social links. Leave a field blank and the website hides it. The course catalogue and scholarship statuses decide where the two main calls to action point.
- **Markets.** Nigeria (home market), Ghana, Kenya, Rwanda, Uganda and South Africa are seeded as **Planned**. Change a status only when a market is genuinely operational.
- **Enquiries.** Read-only submissions with a New / In progress / Resolved status, staff notes and timestamps. Only staff with the relevant Django permissions can see them.

## Brand and design system

- **Logo:** the supplied Haelsoft ribbon logo (`frontend/public/brand/`), with a white-wordmark variant for dark backgrounds, an icon cut from the ribbon mark and an Open Graph image.
- **Colours** (`frontend/app/globals.css`): sampled from the logo and **provisional** until Haelsoft confirms official hex codes. Flame `#F2500A` (wordmark), Orange `#FD7301`, Amber `#FF9A1F`, Ember `#E31700`, and Ember-deep `#B83A00` for orange text on light backgrounds (meets WCAG AA). Change the tokens in one place and every component follows.
- **Type:** Archivo (extended) for headlines, Geist for body, Geist Mono for labels.
- **Tokens:** colour, radii (`--radius-control`, `--radius-card`, `--radius-band`), elevation (`--shadow-card`, `--shadow-pop`), container widths, section spacing and focus styles. Breakpoints are Tailwind's defaults.
- **Components** (`frontend/components/`): SiteHeader (with dropdown and accessible mobile menu), SiteFooter, PrimaryButton / SecondaryButton, PageHero, Section / SectionHeading, Breadcrumbs (with BreadcrumbList data), InstructorCard, TeamMemberCard, PartnerCard, TestimonialCard, ImpactMetric, ContactForm, EmptyState / ErrorState / loading skeletons, ImagePlaceholder.
- **Motion:** one subtle entrance animation, switched off for people who prefer reduced motion.

## Photography

No licensed photography was supplied, so `frontend/content/media.ts` defines each photo slot with an art-direction brief, and the site shows a branded placeholder labelled "Photography placeholder". To replace one, add the licensed image to `frontend/public/images/` and render it with `next/image` in place of the `ImagePlaceholder` for that slot. Do not hotlink images from other sites.

People photos (instructors, team, testimonials) are uploaded in Django Admin and only appear once approved.

## Content still needed from Haelsoft

Nothing below has been invented; the site hides or labels each item until it is supplied:

- Public contact email, phone, address and expected response time
- Social media links
- Team and instructor profiles (with approved photos)
- Confirmed partners and authorised logos
- Learner testimonials with recorded consent
- Verified impact figures with dates and sources
- Founding milestones for Our Story
- Official brand colour codes
- Licensed photography
- Legal review of the privacy notice and the company's registered details

## Deployment notes

- **Backend:** run with a WSGI server (e.g. `gunicorn config.wsgi`) behind HTTPS. Set `DJANGO_DEBUG=false`, a strong `DJANGO_SECRET_KEY`, `DJANGO_ALLOWED_HOSTS`, `DATABASE_URL`, `CORS_ALLOWED_ORIGINS` and a shared cache. Run `python manage.py migrate` and `python manage.py collectstatic` on release, and serve `/media/` from object storage or the web server. SSL redirect, secure cookies and HSTS switch on automatically when debug is off. `SECURE_HSTS_PRELOAD` stays off until you decide to submit the domain to browser preload lists.
- **Frontend:** a Node.js host for Next.js (Vercel, Netlify with the Next.js runtime, or `npm start` behind a proxy). It is server-rendered, not a static export, so it can return real 404s and refresh API content. Set the `NEXT_PUBLIC_*` variables at build time.
- Keep `SHOW_DEMO_CONTENT=false` and `NEXT_PUBLIC_NOINDEX=false` in production; use `NEXT_PUBLIC_NOINDEX=true` on staging.

## Ready for later phases

The structure leaves room for the next modules without rework: courses (the instructor profile already returns a `courses` list), learner accounts and enrolments, scholarships and applications (status and URL already in site settings), payments and country pricing (the `Market` model), certificates, corporate training (already an enquiry type), and APIs for a Flutter mobile app (versioned under `/api/v1/`).

## Known limitations

- The ESLint plugin bundled with `eslint-config-next` depends on a `braces` version with a reported denial-of-service advisory. It affects local linting only, not the built site; there is no fixed upstream release yet.
- The contact form rate limit uses an in-memory cache by default. With several server processes, configure a shared cache (Redis) so the limit applies across them.
