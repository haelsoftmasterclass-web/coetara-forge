import Button, { TextLink } from "@/components/Button";
import { Section, SectionHeader } from "@/components/Section";
import AfricaMap from "@/components/AfricaMap";
import VentureConsole from "@/components/VentureConsole";
import Flow from "@/components/Flow";
import EngineTabs from "@/components/EngineTabs";
import Checklist from "@/components/Checklist";
import Statement from "@/components/Statement";
import Journey from "@/components/Journey";
import CtaBand from "@/components/CtaBand";
import Photo from "@/components/Photo";
import { media } from "@/content/media";
import { curriculum } from "@/content/curriculum";
import { cta, pageMeta, routes } from "@/lib/site";
import { journey } from "@/content/journey";

export const metadata = pageMeta({
  title: "Coetara Forge | Venture Building & Startup Incubation in Africa",
  description:
    "Coetara Forge is a venture-building and commercialisation platform turning exceptional African talent, ideas and technologies into investable companies. Apply for Cohort 01 of the 10-Week Venture Incubator.",
  path: "/",
  absoluteTitle: true,
});

const sectors = [
  { name: "AI & Business Technology", body: "Software and AI that help African businesses operate, sell and decide better." },
  { name: "Fintech & Financial Infrastructure", body: "Payments, credit, savings and the rails that move money across markets." },
  { name: "Events, Creator & Community Economy", body: "Tools and platforms for organisers, creators and the communities around them." },
  { name: "Commerce, Logistics & Market Infrastructure", body: "Moving goods, connecting buyers and sellers, and making markets work." },
];

const ecosystem = [
  { name: "Community", body: "Builders, mentors and operators working alongside each other." },
  { name: "Customers", body: "Real users and pilot partners to test against." },
  { name: "Distribution", body: "Routes to market through the Coetara audience, organiser network and partners." },
  { name: "Technology", body: "Product, engineering and infrastructure capability." },
  { name: "Capital", body: "Pathways to investors for ventures that earn it with evidence." },
  { name: "Operators", body: "Experienced people who know how to make things happen." },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-line">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#03080c08_1px,transparent_1px)] bg-[size:calc((min(100vw,1240px)-80px)/12)_100%] bg-center" />
        <div className="wrap relative grid gap-14 pb-16 pt-14 md:pt-20 lg:grid-cols-[1.08fr_1fr] lg:gap-10 lg:pb-24">
          <div className="relative z-10">
            <p className="eyebrow text-muted" data-reveal>Venture building &amp; commercialisation · Built for Africa</p>
            <h1 className="display mt-7 text-[52px] sm:text-[76px] lg:text-[92px]" data-reveal>
              Build What <br className="hidden sm:block" />
              Comes <span className="flame-text">Next.</span>
            </h1>
            <p className="heading mt-7 max-w-xl text-[22px] text-ink-2 sm:text-[26px]" data-reveal>
              Where exceptional African talent becomes investable companies.
            </p>
            <p className="lede mt-5" data-reveal>
              Coetara Forge is a venture-building and commercialisation platform designed to transform promising people, ideas and technologies into companies built for real markets.
            </p>
            <div className="mt-10 flex flex-wrap gap-3" data-reveal>
              <Button href={cta.primary.href} track={cta.primary.track}>{cta.primary.label}</Button>
              <Button href={cta.secondary.href} variant="ghost" track={cta.secondary.track}>{cta.secondary.label}</Button>
            </div>
          </div>
          <div className="relative" data-reveal>
            <AfricaMap className="mx-auto w-full max-w-[600px] lg:ml-auto lg:mr-0" />
            <div className="absolute bottom-0 left-0 max-w-[210px] rounded-2xl border border-line bg-white/90 p-4 sm:max-w-[300px] sm:p-5 shadow-[0_30px_60px_-30px_rgba(3,8,12,0.35)] backdrop-blur sm:bottom-[10%] lg:-left-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-ember-deep">Built for Africa</p>
              <p className="heading mt-2 text-[18px] leading-tight sm:text-[26px]">54 countries. One venture-building engine.</p>
            </div>
          </div>
        </div>

        {/* What / How / Why */}
        <div className="wrap relative pb-14">
          <dl className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
            {[
              ["What", "Coetara Forge builds companies."],
              ["How", "By combining talent, technology, commercial validation, operators, customers and capital."],
              ["Why", "To turn African potential into enterprise value."],
            ].map(([k, v]) => (
              <div key={k} className="bg-white p-6 md:p-7" data-reveal>
                <dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-ember-deep">{k}</dt>
                <dd className="heading mt-3 text-[20px] leading-snug">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* POTENTIAL → EXECUTION */}
      <Section>
        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
          <div data-reveal>
            <p className="eyebrow text-muted">The missing layer</p>
            <h2 className="heading mt-5 text-[38px] sm:text-[50px]">Africa Has Potential. Execution Is the Bridge.</h2>
          </div>
          <div className="grid gap-8" data-reveal>
            <ul className="grid gap-1 font-display text-[26px] font-bold leading-tight [font-stretch:112%] sm:text-[32px]">
              <li>Africa has exceptional talent.</li>
              <li className="text-ink/75">Africa has ideas.</li>
              <li className="text-ink/55">Africa has technology.</li>
            </ul>
            <p className="lede">
              But potential alone does not create companies. The missing link is often execution. Coetara Forge exists to bridge that gap.
            </p>
          </div>
        </div>
        <div className="mt-16 rounded-[22px] border border-line bg-sand p-6 sm:p-10">
          <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">The Forge execution layer</p>
          <Flow steps={["Talent", "Ideas", "Technology", "Customers", "Operators", "Capital", "Companies"]} />
        </div>
      </Section>

      {/* WHAT WE BUILD */}
      <Section tone="sand" id="engines">
        <SectionHeader
          eyebrow="What we build"
          title="Two engines. One job: build companies."
          align="split"
          lede="Forge Launch starts with exceptional people. Forge Commercial starts with promising technology. Both end in the same place: ventures capable of surviving and growing in real markets."
        />
        <div className="mt-14">
          <EngineTabs />
        </div>
      </Section>

      {/* 10 WEEKS */}
      <section className="on-dark relative overflow-hidden bg-night py-20 text-white md:py-28">
        <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-[radial-gradient(closest-side,rgba(253,114,0,0.18),transparent)]" />
        <div className="wrap relative">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-end">
            <div data-reveal>
              <p className="eyebrow text-white/55">Flagship programme · 10-Week Venture Incubator</p>
              <h2 className="display mt-6 text-[44px] sm:text-[64px] lg:text-[76px]">
                10 Weeks. One Mission. <span className="flame-text">Build a Company.</span>
              </h2>
            </div>
            <div data-reveal>
              <p className="lede">
                Participants do not spend 10 weeks listening to theory. They spend 10 weeks discovering, validating, building, testing, launching, measuring and refining, with real customers and real market evidence.
              </p>
              <div className="mt-8">
                <Button href={routes.incubator} variant="flame" track="incubator_cta">Explore the 10-Week Incubator</Button>
              </div>
            </div>
          </div>

          <ol className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line-dark bg-line-dark sm:grid-cols-5 lg:grid-cols-10">
            {curriculum.map((w) => (
              <li key={w.week} className="flex min-h-[150px] flex-col bg-night p-4 transition-colors hover:bg-[#0e1217]" data-reveal>
                <span className="font-mono text-[11px] text-amber">WK {String(w.week).padStart(2, "0")}</span>
                <span className="mt-3 text-[14px] font-semibold leading-snug">{w.title}</span>
                <span className="mt-auto pt-3 font-mono text-[10px] uppercase tracking-[0.08em] text-white/40">{w.phase}</span>
              </li>
            ))}
          </ol>
          <p className="mt-6 font-mono text-[12px] uppercase tracking-[0.14em] text-white/45">Build. Test. Learn. Repeat.</p>
        </div>
      </section>

      {/* YOU DON'T NEED TO BE A FOUNDER */}
      <Section>
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
          <Photo slot={media.homeBuilders} className="order-last lg:order-first" />
          <div>
            <div data-reveal>
              <p className="eyebrow text-muted">For builders</p>
              <h2 className="heading mt-5 text-[38px] sm:text-[52px]">You Don&apos;t Need to Already Be a Founder.</h2>
              <p className="lede mt-6">Forge can start with exceptional individuals. You do not necessarily need:</p>
            </div>
            <div className="mt-6" data-reveal>
              <Checklist kind="cross" items={["A registered company", "A perfect business plan", "A polished pitch deck", "A large team", "A fully developed product"]} />
            </div>
            <div className="mt-10 rounded-2xl bg-ink p-6 text-white sm:p-8" data-reveal>
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-amber">What matters</p>
              <p className="heading mt-3 text-[24px] sm:text-[28px]">Capability, curiosity, commitment and the ability to build.</p>
              <div className="mt-7 flex flex-wrap items-center gap-5">
                <Button href={cta.primary.href} variant="flame" track={cta.primary.track}>{cta.primary.label}</Button>
                <a href={routes.whoWeLookFor} className="text-[15px] font-semibold text-white/80 underline-offset-4 hover:text-white hover:underline">See who we&apos;re looking for</a>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* SECTORS */}
      <Section tone="sand">
        <SectionHeader
          eyebrow="Where we look for opportunity"
          title="Four areas where African markets are ready for new companies."
          align="split"
          lede="Forge focuses on sectors where real problems, reachable customers and technology meet."
        />
        <ul className="mt-14 grid gap-px overflow-hidden rounded-[22px] border border-line bg-line sm:grid-cols-2">
          {sectors.map((s, i) => (
            <li key={s.name} className="group relative flex min-h-[260px] flex-col overflow-hidden bg-white p-7 sm:p-9" data-reveal>
              <div aria-hidden="true" className="absolute -right-10 -top-10 h-40 w-56 skew-x-[-35deg] bg-[linear-gradient(100deg,#feb101,#fe5301)] opacity-0 transition-opacity duration-500 group-hover:opacity-[0.12]" />
              <span className="font-mono text-[12px] text-ember-deep">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="heading mt-auto max-w-sm text-[28px] sm:text-[32px]">{s.name}</h3>
              <p className="mt-3 max-w-md text-[16px] text-muted">{s.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* ECOSYSTEM */}
      <Section>
        <SectionHeader
          eyebrow="The Forge ecosystem"
          title="You Don't Build Alone."
          lede="Venture building requires more than an idea. Forge helps connect the components required to move from potential to enterprise."
        />
        <div className="relative mt-14">
          <ul className="grid gap-px overflow-hidden rounded-[22px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {ecosystem.map((e) => (
              <li key={e.name} className="bg-white p-7 sm:p-8" data-reveal>
                <div className="flex items-center gap-3">
                  <span className="h-[7px] w-[13px] skew-x-[-20deg] bg-[linear-gradient(90deg,#feb101,#fe5301)]" />
                  <h3 className="heading text-[22px]">{e.name}</h3>
                </div>
                <p className="mt-3 text-[15.5px] text-muted">{e.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* EVIDENCE */}
      <Statement
        questions={[
          "Is there a real problem?",
          "Is the technology viable?",
          "Can the solution reach customers?",
          "Can the team execute?",
          "Can the venture become a business?",
        ]}
      />

      {/* JOURNEY */}
      <Section>
        <SectionHeader
          eyebrow="The Forge journey"
          title="From potential to company, one stage at a time."
          align="split"
          lede="Every stage has a job and an output. Ventures move forward on evidence, not on the calendar."
        >
          <TextLink href={routes.howItWorks} track="how_it_works">Explore How It Works</TextLink>
        </SectionHeader>
        <div className="mt-16">
          <Journey stages={journey} />
        </div>
        <div className="mt-20 grid gap-10 rounded-[28px] bg-sand p-6 sm:p-10 lg:grid-cols-[1fr_440px] lg:items-center lg:gap-16 lg:p-14">
          <div data-reveal>
            <p className="eyebrow text-muted">Evidence, tracked</p>
            <h3 className="heading mt-5 text-[30px] sm:text-[38px]">Every venture carries its evidence with it.</h3>
            <p className="lede mt-5">Each venture in the Forge is reviewed against the five Forge Gates. Progress is measured by what has been proved with customers, not by time spent in a programme.</p>
          </div>
          <div data-reveal>
            <VentureConsole />
          </div>
        </div>
      </Section>

      <CtaBand
        title="The Next Great African Company Could Start With You."
        body="Whether you are an exceptional builder, a university with under-commercialised technology, a corporate innovation team or an investor looking for the next generation of African ventures, there is a place for you in the Forge ecosystem."
      />
    </>
  );
}
