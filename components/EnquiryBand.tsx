import EnquiryForm from "./EnquiryForm";

/**
 * Closing call to action for the partner landing pages: the CtaBand panel,
 * with the enquiry form built in so a partner can start the conversation in place.
 */
export default function EnquiryBand({
  id = "enquiry",
  eyebrow,
  title,
  body,
  role,
  topic,
  submitLabel,
  track,
  note,
}: {
  id?: string;
  eyebrow: string;
  title: React.ReactNode;
  body?: React.ReactNode;
  role: string;
  topic: string;
  submitLabel: string;
  track?: string;
  note?: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 bg-paper py-16 md:py-24" aria-labelledby={`${id}-title`}>
      <div className="wrap">
        <div className="relative overflow-hidden rounded-[28px] bg-night px-5 py-12 text-white sm:px-10 md:px-14 md:py-16">
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -left-24 h-[420px] w-[620px] rotate-[-18deg] bg-[linear-gradient(100deg,#feb101,#fd7200_45%,#fe5301_75%,#e20f01)] opacity-[0.18] blur-[70px]" />
          <div className="relative grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
            <div className="on-dark lg:pt-4" data-reveal>
              <p className="eyebrow text-white/60">{eyebrow}</p>
              <h2 id={`${id}-title`} className="display mt-6 text-[34px] sm:text-[46px] lg:text-[54px]">{title}</h2>
              {body ? <div className="lede mt-6">{body}</div> : null}
              <svg width="96" height="84" viewBox="0 0 14 12" aria-hidden="true" className="mt-12 hidden opacity-90 lg:block">
                <defs><linearGradient id={`${id}-mark`} x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#feb101" /><stop offset="1" stopColor="#fe5301" /></linearGradient></defs>
                <path d="M5 0h9L9 5H0z" fill={`url(#${id}-mark)`} />
                <path d="M5 7h7l-5 5H0z" fill={`url(#${id}-mark)`} opacity=".7" />
              </svg>
            </div>
            <div className="rounded-[22px] bg-white p-6 text-ink sm:p-9" data-reveal>
              <EnquiryForm idPrefix={id} role={role} topic={topic} submitLabel={submitLabel} track={track} />
            </div>
          </div>
          {note ? <p className="relative mt-10 border-t border-line-dark pt-6 text-[13.5px] text-white/55">{note}</p> : null}
        </div>
      </div>
    </section>
  );
}
