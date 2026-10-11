import Link from "next/link";
import { PrimaryButton, SecondaryButton, TextLink } from "@/components/Buttons";
import { InstructorCard, PartnerCard, TestimonialCard } from "@/components/Cards";
import CtaBand from "@/components/CtaBand";
import { Ribbon } from "@/components/Icons";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import Markets from "@/components/Markets";
import { Section, SectionHeading } from "@/components/Section";
import { ErrorState } from "@/components/States";
import { learningAims, learningAreas, learningJourney } from "@/content/learning";
import { media } from "@/content/media";
import { getInstructors, getPartners, getSiteSettings, getTestimonials } from "@/lib/api/server";
import { primaryCtas } from "@/lib/ctas";
import { contactHref, pageMeta, routes } from "@/lib/site";

export const revalidate = 60;

export const metadata = pageMeta({
  title: "Haelsoft EdTech | Practical, career-focused learning for Africa",
  description:
    "Haelsoft EdTech is building practical, career-focused online learning for people across Africa, starting in Nigeria. Meet our instructors and register your interest.",
  path: routes.home,
  absoluteTitle: true,
});

export default async function HomePage() {
  const [settings, featured, testimonials, partners] = await Promise.all([
    getSiteSettings(),
    getInstructors({ featured: true, pageSize: 3 }),
    getTestimonials({ featured: false }),
    getPartners(),
  ]);
  const { courses, scholarships } = primaryCtas(settings);
  const homeMarket = settings.markets.find((m) => m.is_home_market);
  const scholarshipOpen = scholarships.live;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line bg-paper">
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full bg-[radial-gradient(closest-side,rgba(255,154,31,0.2),rgba(242,80,10,0.07),transparent)]" />
        <div className="wrap relative grid gap-12 pb-16 pt-12 md:pb-24 md:pt-20 lg:grid-cols-[1.25fr_1fr] lg:items-center lg:gap-16">
          <div>
            <p className="eyebrow rise text-muted">Haelsoft EdTech · Learning for Africa</p>
            <h1 className="display rise-2 mt-6 text-[42px] sm:text-[60px] lg:text-[76px]">
              Practical skills for the careers <span className="brand-text">you&apos;re building.</span>
            </h1>
            <p className="lede rise-3 mt-7 text-[19px] sm:text-[21px]">
              We&apos;re building a learning platform for people across Africa who want job-ready digital, technology and
              professional skills, taught by practitioners and structured to fit around work and life.
            </p>
            <div className="rise-3 mt-10 flex flex-wrap gap-3">
              <PrimaryButton href={courses.href} badge={courses.live ? undefined : "Coming soon"}>{courses.label}</PrimaryButton>
              <SecondaryButton href={routes.instructors}>Meet our instructors</SecondaryButton>
            </div>
          </div>
          <ImagePlaceholder {...media.homeHero} className="rise-3" />
        </div>
      </section>

      {/* Credibility strip: only facts supplied in the brief, read from Django */}
      <section aria-label="About Haelsoft EdTech" className="border-b border-line bg-sand">
        <div className="wrap grid gap-8 py-10 md:grid-cols-[1fr_2fr] md:items-center">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Formerly Haelsoft Masterclass</p>
            <p className="mt-2 text-[17px] font-semibold">
              {homeMarket ? `Starting in ${homeMarket.name}, designed for Africa.` : "Designed for learners across Africa."}
            </p>
          </div>
          <Markets markets={settings.markets} />
        </div>
      </section>

      {/* Learning areas */}
      <Section id="learning-areas" labelledBy="learning-areas-title">
        <SectionHeading
          id="learning-areas-title"
          eyebrow="What you'll be able to learn"
          title="Learning areas we're preparing"
          layout="split"
          lede={
            courses.live ? (
              "Browse the full course catalogue to see what is available now."
            ) : (
              <>
                The full course catalogue arrives in a later phase of the platform. <strong className="text-ink">Courses are not open
                for enrolment yet.</strong> Tell us what you want to learn and we&apos;ll let you know when they are.
              </>
            )
          }
        >
          <div>
            {courses.live ? (
              <PrimaryButton href={courses.href}>Explore Courses</PrimaryButton>
            ) : (
              <SecondaryButton href={contactHref("learning", "Course updates")}>Register your interest</SecondaryButton>
            )}
          </div>
        </SectionHeading>
        <ul className="mt-14 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {learningAreas.map((area, i) => (
            <li key={area.title} className="flex flex-col bg-white p-7">
              <span className="font-mono text-[12px] text-ember-deep">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="heading mt-6 text-[22px]">{area.title}</h3>
              <p className="mt-3 text-[15px] text-muted">{area.body}</p>
              {!courses.live ? <span className="tag tag-soon mt-6 self-start">Coming soon</span> : null}
            </li>
          ))}
        </ul>
      </Section>

      {/* Why learn with Haelsoft */}
      <Section tone="ink" labelledBy="why-title">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
          <div>
            <p className="eyebrow text-white/65">Why Haelsoft EdTech</p>
            <h2 id="why-title" className="display mt-6 text-[38px] sm:text-[52px]">
              Learning built around <span className="brand-text">real work.</span>
            </h2>
            <p className="mt-6 max-w-md text-[17px] text-white/70">
              These are the principles we are designing the platform around. We will report on how well we deliver them as
              learners start using it.
            </p>
          </div>
          <ul className="grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line-dark bg-line-dark sm:grid-cols-2">
            {learningAims.map((aim) => (
              <li key={aim.title} className="bg-night p-7">
                <Ribbon />
                <h3 className="heading mt-5 text-[21px]">{aim.title}</h3>
                <p className="mt-3 text-[15px] text-white/70">{aim.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Featured instructors (Django) */}
      <Section labelledBy="instructors-title">
        <SectionHeading
          id="instructors-title"
          eyebrow="Our instructors"
          title="Learn from people who do the work"
          layout="split"
          lede="Our instructors are practitioners. Their profiles show their experience and areas of expertise."
        >
          <div><TextLink href={routes.instructors}>See all instructors</TextLink></div>
        </SectionHeading>
        <div className="mt-14">
          {!featured.ok ? (
            <ErrorState title="Instructor profiles are unavailable right now">
              Please try again shortly, or visit the <Link href={routes.instructors} className="underline">instructors page</Link>.
            </ErrorState>
          ) : featured.data.results.length ? (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.data.results.map((instructor) => (
                <li key={instructor.slug} className="flex"><InstructorCard instructor={instructor} /></li>
              ))}
            </ul>
          ) : (
            <div className="card flex flex-col items-start gap-4 p-8 md:flex-row md:items-center md:justify-between">
              <p className="text-[17px] text-muted">Instructor profiles will appear here as they are published.</p>
              <TextLink href={contactHref("instructor", "Teaching with Haelsoft")}>Interested in teaching?</TextLink>
            </div>
          )}
        </div>
      </Section>

      {/* Scholarship campaign (driven by Django site settings) */}
      <Section id="scholarships" tone="sand" labelledBy="scholarships-title">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-16">
          <div>
            <p className="eyebrow text-muted">Scholarships</p>
            <h2 id="scholarships-title" className="heading mt-5 text-[32px] sm:text-[42px] lg:text-[50px]">
              {settings.scholarship_headline || "Scholarships to widen access to learning"}
            </h2>
            <div className="lede mt-6">
              {settings.scholarship_summary ? (
                <p>{settings.scholarship_summary}</p>
              ) : (
                <p>
                  We plan to offer scholarships so that cost is less of a barrier to practical, career-focused learning.
                  Eligibility, dates and the number of places will be announced here.
                </p>
              )}
            </div>
          </div>
          <div className="card p-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Application status</p>
            <p className="heading mt-3 text-[26px]">
              {scholarshipOpen
                ? "Applications are open"
                : settings.scholarship_status === "closed"
                  ? "Applications are closed"
                  : "Applications are not open yet"}
            </p>
            <p className="mt-3 text-[15px] text-muted">
              {scholarshipOpen
                ? "Read the eligibility criteria carefully before you apply."
                : "Register your interest and we'll contact you when there is news about scholarships."}
            </p>
            <div className="mt-7">
              {scholarshipOpen ? (
                <PrimaryButton href={scholarships.href}>Apply for a Scholarship</PrimaryButton>
              ) : (
                <PrimaryButton href={contactHref("learning", "Scholarship updates")}>Get scholarship updates</PrimaryButton>
              )}
            </div>
          </div>
        </div>
      </Section>

      {/* Learning journey */}
      <Section labelledBy="journey-title">
        <SectionHeading id="journey-title" eyebrow="How it will work" title="Your learning journey" lede="The path we are designing for every Haelsoft learner." />
        <ol className="mt-14 grid gap-6 md:grid-cols-4">
          {learningJourney.map((step, i) => (
            <li key={step.title} className="relative border-t-2 border-line pt-6">
              <span aria-hidden="true" className="absolute -top-[2px] left-0 h-[2px] w-12" style={{ background: "var(--brand-gradient)" }} />
              <span className="font-mono text-[12px] text-ember-deep">Step {i + 1}</span>
              <h3 className="heading mt-3 text-[22px]">{step.title}</h3>
              <p className="mt-3 text-[15px] text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Testimonials: only consented, published records; otherwise the section is omitted */}
      {testimonials.ok && testimonials.data.results.length ? (
        <Section tone="sand" labelledBy="voices-title">
          <SectionHeading id="voices-title" eyebrow="Learner voices" title="In their own words" layout="split">
            <div><TextLink href={routes.testimonials}>Read all testimonials</TextLink></div>
          </SectionHeading>
          <ul className="mt-14 grid gap-6 md:grid-cols-3">
            {testimonials.data.results.slice(0, 3).map((t) => (
              <li key={t.id}><TestimonialCard testimonial={t} /></li>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* Partners: only approved records; otherwise the section is omitted */}
      {partners.ok && partners.data.results.length ? (
        <Section labelledBy="partners-title">
          <SectionHeading id="partners-title" eyebrow="Partners" title="Working with organisations that share our goals" layout="split">
            <div><TextLink href={routes.partners}>See all partners</TextLink></div>
          </SectionHeading>
          <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {partners.data.results.slice(0, 4).map((p) => (
              <li key={p.slug} className="flex"><PartnerCard partner={p} /></li>
            ))}
          </ul>
        </Section>
      ) : null}

      <CtaBand
        eyebrow="Get in touch"
        title="Ready to learn, teach or partner with us?"
        body="Tell us what you're looking for. We'll use your message to shape what we launch first and to keep you informed."
        primary={{ label: "Contact us", href: routes.contact }}
        secondary={{ label: "About Haelsoft EdTech", href: routes.about }}
      />
    </>
  );
}
