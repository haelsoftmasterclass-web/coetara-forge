import PageHero from "@/components/PageHero";
import { Section } from "@/components/Section";
import EnquiryForm from "@/components/EnquiryForm";
import { Arrow } from "@/components/Icons";
import { pageMeta, routes } from "@/lib/site";

export const metadata = pageMeta({
  title: "Contact Forge",
  description: "Talk to Coetara Forge about the 10-Week Venture Incubator, university and corporate partnerships, technology commercialisation or investment.",
  path: routes.contact,
});

const pathways = [
  { who: "I'm a Builder", what: "Interested in the 10-Week Venture Incubator.", cta: "Apply for Cohort 01", href: routes.apply, track: "apply_cta" },
  { who: "I'm a University or Research Institution", what: "Interested in technology commercialisation and venture creation.", cta: "Explore University Partnerships", href: routes.universities, track: "partner_cta" },
  { who: "I'm a Corporate", what: "Interested in innovation and strategic venture-building partnerships.", cta: "Explore Corporate Partnerships", href: routes.corporates, track: "partner_cta" },
  { who: "I'm an Investor", what: "Interested in Forge ventures and investment opportunities.", cta: "Engage With Forge", href: routes.investors, track: "partner_cta" },
];

export default function Contact() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={<>Let&apos;s Build What <span className="flame-text">Comes Next.</span></>}
        lede="Whether you are a builder, university, research institution, corporate innovation team, investor or ecosystem partner, we would like to understand what you are building and where there may be a fit."
      />
      <Section>
        <ul className="grid gap-px overflow-hidden rounded-[22px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {pathways.map((p, i) => (
            <li key={p.who} className="flex flex-col bg-white p-7" data-reveal>
              <span className="font-mono text-[12px] text-ember-deep">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="heading mt-6 text-[22px]">{p.who}</h2>
              <p className="mt-2 text-[15px] text-muted">{p.what}</p>
              <a href={p.href} className="link-arrow mt-auto self-start pt-6" data-track={p.track}>{p.cta} <Arrow /></a>
            </li>
          ))}
        </ul>
      </Section>
      <Section tone="sand" id="enquiry">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div>
            <p className="eyebrow text-muted">Send an enquiry</p>
            <h2 className="heading mt-5 text-[34px] sm:text-[44px]">Tell us what you are working on.</h2>
            <p className="lede mt-5">We read every enquiry and route it to the right person in the Forge team.</p>
          </div>
          <div className="rounded-[22px] border border-line bg-white p-6 sm:p-10">
            <EnquiryForm />
          </div>
        </div>
      </Section>
    </>
  );
}
