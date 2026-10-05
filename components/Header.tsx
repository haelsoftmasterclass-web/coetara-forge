import Logo from "./Logo";
import { Arrow } from "./Icons";
import { cta, nav, primaryNav, routes } from "@/lib/site";

export default function Header() {
  return (
    <>
      <div className="bg-ink text-white">
        <div className="wrap flex min-h-10 items-center justify-center gap-3 py-2 text-center text-[13px]">
          <span className="hidden font-mono text-[11px] tracking-[0.14em] text-amber sm:inline">COHORT 01</span>
          <span className="text-white/80">The first Forge cohort is being formed. Applications are open to builders across Africa.</span>
          <a href={cta.primary.href} className="hidden items-center gap-1 font-semibold text-white underline-offset-4 hover:underline md:inline-flex" data-track="apply_cta">
            Apply <Arrow />
          </a>
        </div>
      </div>
      <header className="sticky top-[env(safe-area-inset-top,0px)] z-50 border-b border-line/80 bg-white/85 backdrop-blur-xl backdrop-saturate-150" data-header>
        <div className="wrap flex h-[72px] items-center justify-between gap-6">
          <a href={routes.home} aria-label="Coetara Forge home" className="shrink-0">
            <Logo />
          </a>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {nav.map((group) =>
                group.items ? (
                  <li key={group.label} className="group relative">
                    <button
                      type="button"
                      className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[15px] font-medium text-ink-2 hover:bg-sand"
                      aria-haspopup="true"
                    >
                      {group.label}
                      <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" className="transition-transform group-hover:rotate-180 group-focus-within:rotate-180">
                        <path d="m2 3.5 3 3 3-3" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" />
                      </svg>
                    </button>
                    <div className="invisible absolute left-1/2 top-full w-[380px] -translate-x-1/2 translate-y-1 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                      <ul className="rounded-2xl border border-line bg-white p-2 shadow-[0_24px_60px_-24px_rgba(3,8,12,0.28)]">
                        {group.items.map((item) => (
                          <li key={item.href}>
                            <a href={item.href} className="block rounded-xl px-4 py-3 hover:bg-sand">
                              <span className="block text-[15px] font-semibold text-ink">{item.label}</span>
                              {item.note ? <span className="block text-[13px] text-muted">{item.note}</span> : null}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ) : (
                  <li key={group.label}>
                    <a href={group.href} className="block rounded-full px-3.5 py-2 text-[15px] font-medium text-ink-2 hover:bg-sand">
                      {group.label}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <a href={cta.secondary.href} className="hidden rounded-full px-4 py-2 text-[15px] font-medium text-ink-2 hover:bg-sand xl:inline-flex" data-track={cta.secondary.track}>
              {cta.secondary.label}
            </a>
            <a href={cta.primary.href} className="btn btn-primary hidden !min-h-11 !px-5 sm:inline-flex" data-track={cta.primary.track}>
              {cta.primary.label}
              <Arrow />
            </a>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line lg:hidden"
              aria-label="Open menu"
              aria-expanded="false"
              aria-controls="mobile-drawer"
              data-drawer-open
            >
              <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M3 6h14M3 10h14M3 14h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile navigation drawer */}
      <div id="mobile-drawer" className="fixed inset-0 z-[60] hidden lg:hidden" data-drawer role="dialog" aria-modal="true" aria-label="Menu">
        <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" data-drawer-close />
        <div className="absolute inset-y-0 right-0 flex w-full max-w-[420px] flex-col bg-white pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)] shadow-2xl" data-drawer-panel>
          <div className="flex h-[72px] items-center justify-between px-5">
            <Logo />
            <button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line" aria-label="Close menu" data-drawer-close>
              <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                <path d="m4 4 10 10M14 4 4 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 pb-6">
            <ul className="divide-y divide-line border-y border-line">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="flex items-center justify-between py-4 font-display text-[22px] font-bold [font-stretch:110%]">
                    {item.label}
                    <Arrow className="text-faint" />
                  </a>
                </li>
              ))}
            </ul>
            <ul className="mt-5 grid grid-cols-2 gap-x-4 gap-y-2 text-[15px] text-muted">
              <li><a href={routes.launch}>Forge Launch</a></li>
              <li><a href={routes.commercial}>Forge Commercial</a></li>
              <li><a href={routes.faq}>FAQ</a></li>
              <li><a href={routes.contact}>Contact Forge</a></li>
            </ul>
          </nav>
          <div className="grid gap-3 border-t border-line p-5">
            <a href={cta.primary.href} className="btn btn-primary w-full" data-track={cta.primary.track}>
              {cta.primary.label} <Arrow />
            </a>
            <a href={cta.secondary.href} className="btn btn-ghost w-full" data-track={cta.secondary.track}>
              {cta.secondary.label} <Arrow />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
