import { ImpactMetric } from "@/components/Cards";
import CtaBand from "@/components/CtaBand";
import PageHero from "@/components/PageHero";
import { Section, SectionHeading } from "@/components/Section";
import { EmptyState, ErrorState } from "@/components/States";
import { getImpactMetrics } from "@/lib/api/server";
import type { ImpactMetric as Metric } from "@/lib/api/types";
import { contactHref, pageMeta, routes } from "@/lib/site";

export const revalidate = 60;

export const metadata = pageMeta({
  title: "Our Impact",
  description:
    "How Haelsoft EdTech will measure and report learning outcomes: access, skills, engagement, completion, scholarships and career progression.",
  path: routes.impact,
});

const framework: { area: Metric["area"]; title: string; question: string; measures: string }[] = [
  { area: "access", title: "Access to learning", question: "Who are we reaching?", measures: "Learners registered and enrolled, by country and background." },
  { area: "skills", title: "Skills developed", question: "What can learners now do?", measures: "Assessed skills and completed practical projects." },
  { area: "engagement", title: "Learner engagement", question: "Are learners actively learning?", measures: "Active learning time, lesson progress and participation." },
  { area: "completion", title: "Course completion", question: "Do learners finish what they start?", measures: "Completion rates per course, reported with the size of each group." },
  { area: "scholarships", title: "Scholarships", question: "Are we widening access?", measures: "Scholarships awarded and the progress of scholarship learners." },
  { area: "careers", title: "Career progression", question: "Does learning change careers?", measures: "Self-reported job changes, promotions and new opportunities after learning." },
];

const reportingRules = [
  "Every figure carries the date it was measured and the source it comes from.",
  "We publish a figure only after checking it against its source.",
  "We report small or early numbers honestly rather than waiting for big ones.",
  "Where a figure is self-reported by learners, we say so.",
];

export default async function OurImpactPage() {
  const metrics = await getImpactMetrics();

  return (
    <>
      <PageHero
        eyebrow="Our impact"
        title={<>Impact we&apos;ll <span className="brand-text">prove, not claim.</span></>}
        lede={
          <p>
            We will judge Haelsoft EdTech by what changes for learners. This page sets out what we will measure and how we will
            report it. Verified results will be published here as evidence becomes available.
          </p>
        }
        crumbs={[{ label: "About", href: routes.about }, { label: "Our Impact", href: routes.impact }]}
      />

      <Section labelledBy="results-title">
        <SectionHeading id="results-title" eyebrow="Verified results" title="Published outcomes" />
        <div className="mt-12">
          {!metrics.ok ? (
            <ErrorState title="Results are unavailable right now" />
          ) : metrics.data.length ? (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {metrics.data.map((m) => (
                <li key={m.id} className="flex"><ImpactMetric metric={m} /></li>
              ))}
            </ul>
          ) : (
            <EmptyState title="No outcome figures published yet">
              Our learning platform is in its first phase, so there are no verified learner outcomes to report yet. We will
              publish dated, sourced figures here as evidence becomes available, and we won&apos;t publish estimates in their place.
            </EmptyState>
          )}
        </div>
      </Section>

      <Section tone="sand" labelledBy="framework-title">
        <SectionHeading
          id="framework-title"
          eyebrow="Impact framework"
          title="Six areas we will measure"
          layout="split"
          lede="Each area answers one question about whether learning is working for the people it is meant to serve."
        />
        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {framework.map((f, i) => (
            <li key={f.area} className="card flex flex-col p-7">
              <span className="font-mono text-[12px] text-ember-deep">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="heading mt-5 text-[22px]">{f.title}</h3>
              <p className="mt-2 text-[16px] font-medium text-ink-2">{f.question}</p>
              <p className="mt-3 text-[15px] text-muted">
                <span className="font-semibold text-ink-2">What we&apos;ll track: </span>
                {f.measures}
              </p>
            </li>
          ))}
        </ul>
      </Section>

      <Section labelledBy="rules-title">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <SectionHeading id="rules-title" eyebrow="Reporting standards" title="How we'll report" lede="The rules every number on this page follows." />
          <ol className="border-t border-line">
            {reportingRules.map((r, i) => (
              <li key={r} className="flex gap-6 border-b border-line py-5">
                <span className="font-mono text-[12px] text-ember-deep">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[17px]">{r}</span>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <CtaBand
        eyebrow="Work with us"
        title="Interested in measuring impact together?"
        body="We welcome conversations with organisations that want to fund, evaluate or expand access to practical learning."
        primary={{ label: "Discuss a partnership", href: contactHref("partnership", "Impact partnership") }}
        secondary={{ label: "Our partners", href: routes.partners }}
      />
    </>
  );
}
