type Tone = "white" | "sand" | "ink";

export function Section({
  children,
  tone = "white",
  id,
  className = "",
  tight = false,
}: {
  children: React.ReactNode;
  tone?: Tone;
  id?: string;
  className?: string;
  tight?: boolean;
}) {
  const toneClass = tone === "ink" ? "on-dark bg-night text-white" : tone === "sand" ? "bg-sand" : "bg-paper";
  return (
    <section id={id} className={`${toneClass} ${tight ? "py-16 md:py-20" : "py-20 md:py-28"} scroll-mt-24 ${className}`}>
      <div className="wrap">{children}</div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  lede,
  align = "left",
  children,
  className = "",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  align?: "left" | "split";
  children?: React.ReactNode;
  className?: string;
}) {
  if (align === "split") {
    return (
      <div className={`grid gap-6 md:grid-cols-[1.15fr_1fr] md:items-end md:gap-16 ${className}`} data-reveal>
        <div>
          {eyebrow ? <p className="eyebrow text-muted">{eyebrow}</p> : null}
          <h2 className="heading mt-5 text-[34px] sm:text-[44px] lg:text-[52px]">{title}</h2>
        </div>
        <div className="grid gap-6">
          {lede ? <div className="lede">{lede}</div> : null}
          {children}
        </div>
      </div>
    );
  }
  return (
    <div className={`max-w-3xl ${className}`} data-reveal>
      {eyebrow ? <p className="eyebrow text-muted">{eyebrow}</p> : null}
      <h2 className="heading mt-5 text-[34px] sm:text-[44px] lg:text-[52px]">{title}</h2>
      {lede ? <div className="lede mt-6">{lede}</div> : null}
      {children ? <div className="mt-8">{children}</div> : null}
    </div>
  );
}
