export type Gate = { name: string; question: string; detail?: React.ReactNode };

export const forgeGates: Gate[] = [
  { name: "Unmet Need", question: "Is there a real, sized and currently unsolved problem?" },
  {
    name: "Technology Readiness",
    question: "Where does the opportunity sit on its technology-readiness journey?",
    detail: "What is the fastest credible route toward a market-ready solution?",
  },
  {
    name: "Route to Market",
    question: "Can the venture realistically reach customers?",
    detail: "Potential routes include the Coetara audience, the organiser network, the partner ecosystem and other distribution channels.",
  },
  { name: "Team & Operator Fit", question: "Is there a founder or operator capable of carrying the venture forward?" },
  { name: "Business Model", question: "Is there a credible way to make money independently of subsidy or goodwill?" },
];

export default function Gates({ gates = forgeGates, dark = false }: { gates?: Gate[]; dark?: boolean }) {
  return (
    <ol className={`border-t ${dark ? "border-line-dark" : "border-ink"}`}>
      {gates.map((g, i) => (
        <li
          key={g.name}
          className={`group grid gap-3 border-b py-7 transition-colors md:grid-cols-[140px_1fr_1.3fr] md:gap-10 md:py-9 ${dark ? "border-line-dark" : "border-line"}`}
          data-reveal
        >
          <span className={`font-mono text-[12px] uppercase tracking-[0.14em] ${dark ? "text-amber" : "text-ember-deep"}`}>
            Gate {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="heading text-[26px] md:text-[30px]">{g.name}</h3>
          <div>
            <p className={`text-[18px] leading-snug ${dark ? "text-white" : "text-ink"}`}>{g.question}</p>
            {g.detail ? <p className={`mt-2 text-[15px] ${dark ? "text-white/55" : "text-muted"}`}>{g.detail}</p> : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
