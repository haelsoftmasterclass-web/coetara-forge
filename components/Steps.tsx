/** Numbered process steps laid out as an editorial grid (used for Forge Launch / Forge Commercial models). */
export type Step = { name: string; body: React.ReactNode; list?: string[]; listLabel?: string };

export default function Steps({ steps, cols = 3, dark = false }: { steps: Step[]; cols?: 2 | 3 | 5; dark?: boolean }) {
  const grid = cols === 5 ? "lg:grid-cols-5" : cols === 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3";
  return (
    <ol className={`grid gap-px overflow-hidden rounded-2xl border ${dark ? "border-line-dark bg-line-dark" : "border-line bg-line"} ${grid}`}>
      {steps.map((s, i) => (
        <li key={s.name} className={`flex flex-col p-7 md:p-8 ${dark ? "bg-night" : "bg-white"}`} data-reveal>
          <span className={`font-mono text-[12px] tracking-[0.12em] ${dark ? "text-amber" : "text-ember-deep"}`}>{String(i + 1).padStart(2, "0")}</span>
          <h3 className="heading mt-5 text-[22px] uppercase tracking-[0.01em]">{s.name}</h3>
          <div className={`mt-3 text-[15.5px] leading-relaxed ${dark ? "text-white/65" : "text-muted"}`}>{s.body}</div>
          {s.list ? (
            <div className="mt-5">
              {s.listLabel ? <p className={`font-mono text-[11px] uppercase tracking-[0.12em] ${dark ? "text-white/40" : "text-faint"}`}>{s.listLabel}</p> : null}
              <ul className="mt-2 grid gap-1.5 text-[14.5px]">
                {s.list.map((x) => (
                  <li key={x} className="flex gap-2.5">
                    <span className="mt-[9px] h-[5px] w-[9px] shrink-0 skew-x-[-20deg] bg-orange" />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
