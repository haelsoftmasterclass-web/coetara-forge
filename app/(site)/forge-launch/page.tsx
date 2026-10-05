import { Section, SectionHeader } from "@/components/Section";
import PageHero from "@/components/PageHero";
import Journey from "@/components/Journey";
import Checklist from "@/components/Checklist";
import CtaBand from "@/components/CtaBand";
import Button from "@/components/Button";
import { launchModel } from "@/content/journey";
import { cta, pageMeta, routes } from "@/lib/site";

export const metadata = pageMeta({
  title: "Forge Launch | From Individual Talent to New Companies",
  description:
    "Forge Launch is the founder and venture creation engine of Coetara Forge. It identifies exceptional African builders, forms complementary teams and turns validated opportunities into companies.",
  path: routes.launch,
  absoluteTitle: true,
});

export default function ForgeLaunch() {
  return (
    <>
      <PageHero
        eyebrow="Engine 01 · Forge Launch"
        title={<>From Individual Talent <span className="flame-text">to New Companies.</span></>}
        lede="Forge Launch is the founder and venture creation engine of Coetara Forge. It identifies exceptional people, brings complementary capabilities together and helps turn validated opportunities into companies."
        primary={cta.primary}
        secondary={{ label: "Explore the 10-Week Incubator", href: routes.incubator, track: "incubator_cta" }}
      />

      <Section>
        <SectionHeader eyebrow="The model" title="Nine stages from a person to a company." align="split" lede="Forge Launch starts with people and moves toward investment only when the evidence supports it." />
        <div className="mt-16">
          <Journey stages={launchModel} />
        </div>
      </Section>

      <Section tone="sand">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div data-reveal>
            <p className="eyebrow text-muted">Who is Forge Launch for?</p>
            <h2 className="heading mt-5 text-[34px] sm:text-[46px]">Capable people who may not yet have a company.</h2>
            <p className="lede mt-6">People who have:</p>
          </div>
          <div data-reveal>
            <Checklist
              items={["Strong technical capability", "Product expertise", "Industry knowledge", "Commercial capability", "Research capability", "Operational experience", "Creative capability"]}
            />
            <p className="mt-6 text-[16px] text-muted">but may not yet have a company.</p>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div data-reveal>
            <p className="eyebrow text-muted">Why this model?</p>
            <h2 className="heading mt-5 text-[34px] sm:text-[46px]">Forge Launch can begin earlier.</h2>
            <p className="lede mt-6">
              Traditional startup ecosystems often expect founders to arrive with everything already in place. Forge Launch starts with exceptional people and combines them with problems, capabilities, customers and commercial infrastructure.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2" data-reveal>
            <div className="rounded-[22px] border border-line p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Traditional ecosystems expect</p>
              <ul className="mt-4 grid gap-2 text-[16px] text-ink/60">
                {["A company", "A team", "A pitch deck", "A product", "Customers"].map((x) => (
                  <li key={x} className="line-through decoration-ink/30">{x}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-[22px] bg-ink p-6 text-white">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-amber">Forge Launch starts with</p>
              <ul className="mt-4 grid gap-2 text-[16px]">
                {["Exceptional people", "Real problems", "Complementary capabilities", "Customers", "Commercial infrastructure"].map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      <section className="on-dark bg-night py-20 text-white md:py-24">
        <div className="wrap grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-center">
          <div data-reveal>
            <p className="eyebrow text-white/55">10-Week Incubator connection</p>
            <h2 className="heading mt-5 text-[34px] sm:text-[46px]">The first operating expression of Forge Launch.</h2>
            <p className="lede mt-6">The 10-Week Venture Incubator is where Forge Launch starts in public: exceptional individuals, formed into teams, building ventures with real customers over 10 weeks.</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end" data-reveal>
            <Button href={routes.incubator} variant="flame" track="incubator_cta">Explore the 10-Week Incubator</Button>
            <Button href={cta.primary.href} variant="ghost" track={cta.primary.track}>{cta.primary.label}</Button>
          </div>
        </div>
      </section>

      <CtaBand title="Start with the person. Build the company." />
    </>
  );
}
