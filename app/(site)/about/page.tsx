import { Section, SectionHeader } from "@/components/Section";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import Photo from "@/components/Photo";
import AfricaMap from "@/components/AfricaMap";
import { media } from "@/content/media";
import { cta, pageMeta, routes } from "@/lib/site";

export const metadata = pageMeta({
  title: "About Coetara Forge | African Venture Building",
  description:
    "Coetara Forge is the venture-building and commercialisation arm of Coetara Technologies Limited, providing the execution layer between African potential and enterprise value.",
  path: routes.about,
  absoluteTitle: true,
});

const gaps = [
  ["Founders", "may have ideas", "without systems."],
  ["Institutions", "may have intellectual property", "without commercialisation capability."],
  ["Researchers", "may have technology", "without a route to market."],
  ["Companies", "may have innovation challenges", "without venture-building capacity."],
];

const principles = [
  ["Real problems", "before solutions"],
  ["Customers", "before assumptions"],
  ["Evidence", "before hype"],
  ["Working products", "before endless presentations"],
  ["Commercial viability", "before vanity metrics"],
  ["Iteration", "before attachment"],
  ["Strong teams", "before unnecessary complexity"],
];

const sources = ["Universities", "Communities", "Corporations", "Campuses", "Technology teams", "Research laboratories", "Individual builders"];

const coetara = ["Events", "Discovery", "Community", "Market", "Payments", "Insights", "Related services"];

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="About Forge"
        title={<>We Build Companies, <span className="flame-text">Not Just Programmes.</span></>}
        lede={
          <>
            Coetara Forge is the venture-building and commercialisation arm of Coetara Technologies Limited. It exists to turn promising African talent, ideas and technologies into enterprise value.
          </>
        }
        primary={{ label: "Explore How Forge Works", href: routes.howItWorks }}
        secondary={cta.secondary}
      />

      {/* MISSION */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div data-reveal>
            <p className="eyebrow text-muted">Our mission</p>
            <h2 className="display mt-6 text-[40px] sm:text-[56px]">Turn African Potential Into Enterprise Value.</h2>
          </div>
          <div className="grid content-end gap-5 text-[18px] leading-relaxed text-ink-2" data-reveal>
            <p>Africa has talent, ideas, technology, markets and capital. What it often lacks is the layer that connects them and turns them into operating companies.</p>
            <p>Our mission is to provide that layer. We identify exceptional people and promising technologies, validate the opportunities around them, assemble the teams to pursue them and connect the resulting ventures to customers, operators and capital.</p>
            <p>Enterprise value is the measure: companies that survive and grow in real markets, create jobs and solve real problems.</p>
          </div>
        </div>
      </Section>

      {/* VISION */}
      <section className="on-dark relative overflow-hidden bg-night py-20 text-white md:py-28">
        <div className="wrap relative grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div data-reveal>
            <p className="eyebrow text-white/55">Our vision</p>
            <h2 className="display mt-6 text-[40px] sm:text-[56px]">A World-Class Venture-Building Engine Built for Africa.</h2>
            <p className="lede mt-6">The next generation of African companies will not come from one place. They can emerge from:</p>
            <ul className="mt-8 flex flex-wrap gap-2.5">
              {sources.map((s) => (
                <li key={s} className="rounded-full border border-line-dark px-4 py-2 text-[15px] text-white/85">{s}</li>
              ))}
            </ul>
          </div>
          <AfricaMap dark showLabels className="w-full" />
        </div>
      </section>

      {/* EXECUTION LAYER */}
      <Section>
        <SectionHeader eyebrow="The missing execution layer" title="Potential is everywhere. Execution is scarce." />
        <ul className="mt-14 border-t border-ink">
          {gaps.map(([who, has, lacks]) => (
            <li key={who} className="grid gap-2 border-b border-line py-6 sm:grid-cols-[200px_1fr_1fr] sm:items-baseline sm:gap-8" data-reveal>
              <span className="heading text-[24px]">{who}</span>
              <span className="text-[18px] text-ink-2">{has}</span>
              <span className="text-[18px] text-ember-deep">{lacks}</span>
            </li>
          ))}
        </ul>
        <p className="heading mt-12 max-w-3xl text-[26px] sm:text-[32px]" data-reveal>
          Forge provides the execution layer between potential and enterprise.
        </p>
      </Section>

      {/* HOW WE THINK */}
      <Section tone="sand">
        <SectionHeader eyebrow="How we think" title="The Forge philosophy." align="split" lede="Seven rules that decide how we choose, build and judge ventures." />
        <ol className="mt-14 grid gap-px overflow-hidden rounded-[22px] border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
          {principles.map(([a, b], i) => (
            <li key={a} className={`bg-white p-7 ${i === 0 ? "lg:col-span-2 lg:row-span-2 lg:flex lg:flex-col lg:justify-end lg:bg-ink lg:text-white" : ""}`} data-reveal>
              <span className={`font-mono text-[12px] ${i === 0 ? "text-ember-deep lg:text-amber" : "text-ember-deep"}`}>{String(i + 1).padStart(2, "0")}</span>
              <p className={`heading mt-4 ${i === 0 ? "text-[26px] lg:text-[44px]" : "text-[24px]"}`}>{a}</p>
              <p className={`mt-1 text-[17px] ${i === 0 ? "text-muted lg:text-white/60" : "text-muted"}`}>{b}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* COETARA → FORGE */}
      <Section>
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-20">
          <div data-reveal>
            <p className="eyebrow text-muted">From Coetara Technologies to Coetara Forge</p>
            <h2 className="heading mt-5 text-[36px] sm:text-[48px]">An ecosystem that extends into venture creation.</h2>
            <p className="lede mt-6">
              Coetara Technologies Limited builds a broader ecosystem of products and infrastructure. Forge extends that ecosystem into venture creation, giving new companies access to the audiences, networks and infrastructure Coetara already operates.
            </p>
          </div>
          <div className="rounded-[22px] border border-line p-6 sm:p-8" data-reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Coetara Technologies Limited</p>
            <ul className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {coetara.map((c) => (
                <li key={c} className="rounded-lg bg-sand px-3 py-3 text-center text-[14px] font-semibold">{c}</li>
              ))}
            </ul>
            <div className="my-5 flex justify-center" aria-hidden="true">
              <svg width="14" height="40" viewBox="0 0 14 40"><path d="M7 0v34M2 29l5 6 5-6" stroke="#fd7200" strokeWidth="1.6" fill="none" /></svg>
            </div>
            <div className="rounded-xl bg-ink px-5 py-5 text-white">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-amber">Coetara Forge</p>
              <p className="heading mt-2 text-[22px]">Venture creation: Forge Launch + Forge Commercial</p>
            </div>
          </div>
        </div>
        <div className="mt-16">
          <Photo slot={media.aboutCity} ratio="aspect-[21/9]" className="w-full" />
        </div>
      </Section>

      <CtaBand title="Build What Comes Next." primary={{ label: "Explore How Forge Works", href: routes.howItWorks }} />
    </>
  );
}
