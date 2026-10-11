import ContactForm from "@/components/ContactForm";
import JsonLd from "@/components/JsonLd";
import PageHero from "@/components/PageHero";
import { getSiteSettings } from "@/lib/api/server";
import type { EnquiryPayload } from "@/lib/api/types";
import { SITE_URL, pageMeta, routes, site } from "@/lib/site";
import { ENQUIRY_TYPES } from "@/lib/validation";

export const metadata = pageMeta({
  title: "Contact Us",
  description: "Contact Haelsoft EdTech about learning, teaching, partnerships or corporate training.",
  path: routes.contact,
});

type SearchParams = Promise<{ type?: string; subject?: string }>;

const reasons = [
  { title: "Learning", body: "Questions about upcoming courses, scholarships or how learning will work." },
  { title: "Teaching", body: "Practitioners interested in becoming a Haelsoft instructor." },
  { title: "Partnerships", body: "Organisations exploring a partnership or scholarship sponsorship." },
  { title: "Corporate training", body: "Employers interested in developing their teams' skills." },
];

export default async function ContactPage({ searchParams }: { searchParams: SearchParams }) {
  const [params, settings] = await Promise.all([searchParams, getSiteSettings()]);
  const type = ENQUIRY_TYPES.some((t) => t.value === params.type) ? (params.type as EnquiryPayload["enquiry_type"]) : "general";
  const subject = (params.subject ?? "").slice(0, 160);
  const details = [
    settings.contact_email ? { label: "Email", value: settings.contact_email, href: `mailto:${settings.contact_email}` } : null,
    settings.contact_phone ? { label: "Phone", value: settings.contact_phone, href: `tel:${settings.contact_phone.replace(/[^+\d]/g, "")}` } : null,
    settings.contact_address ? { label: "Address", value: settings.contact_address, href: null } : null,
  ].filter((d): d is { label: string; value: string; href: string | null } => d !== null);

  return (
    <>
      <PageHero
        eyebrow="Contact us"
        title={<>Let&apos;s <span className="brand-text">talk.</span></>}
        lede={<p>Whether you want to learn, teach, partner with us or train your team, send us a message and the right person will pick it up.</p>}
        crumbs={[{ label: "Contact", href: routes.contact }]}
      />
      <section className="section bg-paper">
        <div className="wrap grid gap-14 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
          <div className="grid content-start gap-10">
            <div>
              <h2 className="heading text-[26px]">How we can help</h2>
              <ul className="mt-6 grid gap-5">
                {reasons.map((r) => (
                  <li key={r.title} className="border-l-2 border-flame pl-4">
                    <h3 className="font-semibold">{r.title}</h3>
                    <p className="text-[15px] text-muted">{r.body}</p>
                  </li>
                ))}
              </ul>
            </div>
            {settings.contact_response_note ? (
              <p className="card bg-sand p-5 text-[15px]">{settings.contact_response_note}</p>
            ) : null}
            {details.length ? (
              <div>
                <h2 className="heading text-[22px]">Other ways to reach us</h2>
                <dl className="mt-5 grid gap-4">
                  {details.map((d) => (
                    <div key={d.label}>
                      <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">{d.label}</dt>
                      <dd className="mt-1 whitespace-pre-line text-[17px]">
                        {d.href ? <a href={d.href} className="underline underline-offset-4 hover:text-ember-deep">{d.value}</a> : d.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}
          </div>
          <div id="enquiry" className="scroll-mt-28">
            <h2 className="heading text-[30px]">Send us a message</h2>
            <div className="mt-8">
              <ContactForm key={`${type}:${subject}`} initialType={type} initialSubject={subject} />
            </div>
          </div>
        </div>
      </section>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact Haelsoft EdTech",
          url: `${SITE_URL}${routes.contact}`,
          about: { "@type": "EducationalOrganization", name: site.name, url: SITE_URL, ...(settings.contact_email ? { email: settings.contact_email } : {}) },
        }}
      />
    </>
  );
}
