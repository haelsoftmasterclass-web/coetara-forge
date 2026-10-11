import Breadcrumbs, { type Crumb } from "./Breadcrumbs";

/** Top of every inner page: breadcrumbs, eyebrow, large title, lede and optional CTAs / aside. */
export default function PageHero({
  eyebrow,
  title,
  lede,
  crumbs,
  actions,
  aside,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  crumbs?: Crumb[];
  actions?: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-paper">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#03080c08_1px,transparent_1px)] bg-[size:calc((min(100vw,1240px)-80px)/12)_100%] bg-center"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-[radial-gradient(closest-side,rgba(255,154,31,0.18),rgba(242,80,10,0.07),transparent)]"
      />
      <div className={`wrap relative grid gap-12 pb-16 pt-10 md:pb-24 md:pt-14 ${aside ? "lg:grid-cols-[1.25fr_1fr] lg:items-center lg:gap-16" : ""}`}>
        <div>
          {crumbs ? <Breadcrumbs items={crumbs} className="mb-10" /> : null}
          <p className="eyebrow rise text-muted">{eyebrow}</p>
          <h1 className="display rise-2 mt-6 text-[40px] sm:text-[56px] lg:text-[72px]">{title}</h1>
          {lede ? <div className="lede rise-3 mt-7 text-[19px] sm:text-[21px]">{lede}</div> : null}
          {actions ? <div className="rise-3 mt-10 flex flex-wrap gap-3">{actions}</div> : null}
        </div>
        {aside ? <div className="rise-3">{aside}</div> : null}
      </div>
    </section>
  );
}
