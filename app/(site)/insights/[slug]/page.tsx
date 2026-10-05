import { notFound } from "next/navigation";
import { Section } from "@/components/Section";
import CtaBand from "@/components/CtaBand";
import InsightCard, { InsightCover } from "@/components/InsightCard";
import { formatDate, getInsight, getInsights } from "@/lib/insights";
import { SITE_URL, pageMeta, routes } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return getInsights()
    .filter((i) => i.status === "published")
    .map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const i = getInsight(slug);
  if (!i) return {};
  return pageMeta({ title: i.title, description: i.excerpt, path: `${routes.insights}${i.slug}/` });
}

export default async function Article({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const insight = getInsight(slug);
  if (!insight || insight.status !== "published") notFound();
  const related = getInsights()
    .filter((i) => i.slug !== insight.slug)
    .sort((a, b) => Number(b.category === insight.category) - Number(a.category === insight.category) || Number(b.status === "published") - Number(a.status === "published"))
    .slice(0, 3);
  const url = `${SITE_URL}${routes.insights}${insight.slug}/`;
  const share = [
    ["LinkedIn", `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`],
    ["X", `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(insight.title)}`],
    ["WhatsApp", `https://wa.me/?text=${encodeURIComponent(insight.title + " " + url)}`],
  ];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: insight.title,
    description: insight.excerpt,
    author: { "@type": "Organization", name: insight.author },
    publisher: { "@type": "Organization", name: "Coetara Forge", logo: { "@type": "ImageObject", url: `${SITE_URL}/brand/forge-logo.png` } },
    ...(insight.date ? { datePublished: insight.date } : {}),
    mainEntityOfPage: url,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <article data-article>
        <header className="border-b border-line">
          <div className="wrap max-w-[900px] pb-12 pt-14 md:pt-20">
            <a href={routes.insights} className="font-mono text-[12px] uppercase tracking-[0.14em] text-muted hover:text-ink">← Insights</a>
            <p className="eyebrow mt-8 text-ember-deep">{insight.category}</p>
            <h1 className="display mt-5 text-[38px] sm:text-[54px]">{insight.title}</h1>
            <p className="lede mt-6">{insight.excerpt}</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[12px] uppercase tracking-[0.1em] text-muted">
              <span>By {insight.author}</span>
              {insight.date ? <span>{formatDate(insight.date)}</span> : null}
              <span>{insight.readingTime} min read</span>
            </div>
          </div>
          <div className="wrap max-w-[1100px] pb-14">
            <div className="aspect-[21/9] overflow-hidden rounded-[22px]">
              <InsightCover insight={insight} large />
            </div>
          </div>
        </header>
        <div className="wrap grid max-w-[1100px] gap-12 py-16 lg:grid-cols-[1fr_200px]">
          <div className="prose-forge" dangerouslySetInnerHTML={{ __html: insight.html }} />
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Share</p>
            <ul className="mt-3 flex gap-2 lg:flex-col">
              {share.map(([n, href]) => (
                <li key={n}>
                  <a href={href} target="_blank" rel="noopener" className="tag !px-3 !py-2 hover:!border-ink hover:!text-ink" data-track="insight_share">{n}</a>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </article>
      <Section tone="sand">
        <h2 className="heading text-[30px] sm:text-[38px]">Related insights</h2>
        <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((r) => (
            <InsightCard key={r.slug} insight={r} />
          ))}
        </div>
      </Section>
      <CtaBand title="Build What Comes Next." body="Turn the ideas into a company. Apply for Cohort 01 or partner with Forge." />
    </>
  );
}
