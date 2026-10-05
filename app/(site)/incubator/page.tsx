import { Section, SectionHeader } from "@/components/Section";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import BuildLoop from "@/components/BuildLoop";
import FaqList from "@/components/FaqList";
import Photo from "@/components/Photo";
import { TextLink } from "@/components/Button";
import { Cross } from "@/components/Icons";
import { curriculum } from "@/content/curriculum";
import { faqs } from "@/content/faq";
import { media } from "@/content/media";
import { cta, pageMeta, routes } from "@/lib/site";
import { currentCohort } from "@/content/cohorts";

export const metadata = pageMeta({
  title: "10-Week Venture Incubator | Coetara Forge",
  description:
    "A hands-on 10-week startup incubator for exceptional African builders. Research, customer discovery, MVPs, market testing and investment readiness. Apply for Cohort 01.",
  path: routes.incubator,
  absoluteTitle: true,
});

const roles = ["Tech Builder", "Product Builder", "Business Builder", "Domain Expert", "Researcher", "Creative", "Operator"];

const rhythm = [
  { day: "Monday", what: "Founder / Venture Masterclass" },
  { day: "Tuesday – Thursday", what: "Build Sprint" },
  { day: "Thursday", what: "Office Hours" },
  { day: "Friday", what: "Forge Review" },
];

const after = ["Further venture building", "Investment", "Portfolio support", "Commercial partnerships", "Market development"];

const previewQs = [
  "Do I need an existing startup?",
  "Do I need a business idea?",
  "Is investment guaranteed?",
  "How are applicants selected?",
  "Will I receive a certificate?",
  "What happens after the 10 weeks?",
];

const phaseColour: Record<string, string> = {
  Discover: "bg-amber",
  Build: "bg-orange",
  Market: "bg-flame",
  Invest: "bg-ember",
};

export default function Incubator() {
  return (
    <>
      <PageHero
        eyebrow="Forge Launch · 10-Week Venture Incubator · Cohort 01"
        title={<>10 Weeks. From Potential <span className="flame-text">to Venture.</span></>}
        lede="A hands-on venture-building programme for exceptional individuals who want to build technology-enabled businesses."
        primary={cta.primary}
        secondary={{ label: "See the 10-Week Journey", href: "#curriculum" }}
        aside={
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[22px] border border-line bg-line">
            {[
              ["Duration", "10 weeks"],
              ["Cohort", currentCohort.name.replace("Cohort ", "")],
              ["Start date", currentCohort.dates],
              ["Format", currentCohort.format],
              ["Fee", currentCohort.fee],
              ["Ends with", "Forge Demo Day"],
            ].map(([k, v]) => (
              <div key={k} className="bg-white p-5 sm:p-6">
                <dt className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">{k}</dt>
                <dd className={`heading mt-2 text-[20px] sm:text-[22px] ${v.startsWith("To be") ? "text-ink/45" : ""}`}>{v}</dd>
              </div>
            ))}
          </dl>
        }
      />

      {/* NOT ANOTHER PROGRAMME */}
      <Section>
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div data-reveal>
            <p className="eyebrow text-muted">Built around evidence</p>
            <h2 className="heading mt-5 text-[36px] sm:text-[50px]">This Is Not Another Entrepreneurship Programme.</h2>
            <ul className="mt-10 grid gap-3">
              {["No 10 weeks of theory.", "No certificate-first mentality.", "No endless pitch decks."].map((x) => (
                <li key={x} className="flex items-center gap-4 text-[21px] font-semibold">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-sand text-ember-deep"><Cross /></span>
                  {x}
                </li>
              ))}
            </ul>
          </div>
          <div data-reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">The programme is built around</p>
            <ul className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-[22px] border border-line bg-line">
              {["Research", "Building", "Customer conversations", "Testing", "Traction", "Investment readiness"].map((x, i) => (
                <li key={x} className="flex min-h-[120px] flex-col justify-between bg-white p-5">
                  <span className="font-mono text-[11px] text-ember-deep">{String(i + 1).padStart(2, "0")}</span>
                  <span className="heading text-[20px]">{x}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[16px] text-muted">Participants work toward creating evidence rather than simply completing assignments.</p>
          </div>
        </div>
      </Section>

      {/* CURRICULUM */}
      <Section tone="sand" id="curriculum">
        <SectionHeader
          eyebrow="10-week curriculum"
          title="Every week ends with an output."
          align="split"
          lede="The curriculum moves from discovery to building to market evidence to investment readiness. Each week produces something real that the next week depends on."
        />
        <div className="mt-6 flex flex-wrap gap-4 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
          {Object.entries(phaseColour).map(([p, c]) => (
            <span key={p} className="inline-flex items-center gap-2"><span className={`h-2 w-4 skew-x-[-20deg] ${c}`} />{p}</span>
          ))}
        </div>
        <ol className="mt-10 overflow-hidden rounded-[22px] border border-line bg-white">
          {curriculum.map((w) => (
            <li key={w.week} className="group grid gap-3 border-b border-line p-6 last:border-b-0 sm:grid-cols-[120px_1fr_1fr] sm:items-center sm:gap-8 sm:px-8 md:py-7" data-reveal>
              <div className="flex items-center gap-3">
                <span className={`h-2.5 w-5 skew-x-[-20deg] ${phaseColour[w.phase]}`} />
                <span className="font-mono text-[13px] tracking-[0.08em] text-ink">WEEK {String(w.week).padStart(2, "0")}</span>
              </div>
              <h3 className="heading text-[22px] sm:text-[24px]">{w.title}</h3>
              <div className="rounded-xl bg-sand px-4 py-3 transition-colors group-hover:bg-ink group-hover:text-white">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted group-hover:text-amber">Output</p>
                <p className="mt-0.5 text-[15.5px] font-semibold">{w.output}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      {/* LOOP */}
      <Section>
        <SectionHeader
          eyebrow="Philosophy"
          title="Build. Test. Learn. Repeat."
          lede="Participants are expected to engage with real customers and real market evidence every week. The loop runs until the evidence is strong enough to move to the next stage."
        />
        <div className="mt-14">
          <BuildLoop />
        </div>
      </Section>

      {/* WHO CAN APPLY */}
      <Section tone="sand">
        <div className="grid gap-14 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-20">
          <div>
            <SectionHeader
              eyebrow="Who can apply?"
              title="Seven kinds of builder. No company required."
              lede="You do not need an existing company or startup to apply. Forge forms complementary teams from people with different capabilities."
            />
            <ul className="mt-10 flex flex-wrap gap-2.5" data-reveal>
              {roles.map((r) => (
                <li key={r} className="rounded-full border border-ink/15 bg-white px-5 py-3 text-[16px] font-semibold">{r}</li>
              ))}
            </ul>
            <div className="mt-10" data-reveal>
              <TextLink href={routes.whoWeLookFor}>See who we&apos;re looking for</TextLink>
            </div>
          </div>
          <Photo slot={media.incubatorSprint} />
        </div>
      </Section>

      {/* RHYTHM */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <div data-reveal>
            <p className="eyebrow text-muted">Operating rhythm</p>
            <h2 className="heading mt-5 text-[36px] sm:text-[46px]">A week in the Forge.</h2>
            <p className="mt-6 inline-flex items-center gap-2 rounded-lg border border-flame/30 bg-[#fff6ee] px-3 py-2 text-[14px] text-ember-deep">
              <span className="font-mono text-[11px] uppercase tracking-[0.12em]">Subject to confirmation</span>
            </p>
            <p className="mt-4 max-w-md text-[16px] text-muted">The exact participant commitment will be confirmed before Cohort 01 begins. This is the intended rhythm.</p>
          </div>
          <ol className="border-t border-ink" data-reveal>
            {rhythm.map((r) => (
              <li key={r.day + r.what} className="grid gap-1 border-b border-line py-6 sm:grid-cols-[220px_1fr] sm:items-baseline">
                <span className="font-mono text-[13px] uppercase tracking-[0.1em] text-ember-deep">{r.day}</span>
                <span className="heading text-[24px]">{r.what}</span>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* AFTER */}
      <section className="on-dark bg-night py-20 text-white md:py-28">
        <div className="wrap grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div data-reveal>
            <p className="eyebrow text-white/55">After the 10 weeks</p>
            <h2 className="heading mt-5 text-[36px] sm:text-[48px]">What Happens After 10 Weeks?</h2>
            <p className="lede mt-6">The strongest ventures may progress toward:</p>
            <p className="mt-10 rounded-xl border border-line-dark p-5 text-[15px] text-white/70">
              <span className="font-semibold text-white">Investment is not guaranteed.</span> It is an outcome earned through evidence. Any investment is subject to separate documentation, diligence and approvals.
            </p>
          </div>
          <ol className="grid content-start gap-px overflow-hidden rounded-[22px] border border-line-dark bg-line-dark" data-reveal>
            {after.map((a, i) => (
              <li key={a} className="flex items-center gap-5 bg-night px-6 py-5">
                <span className="font-mono text-[12px] text-amber">{String(i + 1).padStart(2, "0")}</span>
                <span className="heading text-[22px]">{a}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ PREVIEW */}
      <Section>
        <SectionHeader eyebrow="FAQ" title="Questions before you apply." align="split">
          <TextLink href={routes.faq}>See all questions</TextLink>
        </SectionHeader>
        <div className="mt-12">
          <FaqList items={previewQs.map((q) => faqs.find((f) => f.q === q)!).filter(Boolean)} />
        </div>
      </Section>

      <CtaBand
        title="Start building with evidence."
        body="Applications for Cohort 01 are open to exceptional individuals across Africa, with or without a company."
        primary={{ label: "Start Your Application", href: routes.apply, track: "apply_cta" }}
        secondary={null}
        eyebrow="Cohort 01"
      />
    </>
  );
}
