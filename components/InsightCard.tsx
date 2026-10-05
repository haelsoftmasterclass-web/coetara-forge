import type { Insight } from "@/lib/insights";
import { Arrow } from "./Icons";

const hues = ["#feb101", "#fd7200", "#fe5301", "#e20f01"];

/** Generative cover so every article has a consistent, on-brand header until a hero image is set. */
export function InsightCover({ insight, large = false }: { insight: Insight; large?: boolean }) {
  if (insight.image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={insight.image} alt="" className="h-full w-full object-cover" />;
  }
  const seed = insight.order;
  const h1 = hues[seed % 4];
  const h2 = hues[(seed + 2) % 4];
  return (
    <div className="relative h-full w-full overflow-hidden bg-night">
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff1f_1px,transparent_1px)] bg-[size:12px_12px]" />
      <svg viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id={`ic${seed}`} x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor={h1} />
            <stop offset="1" stopColor={h2} />
          </linearGradient>
        </defs>
        <g transform={`translate(${150 + (seed % 3) * 40} ${40 + (seed % 2) * 20}) skewX(-38)`}>
          <rect x="0" y="0" width={180 - (seed % 4) * 14} height="58" fill={`url(#ic${seed})`} />
          <rect x="-12" y="78" width={130 - (seed % 3) * 12} height="46" fill={`url(#ic${seed})`} opacity="0.7" />
        </g>
      </svg>
      <span className={`absolute bottom-4 left-5 font-mono uppercase tracking-[0.16em] text-white/70 ${large ? "text-[12px]" : "text-[10px]"}`}>{insight.category}</span>
    </div>
  );
}

export default function InsightCard({ insight }: { insight: Insight }) {
  const soon = insight.status !== "published";
  const Wrapper = soon ? "div" : "a";
  return (
    <article className="group flex flex-col" data-insight data-category={insight.category} data-reveal>
      <Wrapper
        {...(soon ? {} : { href: `/insights/${insight.slug}/`, "data-track": "insight_open" })}
        className="flex h-full flex-col"
      >
        <div className="aspect-[16/10] overflow-hidden rounded-2xl transition-transform duration-500 group-hover:-translate-y-1">
          <InsightCover insight={insight} />
        </div>
        <div className="mt-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.12em] text-muted">
          <span>{insight.category}</span>
          <span aria-hidden="true">·</span>
          <span>{soon ? "Coming soon" : `${insight.readingTime} min read`}</span>
        </div>
        <h3 className={`heading mt-3 text-[22px] ${soon ? "text-ink/70" : "group-hover:text-ember-deep"}`}>{insight.title}</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">{insight.excerpt}</p>
        {!soon ? (
          <span className="mt-5 inline-flex items-center gap-2 text-[14px] font-semibold">
            Read the article <Arrow />
          </span>
        ) : null}
      </Wrapper>
    </article>
  );
}
