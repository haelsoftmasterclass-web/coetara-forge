import { Section, SectionHeader } from "@/components/Section";
import PageHero from "@/components/PageHero";
import LayerDiagram from "@/components/LayerDiagram";
import Steps, { type Step } from "@/components/Steps";
import Gates, { type Gate } from "@/components/Gates";
import EnquiryBand from "@/components/EnquiryBand";
import Disclaimer from "@/components/Disclaimer";
import { disclaimer } from "@/content/faq";
import { pageMeta, routes } from "@/lib/site";

export const metadata = pageMeta({
  title: "University Partnerships | Coetara Forge",
  description:
    "Coetara Forge works with African universities and research institutions on technology scouting, IP commercialisation, venture creation and founder development, creating pathways from research to market.",
  path: routes.universities,
  absoluteTitle: true,
});

const partner = { label: "Partner With Forge", href: "#enquiry", track: "university_partner_cta" };

const missing = [
  "Commercial validation",
  "Market discovery",
  "Venture formation",
  "Operating talent",
  "Customer access",
  "Business model development",
  "Capital pathways",
];

const together = [
  ["Technology Scouting", "Identify promising technologies, research outputs and intellectual property with potential commercial applications."],
  ["IP Commercialisation", "Evaluate pathways for moving under-commercialised intellectual property toward market opportunity."],
  ["Venture Creation", "Build companies around technologies where an independent venture represents a credible route to market."],
  ["Student Innovation", "Create pathways for exceptional students and emerging builders to develop entrepreneurial opportunities around real problems."],
  ["Research Translation", "Connect research capability with commercial problem-solving, customer discovery and market validation."],
  ["Founder Development", "Identify and develop people capable of taking a technology or opportunity forward."],
];

const pathway: Step[] = [
  { name: "Scout", body: "Identify promising technology and IP." },
  { name: "DownSelect", body: "Evaluate unmet need, technology readiness, route to market, operator fit and business model." },
  { name: "Structure", body: "Explore appropriate licensing, acquisition or joint-venture structures." },
  { name: "Build", body: "Assemble an operating team and move the technology toward a first customer." },
  { name: "Scale & Spin Out", body: "Develop the venture toward institutional capital, scale or a potential exit." },
];

const gates: Gate[] = [
  { name: "Unmet Need", question: "Is there an unmet need?", detail: "A meaningful customer problem that the technology can address." },
  { name: "Technology Readiness", question: "Is the technology ready?", detail: "Or capable of reaching maturity on a credible timeline." },
  { name: "Route to Market", question: "Is there a route to market?", detail: "A realistic way for the technology to reach customers." },
  { name: "Operator Fit", question: "Is there operator fit?", detail: "People who can carry the venture forward." },
  { name: "Business Model", question: "Is there a business model?", detail: "A way to generate sustainable commercial value." },
];

const whoWeWorkWith = [
  "Universities",
  "Research institutions",
  "Innovation laboratories",
  "Public research organisations",
  "University technology-transfer teams",
  "Faculty and research teams",
  "Student innovation programmes",
];

export default function UniversityPartnerships() {
  return (
    <>
      <PageHero
        eyebrow="Forge Commercial · University Partnerships"
        title={<>Turn Research Into <span className="flame-text">Market Impact.</span></>}
        lede={
          <>
            <p>Universities are producing exceptional research, technology and intellectual property. The challenge is turning promising work into products, ventures and companies that can reach real markets.</p>
            <p className="mt-4">Coetara Forge works with universities and research institutions to create pathways from research to commercial opportunity.</p>
          </>
        }
        primary={partner}
        secondary={{ label: "Explore Forge Commercial", href: routes.commercial }}
        aside={
          <LayerDiagram
            label="Research to market"
            inputsLabel="Inside the institution"
            inputs={["Research", "Technology", "Intellectual property", "Talent"]}
            layer="Execution layer"
            layerBody="Validation, venture formation, operators, customers and capital pathways."
            outputsLabel="Toward the market"
            outputs={["Products", "Licences", "Ventures"]}
          />
        }
      />

      {/* THE COMMERCIALISATION GAP */}
      <Section>
        <SectionHeader
          eyebrow="The commercialisation gap"
          title="Great research does not automatically become a great business."
          align="split"
          lede="Promising technologies can remain inside laboratories, research programmes or institutional portfolios long after their commercial potential becomes clear."
        />
        <div className="mt-14 grid items-stretch gap-3 lg:grid-cols-[1fr_auto_1.5fr_auto_1fr]" data-reveal>
          <div className="flex flex-col justify-between rounded-[22px] border border-line bg-white p-7">
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Where it starts</span>
            <p className="heading mt-10 text-[24px]">Promising technology</p>
          </div>
          <GapArrow />
          <div className="rounded-[22px] border border-dashed border-flame bg-[#fff6ee] p-7">
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ember-deep">The missing layer is often</span>
            <ul className="mt-5 grid gap-x-6 sm:grid-cols-2">
              {missing.map((m) => (
                <li key={m} className="flex items-center gap-3 border-b border-flame/15 py-2.5 text-[15.5px] font-semibold text-ink-2">
                  <span className="h-[5px] w-[10px] shrink-0 skew-x-[-20deg] bg-orange" aria-hidden="true" />
                  {m}
                </li>
              ))}
            </ul>
          </div>
          <GapArrow />
          <div className="flex flex-col justify-between rounded-[22px] bg-[linear-gradient(120deg,#feb101,#fd7200_50%,#fe5301)] p-7 text-ink">
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink/60">Where it can go</span>
            <p className="heading mt-10 text-[24px]">Commercial opportunity</p>
          </div>
        </div>
        <p className="heading mt-12 max-w-3xl text-[24px] sm:text-[28px]" data-reveal>
          Forge provides an execution layer between promising technology and <span className="flame-text">commercial opportunity.</span>
        </p>
      </Section>

      {/* WHAT WE CAN DO TOGETHER */}
      <Section tone="sand">
        <SectionHeader eyebrow="What we can do together" title="Six ways to move research forward." align="split" lede="Each partnership is shaped around the institution's research, people and priorities." />
        <ul className="mt-14 grid gap-px overflow-hidden rounded-[22px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {together.map(([name, body], i) => (
            <li key={name} className="flex min-h-[220px] flex-col bg-white p-7" data-reveal>
              <span className="font-mono text-[12px] text-ember-deep">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="heading mt-auto text-[24px]">{name}</h3>
              <p className="mt-3 text-[15.5px] text-muted">{body}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* THE FORGE COMMERCIAL PATHWAY */}
      <Section>
        <SectionHeader eyebrow="The Forge Commercial pathway" title="From lab to market, in five stages." align="split" lede="Specific legal or financial terms are agreed separately for each opportunity." />
        <div className="mt-14">
          <Steps steps={pathway} cols={5} />
        </div>
      </Section>

      {/* WHAT WE LOOK FOR */}
      <Section tone="ink">
        <SectionHeader eyebrow="What we look for" title="The Forge Gates, applied to research." lede="Every opportunity has to pass the same five questions before it earns the next step." />
        <div className="mt-12">
          <Gates gates={gates} dark />
        </div>
      </Section>

      {/* WHO WE WORK WITH */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div data-reveal>
            <p className="eyebrow text-muted">Who we work with</p>
            <h2 className="heading mt-5 text-[34px] sm:text-[44px]">Institutions with research worth taking further.</h2>
          </div>
          <ul className="flex flex-wrap content-start gap-2.5" data-reveal>
            {whoWeWorkWith.map((w) => (
              <li key={w} className="rounded-full border border-ink/15 bg-white px-5 py-3 text-[16px] font-semibold">{w}</li>
            ))}
          </ul>
        </div>
      </Section>

      <EnquiryBand
        eyebrow="Partner With Forge"
        title={<>Your research could become the foundation of a <span className="flame-text">company.</span></>}
        body="Tell us about the research, technology or programme you have in mind. We will come back to you to explore whether there is a fit."
        role="University / Research Institution"
        topic="University partnership"
        submitLabel="Partner With Forge"
        track="university_partner_submit"
      />

      <Disclaimer>{disclaimer}</Disclaimer>
    </>
  );
}

function GapArrow() {
  return (
    <div className="flex items-center justify-center py-1 lg:px-1 lg:py-0" aria-hidden="true">
      <svg width="34" height="12" viewBox="0 0 34 12" className="rotate-90 text-ink/30 lg:rotate-0">
        <path d="M1 6h29M26 1.5 31 6l-5 4.5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
}
