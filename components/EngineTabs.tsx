import { TextLink } from "./Button";
import { routes } from "@/lib/site";

const engines = [
  {
    id: "launch",
    name: "Forge Launch",
    tagline: "From individual talent to new companies.",
    points: [
      "Identify exceptional people and early-stage builders.",
      "Form complementary teams.",
      "Validate real problems.",
      "Build solutions.",
      "Secure early customers.",
      "Prepare the strongest ventures for investment.",
    ],
    input: "Exceptional individuals",
    output: "New companies",
    cta: { label: "Explore Forge Launch", href: routes.launch },
  },
  {
    id: "commercial",
    name: "Forge Commercial",
    tagline: "From under-used technology to commercial ventures.",
    points: [
      "Work with universities, research institutions and corporate innovation teams to identify promising technology and IP.",
      "Evaluate commercial opportunities.",
      "Structure partnerships.",
      "Build operating teams.",
      "Move technology toward market.",
    ],
    input: "Research, technology & IP",
    output: "Commercial ventures",
    cta: { label: "Explore Forge Commercial", href: routes.commercial },
  },
];

/**
 * The two-engine model. Without JS both engines show side by side;
 * forge.js turns the switch into a toggle on small screens only.
 */
export default function EngineTabs() {
  return (
    <div data-tabs>
      <div role="tablist" aria-label="Forge engines" className="engine-tablist mb-8 hidden w-fit rounded-full border border-line bg-sand p-1">
        {engines.map((e, i) => (
          <button
            key={e.id}
            role="tab"
            type="button"
            aria-selected={i === 0}
            aria-controls={`engine-${e.id}`}
            data-tab={e.id}
            className="rounded-full px-5 py-2.5 text-[15px] font-semibold text-muted aria-selected:bg-ink aria-selected:text-white"
          >
            {e.name}
          </button>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        {engines.map((e, i) => (
          <article
            key={e.id}
            id={`engine-${e.id}`}
            role="tabpanel"
            data-panel={e.id}
            className={`group relative flex flex-col overflow-hidden rounded-[22px] border p-7 sm:p-10 ${i === 0 ? "on-dark border-transparent bg-night text-white" : "border-line bg-white"}`}
            data-reveal
          >
            <div className="flex items-start justify-between gap-4">
              <p className={`font-mono text-[12px] uppercase tracking-[0.14em] ${i === 0 ? "text-amber" : "text-ember-deep"}`}>Engine 0{i + 1}</p>
              <svg width="44" height="38" viewBox="0 0 14 12" aria-hidden="true">
                <defs><linearGradient id={`eg${i}`} x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#feb101" /><stop offset="1" stopColor="#fe5301" /></linearGradient></defs>
                <path d="M5 0h9L9 5H0z" fill={`url(#eg${i})`} opacity={i === 0 ? 1 : 0.35} />
                <path d="M5 7h7l-5 5H0z" fill={`url(#eg${i})`} opacity={i === 1 ? 1 : 0.35} />
              </svg>
            </div>
            <h3 className="display mt-6 text-[38px] sm:text-[46px]">{e.name}</h3>
            <p className={`mt-3 text-[19px] ${i === 0 ? "text-white/75" : "text-ink-2"}`}>{e.tagline}</p>

            <div className={`mt-8 flex items-center gap-3 rounded-xl border px-4 py-3 font-mono text-[12px] uppercase tracking-[0.08em] ${i === 0 ? "border-line-dark text-white/70" : "border-line text-muted"}`}>
              <span>{e.input}</span>
              <svg width="40" height="10" viewBox="0 0 40 10" aria-hidden="true" className="shrink-0"><path d="M1 5h35M32 1l4 4-4 4" stroke="#fd7200" strokeWidth="1.5" fill="none" /></svg>
              <span className={i === 0 ? "text-white" : "text-ink"}>{e.output}</span>
            </div>

            <ul className="mt-8 grid gap-3">
              {e.points.map((p) => (
                <li key={p} className={`flex gap-3 text-[16px] leading-snug ${i === 0 ? "text-white/80" : "text-ink-2"}`}>
                  <span className="mt-[8px] h-[6px] w-[11px] shrink-0 skew-x-[-20deg] bg-orange" />
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-auto pt-10">
              <TextLink href={e.cta.href} track={`engine_${e.id}`}>{e.cta.label}</TextLink>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
