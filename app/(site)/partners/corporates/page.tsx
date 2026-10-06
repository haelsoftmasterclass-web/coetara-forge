import { Section, SectionHeader } from "@/components/Section";
import PageHero from "@/components/PageHero";
import LayerDiagram from "@/components/LayerDiagram";
import Flow from "@/components/Flow";
import Checklist from "@/components/Checklist";
import EnquiryBand from "@/components/EnquiryBand";
import Disclaimer from "@/components/Disclaimer";
import { disclaimer } from "@/content/faq";
import { pageMeta, routes } from "@/lib/site";

export const metadata = pageMeta({
  title: "Corporate Partnerships | Coetara Forge",
  description:
    "Coetara Forge partners with corporate innovation teams, R&D teams, banks, telcos and technology companies to turn technology, ideas and IP into evidence-driven new ventures in Africa.",
  path: routes.corporates,
  absoluteTitle: true,
});

const start = { label: "Start a Corporate Partnership", href: "#enquiry", track: "corporate_partner_cta" };

const ways = [
  ["Innovation Programme Sponsorship", "Back a Forge programme or cohort around themes that matter to your organisation and its markets."],
  ["Technology Scouting", "Find emerging technologies, teams and ventures relevant to your strategic priorities."],
  ["Corporate Venture Challenges", "Put a real business problem to exceptional builders and see what evidence-backed solutions emerge."],
  ["R&D Commercialisation", "Explore whether technology from your R&D has a route to market as a product or a standalone venture."],
  ["Talent & Founder Programmes", "Develop founders and operators, inside or around your organisation, using the Forge method."],
  ["Strategic Venture Partnerships", "Build new ventures with Forge where your capability, distribution or data gives them an advantage."],
];

const brings = [
  "Venture-building methodology",
  "Commercial validation",
  "Founder and operator development",
  "Product-building capability",
  "Customer discovery",
  "Market access",
  "Technology commercialisation",
  "Venture development pathways",
];

const whoWeWorkWith = ["Corporate innovation teams", "R&D teams", "Technology companies", "Banks", "Telcos", "Payment companies", "Other strategic organisations"];

const opportunity = [
  ["Internal Capability", "Technology, ideas, data, distribution and people already inside the organisation."],
  ["Commercial Opportunity", "A validated problem, a customer who will pay and a credible route to market."],
  ["New Venture", "A product or company built to stand on its own evidence."],
];

export default function CorporatePartnerships() {
  return (
    <>
      <PageHero
        eyebrow="Forge Commercial · Corporate Partnerships"
        title={<>Turn Innovation Into <span className="flame-text">Commercial Opportunity.</span></>}
        lede={
          <>
            <p>Corporate organisations are constantly generating technology, ideas and intellectual property. Some never reach their full commercial potential.</p>
            <p className="mt-4">Coetara Forge helps organisations identify promising opportunities and explore pathways toward new ventures, products and commercial outcomes.</p>
          </>
        }
        primary={start}
        secondary={{ label: "Explore Forge Commercial", href: routes.commercial }}
        aside={
          <LayerDiagram
            label="Innovation to venture"
            inputsLabel="Inside the organisation"
            inputs={["R&D", "Technology", "Intellectual property", "Ideas", "Talent"]}
            layer="Venture-building layer"
            layerBody="Validation, teams, customers and a disciplined path from concept to company."
            outputsLabel="Commercial outcomes"
            outputs={["Products", "Partnerships", "New ventures"]}
          />
        }
      />

      {/* BEYOND R&D */}
      <Section>
        <SectionHeader
          eyebrow="The execution pathway"
          title="Innovation Should Not Stop at the R&D Department."
          align="split"
          lede="Corporate innovation can produce valuable technology without necessarily producing a standalone business. Forge provides a venture-building layer between innovation and commercial opportunity."
        />
        <div className="mt-12 rounded-[22px] border border-line bg-sand p-6 sm:p-10">
          <Flow steps={["Technology", "Validation", "Team", "Customer", "Venture"]} />
        </div>
      </Section>

      {/* HOW CORPORATES WORK WITH FORGE */}
      <Section tone="sand">
        <SectionHeader eyebrow="How corporates can work with Forge" title="Six ways to build with Forge." align="split" lede="Each partnership is shaped around what the organisation brings and what the ventures need." />
        <ul className="mt-14 grid gap-px overflow-hidden rounded-[22px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {ways.map(([name, body], i) => (
            <li key={name} className="flex min-h-[220px] flex-col bg-white p-7" data-reveal>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[12px] text-ember-deep">{String(i + 1).padStart(2, "0")}</span>
                <span className="tag">Potential collaboration</span>
              </div>
              <h3 className="heading mt-auto pt-8 text-[24px]">{name}</h3>
              <p className="mt-3 text-[15.5px] text-muted">{body}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* THE OPPORTUNITY */}
      <section className="on-dark relative overflow-hidden bg-night py-20 text-white md:py-28">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_0%,rgba(253,114,0,0.16),transparent_55%)]" />
        <div className="wrap relative">
          <div className="max-w-3xl" data-reveal>
            <p className="eyebrow text-white/55">The opportunity</p>
            <h2 className="display mt-6 text-[38px] sm:text-[54px] lg:text-[64px]">
              Don&apos;t let promising innovation remain <span className="flame-text">under-used.</span>
            </h2>
          </div>
          <ol className="mt-14 grid gap-3 lg:grid-cols-3 lg:gap-12">
            {opportunity.map(([name, body], i) => {
              const last = i === opportunity.length - 1;
              return (
                <li
                  key={name}
                  className={`relative flex min-h-[200px] flex-col rounded-[22px] p-7 ${last ? "bg-[linear-gradient(120deg,#feb101,#fd7200_50%,#fe5301)] text-ink" : "border border-line-dark bg-white/[0.03]"}`}
                  data-reveal
                >
                  <span className={`font-mono text-[12px] ${last ? "text-ink/60" : "text-amber"}`}>{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="heading mt-auto pt-8 text-[26px] sm:text-[28px]">{name}</h3>
                  <p className={`mt-3 text-[15.5px] ${last ? "text-ink/75" : "text-white/60"}`}>{body}</p>
                  {!last ? (
                    <svg width="34" height="12" viewBox="0 0 34 12" aria-hidden="true" className="absolute -right-[42px] top-1/2 hidden -translate-y-1/2 text-white/35 lg:block">
                      <path d="M1 6h29M26 1.5 31 6l-5 4.5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
                    </svg>
                  ) : null}
                </li>
              );
            })}
          </ol>
          <p className="heading mt-12 max-w-3xl text-[22px] sm:text-[26px]" data-reveal>
            The objective is evidence-driven venture creation. <span className="text-white/45">Not innovation theatre.</span>
          </p>
        </div>
      </section>

      {/* WHAT FORGE BRINGS */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div data-reveal>
            <p className="eyebrow text-muted">What Forge brings</p>
            <h2 className="heading mt-5 text-[34px] sm:text-[44px]">A venture-building capability, without building one in-house.</h2>
          </div>
          <div data-reveal>
            <Checklist items={brings} cols={2} />
          </div>
        </div>
      </Section>

      {/* WHO WE WORK WITH */}
      <Section tone="sand">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div data-reveal>
            <p className="eyebrow text-muted">Who we work with</p>
            <h2 className="heading mt-5 text-[34px] sm:text-[44px]">Organisations with something worth building on.</h2>
          </div>
          <ul className="flex flex-wrap content-start gap-2.5" data-reveal>
            {whoWeWorkWith.map((w) => (
              <li key={w} className="rounded-full border border-ink/15 bg-white px-5 py-3 text-[16px] font-semibold">{w}</li>
            ))}
          </ul>
        </div>
      </Section>

      <EnquiryBand
        eyebrow="Start a Corporate Partnership"
        title={<>Have an opportunity worth <span className="flame-text">building?</span></>}
        body="Tell us about the technology, challenge or opportunity. We will explore whether there is a venture inside it."
        role="Corporate"
        topic="Corporate partnership"
        submitLabel="Start a Corporate Partnership"
        track="corporate_partner_submit"
      />

      <Disclaimer>{disclaimer}</Disclaimer>
    </>
  );
}
