/** "We Don't Fund Assumptions" — a large editorial statement with the evidence questions. */
export default function Statement({
  eyebrow = "Evidence before assumptions",
  title = "We Don't Fund Assumptions.",
  questions,
  principle = "Evidence before assumptions.",
}: {
  eyebrow?: string;
  title?: string;
  questions: string[];
  principle?: string;
}) {
  return (
    <section className="on-dark relative overflow-hidden bg-night py-24 text-white md:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_10%,rgba(253,114,0,0.18),transparent_55%)]" />
      <div className="wrap relative grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
        <div data-reveal>
          <p className="eyebrow text-white/55">{eyebrow}</p>
          <h2 className="display mt-6 text-[48px] sm:text-[68px] lg:text-[88px]">
            {title.split(" ").slice(0, -1).join(" ")} <span className="flame-text">{title.split(" ").slice(-1)}</span>
          </h2>
          <p className="mt-8 max-w-md text-[17px] text-white/60">
            Every venture in the Forge has to earn its next step. The questions stay the same at every stage. The evidence has to get stronger.
          </p>
        </div>
        <div className="self-end">
          <ol className="border-t border-line-dark">
            {questions.map((q, i) => (
              <li key={q} className="flex items-baseline gap-6 border-b border-line-dark py-5" data-reveal>
                <span className="font-mono text-[12px] text-amber">Q{i + 1}</span>
                <span className="heading text-[22px] sm:text-[26px]">{q}</span>
              </li>
            ))}
          </ol>
          <p className="mt-8 font-mono text-[12px] uppercase tracking-[0.16em] text-white/45" data-reveal>
            Core principle <span className="ml-3 text-white">{principle}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
