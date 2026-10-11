import Link from "next/link";
import type { SiteSettings } from "@/lib/api/types";
import { primaryCtas } from "@/lib/ctas";
import { mobileNav, nav, routes } from "@/lib/site";
import Logo from "./Logo";
import MobileNav from "./MobileNav";
import { DesktopNav } from "./NavLinks";

export default function SiteHeader({ settings }: { settings: SiteSettings }) {
  const { courses, scholarships } = primaryCtas(settings);
  return (
    <>
      <div className="bg-ink text-white">
        <div className="wrap flex min-h-10 items-center justify-center gap-3 py-2 text-center text-[13px]">
          <span className="hidden font-mono text-[11px] tracking-[0.14em] text-amber sm:inline">NEW NAME</span>
          <span className="text-white/80">Haelsoft Masterclass is becoming Haelsoft EdTech.</span>
          <Link href={routes.story} className="hidden font-semibold text-white underline-offset-4 hover:underline md:inline">
            Read our story
          </Link>
        </div>
      </div>
      <header className="sticky top-0 z-50 border-b border-line/80 bg-white/90 backdrop-blur-xl backdrop-saturate-150">
        <div className="wrap flex h-[72px] items-center justify-between gap-4">
          <Link href={routes.home} aria-label="Haelsoft EdTech home" className="shrink-0">
            <Logo priority />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <DesktopNav groups={nav} />
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href={courses.href}
              className="hidden items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-[15px] font-medium text-ink-2 hover:bg-sand xl:inline-flex"
            >
              {courses.label}
              {!courses.live ? <span className="tag tag-soon !px-1.5 !py-0.5 !text-[9px]">Soon</span> : null}
            </Link>
            <Link href={scholarships.href} className="btn btn-primary hidden !min-h-11 !px-5 sm:inline-flex">
              {scholarships.label}
              {!scholarships.live ? (
                <span className="rounded-full bg-white/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em]">Soon</span>
              ) : null}
            </Link>
            <MobileNav items={mobileNav} ctas={[scholarships, courses]} logo={<Logo />} />
          </div>
        </div>
      </header>
    </>
  );
}
