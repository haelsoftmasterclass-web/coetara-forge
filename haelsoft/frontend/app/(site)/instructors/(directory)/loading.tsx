import { CardGridSkeleton } from "@/components/States";

export default function Loading() {
  return (
    <section className="section bg-paper" aria-busy="true" aria-label="Loading instructors">
      <div className="wrap">
        <div className="skeleton mb-6 h-12 w-2/3 max-w-xl rounded-[var(--radius-control)]" />
        <CardGridSkeleton />
        <p className="sr-only" role="status">Loading instructors…</p>
      </div>
    </section>
  );
}
