import { Section, SectionHeader } from "@/components/Section";
import PageHero from "@/components/PageHero";
import Journey from "@/components/Journey";
import Gates from "@/components/Gates";
import ValleyChart from "@/components/ValleyChart";
import Steps from "@/components/Steps";
import CtaBand from "@/components/CtaBand";
import { journey } from "@/content/journey";
import { commercialProcess } from "@/content/commercial";
import { cta, pageMeta, routes } from "@/lib/site";

export const metadata = pageMeta({
  title: "How Coetara Forge Builds Ventures",
  description:
    "The Forge journey, the five Forge Gates and the commercialisation process Coetara Forge uses to turn African talent and technology into companies.",
  path: routes.howItWorks,
  absoluteTitle: true,
});

export default function HowItWorks() {
  return (
    <>
      <PageHero
        eyebrow="How it works"
        title={<>From Potential <span className="flame-text">to Company.</span></>}
        lede="Forge combines discovery, validation, team formation, product building, market testing and investment readiness into one venture-building process."
        primary={cta.primary}
        secondary={cta.secondary}
      />

      <Section id="journey">
        <SectionHeader eyebrow="The Forge journey" title="Eight stages. Each one has to earn the next." align="split" lede="Ventures move through the journey on evidence. Some stages repeat; some ventures stop. That is the point of the process." />
        <div className="mt-16">
          <Journey stages={journey} />
        </div>
      </Section>

      <Section tone="ink" id="gates">
        <SectionHeader eyebrow="Forge gates" title="Five gates every venture must pass." align="split" lede="These are the questions Forge uses to evaluate opportunities, whether they start with a person or with a technology." />
        <div className="mt-14">
          <Gates dark />
        </div>
      </Section>

      <Section id="valley">
        <SectionHeader
          eyebrow="The valley of death"
          title="A working technology is not yet a business."
          lede="Between research or a prototype and a sustainable business sits the commercialisation gap. Promising technologies struggle here because the work changes: from proving the technology works to proving that customers will adopt it and pay for it."
        />
        <div className="mt-14 rounded-[22px] border border-line bg-white p-4 sm:p-8">
          <ValleyChart stages={["Research", "Prototype", "Commercial Validation", "Market", "Scale"]} />
        </div>
        <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Conceptual diagram · the critical technology-readiness zone sits between prototype and commercial validation</p>
      </Section>

      <Section tone="sand" id="commercial-process">
        <SectionHeader eyebrow="Forge Commercial process" title="Scout → DownSelect → Structure → Build → Scale & Spin Out" align="split" lede="How Forge moves technology and intellectual property from the lab toward a venture." />
        <div className="mt-14">
          <Steps steps={commercialProcess} cols={5} />
        </div>
      </Section>

      <section className="border-b border-line bg-paper py-24 md:py-32">
        <div className="wrap text-center">
          <p className="eyebrow justify-center text-muted" data-reveal>Core principle</p>
          <p className="display mx-auto mt-8 max-w-4xl text-[38px] sm:text-[56px] lg:text-[68px]" data-reveal>
            Every stage should make us know more than we <span className="flame-text">knew before.</span>
          </p>
        </div>
      </section>

      <CtaBand
        title="See how Forge builds ventures."
        primary={{ label: "Explore Venture Building", href: routes.ventureBuilding }}
        secondary={cta.primary}
      />
    </>
  );
}
