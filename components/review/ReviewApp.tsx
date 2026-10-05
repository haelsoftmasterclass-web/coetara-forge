"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useMemo, useState } from "react";
import { createClient, type Session, type SupabaseClient } from "@supabase/supabase-js";
import {
  CRITERIA, MAX_SCORE, STATUSES, STATUS_LABEL, sourceOf,
  type AppEvent, type Application, type Enquiry, type Status,
} from "@/lib/review-types";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

let client: SupabaseClient | null = null;
function supabase() {
  if (!client) client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: true, detectSessionInUrl: true, flowType: "implicit" } });
  return client;
}

const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
const fmtDateTime = (d: string) => new Date(d).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

const statusTone: Record<Status, string> = {
  new: "bg-amber/20 text-ink",
  reviewing: "bg-sand text-ink",
  shortlisted: "bg-orange/15 text-ember-deep",
  interview: "bg-flame/15 text-ember-deep",
  accepted: "bg-ink text-amber",
  declined: "bg-line text-muted",
  withdrawn: "bg-line text-faint",
};

function StatusPill({ s }: { s: Status }) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.06em] ${statusTone[s]}`}>{STATUS_LABEL[s]}</span>;
}

function Shell({ children, email, onSignOut }: { children: React.ReactNode; email?: string; onSignOut?: () => void }) {
  return (
    <div className="min-h-screen bg-sand">
      <header className="sticky top-[env(safe-area-inset-top,0px)] z-30 border-b border-line bg-white">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-4 px-4 sm:px-6">
          <a href="/" className="flex items-center gap-3">
            <img src="/brand/forge-mark-256.png" alt="" className="h-7 w-auto" />
            <span className="font-display text-[17px] font-bold [font-stretch:115%]">Forge Review</span>
          </a>
          {email ? (
            <div className="flex items-center gap-3 text-[14px]">
              <span className="hidden text-muted sm:inline">{email}</span>
              <button type="button" onClick={onSignOut} className="rounded-full border border-line px-3 py-1.5 font-semibold hover:border-ink">Sign out</button>
            </div>
          ) : null}
        </div>
      </header>
      {children}
    </div>
  );
}

/* ───────────────────────── Sign in ───────────────────────── */
function SignIn() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    const { error } = await supabase().auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { emailRedirectTo: `${window.location.origin}/review/` },
    });
    if (error) {
      setError(error.message);
      setState("error");
    } else setState("sent");
  }
  return (
    <Shell>
      <main className="mx-auto grid max-w-md gap-6 px-4 py-20">
        <div>
          <p className="eyebrow text-muted">Team only</p>
          <h1 className="display mt-4 text-[40px]">Review applications</h1>
          <p className="mt-3 text-muted">Sign in with your work email. We will send you a one-time link. Only people on the Forge review team can see applications.</p>
        </div>
        {state === "sent" ? (
          <div className="rounded-2xl border border-line bg-white p-6" role="status">
            <p className="heading text-[22px]">Check your inbox.</p>
            <p className="mt-2 text-muted">We sent a sign-in link to <strong className="text-ink">{email}</strong>. Open it on this device.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="grid gap-4 rounded-2xl border border-line bg-white p-6">
            <div className="field">
              <label htmlFor="review-email">Work email</label>
              <input id="review-email" type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            </div>
            {state === "error" ? <p className="error-msg">{error}</p> : null}
            <button type="submit" className="btn btn-primary" disabled={state === "sending"}>
              {state === "sending" ? "Sending link…" : "Send sign-in link"}
            </button>
          </form>
        )}
      </main>
    </Shell>
  );
}

/* ───────────────────────── Dashboard ───────────────────────── */
type Tab = "applications" | "enquiries" | "sources";

export default function ReviewApp() {
  const configured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!configured) return;
    const sb = supabase();
    sb.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data } = sb.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, [configured]);

  if (!configured) {
    return (
      <Shell>
        <main className="mx-auto max-w-xl px-4 py-20">
          <h1 className="display text-[36px]">Review dashboard not connected</h1>
          <p className="mt-4 text-muted">
            Set <code className="font-mono text-ink">NEXT_PUBLIC_SUPABASE_URL</code> and <code className="font-mono text-ink">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in Netlify, then redeploy.
          </p>
        </main>
      </Shell>
    );
  }
  if (!ready) return <Shell><p className="p-10 text-center text-muted">Loading…</p></Shell>;
  if (!session) return <SignIn />;
  return <Dashboard session={session} />;
}

function Dashboard({ session }: { session: Session }) {
  const email = (session.user.email || "").toLowerCase();
  const sb = supabase();
  const [tab, setTab] = useState<Tab>("applications");
  const [apps, setApps] = useState<Application[] | null>(null);
  const [enquiries, setEnquiries] = useState<Enquiry[] | null>(null);
  const [isReviewer, setIsReviewer] = useState<boolean | null>(null);
  const [error, setError] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const team = await sb.from("reviewers").select("email").eq("email", email).maybeSingle();
    if (team.error || !team.data) {
      setIsReviewer(false);
      return;
    }
    setIsReviewer(true);
    const [a, e] = await Promise.all([
      sb.from("applications").select("*").order("created_at", { ascending: false }).limit(2000),
      sb.from("enquiries").select("*").order("created_at", { ascending: false }).limit(2000),
    ]);
    if (a.error || e.error) setError((a.error || e.error)!.message);
    setApps((a.data as Application[]) || []);
    setEnquiries((e.data as Enquiry[]) || []);
  }, [sb, email]);

  useEffect(() => {
    load();
  }, [load]);

  // Deep link from email alerts: /review/#<application id>
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id && apps?.some((a) => a.id === id)) setOpenId(id);
  }, [apps]);

  const signOut = () => sb.auth.signOut();

  if (isReviewer === false) {
    return (
      <Shell email={email} onSignOut={signOut}>
        <main className="mx-auto max-w-xl px-4 py-20">
          <h1 className="display text-[34px]">You&apos;re signed in, but not on the review team.</h1>
          <p className="mt-4 text-muted">Ask a Forge admin to add <strong className="text-ink">{email}</strong> to the reviewers list in Supabase.</p>
        </main>
      </Shell>
    );
  }

  const open = apps?.find((a) => a.id === openId) || null;

  return (
    <Shell email={email} onSignOut={signOut}>
      <main className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6">
        {error ? <p className="mb-4 rounded-xl border border-ember/30 bg-[#fff1ee] p-4 text-ember-deep">{error}</p> : null}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div role="tablist" className="flex w-fit gap-1 rounded-full border border-line bg-white p-1">
            {(
              [
                ["applications", `Applications${apps ? ` · ${apps.length}` : ""}`],
                ["enquiries", `Enquiries${enquiries ? ` · ${enquiries.filter((e) => e.status !== "closed").length} open` : ""}`],
                ["sources", "Sources"],
              ] as [Tab, string][]
            ).map(([k, label]) => (
              <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className="rounded-full px-4 py-2 text-[14px] font-semibold text-muted aria-selected:bg-ink aria-selected:text-white">
                {label}
              </button>
            ))}
          </div>
          <button type="button" onClick={load} className="rounded-full border border-line bg-white px-4 py-2 text-[14px] font-semibold hover:border-ink">Refresh</button>
        </div>

        {apps === null || enquiries === null ? (
          <p className="py-20 text-center text-muted">Loading applications…</p>
        ) : tab === "applications" ? (
          <Applications apps={apps} onOpen={(id) => { setOpenId(id); history.replaceState(null, "", `#${id}`); }} />
        ) : tab === "enquiries" ? (
          <Enquiries rows={enquiries} email={email} onChange={(row) => setEnquiries((list) => list!.map((r) => (r.id === row.id ? row : r)))} />
        ) : (
          <Sources apps={apps} />
        )}
      </main>
      {open ? (
        <ApplicationPanel
          app={open}
          email={email}
          onClose={() => { setOpenId(null); history.replaceState(null, "", location.pathname); }}
          onSaved={(row) => setApps((list) => list!.map((a) => (a.id === row.id ? row : a)))}
        />
      ) : null}
    </Shell>
  );
}

/* ───────────────────────── Applications list ───────────────────────── */
function Applications({ apps, onOpen }: { apps: Application[]; onOpen: (id: string) => void }) {
  const [status, setStatus] = useState<Status | "all">("all");
  const [q, setQ] = useState("");
  const [country, setCountry] = useState("all");
  const [sort, setSort] = useState<"newest" | "score">("newest");

  const countries = useMemo(() => Array.from(new Set(apps.map((a) => a.country).filter(Boolean))).sort() as string[], [apps]);
  const counts = useMemo(() => Object.fromEntries(STATUSES.map((s) => [s, apps.filter((a) => a.status === s).length])), [apps]);

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    return apps
      .filter((a) => status === "all" || a.status === status)
      .filter((a) => country === "all" || a.country === country)
      .filter((a) => !term || [a.full_name, a.email, a.current_role, a.organisation, a.expertise, a.problem, a.city].join(" ").toLowerCase().includes(term))
      .sort((a, b) => (sort === "score" ? b.score_total - a.score_total : b.created_at.localeCompare(a.created_at)));
  }, [apps, status, country, q, sort]);

  function exportCsv() {
    const cols: (keyof Application)[] = ["created_at", "status", "score_total", "full_name", "email", "phone", "country", "city", "current_role", "organisation", "experience", "expertise", "has_idea", "commitment", "utm_source", "utm_medium", "utm_campaign", "first_utm_source", "referrer", "linkedin", "github", "portfolio", "website", "notes"];
    const escCsv = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [cols.join(","), ...rows.map((r) => cols.map((c) => escCsv(r[c])).join(","))].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `forge-applications-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="mt-6">
      <ol className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-4 lg:grid-cols-7">
        {STATUSES.map((s) => (
          <li key={s}>
            <button type="button" onClick={() => setStatus(status === s ? "all" : s)} className={`w-full p-4 text-left transition-colors ${status === s ? "bg-ink text-white" : "bg-white hover:bg-sand"}`}>
              <span className="block font-mono text-[11px] uppercase tracking-[0.1em] opacity-70">{STATUS_LABEL[s]}</span>
              <span className="heading mt-1 block text-[28px] tabular-nums">{counts[s]}</span>
            </button>
          </li>
        ))}
      </ol>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <input type="search" placeholder="Search name, email, role, problem…" value={q} onChange={(e) => setQ(e.target.value)} className="input !min-h-11 max-w-sm flex-1 !rounded-full" aria-label="Search applications" />
        <select value={country} onChange={(e) => setCountry(e.target.value)} className="input !min-h-11 !w-auto !rounded-full" aria-label="Country">
          <option value="all">All countries</option>
          {countries.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value as "newest" | "score")} className="input !min-h-11 !w-auto !rounded-full" aria-label="Sort">
          <option value="newest">Newest first</option>
          <option value="score">Highest score</option>
        </select>
        <button type="button" onClick={exportCsv} className="ml-auto rounded-full border border-line bg-white px-4 py-2.5 text-[14px] font-semibold hover:border-ink">Export CSV ({rows.length})</button>
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="w-full min-w-[860px] text-left text-[14px]">
          <thead className="border-b border-line font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Applicant</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Expertise</th>
              <th className="px-4 py-3 font-medium">Source</th>
              <th className="px-4 py-3 text-right font-medium">Score</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Applied</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-16 text-center text-muted">{apps.length ? "No applications match these filters." : "No applications yet. They will appear here as soon as someone applies."}</td></tr>
            ) : (
              rows.map((a) => (
                <tr key={a.id} onClick={() => onOpen(a.id)} className="cursor-pointer border-b border-line last:border-0 hover:bg-sand">
                  <td className="px-4 py-3">
                    <button type="button" className="text-left" onClick={(e) => { e.stopPropagation(); onOpen(a.id); }}>
                      <span className="block font-semibold">{a.full_name}</span>
                      <span className="block text-[13px] text-muted">{a.current_role}</span>
                    </button>
                  </td>
                  <td className="px-4 py-3">{[a.city, a.country].filter(Boolean).join(", ")}</td>
                  <td className="px-4 py-3">{a.expertise}</td>
                  <td className="px-4 py-3 text-muted">{sourceOf(a)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{a.score_total ? <strong>{a.score_total}<span className="font-normal text-faint">/{MAX_SCORE}</span></strong> : <span className="text-faint">–</span>}</td>
                  <td className="px-4 py-3"><StatusPill s={a.status} /></td>
                  <td className="px-4 py-3 text-muted tabular-nums">{fmtDate(a.created_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ───────────────────────── Application detail + scoring ───────────────────────── */
function ApplicationPanel({ app, email, onClose, onSaved }: { app: Application; email: string; onClose: () => void; onSaved: (a: Application) => void }) {
  const sb = supabase();
  const [scores, setScores] = useState<Record<string, number>>(app.scores || {});
  const [notes, setNotes] = useState(app.notes || "");
  const [status, setStatus] = useState<Status>(app.status);
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setScores(app.scores || {});
    setNotes(app.notes || "");
    setStatus(app.status);
    sb.from("application_events").select("*").eq("application_id", app.id).order("created_at", { ascending: false }).then(({ data }) => setEvents((data as AppEvent[]) || []));
  }, [app, sb]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const total = CRITERIA.reduce((n, c) => n + (scores[c.key] || 0), 0);
  const dirty = status !== app.status || notes !== (app.notes || "") || JSON.stringify(scores) !== JSON.stringify(app.scores || {});

  async function save() {
    setSaving(true);
    setMsg("");
    const { data, error } = await sb
      .from("applications")
      .update({ scores, notes: notes || null, status, reviewed_by: email, reviewed_at: new Date().toISOString() })
      .eq("id", app.id)
      .select()
      .single();
    if (error) {
      setMsg(error.message);
      setSaving(false);
      return;
    }
    const log: Partial<AppEvent & { application_id: string }>[] = [];
    if (status !== app.status) log.push({ application_id: app.id, actor: email, action: "status", from_status: app.status, to_status: status });
    if (JSON.stringify(scores) !== JSON.stringify(app.scores || {})) log.push({ application_id: app.id, actor: email, action: "score", detail: `Score ${total}/${MAX_SCORE}` });
    if (notes !== (app.notes || "")) log.push({ application_id: app.id, actor: email, action: "note", detail: notes.slice(0, 280) });
    if (log.length) {
      const ins = await sb.from("application_events").insert(log).select();
      if (ins.data) setEvents((ev) => [...(ins.data as AppEvent[]), ...ev]);
    }
    onSaved(data as Application);
    setSaving(false);
    setMsg("Saved");
  }

  const answers: [string, string | null][] = [
    ["Why do you want to build a company?", app.motivation],
    ["What problem in Africa deserves solving?", app.problem],
    [`Business idea (${app.has_idea || "–"})`, app.idea],
    ["Skills they bring to a founding team", app.skills_bring],
    ["Skills they want in co-founders", app.skills_seek],
    ["Why Coetara Forge?", app.why_forge],
    ["What they hope to build in 10 weeks", app.ambition],
    ["Anything else", app.final_message],
  ];

  return (
    <div className="fixed inset-0 z-40 flex justify-end" role="dialog" aria-modal="true" aria-label={`Application from ${app.full_name}`}>
      <button type="button" aria-label="Close" className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-[1040px] flex-col overflow-hidden bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4 sm:px-8">
          <div className="min-w-0">
            <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted">Applied {fmtDateTime(app.created_at)} · Ref {app.id.slice(0, 8).toUpperCase()}</p>
            <h2 className="heading mt-1 truncate text-[26px]">{app.full_name}</h2>
            <p className="text-[14px] text-muted">{[app.current_role, app.organisation].filter(Boolean).join(" · ")}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-line px-3 py-1.5 text-[14px] font-semibold hover:border-ink">Close</button>
        </div>

        <div className="grid flex-1 overflow-y-auto lg:grid-cols-[1fr_360px]">
          <div className="min-w-0 px-5 py-6 sm:px-8">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-[14px] sm:grid-cols-3">
              {[
                ["Email", <a key="e" className="underline" href={`mailto:${app.email}`}>{app.email}</a>],
                ["Phone", app.phone],
                ["Location", [app.city, app.country].filter(Boolean).join(", ")],
                ["Expertise", app.expertise],
                ["Years of experience", app.experience],
                ["Commitment", app.commitment],
                ["Source (last touch)", sourceOf(app)],
                ["Campaign", app.utm_campaign],
                ["First touch", app.first_utm_source ? [app.first_utm_source, app.first_utm_medium, app.first_utm_campaign].filter(Boolean).join(" / ") : null],
              ].map(([k, v]) => (
                <div key={k as string} className="min-w-0">
                  <dt className="font-mono text-[10px] uppercase tracking-[0.1em] text-faint">{k}</dt>
                  <dd className="mt-0.5 break-words">{v || <span className="text-faint">–</span>}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-5 flex flex-wrap gap-2">
              {(["linkedin", "github", "portfolio", "website"] as const).map((k) =>
                app[k] ? (
                  <a key={k} href={app[k]!} target="_blank" rel="noopener noreferrer" className="tag !px-3 !py-1.5 hover:!border-ink hover:!text-ink">{k}</a>
                ) : null,
              )}
            </div>
            <div className="mt-8 grid gap-6">
              {answers.map(([q, a]) => (
                <section key={q}>
                  <h3 className="text-[14px] font-semibold text-muted">{q}</h3>
                  <p className="mt-1.5 whitespace-pre-wrap text-[15.5px] leading-relaxed">{a || <span className="text-faint">No answer</span>}</p>
                </section>
              ))}
            </div>
          </div>

          <aside className="border-t border-line bg-sand/60 px-5 py-6 sm:px-8 lg:border-l lg:border-t-0 lg:px-6">
            <div className="field">
              <label htmlFor="app-status">Status</label>
              <select id="app-status" className="input" value={status} onChange={(e) => setStatus(e.target.value as Status)}>
                {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
              </select>
            </div>

            <div className="mt-6 flex items-baseline justify-between">
              <h3 className="text-[14px] font-semibold">Score</h3>
              <span className="heading text-[22px] tabular-nums">{total}<span className="text-[14px] text-faint">/{MAX_SCORE}</span></span>
            </div>
            <ul className="mt-2 grid gap-2">
              {CRITERIA.map((c) => (
                <li key={c.key} className="flex items-center justify-between gap-2">
                  <span className="text-[13.5px]">{c.label}</span>
                  <span className="flex gap-1" role="radiogroup" aria-label={c.label}>
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        role="radio"
                        aria-checked={scores[c.key] === n}
                        aria-label={`${c.label} ${n}`}
                        onClick={() => setScores((s) => ({ ...s, [c.key]: s[c.key] === n ? 0 : n }))}
                        className={`h-7 w-7 rounded-md border text-[12px] font-semibold tabular-nums ${scores[c.key] >= n ? "border-ink bg-ink text-amber" : "border-line bg-white text-muted hover:border-ink"}`}
                      >
                        {n}
                      </button>
                    ))}
                  </span>
                </li>
              ))}
            </ul>

            <div className="field mt-6">
              <label htmlFor="app-notes">Reviewer notes</label>
              <textarea id="app-notes" className="input !min-h-[120px]" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Evidence, concerns, questions for interview…" />
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button type="button" onClick={save} disabled={!dirty || saving} className="btn btn-primary disabled:opacity-40">{saving ? "Saving…" : "Save review"}</button>
              {msg ? <span className={`text-[13px] ${msg === "Saved" ? "text-muted" : "text-ember-deep"}`} role="status">{msg}</span> : null}
            </div>
            {app.reviewed_by ? <p className="mt-3 text-[12.5px] text-muted">Last reviewed by {app.reviewed_by}{app.reviewed_at ? `, ${fmtDateTime(app.reviewed_at)}` : ""}</p> : null}

            <h3 className="mt-8 text-[14px] font-semibold">Activity</h3>
            <ol className="mt-2 grid gap-2 text-[13px]">
              {events.length === 0 ? <li className="text-faint">No activity yet.</li> : null}
              {events.map((ev) => (
                <li key={ev.id} className="rounded-lg bg-white px-3 py-2">
                  <span className="font-semibold">{ev.actor.split("@")[0]}</span>{" "}
                  {ev.action === "status" ? <>moved {STATUS_LABEL[ev.from_status as Status] || ev.from_status} → {STATUS_LABEL[ev.to_status as Status] || ev.to_status}</> : ev.action === "score" ? <>scored · {ev.detail}</> : <>added a note</>}
                  <span className="block text-[11.5px] text-faint">{fmtDateTime(ev.created_at)}</span>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── Enquiries ───────────────────────── */
function Enquiries({ rows, email, onChange }: { rows: Enquiry[]; email: string; onChange: (r: Enquiry) => void }) {
  const sb = supabase();
  const [filter, setFilter] = useState<"open" | "all">("open");
  const list = rows.filter((r) => filter === "all" || r.status !== "closed");
  async function setStatus(r: Enquiry, status: Enquiry["status"]) {
    const { data } = await sb.from("enquiries").update({ status, handled_by: email }).eq("id", r.id).select().single();
    if (data) onChange(data as Enquiry);
  }
  return (
    <section className="mt-6">
      <div className="flex gap-2">
        {(["open", "all"] as const).map((f) => (
          <button key={f} type="button" aria-pressed={filter === f} onClick={() => setFilter(f)} className="tag !px-3 !py-1.5 aria-pressed:!border-ink aria-pressed:!bg-ink aria-pressed:!text-white">{f === "open" ? "Open" : "All"}</button>
        ))}
      </div>
      <ul className="mt-5 grid gap-3">
        {list.length === 0 ? <li className="rounded-2xl border border-line bg-white px-4 py-16 text-center text-muted">No enquiries here.</li> : null}
        {list.map((r) => (
          <li key={r.id} className="grid gap-4 rounded-2xl border border-line bg-white p-5 md:grid-cols-[1fr_auto]">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="tag">{r.role}</span>
                <span className="font-mono text-[11px] text-muted">{fmtDateTime(r.created_at)} · {sourceOf(r)}</span>
              </div>
              <h3 className="heading mt-2 text-[20px]">{r.topic}</h3>
              <p className="mt-1 text-[14px] text-muted">
                {r.name}{r.organisation ? ` · ${r.organisation}` : ""} · <a className="underline" href={`mailto:${r.email}`}>{r.email}</a>{r.phone ? ` · ${r.phone}` : ""}
              </p>
              <p className="mt-3 whitespace-pre-wrap text-[15px]">{r.message}</p>
            </div>
            <div className="flex items-start gap-2 md:flex-col">
              <select aria-label="Enquiry status" className="input !min-h-10 !w-auto" value={r.status} onChange={(e) => setStatus(r, e.target.value as Enquiry["status"])}>
                <option value="new">New</option>
                <option value="in_progress">In progress</option>
                <option value="closed">Closed</option>
              </select>
              {r.handled_by ? <span className="text-[12px] text-muted">{r.handled_by}</span> : null}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ───────────────────────── Sources (marketing attribution) ───────────────────────── */
function Sources({ apps }: { apps: Application[] }) {
  const [by, setBy] = useState<"source" | "campaign" | "country" | "expertise">("source");
  const ADVANCED: Status[] = ["shortlisted", "interview", "accepted"];
  const rows = useMemo(() => {
    const key = (a: Application) =>
      by === "source" ? sourceOf(a) : by === "campaign" ? a.utm_campaign || "(no campaign)" : by === "country" ? a.country || "(unknown)" : a.expertise || "(unknown)";
    const map = new Map<string, { n: number; adv: number; scoreSum: number; scored: number }>();
    for (const a of apps) {
      const k = key(a);
      const m = map.get(k) || { n: 0, adv: 0, scoreSum: 0, scored: 0 };
      m.n++;
      if (ADVANCED.includes(a.status)) m.adv++;
      if (a.score_total) { m.scoreSum += a.score_total; m.scored++; }
      map.set(k, m);
    }
    return Array.from(map.entries()).sort((x, y) => y[1].n - x[1].n);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apps, by]);
  const max = Math.max(1, ...rows.map(([, m]) => m.n));
  return (
    <section className="mt-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-2xl text-[15px] text-muted">Which channels bring applicants, and which bring applicants who progress. &ldquo;Progressed&rdquo; counts shortlisted, interview and accepted.</p>
        <div className="flex gap-1 rounded-full border border-line bg-white p-1">
          {(["source", "campaign", "country", "expertise"] as const).map((k) => (
            <button key={k} type="button" aria-pressed={by === k} onClick={() => setBy(k)} className="rounded-full px-3 py-1.5 text-[13px] font-semibold capitalize text-muted aria-pressed:bg-ink aria-pressed:text-white">{k}</button>
          ))}
        </div>
      </div>
      <div className="mt-5 overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="w-full min-w-[640px] text-[14px]">
          <thead className="border-b border-line text-left font-mono text-[11px] uppercase tracking-[0.08em] text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">{by}</th>
              <th className="px-4 py-3 font-medium">Applications</th>
              <th className="px-4 py-3 text-right font-medium">Progressed</th>
              <th className="px-4 py-3 text-right font-medium">Progress rate</th>
              <th className="px-4 py-3 text-right font-medium">Avg score</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? <tr><td colSpan={5} className="px-4 py-16 text-center text-muted">No applications yet.</td></tr> : null}
            {rows.map(([k, m]) => (
              <tr key={k} className="border-b border-line last:border-0">
                <td className="px-4 py-3 font-semibold">{k}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="h-2 rounded-full bg-[linear-gradient(90deg,#feb101,#fe5301)]" style={{ width: `${(m.n / max) * 160}px` }} />
                    <span className="tabular-nums">{m.n}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right tabular-nums">{m.adv}</td>
                <td className="px-4 py-3 text-right tabular-nums">{Math.round((m.adv / m.n) * 100)}%</td>
                <td className="px-4 py-3 text-right tabular-nums">{m.scored ? (m.scoreSum / m.scored).toFixed(1) : "–"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
