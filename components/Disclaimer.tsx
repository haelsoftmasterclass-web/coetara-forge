import { routes } from "@/lib/site";

/** The approved legal wording, set quietly at the foot of a page. */
export default function Disclaimer({ children }: { children: React.ReactNode }) {
  return (
    <section className="border-t border-line bg-paper py-10" aria-label="Legal disclaimer">
      <div className="wrap grid gap-3 md:grid-cols-[180px_1fr] md:gap-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">Disclaimer</p>
        <p className="max-w-4xl text-[14px] leading-relaxed text-muted">
          {children}{" "}
          <a href={routes.disclaimer} className="underline underline-offset-2 hover:text-ink">Read the full disclaimer</a>.
        </p>
      </div>
    </section>
  );
}
