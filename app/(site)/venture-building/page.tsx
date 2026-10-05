import { Section, SectionHeader } from "@/components/Section";
import PageHero from "@/components/PageHero";
import Flow from "@/components/Flow";
import Gates from "@/components/Gates";
import Statement from "@/components/Statement";
import CtaBand from "@/components/CtaBand";
import { TextLink } from "@/components/Button";
import { cta, pageMeta, routes } from "@/lib/site";

export const metadata = pageMeta({
  title: "Venture Building in Africa",
  description:
    "Venture building is the discipline of turning validated opportunities into operating businesses. How Coetara Forge builds companies through Forge Launch and Forge Commercial.",
  path: routes.ventureBuilding,
});

const pathways = [
  {
    id: "launch",
    name: "Forge Launch",
    tagline: "From individual talent to new companies.",
    items: ["Identify people", "Identify problems", "Form teams", "Validate opportunities", "Build products", "Test customers", "Develop traction", "Prepare for investment"],
    cta: { label: "Explore Forge Launch", href: routes.launch },
  },
  {
    id: "commercial",
    name: "Forge Commercial",
    tagline: "From under-used technology to commercial ventures.",
    items: ["Scout technology", "Evaluate IP", "Assess market opportunity", "Structure partnerships", "Assemble teams", "Build commercial pathways", "Scale or spin out"],
    cta: { label: "Explore Forge Commercial", href: routes.commercial },
  },
];

export default function VentureBuilding() {
  return (
    <>
      <PageHero
        eyebrow="Venture building"
        title={<>We Don&apos;t Just Accelerate Companies. <span className="flame-text">We Help Build Them.</span></>}
        lede="Venture building is the discipline of turning validated opportunities into operating businesses."
        primary={cta.primary}
        secondary={cta.secondary}
      />

      <Section>
        <SectionHeader
          eyebrow="What venture building means"
          title="From a problem to an investable company."
          lede="Forge can help move an opportunity through every stage between a real problem and investment, providing the team, customers, operators and commercial infrastructure a young venture lacks."
        />
        <div className="mt-12 rounded-[22px] border border-line bg-sand p-6 sm:p-10">
          <Flow steps={["Problem", "Validation", "Team", "Product", "Customers", "Revenue", "Investment"]} />
        </div>
      </Section>

      <Section tone="sand">
        <SectionHeader eyebrow="Two venture-building pathways" title="Two starting points. One discipline." />
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {pathways.map((p, i) => (
            <article key={p.id} id={p.id} className={`flex flex-col rounded-[22px] p-8 sm:p-10 ${i === 0 ? "on-dark bg-night text-white" : "border border-line bg-white"}`} data-reveal>
              <p className={`font-mono text-[12px] uppercase tracking-[0.14em] ${i === 0 ? "text-amber" : "text-ember-deep"}`}>Pathway 0{i + 1}</p>
              <h3 className="display mt-5 text-[40px] sm:text-[48px]">{p.name}</h3>
              <p className={`mt-3 text-[19px] ${i === 0 ? "text-white/75" : "text-ink-2"}`}>{p.tagline}</p>
              <ol className={`mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-xl border sm:grid-cols-2 ${i === 0 ? "border-line-dark bg-line-dark" : "border-line bg-line"}`}>
                {p.items.map((it, k) => (
                  <li key={it} className={`flex items-center gap-3 px-4 py-3.5 text-[15.5px] ${i === 0 ? "bg-night" : "bg-white"}`}>
                    <span className={`font-mono text-[11px] ${i === 0 ? "text-white/40" : "text-faint"}`}>{String(k + 1).padStart(2, "0")}</span>
                    {it}
                  </li>
                ))}
              </ol>
              <div className="mt-auto pt-10">
                <TextLink href={p.cta.href} track={`engine_${p.id}`}>{p.cta.label}</TextLink>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Statement
        questions={["Is the problem real?", "Will customers pay?", "Can the technology work?", "Can the team execute?", "Can this become a business?"]}
      />

      <Section id="gates">
        <SectionHeader eyebrow="What makes a venture worth building?" title="The five Forge Gates." align="split">
          <TextLink href={`${routes.howItWorks}#gates`}>See How Forge Evaluates Opportunities</TextLink>
        </SectionHeader>
        <div className="mt-14">
          <Gates />
        </div>
      </Section>

      <CtaBand title="Build What Comes Next." />
    </>
  );
}
