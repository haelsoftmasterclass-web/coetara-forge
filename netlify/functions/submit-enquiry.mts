import type { Config, Context } from "@netlify/functions";
import { attribution, clean, emailLayout, env, esc, fieldTable, insertRow, isEmail, json, p, passesBotCheck, readFields, sendEmail } from "../lib/forge.mts";

const ROLES = ["Founder / Builder", "University / Research Institution", "Corporate", "Investor", "Mentor / Operator", "Other"];

/** Route each kind of enquiry to the right inbox; anything unset falls back to FORGE_TEAM_EMAIL. */
function inboxFor(role: string) {
  const byRole: Record<string, string> = {
    "University / Research Institution": env("FORGE_PARTNERS_EMAIL"),
    Corporate: env("FORGE_PARTNERS_EMAIL"),
    Investor: env("FORGE_INVESTORS_EMAIL"),
    "Founder / Builder": env("FORGE_APPLICATIONS_EMAIL"),
  };
  return (byRole[role] || env("FORGE_TEAM_EMAIL")).split(",").map((s) => s.trim()).filter(Boolean);
}

export default async (req: Request, context: Context) => {
  if (req.method !== "POST") return json({ ok: false, error: "Method not allowed" }, 405);
  let f: Record<string, string>;
  try {
    f = await readFields(req);
  } catch {
    return json({ ok: false, error: "Could not read the form." }, 400);
  }
  if (!(await passesBotCheck(f, context.ip))) return json({ ok: false, error: "Please confirm you are human and try again." }, 400);

  const email = clean(f.email, 254)?.toLowerCase() ?? null;
  const role = ROLES.includes(f.role) ? f.role : "Other";
  const row = {
    name: clean(f.name, 200),
    organisation: clean(f.organisation, 200),
    email,
    phone: clean(f.phone, 50),
    role,
    topic: clean(f.topic, 300),
    message: clean(f.message),
    ...attribution(f),
  };
  if (!row.name || !isEmail(email) || !row.topic || !row.message) {
    return json({ ok: false, error: "Please fill in your name, a valid email, a topic and a message." }, 422);
  }

  let saved: { id: string };
  try {
    saved = await insertRow("enquiries", row);
  } catch (err) {
    console.error(err);
    return json({ ok: false, error: "We could not send your enquiry. Please try again in a moment." }, 502);
  }

  const site = env("NEXT_PUBLIC_SITE_URL", new URL(req.url).origin).replace(/\/$/, "");
  const inbox = inboxFor(role);
  await Promise.allSettled([
    sendEmail({
      to: email!,
      subject: "Thanks for contacting Coetara Forge",
      text: `Hi ${row.name},\n\nThank you for getting in touch with Coetara Forge about "${row.topic}". A member of the Forge team will reply by email.\n\nBuild What Comes Next.\nCoetara Forge`,
      html: emailLayout("Thanks for getting in touch.", p(`Hi ${esc(row.name)},`) + p(`Thank you for contacting Coetara Forge about <strong>${esc(row.topic)}</strong>. A member of the Forge team will reply by email.`)),
    }),
    inbox.length
      ? sendEmail({
          to: inbox,
          replyTo: email!,
          subject: `New enquiry (${role}): ${row.topic}`,
          text: `${row.name} <${email}> · ${row.organisation || ""}\n${role}\n\n${row.message}\n\nDashboard: ${site}/review/`,
          html: emailLayout(
            `New enquiry from ${row.name}`,
            fieldTable([
              ["I am a", role],
              ["Organisation", row.organisation],
              ["Email", email],
              ["Phone", row.phone],
              ["Topic", row.topic],
              ["Source", [row.utm_source, row.utm_medium, row.utm_campaign].filter(Boolean).join(" / ") || row.referrer || "Direct"],
            ]) + p(esc(row.message)) + p(`Reply directly to this email to answer ${esc(row.name)}.`),
          ),
        })
      : Promise.resolve(),
  ]);

  return json({ ok: true, id: saved.id });
};

export const config: Config = { path: "/api/contact", method: "POST" };
