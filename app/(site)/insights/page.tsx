import { Section } from "@/components/Section";
import PageHero from "@/components/PageHero";
import CtaBand from "@/components/CtaBand";
import InsightCard from "@/components/InsightCard";
import { getInsights, insightCategories } from "@/lib/insights";
import { pageMeta, routes } from "@/lib/site";

export const metadata = pageMeta({
  title: "Insights",
  description:
    "Insights on venture building, African innovation, technology commercialisation, founders and the work of building companies in real markets.",
  path: routes.insights,
});

export default function Insights() {
  const insights = getInsights();
  const used = new Set(insights.map((i) => i.category));
  return (
    <>
      <PageHero
        eyebrow="Insights"
        title={<>Ideas, Evidence &amp; Lessons <span className="flame-text">From the Forge.</span></>}
        lede="Insights on venture building, African innovation, technology commercialisation, founders and the work of building companies in real markets."
      />
      <Section tight>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter insights by category" data-insight-filter>
          <button type="button" className="tag !px-3 !py-2 !text-[12px] aria-pressed:!border-ink aria-pressed:!bg-ink aria-pressed:!text-white" aria-pressed="true" data-category-btn="all">All</button>
          {insightCategories.map((c) => (
            <button
              key={c}
              type="button"
              className="tag !px-3 !py-2 !text-[12px] aria-pressed:!border-ink aria-pressed:!bg-ink aria-pressed:!text-white"
              aria-pressed="false"
              data-category-btn={c}
              disabled={!used.has(c)}
              title={used.has(c) ? undefined : "Articles coming soon"}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="mt-12 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {insights.map((i) => (
            <InsightCard key={i.slug} insight={i} />
          ))}
        </div>
        <p className="hidden py-16 text-center text-muted" data-insight-empty>No articles in this category yet.</p>
      </Section>
      <CtaBand title="Read about it. Then build it." />
    </>
  );
}
