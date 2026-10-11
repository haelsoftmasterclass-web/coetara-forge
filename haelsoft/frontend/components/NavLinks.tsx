"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { NavGroup } from "@/lib/site";
import { Chevron } from "./Icons";

export function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function Dropdown({ group, pathname }: { group: Required<Pick<NavGroup, "items">> & NavGroup; pathname: string }) {
  // Open state is remembered per path, so navigating closes the menu without an effect.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (value: boolean | ((v: boolean) => boolean)) =>
    setOpenOn((current) => ((typeof value === "function" ? value(current === pathname) : value) ? pathname : null));
  const ref = useRef<HTMLLIElement>(null);
  const groupActive = group.items.some((item) => isActive(pathname, item.href));
  const menuId = `menu-${group.label.toLowerCase().replace(/\s+/g, "-")}`;

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpenOn(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenOn(null);
        ref.current?.querySelector("button")?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <li ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[15px] font-medium hover:bg-sand ${groupActive ? "text-ink" : "text-ink-2"}`}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
      >
        {group.label}
        <Chevron className={`transition-transform ${open ? "rotate-180" : ""}`} />
        {groupActive ? <span aria-hidden="true" className="absolute inset-x-4 -bottom-[17px] h-[2px] rounded-full bg-flame" /> : null}
      </button>
      <div id={menuId} hidden={!open} className="absolute left-1/2 top-full z-50 w-[380px] -translate-x-1/2 pt-3">
        <ul className="rounded-2xl border border-line bg-white p-2 shadow-[var(--shadow-pop)]">
          {group.items.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`block rounded-xl px-4 py-3 hover:bg-sand ${active ? "bg-sand" : ""}`}
                >
                  <span className="block text-[15px] font-semibold text-ink">{item.label}</span>
                  {item.note ? <span className="block text-[13px] text-muted">{item.note}</span> : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </li>
  );
}

export function DesktopNav({ groups }: { groups: NavGroup[] }) {
  const pathname = usePathname() || "/";
  return (
    <ul className="flex items-center gap-1">
      {groups.map((group) =>
        group.items ? (
          <Dropdown key={group.label} group={{ ...group, items: group.items }} pathname={pathname} />
        ) : (
          <li key={group.label} className="relative">
            <Link
              href={group.href ?? "/"}
              aria-current={isActive(pathname, group.href ?? "/") ? "page" : undefined}
              className="block rounded-full px-3.5 py-2 text-[15px] font-medium text-ink-2 hover:bg-sand aria-[current=page]:text-ink"
            >
              {group.label}
              {isActive(pathname, group.href ?? "/") ? (
                <span aria-hidden="true" className="absolute inset-x-4 -bottom-[17px] h-[2px] rounded-full bg-flame" />
              ) : null}
            </Link>
          </li>
        ),
      )}
    </ul>
  );
}
