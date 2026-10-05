import { Section } from "@/components/Section";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import FaqList from "@/components/FaqList";
import { disclaimer, faqs } from "@/content/faq";
import { pageMeta, routes } from "@/lib/site";

export const metadata = pageMeta({
  title: "FAQ",
  description: "Answers about Coetara Forge, the 10-Week Venture Incubator, applications, investment and partnerships.",
  path: routes.faq,
});

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a.join(" ") } })),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero eyebrow="FAQ" title={<>Questions Before <span className="flame-text">You Build?</span></>} lede="Everything we can answer today about Forge, the 10-Week Venture Incubator and partnering with us. Anything still being finalised is marked as to be confirmed." />
      <Section>
        <FaqList items={faqs} searchable />
        <aside className="mt-16 rounded-[22px] border border-line bg-sand p-6 sm:p-8" id="disclaimer">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Legal disclaimer</p>
          <p className="mt-3 max-w-4xl text-[15px] leading-relaxed text-ink-2">{disclaimer}</p>
        </aside>
      </Section>
      <CtaBand title="Still have a question?" primary={{ label: "Contact Forge", href: routes.contact }} secondary={{ label: "Apply for Cohort 01", href: routes.apply, track: "apply_cta" }} />
    </>
  );
}
