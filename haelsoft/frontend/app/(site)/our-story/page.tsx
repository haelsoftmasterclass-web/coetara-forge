import { PrimaryButton, SecondaryButton } from "@/components/Buttons";
import CtaBand from "@/components/CtaBand";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import PageHero from "@/components/PageHero";
import Paragraphs from "@/components/Paragraphs";
import { Section, SectionHeading } from "@/components/Section";
import { EmptyState } from "@/components/States";
import { media } from "@/content/media";
import { getContentBlocks } from "@/lib/api/server";
import { pageMeta, routes, site } from "@/lib/site";

export const revalidate = 60;

export const metadata = pageMeta({
  title: "Our Story",
  description: "How Haelsoft Masterclass became Haelsoft EdTech, the challenge we are responding to and the principles that guide our work.",
  path: routes.story,
});

const chapters = [
  {
    eyebrow: "Where we come from",
    title: `From ${site.legacyName} to ${site.name}`,
    body: `${site.legacyName} focused on career advancement, professional learning, technology and digital skills. ${site.name} carries that purpose forward as a platform, so practical learning can reach more people in more places.`,
  },
  {
    eyebrow: "The challenge",
    title: "Skills move faster than traditional learning",
    body: "The skills employers need keep changing, and many learners cannot pause their lives to retrain. Learning has to be practical, flexible and close to the work itself.",
  },
  {
    eyebrow: "The vision",
    title: "Practical digital and professional education for Africa",
    body: "We want any motivated learner on the continent to be able to gain skills that matter for work, taught by people who practise them, in a format that fits real life.",
  },
];

const principles = [
  { title: "Truthful by default", body: "We only make claims we can evidence, and we report outcomes as we measure them." },
  { title: "Practice over theory", body: "Every course should leave learners able to do something new." },
  { title: "Built for access", body: "Design decisions start from the realities of learners' time, budgets and connectivity." },
  { title: "Respect for learners", body: "We treat learners' data, time and stories with care and ask permission before sharing." },
];

export default async function OurStoryPage() {
  const blocks = await getContentBlocks("our-story");
  const milestones = blocks.ok ? blocks.data : [];

  return (
    <>
      <PageHero
        eyebrow="Our story"
        title={<>Why we&apos;re building <span className="brand-text">Haelsoft EdTech.</span></>}
        lede={<p>A new name for a long-standing purpose: helping people gain the practical skills that move careers forward.</p>}
        crumbs={[{ label: "About", href: routes.about }, { label: "Our Story", href: routes.story }]}
        aside={<ImagePlaceholder {...media.storyWorkshop} ratio="aspect-[4/3]" />}
      />

      <Section labelledBy="chapters-title">
        <h2 id="chapters-title" className="sr-only">Our story in three parts</h2>
        <ol className="grid gap-16">
          {chapters.map((c, i) => (
            <li key={c.title} className="grid gap-6 border-t border-line pt-10 md:grid-cols-[200px_1fr] md:gap-16">
              <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-ember-deep">
                {String(i + 1).padStart(2, "0")} · {c.eyebrow}
              </p>
              <div>
                <h3 className="heading text-[28px] sm:text-[36px]">{c.title}</h3>
                <p className="prose-brand mt-5">{c.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="sand" labelledBy="principles-title">
        <SectionHeading id="principles-title" eyebrow="What guides us" title="Our principles" />
        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((p) => (
            <li key={p.title} className="card p-7">
              <h3 className="heading text-[21px]">{p.title}</h3>
              <p className="mt-3 text-[15px] text-muted">{p.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* Milestones are managed in Django (Content blocks > Our Story). Nothing is shown until staff publish confirmed details. */}
      <Section labelledBy="milestones-title">
        <SectionHeading id="milestones-title" eyebrow="Milestones" title="Our journey so far" />
        <div className="mt-12">
          {milestones.length ? (
            <ol className="grid gap-10 border-l-2 border-line pl-8">
              {milestones.map((m) => (
                <li key={m.id} className="relative">
                  <span aria-hidden="true" className="absolute -left-[41px] top-1.5 h-4 w-4 rounded-full border-4 border-white bg-flame" />
                  {m.eyebrow ? <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-ember-deep">{m.eyebrow}</p> : null}
                  <h3 className="heading mt-2 text-[24px]">{m.heading}</h3>
                  <Paragraphs text={m.body} className="mt-3" />
                </li>
              ))}
            </ol>
          ) : (
            <EmptyState title="Milestones will be published once confirmed">
              We&apos;re gathering the dates and details of our history from {site.legacyName} onwards. They&apos;ll appear here
              once they have been checked.
            </EmptyState>
          )}
        </div>
      </Section>

      <Section tone="ink" labelledBy="future-title">
        <div className="max-w-3xl">
          <p className="eyebrow text-white/65">What&apos;s next</p>
          <h2 id="future-title" className="display mt-6 text-[36px] sm:text-[50px]">A platform that grows with its learners.</h2>
          <p className="mt-6 text-[17px] text-white/70">
            This website is the first phase. Courses, learner accounts, scholarships, certificates and corporate training will
            follow, each launched when it is ready.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <PrimaryButton href={routes.impact} tone="brand">How we&apos;ll measure impact</PrimaryButton>
            <SecondaryButton href={routes.team}>Meet the team</SecondaryButton>
          </div>
        </div>
      </Section>

      <CtaBand
        eyebrow="Be part of it"
        title="Help shape what we build first."
        body="Tell us what you want to learn, teach or build with us."
        primary={{ label: "Contact us", href: routes.contact }}
        secondary={{ label: "About Haelsoft EdTech", href: routes.about }}
      />
    </>
  );
}
