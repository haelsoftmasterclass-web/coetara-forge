import { Section, SectionHeader } from "@/components/Section";
import PageHero from "@/components/PageHero";
import LayerDiagram from "@/components/LayerDiagram";
import Statement from "@/components/Statement";
import Journey, { type Stage } from "@/components/Journey";
import EnquiryBand from "@/components/EnquiryBand";
import Disclaimer from "@/components/Disclaimer";
import { disclaimer, investmentNote } from "@/content/faq";
import { pageMeta, routes } from "@/lib/site";

export const metadata = pageMeta({
  title: "Investors | Coetara Forge",
  description:
    "Coetara Forge is building a pipeline of African ventures from the earliest stages, evaluated on evidence, customer validation, technology readiness and team capability. Engage with Forge as an investor.",
  path: routes.investors,
  absoluteTitle: true,
});

const engage = { label: "Engage With Forge", href: "#enquiry", track: "investor_cta" };

const evaluates = [
  "Unmet need",
  "Technology viability",
  "Route to market",
  "Team and operator fit",
  "Business model",
  "Customer evidence",
  "Traction",
  "Investment readiness",
];

const investorJourney: Stage[] = [
  { name: "Discover", body: "Identify promising ventures emerging through Forge." },
  { name: "Understand", body: "Review the problem, technology, market and founding team." },
  { name: "Validate", body: "Assess evidence from customers and the market." },
  { name: "Engage", body: "Participate where appropriate through introductions, Demo Day or strategic engagement." },
  { name: "Follow", body: "Track ventures as they develop." },
];

const ways = [
  ["Demo Day participation", "See ventures present their evidence at Forge Demo Day."],
  ["Strategic introductions", "Introductions to ventures that match your focus."],
  ["Co-investment opportunities", "The potential to invest alongside Forge where a venture raises a round."],
  ["Follow-on rounds", "Participate as ventures raise their next round."],
  ["Portfolio partnerships", "Work with Forge ventures on growth and strategy."],
  ["Venture referrals", "Refer ventures and opportunities into the Forge pipeline."],
];

const evidence = ["A real problem", "Real customers", "Real technology", "A viable business", "Capable operators", "Potential for growth"];

const components = ["Talent", "Ideas", "Technology", "Customers", "Operators", "Capital"];

export default function Investors() {
  return (
    <>
      <PageHero
        eyebrow="Forge Ecosystem · Investors"
        title={<>Discover Ventures Before They Become <span className="flame-text">Obvious.</span></>}
        lede={
          <>
            <p>Forge is building a pipeline of companies from the earliest stages of development. We work around evidence, customer validation, technology readiness, team capability and commercial potential.</p>
            <p className="mt-4">For investors, that creates an opportunity to understand ventures earlier in their journey.</p>
          </>
        }
        primary={engage}
        secondary={{ label: "Explore the Portfolio", href: routes.portfolio }}
        aside={
          <LayerDiagram
            label="The Forge pipeline"
            inputsLabel="Where ventures start"
            inputs={["Talent", "Ideas", "Technology"]}
            layer="Build, test, evidence"
            layerBody="Every venture earns each next step with evidence from customers and the market."
            outputsLabel="What the pipeline is for"
            outputs={["Validated ventures", "Investable companies"]}
          />
        }
      />

      <Statement
        eyebrow="Evidence before assumptions"
        questions={evaluates}
        marker="number"
        principle="Evidence before assumptions."
        body={
          <>
            <p>Every venture must earn its next step. Forge evaluates each one on the same criteria at every stage, and the evidence has to get stronger each time.</p>
          </>
        }
      />

      {/* THE INVESTOR JOURNEY */}
      <Section>
        <SectionHeader eyebrow="The investor journey" title="Know a venture long before the round." align="split" lede="Investors can follow ventures from their first evidence, not just their final pitch." />
        <div className="mt-14">
          <Journey stages={investorJourney} />
        </div>
      </Section>

      {/* WAYS TO ENGAGE */}
      <Section tone="sand">
        <SectionHeader
          eyebrow="Ways to engage"
          title="Potential pathways into the Forge ecosystem."
          align="split"
          lede="These are potential engagement pathways, not guarantees. Each is subject to applicable Forge investment and partner arrangements."
        />
        <ul className="mt-14 grid gap-px overflow-hidden rounded-[22px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {ways.map(([name, body], i) => (
            <li key={name} className="flex min-h-[200px] flex-col bg-white p-7" data-reveal>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[12px] text-ember-deep">{String(i + 1).padStart(2, "0")}</span>
                <span className="tag">Potential pathway</span>
              </div>
              <h3 className="heading mt-auto pt-8 text-[24px]">{name}</h3>
              <p className="mt-3 text-[15.5px] text-muted">{body}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Subject to applicable Forge investment and partner arrangements.</p>
      </Section>

      {/* INVEST IN EVIDENCE */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
          <div data-reveal>
            <p className="eyebrow text-muted">Core principle</p>
            <h2 className="heading mt-5 text-[34px] sm:text-[46px]">Invest in Evidence, Not Just <span className="flame-text">Potential.</span></h2>
            <blockquote className="mt-8 border-l-[3px] border-orange pl-5">
              <p className="heading text-[22px] leading-snug text-ink-2 sm:text-[26px]">&ldquo;Every stage should make us know more than we knew before.&rdquo;</p>
            </blockquote>
            <p className="lede mt-8">The strongest ventures demonstrate increasingly credible evidence across six dimensions.</p>
          </div>
          {/* Illustrative only: evidence builds stage by stage. These bars are not data. */}
          <ol className="grid gap-2.5 self-end sm:grid-cols-6 sm:items-end sm:gap-3" data-reveal>
            {evidence.map((e, i) => (
              <li
                key={e}
                className="flex items-center gap-4 sm:flex-col sm:items-stretch sm:gap-3"
                style={{ "--bar-h": `${56 + i * 46}px`, "--bar-w": `${18 + i * 8}%` } as React.CSSProperties}
              >
                <span
                  className="flex h-11 w-[var(--bar-w)] shrink-0 items-start rounded-xl px-3 pt-3 sm:h-[var(--bar-h)] sm:w-full"
                  style={{ background: `linear-gradient(160deg, rgba(254,177,1,${(0.25 + i * 0.13).toFixed(2)}), rgba(254,83,1,${(0.15 + i * 0.17).toFixed(2)}))` }}
                  aria-hidden="true"
                >
                  <span className="font-mono text-[11px] leading-none text-ink/70">{String(i + 1).padStart(2, "0")}</span>
                </span>
                <span className="text-[15px] font-semibold leading-tight sm:min-h-[2.5em] sm:text-[14px]">{e}</span>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* WHY FORGE */}
      <section className="on-dark relative overflow-hidden bg-night py-20 text-white md:py-28">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_10%_100%,rgba(253,114,0,0.16),transparent_55%)]" />
        <div className="wrap relative grid items-center gap-14 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <div data-reveal>
            <p className="eyebrow text-white/55">Why Forge</p>
            <h2 className="heading mt-5 text-[34px] sm:text-[46px]">Where the components of a company meet.</h2>
            <p className="lede mt-6">Forge sits at the intersection of talent, ideas, technology, customers, operators and capital. Its purpose is to help turn those components into companies.</p>
          </div>
          <div className="grid items-center gap-4 sm:grid-cols-[1fr_auto_auto]" data-reveal>
            <ul className="grid grid-cols-2 gap-2 sm:grid-cols-1">
              {components.map((c) => (
                <li key={c} className="flex items-center justify-between gap-3 rounded-full border border-line-dark bg-white/[0.03] px-4 py-2.5 text-[15px] font-semibold">
                  {c}
                  <span className="hidden h-px w-8 bg-gradient-to-r from-white/10 to-amber/70 sm:block" aria-hidden="true" />
                </li>
              ))}
            </ul>
            <div className="flex flex-col items-center justify-center gap-3 self-stretch rounded-[22px] border border-line-dark bg-white/[0.03] px-7 py-8 text-center">
              <svg width="56" height="48" viewBox="0 0 14 12" aria-hidden="true">
                <defs><linearGradient id="whyMark" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#feb101" /><stop offset="1" stopColor="#fe5301" /></linearGradient></defs>
                <path d="M5 0h9L9 5H0z" fill="url(#whyMark)" />
                <path d="M5 7h7l-5 5H0z" fill="url(#whyMark)" opacity=".7" />
              </svg>
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/60">Forge</span>
            </div>
            <div className="flex items-center gap-3 sm:flex-col">
              <svg width="34" height="12" viewBox="0 0 34 12" aria-hidden="true" className="hidden text-white/35 sm:block">
                <path d="M1 6h29M26 1.5 31 6l-5 4.5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
              </svg>
              <span className="w-full rounded-full bg-[linear-gradient(100deg,#feb101,#fd7200_45%,#fe5301)] px-5 py-3 text-center text-[16px] font-semibold text-ink">Companies</span>
            </div>
          </div>
        </div>
      </section>

      <EnquiryBand
        eyebrow="Engage With Forge"
        title={<>Let&apos;s Build the Pipeline <span className="flame-text">Together.</span></>}
        body="Tell us about your focus, stage and the kind of ventures you want to understand earlier."
        role="Investor"
        topic="Investor engagement"
        submitLabel="Engage With Forge"
        track="investor_submit"
        note={investmentNote}
      />

      <Disclaimer>{disclaimer}</Disclaimer>
    </>
  );
}
