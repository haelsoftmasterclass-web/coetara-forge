import { Section, SectionHeader } from "@/components/Section";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import Photo from "@/components/Photo";
import { TextLink } from "@/components/Button";
import { media } from "@/content/media";
import { cta, pageMeta, routes } from "@/lib/site";

export const metadata = pageMeta({
  title: "Partner With Coetara Forge | Universities & Corporates",
  description:
    "Universities, research institutions, corporates, banks, telcos, technology companies and investors partner with Coetara Forge on technology commercialisation, venture creation and founder programmes in Africa.",
  path: routes.partners,
  absoluteTitle: true,
});

const types = [
  {
    id: "universities",
    name: "Universities & Research Institutions",
    items: ["Technology scouting", "IP commercialisation", "Venture creation", "Entrepreneurship programmes", "Student innovation", "Research translation", "Founder development"],
    cta: { label: "Explore University Partnerships", href: `${routes.contact}?type=university` },
  },
  {
    id: "corporates",
    name: "Corporates",
    items: ["Innovation programme sponsorship", "Technology scouting", "Corporate venture challenges", "R&D commercialisation", "Talent programmes", "Strategic venture partnerships"],
    cta: { label: "Partner on Corporate Innovation", href: `${routes.contact}?type=partner` },
  },
  {
    id: "technology",
    name: "Banks, Telcos & Technology Companies",
    items: ["Themed hackathons", "Founder programmes", "Technology initiatives", "Early access to talent", "Venture-building initiatives", "Distribution partnerships"],
    cta: { label: "Start a Partnership Conversation", href: `${routes.contact}?type=partner` },
  },
  {
    id: "investors",
    name: "Investors",
    items: ["Demo Day participation", "Co-investment opportunities", "Follow-on rounds", "Strategic introductions", "Portfolio partnerships", "Venture referrals"],
    cta: { label: "Discuss Investment & Partnerships", href: `${routes.contact}?type=investor` },
    note: "Investment access and terms are agreed separately and only once formally confirmed.",
  },
];

const why = [
  "Access to exceptional builders",
  "Access to emerging technologies",
  "Venture creation capability",
  "Commercial validation",
  "Market access",
  "Strategic innovation",
  "Early visibility into opportunities",
];

export default function Partners() {
  return (
    <>
      <PageHero
        eyebrow="For partners"
        title={<>Build More Than Partnerships. <span className="flame-text">Build What Comes Next.</span></>}
        lede="Coetara Forge works with organisations that have talent, technology, markets, distribution or capital that can help create new ventures."
        primary={{ label: "Partner With Forge", href: `${routes.contact}?type=partner`, track: "partner_cta" }}
        aside={<Photo slot={media.partnersHero} ratio="aspect-[4/5]" className="mx-auto max-w-[460px]" />}
      />

      <Section>
        <SectionHeader eyebrow="Partner types" title="Four ways to build with Forge." align="split" lede="Each partnership is shaped around what the partner brings and what the ventures need." />
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {types.map((t, i) => (
            <article key={t.id} id={t.id} className="flex scroll-mt-28 flex-col rounded-[22px] border border-line bg-white p-7 sm:p-9" data-reveal>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[12px] text-ember-deep">{String(i + 1).padStart(2, "0")}</span>
                <span className="tag">Potential collaboration</span>
              </div>
              <h3 className="heading mt-6 text-[28px] sm:text-[32px]">{t.name}</h3>
              <ul className="mt-6 grid gap-2.5">
                {t.items.map((it) => (
                  <li key={it} className="flex gap-3 border-b border-line pb-2.5 text-[16px] text-ink-2 last:border-b-0">
                    <span className="mt-[9px] h-[5px] w-[10px] shrink-0 skew-x-[-20deg] bg-orange" />
                    {it}
                  </li>
                ))}
              </ul>
              {t.note ? <p className="mt-5 rounded-lg bg-sand px-4 py-3 text-[13.5px] text-muted">{t.note}</p> : null}
              <div className="mt-auto pt-8">
                <TextLink href={t.cta.href} track="partner_cta">{t.cta.label}</TextLink>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="ink">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
          <div data-reveal>
            <p className="eyebrow text-white/55">Why partner with Forge?</p>
            <h2 className="heading mt-5 text-[36px] sm:text-[48px]">A direct line into what gets built next.</h2>
            <p className="lede mt-6">Partners gain a working venture-building capability without having to build one in-house.</p>
          </div>
          <ol className="border-t border-line-dark" data-reveal>
            {why.map((w, i) => (
              <li key={w} className="flex items-baseline gap-6 border-b border-line-dark py-5">
                <span className="font-mono text-[12px] text-amber">{String(i + 1).padStart(2, "0")}</span>
                <span className="heading text-[22px] sm:text-[24px]">{w}</span>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      <CtaBand
        title="Bring Us the Problem, Technology, Talent or Opportunity."
        primary={{ label: "Start a Partnership Conversation", href: `${routes.contact}?type=partner`, track: "partner_cta" }}
        secondary={{ label: "Explore Forge Commercial", href: routes.commercial }}
        eyebrow="Partner With Forge"
      />
    </>
  );
}
