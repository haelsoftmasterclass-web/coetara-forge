import { Section, SectionHeader } from "@/components/Section";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import Checklist from "@/components/Checklist";
import WeekTimeline from "@/components/WeekTimeline";
import AfricaMap from "@/components/AfricaMap";
import Flow from "@/components/Flow";
import Disclaimer from "@/components/Disclaimer";
import { TextLink } from "@/components/Button";
import { currentCohort } from "@/content/cohorts";
import { disclaimer } from "@/content/faq";
import { pageMeta, routes } from "@/lib/site";

export const metadata = pageMeta({
  title: "Coetara Forge Cohort 01 | 10-Week Venture Incubator",
  description:
    "Cohort 01 of the Coetara Forge 10-Week Venture Incubator: a hands-on venture-building programme for exceptional individuals across Africa. You do not need to already be a founder. Apply for Cohort 01.",
  path: routes.cohort01,
  absoluteTitle: true,
});

const apply = { label: "Apply for Cohort 01", href: routes.apply, track: "apply_cta" };

const verbs = ["Discovering.", "Validating.", "Forming.", "Building.", "Launching.", "Measuring.", "Refining.", "Preparing for the next stage."];

const builders = [
  ["Tech Builder", "Engineers and developers who can turn problems into working technology."],
  ["Product Builder", "People who understand users, products and experiences."],
  ["Business Builder", "Commercial thinkers who understand markets, sales and growth."],
  ["Domain Expert", "People with deep knowledge of industries and difficult problems."],
  ["Researcher", "People working on technology, science or research with commercial potential."],
  ["Creative", "People who can turn ideas into compelling products, brands and experiences."],
  ["Operator", "People who understand how to make things happen."],
];

const dontNeed = ["A registered company", "A perfect business plan", "A polished pitch deck", "A fully developed product", "A large founding team"];
const doNeed = ["Capability", "Curiosity", "Problem-solving ability", "Commercial thinking", "The willingness to build"];

const philosophy = [
  ["Customer conversations", "assumptions"],
  ["Working products", "endless presentations"],
  ["Real transactions", "theoretical business models"],
  ["Evidence", "hype"],
  ["Iteration", "attachment"],
];

const capabilities = ["Technical", "Commercial", "Creative", "Operational", "Research", "Domain"];

export default function Cohort01() {
  // Dates, format and fee come from content/cohorts.json (editable in the CMS) and read
  // "To be announced / To be confirmed" until Coetara confirms them. [CONFIRM]
  const facts = [
    ["Programme", "10-Week Venture Incubator"],
    ["Pathway", "Forge Launch"],
    ["Start date", currentCohort.dates],
    ["Format", currentCohort.format],
    ["Fee", currentCohort.fee],
    ["Ends with", "Forge Demo Day"],
  ];
  return (
    <>
      <PageHero
        eyebrow="Cohort 01 · 10-Week Venture Incubator"
        title={<>10 Weeks. <br className="hidden sm:block" />From Potential <span className="flame-text">to Venture.</span></>}
        lede={
          <>
            <p>
              Coetara Forge Cohort 01 is the first operating expression of Forge Launch: a hands-on venture-building programme for exceptional individuals who want to build technology-enabled businesses.
            </p>
            <p className="mt-5 font-semibold text-ink">
              You do not need to already be a founder. <br className="hidden sm:block" />You need the potential to become one.
            </p>
          </>
        }
        primary={apply}
        secondary={{ label: "Explore How It Works", href: "#how-it-works" }}
        aside={
          <div className="overflow-hidden rounded-[22px] border border-line bg-white">
            <div className="flex items-center justify-between gap-4 bg-ink px-5 py-4 text-white sm:px-6">
              <p className="heading text-[22px]">{currentCohort.name}</p>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-amber">
                <span className="h-1.5 w-1.5 rounded-full bg-amber" aria-hidden="true" />
                {currentCohort.status}
              </span>
            </div>
            <dl className="grid grid-cols-2 gap-px bg-line">
              {facts.map(([k, v]) => (
                <div key={k} className="bg-white p-5 sm:p-6">
                  <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">{k}</dt>
                  <dd className={`heading mt-2 text-[18px] sm:text-[20px] ${v.startsWith("To be") ? "text-ink/45" : ""}`}>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        }
      />

      {/* NOT ANOTHER PROGRAMME */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div data-reveal>
            <p className="eyebrow text-muted">Built around evidence</p>
            <h2 className="heading mt-5 text-[34px] sm:text-[46px] lg:text-[52px]">This Is Not Another Entrepreneurship Programme.</h2>
            <p className="lede mt-6">
              Participants do not spend 10 weeks listening to theory or collecting certificates. They spend them building a company, and producing the evidence to show whether it should exist.
            </p>
          </div>
          <div data-reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Ten weeks of</p>
            <ol className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-[22px] border border-line bg-line">
              {verbs.map((v, i) => (
                <li key={v} className={`flex min-h-[104px] flex-col justify-between p-5 ${i === verbs.length - 1 ? "bg-ink text-white" : "bg-white"}`}>
                  <span className={`font-mono text-[11px] ${i === verbs.length - 1 ? "text-amber" : "text-ember-deep"}`}>{String(i + 1).padStart(2, "0")}</span>
                  <span className="heading text-[19px] sm:text-[22px]">{v}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      {/* THE 10 WEEKS */}
      <section id="how-it-works" className="on-dark scroll-mt-24 bg-night py-20 text-white md:py-28">
        <div className="wrap">
          <SectionHeader
            eyebrow="The 10 weeks"
            title="One mission. Ten outputs."
            align="split"
            lede="The programme moves from discovery to building to market evidence to investment readiness. Every week ends with something real that the next week depends on."
          />
          <div className="mt-14">
            <WeekTimeline />
          </div>
        </div>
      </section>

      {/* WHO SHOULD APPLY */}
      <Section>
        <SectionHeader
          eyebrow="Who should apply?"
          title="Seven kinds of builder. One founding team."
          align="split"
          lede="Forge is looking for exceptional people with capabilities that can contribute to building a company. Strong ventures need more than one kind of builder, so Forge forms complementary teams."
        />
        <ul className="mt-14 grid gap-px overflow-hidden rounded-[22px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {builders.map(([name, body], i) => (
            <li key={name} className="flex min-h-[210px] flex-col bg-white p-7 transition-colors hover:bg-sand" data-reveal>
              <span className="font-mono text-[12px] text-ember-deep">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="heading mt-auto text-[24px] sm:text-[26px]">{name}</h3>
              <p className="mt-3 text-[15.5px] text-muted">{body}</p>
            </li>
          ))}
          <li className="flex min-h-[210px] flex-col justify-between bg-ink p-7 text-white" data-reveal>
            <span className="font-mono text-[12px] text-amber">You?</span>
            <div>
              <p className="heading text-[22px]">Not sure where you fit?</p>
              <a href={apply.href} className="mt-4 inline-flex items-center gap-2 font-semibold text-amber underline-offset-4 hover:underline" data-track={apply.track}>
                Apply and tell us
              </a>
            </div>
          </li>
        </ul>
      </Section>

      {/* DON'T NEED / DO NEED */}
      <Section tone="sand">
        <SectionHeader eyebrow="Before you apply" title="What you need, and what you don't." />
        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          <div className="rounded-[22px] border border-line bg-white p-7 sm:p-10" data-reveal>
            <h3 className="heading text-[28px] sm:text-[34px]">You Do Not Need…</h3>
            <div className="mt-6">
              <Checklist items={dontNeed} kind="cross" />
            </div>
          </div>
          <div className="on-dark rounded-[22px] bg-night p-7 text-white sm:p-10" data-reveal>
            <h3 className="heading text-[28px] sm:text-[34px]">You Do <span className="flame-text">Need…</span></h3>
            <div className="mt-6">
              <Checklist items={doNeed} kind="check" dark />
            </div>
          </div>
        </div>
      </Section>

      {/* BUILD TEST LEARN REPEAT */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.2fr] lg:gap-20">
          <div data-reveal>
            <p className="eyebrow text-muted">The Forge philosophy</p>
            <h2 className="display mt-6 text-[44px] sm:text-[60px] lg:text-[68px]">
              Build. Test. Learn. <span className="flame-text">Repeat.</span>
            </h2>
            <p className="lede mt-6">Every week, participants put their work in front of real customers and real markets, then let the evidence decide what happens next.</p>
          </div>
          <ol className="self-end border-t border-ink" data-reveal>
            {philosophy.map(([yes, no], i) => (
              <li key={yes} className="grid grid-cols-[36px_1fr] items-baseline gap-x-3 border-b border-line py-5 sm:grid-cols-[44px_1.1fr_auto_1fr] sm:gap-x-5">
                <span className="font-mono text-[12px] text-ember-deep">{String(i + 1).padStart(2, "0")}</span>
                <span className="heading text-[22px] sm:text-[24px]">{yes}</span>
                <span className="col-start-2 font-mono text-[11px] uppercase tracking-[0.14em] text-faint sm:col-start-auto">instead of</span>
                <span className="col-start-2 text-[17px] text-muted line-through decoration-flame/60 sm:col-start-auto">{no}</span>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* WHO IS THIS FOR */}
      <section className="on-dark relative overflow-hidden bg-night py-20 text-white md:py-28">
        <div className="wrap grid items-center gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div data-reveal>
            <p className="eyebrow text-white/55">Who is this for?</p>
            <h2 className="heading mt-5 text-[34px] sm:text-[46px]">Exceptional individuals across Africa, ready to build.</h2>
            <p className="lede mt-6">
              Cohort 01 is for people with strong technical, commercial, creative, operational, research or domain capabilities who want to build technology-enabled businesses. You do not need to already run a company to apply.
            </p>
            <ul className="mt-10 flex flex-wrap gap-2.5">
              {capabilities.map((c) => (
                <li key={c} className="rounded-full border border-line-dark px-4 py-2 text-[15px] font-semibold text-white/85">{c}</li>
              ))}
            </ul>
          </div>
          <div data-reveal>
            <AfricaMap dark className="mx-auto w-full max-w-[460px]" />
          </div>
        </div>
      </section>

      {/* AFTER 10 WEEKS */}
      <Section tone="sand">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div data-reveal>
            <p className="eyebrow text-muted">After 10 weeks</p>
            <h2 className="heading mt-5 text-[34px] sm:text-[46px]">Every venture earns its next step.</h2>
            <p className="lede mt-6">
              The strongest ventures may progress into next-stage venture building, investment or portfolio support, subject to evidence, diligence, approvals and separate arrangements.
            </p>
            <p className="mt-8 rounded-xl border border-flame/30 bg-[#fff6ee] p-5 text-[15px] text-ink-2">
              <span className="font-semibold text-ember-deep">Participation does not guarantee investment.</span> Investment is an outcome earned through evidence, never a promise made at the start.
            </p>
          </div>
          <div className="self-center" data-reveal>
            <div className="rounded-[22px] border border-line bg-white p-6 sm:p-8">
              <Flow steps={["10 weeks", "Forge Demo Day", "Decision"]} />
              <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Possible next stages</p>
              <ol className="mt-3 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
                {["Next-stage venture building", "Investment", "Portfolio support"].map((x, i) => (
                  <li key={x} className="bg-sand p-4">
                    <span className="font-mono text-[11px] text-ember-deep">{String(i + 1).padStart(2, "0")}</span>
                    <p className="heading mt-2 text-[17px]">{x}</p>
                  </li>
                ))}
              </ol>
            </div>
            <div className="mt-6">
              <TextLink href={routes.faq}>Questions before you apply</TextLink>
            </div>
          </div>
        </div>
      </Section>

      <CtaBand
        title={<>The Next Great African Company Could Start <span className="flame-text">With You.</span></>}
        body="Applications for Cohort 01 are open to exceptional individuals across Africa, with or without a company."
        primary={apply}
        secondary={{ label: "Explore How It Works", href: "#how-it-works" }}
        eyebrow="Cohort 01 · Build What Comes Next"
      />

      <Disclaimer>{disclaimer}</Disclaimer>
    </>
  );
}
