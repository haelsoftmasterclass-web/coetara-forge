import { Section, SectionHeader } from "@/components/Section";
import PageHero from "@/components/PageHero";
import Checklist from "@/components/Checklist";
import CtaBand from "@/components/CtaBand";
import Photo from "@/components/Photo";
import { media } from "@/content/media";
import { cta, pageMeta, routes } from "@/lib/site";

export const metadata = pageMeta({
  title: "Apply to Coetara Forge | Founder & Builder Applications",
  description:
    "Forge looks for tech builders, product builders, business builders, domain experts, researchers, creatives and operators across Africa. You do not need to already be a founder.",
  path: routes.whoWeLookFor,
  absoluteTitle: true,
});

const people = [
  ["Tech Builders", "Engineers and developers who can turn problems into working technology."],
  ["Product Builders", "People who understand users, products and experiences."],
  ["Business Builders", "Commercial thinkers who understand markets, sales and growth."],
  ["Domain Experts", "People with deep knowledge of industries and difficult problems."],
  ["Researchers", "People working on technology, science or research with commercial potential."],
  ["Creatives", "People who can turn ideas into compelling products, brands and experiences."],
  ["Operators", "People who understand how to make things happen."],
];

export default function WhoWeLookFor() {
  return (
    <>
      <PageHero
        eyebrow="Who we're looking for"
        title={<>Exceptional People. <span className="flame-text">Unfinished Potential.</span></>}
        lede={
          <>
            You do not need to already be a founder to become one. Forge looks for people with the capability and ambition to build something meaningful.
          </>
        }
        primary={cta.primary}
        aside={<Photo slot={media.whoHero} ratio="aspect-[4/5]" className="mx-auto max-w-[460px]" />}
      />

      <Section>
        <SectionHeader eyebrow="People we look for" title="Seven kinds of capability. One founding team." align="split" lede="Strong ventures need more than one kind of builder. Forge brings complementary people together." />
        <ul className="mt-14 grid gap-px overflow-hidden rounded-[22px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {people.map(([name, body], i) => (
            <li key={name} className="flex min-h-[230px] flex-col bg-white p-7 transition-colors hover:bg-sand" data-reveal>
              <span className="font-mono text-[12px] text-ember-deep">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="heading mt-auto text-[26px]">{name}</h3>
              <p className="mt-3 text-[15.5px] text-muted">{body}</p>
            </li>
          ))}
          <li className="flex min-h-[230px] flex-col justify-between bg-ink p-7 text-white" data-reveal>
            <span className="font-mono text-[12px] text-amber">You?</span>
            <div>
              <p className="heading text-[24px]">Not sure where you fit?</p>
              <a href={cta.primary.href} className="mt-4 inline-flex items-center gap-2 font-semibold text-amber underline-offset-4 hover:underline" data-track="apply_cta">Apply and tell us</a>
            </div>
          </li>
        </ul>
      </Section>

      <Section tone="sand">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
          <div data-reveal>
            <p className="eyebrow text-muted">What you don&apos;t need</p>
            <h2 className="heading mt-5 text-[34px] sm:text-[44px]">Leave these at the door.</h2>
            <p className="lede mt-5">You do not necessarily need:</p>
            <div className="mt-6">
              <Checklist kind="cross" items={["A registered company", "A perfect business plan", "A polished pitch deck", "A fully developed product", "A large team"]} />
            </div>
          </div>
          <div data-reveal>
            <p className="eyebrow text-muted">What we look for</p>
            <h2 className="heading mt-5 text-[34px] sm:text-[44px]">Bring these instead.</h2>
            <p className="lede mt-5">What we assess in every application:</p>
            <div className="mt-6">
              <Checklist
                kind="check"
                cols={2}
                items={["Capability", "Curiosity", "Problem-solving ability", "Domain understanding", "Commercial thinking", "Execution ability", "Adaptability", "Commitment", "Willingness to learn"]}
              />
            </div>
          </div>
        </div>
      </Section>

      <CtaBand
        title="You May Not Have a Company Yet. That's Okay."
        body="Tell us what you can build and which problems you understand. We will look at the person first."
        secondary={{ label: "Read the FAQ", href: routes.faq }}
        eyebrow="Cohort 01"
      />
    </>
  );
}
