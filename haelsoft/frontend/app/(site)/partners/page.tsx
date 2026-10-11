import { PartnerCard } from "@/components/Cards";
import CtaBand from "@/components/CtaBand";
import { Ribbon } from "@/components/Icons";
import PageHero from "@/components/PageHero";
import { Section, SectionHeading } from "@/components/Section";
import { ErrorState } from "@/components/States";
import { getPartners } from "@/lib/api/server";
import type { Partner } from "@/lib/api/types";
import { contactHref, pageMeta, routes } from "@/lib/site";
import { PrimaryButton } from "@/components/Buttons";

export const revalidate = 60;

export const metadata = pageMeta({
  title: "Our Partners",
  description: "Partner with Haelsoft EdTech to widen access to practical, career-focused learning across Africa.",
  path: routes.partners,
});

const opportunities = [
  { title: "Education institutions", body: "Universities, colleges and training providers who want to extend practical learning to more people." },
  { title: "Employers", body: "Organisations that want to develop their teams or build pipelines of skilled talent." },
  { title: "Technology companies", body: "Companies whose tools and platforms learners need to master for work." },
  { title: "Foundations and NGOs", body: "Organisations that fund or support access to education, including scholarships." },
  { title: "Public sector", body: "Government bodies and programmes focused on skills, jobs and digital inclusion." },
];

function groupByCategory(partners: Partner[]) {
  const groups = new Map<string, Partner[]>();
  for (const p of partners) groups.set(p.category_label, [...(groups.get(p.category_label) ?? []), p]);
  return [...groups.entries()];
}

export default async function PartnersPage() {
  const partners = await getPartners();
  const list = partners.ok ? partners.data.results : [];
  return (
    <>
      <PageHero
        eyebrow="Our partners"
        title={<>Partner with us to <span className="brand-text">widen access.</span></>}
        lede={<p>We work with organisations that share our goal of making practical, career-focused learning available to more people across Africa.</p>}
        crumbs={[{ label: "Partners", href: routes.partners }]}
        actions={<PrimaryButton href={contactHref("partnership", "Partnership enquiry")}>Start a partnership conversation</PrimaryButton>}
      />

      {!partners.ok ? (
        <Section><ErrorState title="Partner details are unavailable right now" /></Section>
      ) : list.length ? (
        <Section labelledBy="current-partners">
          <SectionHeading id="current-partners" eyebrow="Current partners" title="Organisations we work with" />
          {groupByCategory(list).map(([category, items]) => (
            <section key={category} aria-label={category} className="mt-12">
              <h3 className="font-mono text-[12px] uppercase tracking-[0.14em] text-muted">{category}</h3>
              <ul className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((p) => <li key={p.slug} className="flex"><PartnerCard partner={p} /></li>)}
              </ul>
            </section>
          ))}
        </Section>
      ) : null}

      <Section tone={list.length ? "sand" : "white"} labelledBy="opportunities-title">
        <SectionHeading
          id="opportunities-title"
          eyebrow="Partnership opportunities"
          title="Who we'd like to work with"
          layout="split"
          lede="Partnerships can take many forms, from co-designing courses to sponsoring scholarships. These are the organisations we are keen to hear from."
        />
        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {opportunities.map((o) => (
            <li key={o.title} className="card p-7">
              <Ribbon />
              <h3 className="heading mt-5 text-[21px]">{o.title}</h3>
              <p className="mt-3 text-[15px] text-muted">{o.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand
        eyebrow="Partnerships"
        title="Let's talk about working together."
        body="Tell us about your organisation and what you'd like to achieve. We'll come back to you to explore whether there's a fit."
        primary={{ label: "Send a partnership enquiry", href: contactHref("partnership", "Partnership enquiry") }}
        secondary={{ label: "Corporate training enquiry", href: contactHref("corporate", "Corporate training") }}
      />
    </>
  );
}
