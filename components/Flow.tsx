/** A left-to-right chain of nodes (Talent → Ideas → … → Companies). Wraps on small screens. */
export default function Flow({
  steps,
  highlightLast = true,
  dark = false,
  zone,
}: {
  steps: string[];
  highlightLast?: boolean;
  dark?: boolean;
  /** indices of steps that sit inside a highlighted zone (e.g. the valley of death) */
  zone?: { from: number; to: number; label: string };
}) {
  return (
    <div className="relative" data-reveal>
      <ol className="flex flex-wrap items-stretch gap-y-3" data-flow>
        {steps.map((s, i) => {
          const last = i === steps.length - 1;
          const inZone = zone && i >= zone.from && i <= zone.to;
          return (
            <li key={s} className="flex items-center" style={{ transitionDelay: `${i * 90}ms` }}>
              <span
                className={[
                  "relative inline-flex min-h-12 items-center rounded-full border px-4 py-2.5 text-[15px] font-semibold sm:px-5",
                  last && highlightLast
                    ? "border-transparent bg-[linear-gradient(100deg,#feb101,#fd7200_45%,#fe5301)] text-ink"
                    : inZone
                      ? "border-dashed border-flame text-ember-deep " + (dark ? "bg-transparent text-amber" : "bg-[#fff5ec]")
                      : dark
                        ? "border-line-dark bg-white/[0.03] text-white"
                        : "border-line bg-white text-ink",
                ].join(" ")}
              >
                <span className={`mr-2 font-mono text-[11px] ${last && highlightLast ? "text-ink/60" : "text-faint"}`}>{String(i + 1).padStart(2, "0")}</span>
                {s}
              </span>
              {!last ? (
                <svg width="34" height="12" viewBox="0 0 34 12" aria-hidden="true" className={`mx-1 shrink-0 ${dark ? "text-white/30" : "text-ink/25"}`}>
                  <path d="M1 6h29M26 1.5 31 6l-5 4.5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
                </svg>
              ) : null}
            </li>
          );
        })}
      </ol>
      {zone ? (
        <p className={`mt-4 font-mono text-[11px] uppercase tracking-[0.14em] ${dark ? "text-amber" : "text-ember-deep"}`}>
          <span className="mr-2 inline-block h-2 w-5 border border-dashed border-current align-middle" />
          {zone.label}
        </p>
      ) : null}
    </div>
  );
}
