import Link from "next/link";
import { SITE_URL } from "@/lib/site";
import JsonLd from "./JsonLd";

export type Crumb = { label: string; href: string };

/** Visible breadcrumb trail plus matching BreadcrumbList structured data. The last item is the current page. */
export default function Breadcrumbs({ items, className = "" }: { items: Crumb[]; className?: string }) {
  const trail = [{ label: "Home", href: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb" className={className}>
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[12px] uppercase tracking-[0.1em] text-muted">
          {trail.map((crumb, i) => {
            const last = i === trail.length - 1;
            return (
              <li key={crumb.href} className="flex items-center gap-2">
                {last ? (
                  <span aria-current="page" className="text-ink">{crumb.label}</span>
                ) : (
                  <>
                    <Link href={crumb.href} className="underline-offset-4 hover:text-ink hover:underline">{crumb.label}</Link>
                    <span aria-hidden="true" className="text-line">/</span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: trail.map((crumb, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: crumb.label,
            item: `${SITE_URL}${crumb.href === "/" ? "" : crumb.href}`,
          })),
        }}
      />
    </>
  );
}
