import { Plus } from "./Icons";
import type { Faq } from "@/content/faq";

export default function FaqList({ items, searchable = false }: { items: Faq[]; searchable?: boolean }) {
  const topics = Array.from(new Set(items.map((f) => f.topic)));
  return (
    <div data-faq>
      {searchable ? (
        <div className="mb-10 grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
          <label className="relative block">
            <span className="sr-only">Search questions</span>
            <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" className="absolute left-4 top-1/2 -translate-y-1/2 text-faint">
              <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.6" fill="none" />
              <path d="m12.5 12.5 3.5 3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <input id="faq-search" type="search" className="input !rounded-full !pl-11" placeholder="Search questions, e.g. investment, certificate, universities" data-faq-search />
          </label>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by topic">
            <button type="button" className="tag !text-[12px] aria-pressed:!border-ink aria-pressed:!bg-ink aria-pressed:!text-white" aria-pressed="true" data-faq-topic="all">All</button>
            {topics.map((t) => (
              <button key={t} type="button" className="tag !text-[12px] aria-pressed:!border-ink aria-pressed:!bg-ink aria-pressed:!text-white" aria-pressed="false" data-faq-topic={t}>
                {t}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      <div className="border-t border-ink">
        {items.map((f) => (
          <details key={f.q} className="group border-b border-line" data-faq-item data-topic={f.topic}>
            <summary className="flex items-center justify-between gap-6 py-6">
              <span className="heading text-[20px] sm:text-[23px]">{f.q}</span>
              <span className="faq-icon inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line transition-transform duration-300 group-hover:border-ink">
                <Plus />
              </span>
            </summary>
            <div className="max-w-3xl pb-7 text-[17px] leading-relaxed text-ink-2">
              {f.tbc ? <span className="tag mb-3 !border-flame/40 !text-ember-deep">To be confirmed</span> : null}
              {f.a.map((p) => (
                <p key={p} className="mt-2 first:mt-0">{p}</p>
              ))}
            </div>
          </details>
        ))}
      </div>
      {searchable ? <p className="hidden py-10 text-center text-muted" data-faq-empty>No questions match that search. Try another word, or <a className="underline" href="/contact/">ask us directly</a>.</p> : null}
    </div>
  );
}
