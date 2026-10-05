export type Stage = { name: string; body: string };

/**
 * The Forge Journey. Each stage is a column on a rail; forge.js lights the rail
 * stage by stage as the block scrolls into view, and visitors can hover/focus a
 * stage to read it. Every stage's copy is visible at rest.
 */
export default function Journey({ stages, dark = false }: { stages: Stage[]; dark?: boolean }) {
  const cols = stages.length > 8 ? "lg:grid-cols-9" : "lg:grid-cols-8";
  return (
    <div className="relative" data-journey>
      <div aria-hidden="true" className={`absolute left-0 right-0 top-[22px] hidden h-px lg:block ${dark ? "bg-line-dark" : "bg-line"}`} />
      <div aria-hidden="true" className="absolute left-0 top-[21px] hidden h-[3px] w-full origin-left scale-x-0 bg-[linear-gradient(90deg,#feb101,#fd7200,#fe5301,#e20f01)] transition-transform duration-[2200ms] ease-[cubic-bezier(.2,.7,.1,1)] lg:block" data-journey-rail />
      <ol className={`relative grid gap-px sm:grid-cols-2 ${cols} lg:gap-4`}>
        {stages.map((s, i) => (
          <li key={s.name} className="group relative" data-journey-stage style={{ transitionDelay: `${i * 200}ms` }}>
            <div className="flex items-center gap-3 lg:block">
              <span
                className={[
                  "relative z-10 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border font-mono text-[12px] transition-all duration-500",
                  dark ? "border-line-dark bg-night text-white/70" : "border-line bg-white text-ink/70",
                  "group-[.is-lit]:border-transparent group-[.is-lit]:bg-ink group-[.is-lit]:text-amber",
                  dark ? "group-[.is-lit]:bg-white group-[.is-lit]:text-ink" : "",
                ].join(" ")}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="heading text-[19px] uppercase tracking-[0.02em] lg:mt-6 lg:text-[16px] xl:text-[18px]">{s.name}</h3>
            </div>
            <p className={`mt-2 pb-6 pl-14 text-[15px] leading-relaxed lg:pl-0 lg:pb-0 ${dark ? "text-white/60" : "text-muted"}`}>{s.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
