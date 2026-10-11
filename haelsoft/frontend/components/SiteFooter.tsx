import Link from "next/link";
import type { SiteSettings } from "@/lib/api/types";
import { primaryCtas } from "@/lib/ctas";
import { routes, site } from "@/lib/site";
import Logo from "./Logo";

function Col({ title, links }: { title: string; links: { label: string; href: string; soon?: boolean }[] }) {
  return (
    <div>
      <h2 className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/55">{title}</h2>
      <ul className="mt-4 grid gap-2.5 text-[15px]">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="inline-flex items-center gap-2 text-white/80 transition-colors hover:text-white">
              {link.label}
              {link.soon ? <span className="tag !px-1.5 !py-0 !text-[9px]">Soon</span> : null}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SiteFooter({ settings }: { settings: SiteSettings }) {
  const { courses, scholarships } = primaryCtas(settings);
  const social = [
    { label: "LinkedIn", href: settings.linkedin_url },
    { label: "X", href: settings.x_url },
    { label: "Instagram", href: settings.instagram_url },
    { label: "Facebook", href: settings.facebook_url },
    { label: "YouTube", href: settings.youtube_url },
  ].filter((s) => s.href);

  return (
    <footer className="on-dark relative overflow-hidden bg-night text-white">
      <div className="wrap pb-10 pt-20">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_2fr]">
          <div className="max-w-sm">
            <Logo dark />
            <p className="display mt-8 text-[30px] text-white">Practical skills. Real careers.</p>
            <p className="mt-4 text-[15px] leading-relaxed text-white/65">{site.description}</p>
            {settings.contact_email ? (
              <p className="mt-6 text-[15px]">
                <a href={`mailto:${settings.contact_email}`} className="text-white underline underline-offset-4 hover:text-amber">
                  {settings.contact_email}
                </a>
              </p>
            ) : null}
            {social.length ? (
              <ul className="mt-6 flex flex-wrap gap-2" aria-label="Haelsoft on social media">
                {social.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} rel="noopener noreferrer" className="tag hover:!border-white hover:!text-white">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <Col
              title="About"
              links={[
                { label: "About Haelsoft EdTech", href: routes.about },
                { label: "Our Story", href: routes.story },
                { label: "Our Impact", href: routes.impact },
                { label: "Our Team", href: routes.team },
              ]}
            />
            <Col
              title="Learn"
              links={[
                { label: "Our Instructors", href: routes.instructors },
                { label: courses.label, href: courses.href, soon: !courses.live },
                { label: "Scholarships", href: scholarships.href, soon: !scholarships.live },
                { label: "Testimonials", href: routes.testimonials },
              ]}
            />
            <Col
              title="Connect"
              links={[
                { label: "Our Partners", href: routes.partners },
                { label: "Contact Us", href: routes.contact },
                { label: "Privacy notice", href: routes.privacy },
              ]}
            />
          </div>
        </div>
        <div className="mt-20 flex flex-col gap-4 border-t border-line-dark pt-6 text-[13px] text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Haelsoft. All rights reserved.</p>
          <p>Formerly {site.legacyName}.</p>
        </div>
      </div>
      <div aria-hidden="true" className="pointer-events-none select-none overflow-hidden">
        <p className="display -mb-[0.18em] whitespace-nowrap text-center text-[17vw] leading-none text-white/[0.04]">HAELSOFT</p>
      </div>
    </footer>
  );
}
