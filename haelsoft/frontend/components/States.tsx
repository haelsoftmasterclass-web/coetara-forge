import Link from "next/link";
import { Arrow } from "./Icons";

/** Honest "nothing here yet" panel. Never filled with fake content. */
export function EmptyState({
  title,
  children,
  action,
}: {
  title: string;
  children?: React.ReactNode;
  action?: { label: string; href: string };
}) {
  return (
    <div className="card flex flex-col items-start gap-4 border-dashed bg-sand/60 p-8 md:p-10">
      <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-ember-deep">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 4v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.6" /></svg>
      </span>
      <h3 className="heading text-[22px]">{title}</h3>
      {children ? <div className="max-w-[60ch] text-[16px] text-muted">{children}</div> : null}
      {action ? (
        <Link href={action.href} className="link-arrow mt-2">
          {action.label}
          <Arrow />
        </Link>
      ) : null}
    </div>
  );
}

/** Shown when the API cannot be reached. Says so plainly and offers a way forward. */
export function ErrorState({ title = "We couldn't load this right now", children }: { title?: string; children?: React.ReactNode }) {
  return (
    <div role="alert" className="card flex flex-col items-start gap-3 border-[#f3c3bd] bg-[#fff6f5] p-8">
      <h3 className="heading text-[22px]">{title}</h3>
      <div className="max-w-[60ch] text-[16px] text-muted">
        {children ?? "This section is temporarily unavailable. Please refresh the page in a moment."}
      </div>
    </div>
  );
}

/** Skeleton cards for loading.tsx files. */
export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="card overflow-hidden">
          <div className="skeleton aspect-[4/3]" />
          <div className="grid gap-3 p-6">
            <div className="skeleton h-5 w-2/3 rounded" />
            <div className="skeleton h-4 w-1/2 rounded" />
            <div className="skeleton h-4 w-full rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Small label for development demo records, so sample content can never pass as real. */
export function DemoBadge({ name }: { name: string }) {
  if (!name.startsWith("[Demo]")) return null;
  return <span className="tag tag-soon">Demo content</span>;
}

export function stripDemo(name: string) {
  return name.replace(/^\[Demo\]\s*/, "");
}
