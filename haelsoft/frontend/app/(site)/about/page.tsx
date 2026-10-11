import { PrimaryButton, SecondaryButton } from "@/components/Buttons";
import CtaBand from "@/components/CtaBand";
import { Check, Ribbon } from "@/components/Icons";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import JsonLd from "@/components/JsonLd";
import Markets from "@/components/Markets";
import PageHero from "@/components/PageHero";
import { Section, SectionHeading } from "@/components/Section";
import { media } from "@/content/media";
import { getSiteSettings } from "@/lib/api/server";
import { primaryCtas } from "@/lib/ctas";
import { SITE_URL, contactHref, pageMeta, routes, site } from "@/lib/site";

export const revalidate = 60;

export const metadata = pageMeta({
  title: "About Haelsoft EdTech",
  description:
    "What Haelsoft EdTech is, who it is for, the learning problems it aims to solve and how the platform will grow across Africa.",
  path: routes.about,
});

const audiences = [
  { title: "Early-career learners", body: "People preparing for their first role who need practical, job-relevant skills." },
  { title: "Working professionals", body: "People who want to grow in their current role or move into a new field." },
  { title: "Career changers", body: "People retraining for digital, technology and professional careers." },
  { title: "Organisations", body: "Employers and institutions looking to develop the skills of their people." },
];

const problems = [
  "Learning that stays theoretical and doesn't translate into work people can do.",
  "Courses that aren't built for learners balancing study with jobs and family.",
  "Limited access to instructors with current, hands-on industry experience.",
  "Cost and connectivity barriers that put good learning out of reach.",
];

const approach = [
  { title: "Practice first", body: "Lessons are built around tasks that mirror the work, so skills are applied, not just described." },
  { title: "Taught by practitioners", body: "Instructors are people who use these skills in their own work." },
  { title: "Structured paths", body: "Clear sequences of learning with defined outcomes for each step." },
  { title: "Built for real conditions", body: "Online learning designed for people learning on the move and around work." },
];

const today = [
  "This website, with information about Haelsoft EdTech",
  "Instructor profiles and the team behind the platform",
  "Enquiries for learning, teaching, partnerships and corporate training",
];

const later = [
  "Course catalogue and course pages",
  "Learner accounts, enrolment and progress tracking",
  "Scholarship applications",
  "Assessments and certificates",
  "Corporate training programmes",
  "A mobile app",
];

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const { courses } = primaryCtas(settings);
  return (
    <>
      <PageHero
        eyebrow="About Haelsoft EdTech"
        title={<>A learning platform for <span className="brand-text">Africa&apos;s next careers.</span></>}
        lede={
          <p>
            Haelsoft EdTech is the next chapter of {site.legacyName}. We are building an online learning platform that helps
            people across Africa gain practical, career-focused skills.
          </p>
        }
        crumbs={[{ label: "About", href: routes.about }]}
        actions={
          <>
            <PrimaryButton href={routes.instructors}>Meet our instructors</PrimaryButton>
            <SecondaryButton href={routes.contact}>Contact us</SecondaryButton>
          </>
        }
        aside={<ImagePlaceholder {...media.aboutLearners} ratio="aspect-[4/3]" />}
      />

      <Section labelledBy="who-title">
        <SectionHeading id="who-title" eyebrow="Who it's for" title="Built for people who learn to move forward" />
        <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {audiences.map((a) => (
            <li key={a.title} className="card p-7">
              <Ribbon />
              <h3 className="heading mt-5 text-[21px]">{a.title}</h3>
              <p className="mt-3 text-[15px] text-muted">{a.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="sand" labelledBy="problem-title">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <SectionHeading
            id="problem-title"
            eyebrow="The problem"
            title="Too much learning stops short of real work"
            lede="These are the gaps we have set out to address."
          />
          <ol className="border-t border-line">
            {problems.map((p, i) => (
              <li key={p} className="flex gap-6 border-b border-line py-5">
                <span className="font-mono text-[12px] text-ember-deep">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[17px]">{p}</span>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <Section labelledBy="approach-title">
        <SectionHeading id="approach-title" eyebrow="Our approach" title="How we design learning" layout="split" lede="Four principles shape every course we will publish." />
        <ul className="mt-14 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {approach.map((a) => (
            <li key={a.title} className="bg-white p-7">
              <h3 className="heading text-[21px]">{a.title}</h3>
              <p className="mt-3 text-[15px] text-muted">{a.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="ink" labelledBy="ambition-title">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <div>
            <p className="eyebrow text-white/65">Pan-African ambition</p>
            <h2 id="ambition-title" className="display mt-6 text-[36px] sm:text-[50px]">One platform, many markets.</h2>
            <p className="mt-6 max-w-lg text-[17px] text-white/70">
              We are starting in our home market and preparing to serve learners in more countries. The markets below are our
              initial focus; each shows its current status. Planned markets are not yet operational.
            </p>
          </div>
          <div className="self-center">
            <Markets markets={settings.markets} dark />
          </div>
        </div>
      </Section>

      <Section labelledBy="now-title">
        <SectionHeading id="now-title" eyebrow="Today and next" title="What's available now, and what's coming" />
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <div className="card p-8">
            <h3 className="heading text-[22px]">Available today</h3>
            <ul className="mt-6 grid gap-3">
              {today.map((t) => (
                <li key={t} className="flex gap-3 text-[16px]"><Check className="mt-1 shrink-0 text-success" />{t}</li>
              ))}
            </ul>
          </div>
          <div className="card bg-sand p-8">
            <h3 className="heading flex items-center gap-3 text-[22px]">Coming in later phases <span className="tag tag-soon">Planned</span></h3>
            <ul className="mt-6 grid gap-3">
              {later.map((t) => (
                <li key={t} className="flex gap-3 text-[16px] text-ink-2"><span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-flame" />{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <CtaBand
        eyebrow="Next steps"
        title="Find out more about learning with us."
        primary={{ label: courses.live ? "Explore Courses" : "Register your interest", href: courses.live ? courses.href : contactHref("learning", "Course updates") }}
        secondary={{ label: "Read our story", href: routes.story }}
      />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "About Haelsoft EdTech",
          url: `${SITE_URL}${routes.about}`,
          about: { "@type": "EducationalOrganization", name: site.name, url: SITE_URL },
        }}
      />
    </>
  );
}
