# Coetara Forge website

The website for **Coetara Forge**, the venture-building and commercialisation platform of Coetara Technologies Limited.
*Build What Comes Next.*

Built with **Next.js (App Router) + Tailwind CSS v4** as a fully static site. `npm run build` produces plain HTML/CSS/JS in `out/`, which can be hosted anywhere (Netlify, Vercel, Cloudflare Pages, S3, any web server).

## Run it locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in ./out
```

Copy `.env.example` to `.env.local` and fill in:

| Variable | What it does |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Live domain. Used for canonical URLs, sitemap and Open Graph. Placeholder: `https://forge.coetara.com`. |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager container. Configure GA4 and Search Console inside GTM. |
| `NEXT_PUBLIC_FORM_ENDPOINT` | Where the Apply and Contact forms POST (e.g. Formspree, Basin or your own API). Leave empty on Netlify to use Netlify Forms. |

## Pages

| Route | Page |
| --- | --- |
| `/` | Home |
| `/about/` | About Forge |
| `/incubator/` | 10-Week Venture Incubator |
| `/how-it-works/` | How It Works (journey, Forge Gates, valley of death, commercial process) |
| `/who-were-looking-for/` | Who We're Looking For |
| `/venture-building/` | Venture Building |
| `/partners/` | For Partners |
| `/portfolio/` | Portfolio (shows "Portfolio coming soon" until real companies are added) |
| `/insights/` and `/insights/[slug]/` | Insights and articles |
| `/faq/` | FAQ (searchable, with legal disclaimer) |
| `/apply/` | 11-step application (saves progress in the browser) |
| `/contact/` | Contact pathways and enquiry form |
| `/forge-launch/` | Forge Launch |
| `/forge-commercial/` | Forge Commercial |
| `/legal/*` | Privacy, Terms, Investment / Legal Disclaimer |

Also generated: `sitemap.xml`, `robots.txt`, a branded 404, Open Graph tags, Organization / Article / FAQPage structured data.

## Where things live

```
app/(site)/          marketing pages (one folder per route)
app/review/          private review dashboard (Supabase sign-in)
netlify/functions/   /api/apply and /api/contact (save to Supabase, email via Resend)
supabase/schema.sql  database tables and row-level security
components/          shared components (hero, CTA band, journey, gates, forms…)
content/             editable content: FAQ, curriculum, cohorts, portfolio, photo slots, insights/*.md
lib/site.ts          navigation, CTA hierarchy, routes, SEO helper
public/forge.js      all interactivity (drawer, reveals, FAQ search, filters, multi-step form, analytics events)
public/admin/        Decap CMS (browser-based content editing)
app/globals.css      design tokens (colours, type) and component styles
```

All pages are server-rendered to static HTML and work without JavaScript; `public/forge.js` adds interaction on top.

## Managing content

**In code:** edit the files in `content/`. Insights are Markdown files in `content/insights/` (set `status: "coming-soon"` to show a card without a page).

**In the browser (CMS):** the site includes [Decap CMS](https://decapcms.org) at `/admin/`. On Netlify: enable **Identity** and **Git Gateway**, invite editors, and they can publish Insights, add Portfolio companies and add new Cohorts without touching code. Each save commits to the repository and triggers a rebuild.

- **Portfolio:** never add placeholder companies. The page shows "Portfolio coming soon" while the list is empty.
- **Cohorts:** the incubator page shows the first cohort in `content/cohorts.json` (dates, format and fee read "To be confirmed" until set).

## Photography

`content/media.ts` lists every photo slot with an art-direction brief. Until a `src` is set, the site shows a branded placeholder with the brief as caption. Add licensed or commissioned images to `public/images/` and set `src: "/images/your-file.jpg"`.

## Analytics events

With GTM installed, `forge.js` pushes these events to `dataLayer`:
`apply_cta`, `partner_cta`, `application_start`, `application_step`, `application_complete`, `contact_submit`, `incubator_visit`, `forge_launch_visit`, `forge_commercial_visit`, `portfolio_visit`, `portfolio_card`, `insight_open`, `insight_engagement` (25/50/75/100% read), `insight_filter`, `engine_toggle`.

## Design system

- **Colours** (from the Forge logo): Amber `#FEB101`, Orange `#FD7200`, Flame `#FE5301`, Ember `#E20F01`, Deep ember `#C42201`, Ink `#03080C`, Sand `#F7F4F0`.
- **Type:** Archivo (extended width, echoing the FORGE wordmark) for headlines, Geist for body, Geist Mono for labels.
- **Layout:** editorial 12-column grid, uppercase mono eyebrows over large headlines, ink-black bands for key statements.

## Applications backend

Forms post to Netlify Functions, which save to Supabase and send emails through Resend. If the function is unreachable, `forge.js` falls back to Netlify Forms so no submission is lost. Every submission carries first-touch and last-touch UTM source, medium and campaign, plus referrer and landing page.

Setup, once:

1. **Supabase.** Open SQL Editor, paste `supabase/schema.sql`, edit the reviewer emails at the bottom, run it. Under Authentication > URL Configuration set Site URL to the live site and add `<site>/review/` as a redirect URL.
2. **Resend.** Verify your sending domain (Domains > Add), then create an API key.
3. **Netlify.** Connect this repo (build `npm run build`, publish `out`) and add the variables in `.env.example` under Site configuration > Environment variables. Keys go only there, never in the repo.

The team then signs in at `/review/` with a magic link. Only emails in the `reviewers` table can see data; row-level security enforces this in the database, not just the UI. Reviewers can change status, score applicants 1 to 5 on the nine Forge criteria (out of 45), add notes, export CSV, and see which sources and campaigns bring applicants who progress. Every change is written to `application_events`.

To add or remove a reviewer later, edit the `reviewers` table in Supabase's Table Editor.

## Design preview

`python3 scripts/make-preview.py` (after `npm run build`) writes `preview/`, a relative-path copy without the Next.js runtime and with simulated form submissions. It is only for sharing a design preview, not for production.
