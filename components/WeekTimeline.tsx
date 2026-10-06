import { curriculum } from "@/content/curriculum";

const phaseBg: Record<string, string> = {
  Discover: "bg-amber",
  Build: "bg-orange",
  Market: "bg-flame",
  Invest: "bg-ember",
};

/**
 * The 10-week programme as a lit rail on a dark band: two rows of five on desktop,
 * a vertical rail on mobile. Reuses the Journey hooks, so forge.js lights each week
 * in turn as the block scrolls into view. Every week's copy is readable at rest.
 */
export default function WeekTimeline() {
  return (
    <div data-journey>
      <ul className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.12em] text-white/55" aria-label="Phases">
        {Object.entries(phaseBg).map(([p, c]) => (
          <li key={p} className="inline-flex items-center gap-2"><span className={`h-2 w-4 skew-x-[-20deg] ${c}`} />{p}</li>
        ))}
      </ul>
      <ol className="mt-12 grid lg:grid-cols-5 lg:gap-y-14">
        {curriculum.map((w, i) => {
          const wk = String(w.week).padStart(2, "0");
          const last = i === curriculum.length - 1;
          return (
            <li key={w.week} className="group relative pb-10 pl-16 lg:pb-0 lg:pl-0 lg:pr-5" data-journey-stage>
              {/* rail segments: vertical on mobile, horizontal on desktop */}
              {!last ? <span aria-hidden="true" data-week-seg-v className={`absolute bottom-0 left-[21px] top-0 w-[2px] lg:hidden ${phaseBg[w.phase]}`} /> : null}
              <span aria-hidden="true" data-week-seg className={`absolute left-0 right-0 top-[21px] hidden h-[2px] lg:block ${phaseBg[w.phase]}`} />
              <span className="absolute left-0 top-0 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-line-dark bg-night font-mono text-[12px] text-white/70 transition-all duration-500 group-[.is-lit]:border-transparent group-[.is-lit]:bg-white group-[.is-lit]:text-ink lg:relative">
                {wk}
              </span>
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/50 lg:mt-6">
                <span className="text-amber">Wk {wk}</span> · {w.phase}
              </p>
              <h3 className="heading mt-2 text-[20px] leading-tight lg:text-[19px] xl:text-[20px]">{w.title}</h3>
              <div className="mt-4 rounded-xl border border-line-dark bg-white/[0.03] px-4 py-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-amber">Output</p>
                <p className="mt-1 text-[14.5px] font-medium leading-snug text-white/85">{w.output}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
