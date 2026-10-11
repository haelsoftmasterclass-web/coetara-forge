"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Cta } from "@/lib/ctas";
import type { NavItem } from "@/lib/site";
import { Arrow } from "./Icons";
import { isActive } from "./NavLinks";

export default function MobileNav({ items, ctas, logo }: { items: NavItem[]; ctas: Cta[]; logo: React.ReactNode }) {
  const pathname = usePathname() || "/";
  // Open state is remembered per path, so navigating closes the menu without an effect.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (value: boolean) => setOpenOn(value ? pathname : null);
  const openerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);


  useEffect(() => {
    if (!open) {
      if (wasOpen.current) openerRef.current?.focus();
      wasOpen.current = false;
      return;
    }
    wasOpen.current = true;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("button, a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenOn(null);
      if (e.key === "Tab" && panelRef.current) {
        // Keep focus inside the open menu.
        const focusables = panelRef.current.querySelectorAll<HTMLElement>("a, button");
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        ref={openerRef}
        type="button"
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line lg:hidden"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(true)}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M3 6h14M3 10h14M3 14h9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>

      {open ? (
        <div id="mobile-menu" className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div
            ref={panelRef}
            className="absolute inset-y-0 right-0 flex w-full max-w-[420px] flex-col bg-white pb-[env(safe-area-inset-bottom,0px)] pt-[env(safe-area-inset-top,0px)] shadow-2xl"
          >
            <div className="flex h-[72px] items-center justify-between px-5">
              {logo}
              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
                  <path d="m4 4 10 10M14 4 4 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-5 pb-6">
              <ul className="divide-y divide-line border-y border-line">
                {items.map((item) => {
                  const active = isActive(pathname, item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={`flex items-center justify-between py-4 font-display text-[21px] font-bold [font-stretch:110%] ${active ? "text-ember-deep" : ""}`}
                        onClick={() => setOpen(false)}
                      >
                        {item.label}
                        <Arrow className="text-faint" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <div className="grid gap-3 border-t border-line p-5">
              {ctas.map((cta, i) => (
                <Link
                  key={cta.label}
                  href={cta.href}
                  className={`btn ${i === 0 ? "btn-primary" : "btn-secondary"} w-full`}
                  onClick={() => setOpen(false)}
                >
                  {cta.label}
                  {!cta.live ? <span className="tag tag-soon !py-0.5">Coming soon</span> : <Arrow />}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
