type Tone = "white" | "sand" | "ink";

export function Section({
  children,
  tone = "white",
  id,
  className = "",
  labelledBy,
}: {
  children: React.ReactNode;
  tone?: Tone;
  id?: string;
  className?: string;
  labelledBy?: string;
}) {
  const toneClass = tone === "ink" ? "on-dark bg-night text-white" : tone === "sand" ? "bg-sand" : "bg-paper";
  return (
    <section id={id} aria-labelledby={labelledBy} className={`${toneClass} section scroll-mt-24 ${className}`}>
      <div className="wrap">{children}</div>
    </section>
  );
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  lede,
  layout = "stacked",
  children,
  className = "",
}: {
  id?: string;
  eyebrow?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  layout?: "stacked" | "split";
  children?: React.ReactNode;
  className?: string;
}) {
  const heading = (
    <>
      {eyebrow ? <p className="eyebrow text-muted">{eyebrow}</p> : null}
      <h2 id={id} className="heading mt-5 text-[32px] sm:text-[42px] lg:text-[50px]">
        {title}
      </h2>
    </>
  );
  if (layout === "split") {
    return (
      <div className={`grid gap-6 md:grid-cols-[1.15fr_1fr] md:items-end md:gap-16 ${className}`}>
        <div>{heading}</div>
        <div className="grid gap-6">
          {lede ? <div className="lede">{lede}</div> : null}
          {children}
        </div>
      </div>
    );
  }
  return (
    <div className={`max-w-3xl ${className}`}>
      {heading}
      {lede ? <div className="lede mt-6">{lede}</div> : null}
      {children ? <div className="mt-8">{children}</div> : null}
    </div>
  );
}
