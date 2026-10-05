import Button from "./Button";

type CTA = { label: string; href: string; track?: string };

export default function PageHero({
  eyebrow,
  title,
  lede,
  primary,
  secondary,
  aside,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  primary?: CTA;
  secondary?: CTA;
  aside?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-paper">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#03080c08_1px,transparent_1px)] bg-[size:calc((min(100vw,1240px)-80px)/12)_100%] bg-center" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-[radial-gradient(closest-side,rgba(254,177,1,0.16),rgba(254,83,1,0.06),transparent)]" />
      <div className={`wrap relative grid gap-12 pb-16 pt-14 md:pb-24 md:pt-20 ${aside ? "lg:grid-cols-[1.25fr_1fr] lg:items-center lg:gap-16" : ""}`}>
        <div>
          <p className="eyebrow text-muted" data-reveal>{eyebrow}</p>
          <h1 className="display mt-6 text-[42px] sm:text-[60px] lg:text-[76px]" data-reveal>{title}</h1>
          {lede ? <div className="lede mt-7 text-[19px] sm:text-[21px]" data-reveal>{lede}</div> : null}
          {primary || secondary ? (
            <div className="mt-10 flex flex-wrap gap-3" data-reveal>
              {primary ? <Button href={primary.href} track={primary.track}>{primary.label}</Button> : null}
              {secondary ? <Button href={secondary.href} variant="ghost" track={secondary.track}>{secondary.label}</Button> : null}
            </div>
          ) : null}
          {children}
        </div>
        {aside ? <div data-reveal>{aside}</div> : null}
      </div>
    </section>
  );
}
