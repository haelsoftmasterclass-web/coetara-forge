-- Coetara Forge: applications, enquiries and the review team.
-- Run once in Supabase → SQL Editor → New query → paste → Run.
-- Safe to re-run: every statement checks whether the object already exists.

create extension if not exists pgcrypto;

-- ─────────────────────────────────────────────────────────────
-- Reviewers: people allowed into the /review dashboard.
-- Add your team here (see the INSERT at the bottom).
-- ─────────────────────────────────────────────────────────────
create table if not exists public.reviewers (
  email       text primary key check (email = lower(email)),
  full_name   text,
  role        text not null default 'reviewer' check (role in ('admin', 'reviewer')),
  created_at  timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────
-- Applications (10-Week Venture Incubator)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.applications (
  id               uuid primary key default gen_random_uuid(),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  cohort           text not null default 'cohort-01',
  status           text not null default 'new'
                   check (status in ('new', 'reviewing', 'shortlisted', 'interview', 'accepted', 'declined', 'withdrawn')),

  -- Step 1: About you
  full_name        text not null,
  email            text not null,
  phone            text,
  country          text,
  city             text,
  "current_role"     text,
  organisation     text,
  experience       text,
  -- Step 2–11
  expertise        text,
  motivation       text,
  problem          text,
  has_idea         text,
  idea             text,
  skills_bring     text,
  skills_seek      text,
  why_forge        text,
  ambition         text,
  commitment       text,
  linkedin         text,
  portfolio        text,
  github           text,
  website          text,
  final_message    text,
  consent          boolean not null default false,

  -- Marketing attribution (first touch and the touch that converted)
  utm_source       text,
  utm_medium       text,
  utm_campaign     text,
  utm_term         text,
  utm_content      text,
  first_utm_source   text,
  first_utm_medium   text,
  first_utm_campaign text,
  referrer         text,
  landing_page     text,

  -- Review
  scores           jsonb not null default '{}'::jsonb,   -- {"capability": 4, "curiosity": 5, ...} each 1–5
  score_total      integer generated always as (
                     coalesce((scores->>'capability')::int, 0) + coalesce((scores->>'curiosity')::int, 0) +
                     coalesce((scores->>'problem_solving')::int, 0) + coalesce((scores->>'domain')::int, 0) +
                     coalesce((scores->>'commercial')::int, 0) + coalesce((scores->>'execution')::int, 0) +
                     coalesce((scores->>'adaptability')::int, 0) + coalesce((scores->>'commitment')::int, 0) +
                     coalesce((scores->>'learning')::int, 0)
                   ) stored,
  notes            text,
  assigned_to      text references public.reviewers(email) on delete set null,
  reviewed_by      text,
  reviewed_at      timestamptz
);

create index if not exists applications_created_idx on public.applications (created_at desc);
create index if not exists applications_status_idx  on public.applications (status);
create index if not exists applications_email_idx   on public.applications (lower(email));

-- ─────────────────────────────────────────────────────────────
-- Enquiries (Contact form: partners, universities, investors…)
-- ─────────────────────────────────────────────────────────────
create table if not exists public.enquiries (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  status        text not null default 'new' check (status in ('new', 'in_progress', 'closed')),
  name          text not null,
  organisation  text,
  email         text not null,
  phone         text,
  role          text,
  topic         text,
  message       text,
  utm_source    text,
  utm_medium    text,
  utm_campaign  text,
  first_utm_source   text,
  first_utm_medium   text,
  first_utm_campaign text,
  referrer      text,
  landing_page  text,
  notes         text,
  handled_by    text
);

create index if not exists enquiries_created_idx on public.enquiries (created_at desc);

-- ─────────────────────────────────────────────────────────────
-- Activity log: every status change or note on an application
-- ─────────────────────────────────────────────────────────────
create table if not exists public.application_events (
  id              bigint generated always as identity primary key,
  application_id  uuid not null references public.applications(id) on delete cascade,
  created_at      timestamptz not null default now(),
  actor           text not null,
  action          text not null,       -- 'status', 'score', 'note', 'assign'
  from_status     text,
  to_status       text,
  detail          text
);

create index if not exists application_events_app_idx on public.application_events (application_id, created_at desc);

-- updated_at maintenance
create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at := now(); return new; end $$;

drop trigger if exists applications_touch on public.applications;
create trigger applications_touch before update on public.applications for each row execute function public.touch_updated_at();
drop trigger if exists enquiries_touch on public.enquiries;
create trigger enquiries_touch before update on public.enquiries for each row execute function public.touch_updated_at();

-- ─────────────────────────────────────────────────────────────
-- Security. Public visitors can never read or write these tables.
-- Forms are saved by the Netlify functions using the service role key
-- (which bypasses these rules). Signed-in reviewers can read and update.
-- ─────────────────────────────────────────────────────────────
create or replace function public.is_reviewer() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.reviewers r where r.email = lower(coalesce(auth.jwt()->>'email', '')));
$$;

alter table public.reviewers          enable row level security;
alter table public.applications       enable row level security;
alter table public.enquiries          enable row level security;
alter table public.application_events enable row level security;

drop policy if exists "reviewers read team"        on public.reviewers;
drop policy if exists "reviewers read applications" on public.applications;
drop policy if exists "reviewers update applications" on public.applications;
drop policy if exists "reviewers read enquiries"   on public.enquiries;
drop policy if exists "reviewers update enquiries" on public.enquiries;
drop policy if exists "reviewers read events"      on public.application_events;
drop policy if exists "reviewers add events"       on public.application_events;

create policy "reviewers read team"           on public.reviewers          for select to authenticated using (public.is_reviewer());
create policy "reviewers read applications"   on public.applications       for select to authenticated using (public.is_reviewer());
create policy "reviewers update applications" on public.applications       for update to authenticated using (public.is_reviewer()) with check (public.is_reviewer());
create policy "reviewers read enquiries"      on public.enquiries          for select to authenticated using (public.is_reviewer());
create policy "reviewers update enquiries"    on public.enquiries          for update to authenticated using (public.is_reviewer()) with check (public.is_reviewer());
create policy "reviewers read events"         on public.application_events for select to authenticated using (public.is_reviewer());
create policy "reviewers add events"          on public.application_events for insert to authenticated
  with check (public.is_reviewer() and actor = lower(auth.jwt()->>'email'));

-- ─────────────────────────────────────────────────────────────
-- Add your review team (lower-case emails). Edit, then run.
-- ─────────────────────────────────────────────────────────────
-- insert into public.reviewers (email, full_name, role) values
--   ('you@coetara.com', 'Your Name', 'admin')
-- on conflict (email) do nothing;
