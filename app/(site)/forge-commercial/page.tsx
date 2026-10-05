import { Section, SectionHeader } from "@/components/Section";
import PageHero from "@/components/PageHero";
import Flow from "@/components/Flow";
import Steps from "@/components/Steps";
import Gates, { type Gate } from "@/components/Gates";
import CtaBand from "@/components/CtaBand";
import Photo from "@/components/Photo";
import { commercialProcess } from "@/content/commercial";
import { media } from "@/content/media";
import { pageMeta, routes } from "@/lib/site";

export const metadata = pageMeta({
  title: "Forge Commercial | Technology & IP Commercialisation in Africa",
  description:
    "Forge Commercial helps African universities, research institutions and corporates move promising technology and intellectual property from R&D toward commercial ventures.",
  path: routes.commercial,
  absoluteTitle: true,
});

const commercialGates: Gate[] = [
  { name: "Unmet Need", question: "Is there a meaningful customer problem?" },
  { name: "Technology Readiness", question: "Is the technology sufficiently mature or capable of reaching maturity?" },
  { name: "Route to Market", question: "Can the technology realistically reach customers?" },
  { name: "Team & Operator Fit", question: "Can the right people operate the venture?" },
  { name: "Business Model", question: "Can the opportunity generate sustainable commercial value?" },
];

const partners = [
  ["Universities", "Help move research and intellectual property toward commercial opportunity."],
  ["Research Institutions", "Identify technology with potential for market application."],
  ["Corporates", "Explore R&D commercialisation and strategic venture opportunities."],
  ["Technology Teams", "Transform under-used technology into commercial ventures."],
];

export default function ForgeCommercial() {
  const discuss = { label: "Discuss Technology Commercialisation", href: `${routes.contact}?type=technology`, track: "partner_cta" };
  return (
    <>
      <PageHero
        eyebrow="Engine 02 · Forge Commercial"
        title={<>From Under-Used Technology <span className="flame-text">to Commercial Ventures.</span></>}
        lede="Great technology does not automatically become a great business. Forge Commercial helps move promising technology and intellectual property from research and development toward market opportunity."
        primary={discuss}
        secondary={{ label: "Contact Forge", href: routes.contact }}
        aside={<Photo slot={media.commercialLab} ratio="aspect-[4/5]" className="mx-auto max-w-[460px]" />}
      />

      <Section>
        <SectionHeader
          eyebrow="The commercialisation gap"
          title="Where good technology stalls."
          lede="Many technologies stall between technical development and commercial adoption. This is the space Forge is designed to address."
        />
        <div className="mt-12 rounded-[22px] border border-line bg-sand p-6 sm:p-10">
          <Flow steps={["Research", "Prototype", "Validation", "Product", "Market", "Scale"]} zone={{ from: 1, to: 3, label: "The gap: technical development to commercial adoption" }} />
        </div>
      </Section>

      <Section tone="sand">
        <SectionHeader eyebrow="Forge Commercial model" title="Five stages from lab to market." align="split" lede="A structured route for technology and IP, from first scouting to scale or spin-out." />
        <div className="mt-14">
          <Steps steps={commercialProcess} cols={3} />
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="Who we work with" title="Partners with technology worth taking to market." />
        <ul className="mt-12 grid gap-px overflow-hidden rounded-[22px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {partners.map(([n, b]) => (
            <li key={n} className="flex min-h-[200px] flex-col bg-white p-7" data-reveal>
              <h3 className="heading mt-auto text-[24px]">{n}</h3>
              <p className="mt-3 text-[15.5px] text-muted">{b}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="ink">
        <SectionHeader eyebrow="What we evaluate" title="The Forge Gates, applied to technology." />
        <div className="mt-12">
          <Gates gates={commercialGates} dark />
        </div>
      </Section>

      <section className="border-b border-line bg-paper py-24 md:py-32">
        <div className="wrap">
          <p className="eyebrow text-muted" data-reveal>Core principle</p>
          <p className="display mt-8 max-w-5xl text-[44px] sm:text-[68px] lg:text-[84px]" data-reveal>
            A working technology is not yet a <span className="flame-text">business.</span>
          </p>
          <p className="lede mt-8" data-reveal>
            Commercialisation requires customer understanding, market validation, business models, operating capability and a credible path to adoption.
          </p>
        </div>
      </section>

      <CtaBand
        title="Have Technology That Should Reach the Market?"
        body="Let's explore whether there is a venture inside it."
        primary={discuss}
        secondary={{ label: "Contact Forge", href: routes.contact }}
        eyebrow="Forge Commercial"
      />
    </>
  );
}
