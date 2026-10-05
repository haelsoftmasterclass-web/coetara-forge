import Logo from "./Logo";
import { Arrow } from "./Icons";
import { cta, routes, site } from "@/lib/site";

const explore = [
  ["About Forge", routes.about],
  ["10-Week Incubator", routes.incubator],
  ["How It Works", routes.howItWorks],
  ["Who We're Looking For", routes.whoWeLookFor],
  ["Venture Building", routes.ventureBuilding],
  ["Forge Launch", routes.launch],
  ["Forge Commercial", routes.commercial],
  ["Portfolio", routes.portfolio],
  ["Insights", routes.insights],
];
const partners = [
  ["Universities", `${routes.partners}#universities`],
  ["Corporates", `${routes.partners}#corporates`],
  ["Investors", `${routes.partners}#investors`],
  ["Technology Partners", `${routes.partners}#technology`],
];
const legal = [
  ["Privacy", routes.privacy],
  ["Terms", routes.terms],
  ["Investment / Legal Disclaimer", routes.disclaimer],
];

function Col({ title, links }: { title: string; links: string[][] }) {
  return (
    <div>
      <h3 className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45">{title}</h3>
      <ul className="mt-4 grid gap-2.5 text-[15px]">
        {links.map(([label, href]) => (
          <li key={href}>
            <a href={href} className="text-white/80 transition-colors hover:text-white">{label}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="on-dark relative overflow-hidden bg-night text-white">
      <div className="wrap pb-10 pt-20">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_2fr]">
          <div className="max-w-sm">
            <Logo dark />
            <p className="display mt-8 text-[32px] text-white">{site.tagline}</p>
            <p className="mt-4 text-[15px] leading-relaxed text-white/60">
              Coetara Forge is the venture-building and commercialisation platform of Coetara Technologies Limited.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={cta.primary.href} className="btn btn-flame" data-track={cta.primary.track}>
                {cta.primary.label} <Arrow />
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            <Col title="Explore" links={explore} />
            <Col title="Partners" links={partners} />
            <div className="grid content-start gap-10">
              <Col title="Apply" links={[[cta.primary.label, cta.primary.href]]} />
              <Col title="Contact" links={[["Contact Forge", routes.contact], ["FAQ", routes.faq]]} />
            </div>
            <Col title="Legal" links={legal} />
          </div>
        </div>
        <div className="mt-20 flex flex-col gap-4 border-t border-line-dark pt-6 text-[13px] text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Coetara Technologies Limited. All rights reserved.</p>
          <p className="max-w-xl sm:text-right">Participation in a Forge programme does not guarantee investment. <a href={routes.disclaimer} className="underline underline-offset-2 hover:text-white">Read the disclaimer</a>.</p>
        </div>
      </div>
      <div aria-hidden="true" className="pointer-events-none select-none overflow-hidden">
        <p className="display -mb-[0.18em] whitespace-nowrap text-center text-[19vw] leading-none text-white/[0.04]">FORGE</p>
      </div>
    </footer>
  );
}
