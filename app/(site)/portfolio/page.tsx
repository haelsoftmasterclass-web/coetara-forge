import { Section, SectionHeader } from "@/components/Section";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import { portfolio } from "@/content/portfolio";
import { cta, pageMeta, routes } from "@/lib/site";

export const metadata = pageMeta({
  title: "Portfolio",
  description: "Companies built through Coetara Forge. The first generation of Forge ventures is being built.",
  path: routes.portfolio,
});

const represents = ["A problem identified", "A market investigated", "A team formed", "A solution built", "Customers engaged", "Evidence generated"];
const stages = ["Incubation", "Pre-Seed", "Seed", "Growth"];

export default function Portfolio() {
  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title={<>Companies <span className="flame-text">Built by Forge.</span></>}
        lede="This is where ventures created through Forge will live. Every company should represent more than an idea."
      >
        <ul className="mt-10 grid max-w-2xl grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3" data-reveal>
          {represents.map((r) => (
            <li key={r} className="flex items-center gap-2.5 text-[15px] text-ink-2">
              <span className="h-[5px] w-[10px] skew-x-[-20deg] bg-orange" />
              {r}
            </li>
          ))}
        </ul>
      </PageHero>

      <Section>
        {portfolio.length === 0 ? (
          <div className="relative overflow-hidden rounded-[22px] border border-dashed border-ink/20 bg-sand px-6 py-16 text-center sm:py-24" data-reveal>
            <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 opacity-60 sm:grid-cols-4" aria-hidden="true">
              {stages.map((s) => (
                <div key={s} className="rounded-xl border border-dashed border-ink/20 bg-white/60 p-4 text-left">
                  <div className="h-8 w-8 rounded-md bg-line" />
                  <div className="mt-4 h-2.5 w-3/4 rounded bg-line" />
                  <div className="mt-2 h-2 w-1/2 rounded bg-line" />
                  <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.12em] text-faint">{s}</p>
                </div>
              ))}
            </div>
            <p className="eyebrow mt-12 justify-center text-ember-deep">Portfolio coming soon</p>
            <h2 className="heading mx-auto mt-4 max-w-2xl text-[32px] sm:text-[44px]">The first generation of Forge ventures is being built.</h2>
            <p className="mx-auto mt-4 max-w-xl text-[17px] text-muted">Companies will appear here once they have been formed through Forge Launch or Forge Commercial.</p>
          </div>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {portfolio.map((c) => (
              <li key={c.name} className="group flex flex-col rounded-[22px] border border-line bg-white p-7 transition-all hover:-translate-y-1 hover:border-ink" data-track="portfolio_card">
                <div className="flex items-center justify-between">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {c.logo ? <img src={c.logo} alt="" className="h-10 w-auto" /> : <span className="heading text-[20px]">{c.name}</span>}
                  <span className="tag">{c.stage}</span>
                </div>
                <h3 className="heading mt-6 text-[24px]">{c.name}</h3>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">{c.sector} · {c.pathway}</p>
                <p className="mt-4 text-[15.5px] text-ink-2">{c.description}</p>
                {c.website ? (
                  <a href={c.website} className="link-arrow mt-auto self-start pt-6" target="_blank" rel="noopener" data-track="portfolio_visit_site">Visit website</a>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section tone="sand">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <SectionHeader eyebrow="Portfolio philosophy" title="We are not trying to build the largest portfolio." />
          <div data-reveal>
            <p className="lede">We are building ventures around:</p>
            <ul className="mt-6 border-t border-ink">
              {["Real problems", "Real customers", "Real technology", "Real economics", "Real potential"].map((r) => (
                <li key={r} className="heading border-b border-line py-4 text-[24px] sm:text-[28px]">
                  <span className="text-ember-deep">Real</span> {r.replace("Real ", "")}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <CtaBand title="Build the companies that will fill this page." primary={{ label: "Build With Forge", href: cta.primary.href, track: "apply_cta" }} />
    </>
  );
}
