/**
 * Shared helpers for the Forge form functions.
 * Talks to Supabase (PostgREST) and Resend over plain fetch, so no SDKs are needed.
 * All secrets come from Netlify environment variables, never from code.
 */

export function env(name: string, fallback = ""): string {
  // Netlify.env is available inside Netlify Functions; process.env is used by local tests.
  const g = globalThis as unknown as { Netlify?: { env: { get(n: string): string | undefined } } };
  return g.Netlify?.env.get(name) ?? process.env[name] ?? fallback;
}

export function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json; charset=utf-8" } });
}

/** Accepts form-encoded, multipart or JSON bodies and returns a flat string map. */
export async function readFields(req: Request): Promise<Record<string, string>> {
  const type = req.headers.get("content-type") || "";
  if (type.includes("application/json")) {
    const data = (await req.json()) as Record<string, unknown>;
    return Object.fromEntries(Object.entries(data).map(([k, v]) => [k, v == null ? "" : String(v)]));
  }
  const form = await req.formData();
  const out: Record<string, string> = {};
  form.forEach((v, k) => {
    if (typeof v === "string") out[k] = v;
  });
  return out;
}

const MAX = 6000;
export function clean(v: string | undefined, max = MAX): string | null {
  if (v == null) return null;
  const s = v.replace(/\u0000/g, "").trim();
  return s ? s.slice(0, max) : null;
}

export const isEmail = (v: string | null) => !!v && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) && v.length <= 254;

export function cleanUrl(v: string | undefined): string | null {
  const s = clean(v, 500);
  if (!s) return null;
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:" ? u.toString() : null;
  } catch {
    return null;
  }
}

/** Marketing attribution fields added to every form by forge.js. */
export function attribution(f: Record<string, string>) {
  return {
    utm_source: clean(f.utm_source, 200),
    utm_medium: clean(f.utm_medium, 200),
    utm_campaign: clean(f.utm_campaign, 200),
    first_utm_source: clean(f.first_utm_source, 200),
    first_utm_medium: clean(f.first_utm_medium, 200),
    first_utm_campaign: clean(f.first_utm_campaign, 200),
    referrer: clean(f.referrer, 500),
    landing_page: clean(f.landing_page, 500),
  };
}

/** Optional Cloudflare Turnstile check. Only enforced when TURNSTILE_SECRET_KEY is set. */
export async function passesBotCheck(f: Record<string, string>, ip: string | undefined): Promise<boolean> {
  if (f.company_website) return false; // honeypot field: humans never fill it
  const secret = env("TURNSTILE_SECRET_KEY");
  if (!secret) return true;
  const token = f["cf-turnstile-response"];
  if (!token) return false;
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set("remoteip", ip);
  const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
  const data = (await r.json()) as { success?: boolean };
  return !!data.success;
}

export async function insertRow(table: string, row: Record<string, unknown>) {
  const url = env("SUPABASE_URL").replace(/\/$/, "");
  const key = env("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !key) throw new Error("Supabase is not configured (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)");
  const r = await fetch(`${url}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      apikey: key,
      // Legacy service_role keys are JWTs and also go in Authorization; new sb_secret_ keys are apikey-only.
      ...(key.startsWith("eyJ") ? { authorization: `Bearer ${key}` } : {}),
      "content-type": "application/json",
      prefer: "return=representation",
    },
    body: JSON.stringify(row),
  });
  if (!r.ok) throw new Error(`Supabase insert into ${table} failed: ${r.status} ${await r.text()}`);
  const [saved] = (await r.json()) as Array<{ id: string }>;
  return saved;
}

export async function sendEmail(msg: { to: string | string[]; subject: string; html: string; text: string; replyTo?: string }) {
  const key = env("RESEND_API_KEY");
  const from = env("FORGE_FROM_EMAIL");
  if (!key || !from) {
    console.warn("Email skipped: RESEND_API_KEY or FORGE_FROM_EMAIL not set");
    return;
  }
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({ from, to: msg.to, subject: msg.subject, html: msg.html, text: msg.text, reply_to: msg.replyTo }),
  });
  if (!r.ok) console.error("Resend error", r.status, await r.text());
}

export const esc = (s: unknown) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Branded, email-client-safe wrapper (tables + inline styles). */
export function emailLayout(title: string, bodyHtml: string) {
  const site = env("NEXT_PUBLIC_SITE_URL", "https://coetara-forge.netlify.app").replace(/\/$/, "");
  return `<!doctype html><html><body style="margin:0;background:#f7f4f0;font-family:Helvetica,Arial,sans-serif;color:#03080c">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f4f0;padding:32px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden">
<tr><td style="background:#03080c;padding:22px 28px"><img src="${site}/brand/forge-wordmark-white.png" alt="FORGE" height="18" style="display:block;height:18px"></td></tr>
<tr><td style="height:4px;background:linear-gradient(90deg,#feb101,#fd7200,#fe5301,#e20f01);background-color:#fd7200"></td></tr>
<tr><td style="padding:32px 28px">
<h1 style="margin:0 0 16px;font-size:24px;line-height:1.25">${esc(title)}</h1>
${bodyHtml}
</td></tr>
<tr><td style="padding:20px 28px;border-top:1px solid #e7e3de;font-size:12px;color:#5d6066">Coetara Forge · a venture-building and commercialisation platform of Coetara Technologies Limited<br>Build What Comes Next.</td></tr>
</table></td></tr></table></body></html>`;
}

export const p = (s: string) => `<p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#1c2127">${s}</p>`;

export function fieldTable(rows: [string, string | null | undefined][]) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;font-size:14px;margin:8px 0 18px">${rows
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 10px 8px 0;border-bottom:1px solid #e7e3de;color:#5d6066;vertical-align:top;width:34%">${esc(k)}</td><td style="padding:8px 0;border-bottom:1px solid #e7e3de;white-space:pre-wrap">${esc(v)}</td></tr>`,
    )
    .join("")}</table>`;
}
