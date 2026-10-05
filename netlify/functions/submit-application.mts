import type { Config, Context } from "@netlify/functions";
import {
  attribution, clean, cleanUrl, emailLayout, env, esc, fieldTable, insertRow, isEmail, json, p, passesBotCheck, readFields, sendEmail,
} from "../lib/forge.mts";

const REQUIRED = ["full_name", "email", "phone", "country", "city", "current_role", "experience", "expertise", "motivation", "problem", "has_idea", "skills_bring", "skills_seek", "why_forge", "ambition", "commitment"];

export default async (req: Request, context: Context) => {
  if (req.method !== "POST") return json({ ok: false, error: "Method not allowed" }, 405);

  let f: Record<string, string>;
  try {
    f = await readFields(req);
  } catch {
    return json({ ok: false, error: "Could not read the form." }, 400);
  }

  if (!(await passesBotCheck(f, context.ip))) return json({ ok: false, error: "Please confirm you are human and try again." }, 400);

  const missing = REQUIRED.filter((k) => !clean(f[k]));
  const email = clean(f.email, 254)?.toLowerCase() ?? null;
  if (missing.length || !isEmail(email) || f.consent !== "yes") {
    return json({ ok: false, error: "Some required answers are missing.", missing, invalidEmail: !isEmail(email), consent: f.consent === "yes" }, 422);
  }

  const row = {
    cohort: clean(f.cohort, 50) || "cohort-01",
    full_name: clean(f.full_name, 200),
    email,
    phone: clean(f.phone, 50),
    country: clean(f.country, 100),
    city: clean(f.city, 100),
    current_role: clean(f.current_role, 200),
    organisation: clean(f.organisation, 200),
    experience: clean(f.experience, 50),
    expertise: clean(f.expertise, 100),
    motivation: clean(f.motivation),
    problem: clean(f.problem),
    has_idea: clean(f.has_idea, 20),
    idea: clean(f.idea),
    skills_bring: clean(f.skills_bring),
    skills_seek: clean(f.skills_seek),
    why_forge: clean(f.why_forge),
    ambition: clean(f.ambition),
    commitment: clean(f.commitment, 100),
    linkedin: cleanUrl(f.linkedin),
    portfolio: cleanUrl(f.portfolio),
    github: cleanUrl(f.github),
    website: cleanUrl(f.website),
    final_message: clean(f.final_message),
    consent: true,
    ...attribution(f),
  };

  let saved: { id: string };
  try {
    saved = await insertRow("applications", row);
  } catch (err) {
    console.error(err);
    return json({ ok: false, error: "We could not save your application. Please try again in a moment." }, 502);
  }

  const site = env("NEXT_PUBLIC_SITE_URL", new URL(req.url).origin).replace(/\/$/, "");
  const first = (row.full_name || "").split(/\s+/)[0];
  const team = env("FORGE_APPLICATIONS_EMAIL") || env("FORGE_TEAM_EMAIL");

  await Promise.allSettled([
    sendEmail({
      to: email!,
      subject: "We received your Coetara Forge application",
      replyTo: team || undefined,
      text: `Hi ${first},\n\nThank you for applying to Cohort 01 of the Coetara Forge 10-Week Venture Incubator. Your application has been received.\n\nWe review every application. Shortlisted applicants will be contacted by email about the next stage of assessment.\n\nApplication reference: ${saved.id.slice(0, 8).toUpperCase()}\n\nBuild What Comes Next.\nCoetara Forge`,
      html: emailLayout(
        "Application received.",
        p(`Hi ${esc(first)},`) +
          p("Thank you for applying to Cohort 01 of the Coetara Forge 10-Week Venture Incubator. Your application has been received.") +
          p("We review every application. Shortlisted applicants will be contacted by email about the next stage of assessment.") +
          p(`Application reference: <strong>${saved.id.slice(0, 8).toUpperCase()}</strong>`) +
          p(`While you wait, read <a href="${site}/insights/validate-a-business-problem/" style="color:#c42201">how to validate a business problem before building a product</a>.`),
      ),
    }),
    team
      ? sendEmail({
          to: team.split(",").map((s) => s.trim()),
          subject: `New application: ${row.full_name} (${row.expertise}, ${row.country})`,
          replyTo: email!,
          text: `New Cohort 01 application from ${row.full_name} <${email}>\n${row.current_role} · ${row.country}\nSource: ${row.utm_source || row.referrer || "direct"}\n\nReview: ${site}/review/#${saved.id}`,
          html: emailLayout(
            `New application: ${row.full_name}`,
            fieldTable([
              ["Email", email],
              ["Country / city", [row.country, row.city].filter(Boolean).join(", ")],
              ["Current role", row.current_role],
              ["Expertise", row.expertise],
              ["Experience", row.experience],
              ["Has an idea", row.has_idea],
              ["Commitment", row.commitment],
              ["Source", [row.utm_source, row.utm_medium, row.utm_campaign].filter(Boolean).join(" / ") || row.referrer || "Direct"],
            ]) +
              p(`<strong>The problem they want to solve</strong><br>${esc(row.problem)}`) +
              p(`<a href="${site}/review/#${saved.id}" style="display:inline-block;background:#03080c;color:#ffffff;padding:12px 18px;border-radius:999px;text-decoration:none;font-weight:bold">Open in the review dashboard</a>`),
          ),
        })
      : Promise.resolve(),
  ]);

  return json({ ok: true, id: saved.id });
};

export const config: Config = { path: "/api/apply", method: "POST" };
