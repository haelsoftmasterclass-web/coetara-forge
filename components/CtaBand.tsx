import Button from "./Button";
import { cta } from "@/lib/site";

type CTA = { label: string; href: string; track?: string };

export default function CtaBand({
  title,
  body,
  primary = cta.primary,
  secondary = cta.secondary,
  eyebrow = "Build What Comes Next",
}: {
  title: React.ReactNode;
  body?: React.ReactNode;
  primary?: CTA;
  secondary?: CTA | null;
  eyebrow?: string;
}) {
  return (
    <section className="bg-paper py-16 md:py-24">
      <div className="wrap">
        <div className="on-dark relative overflow-hidden rounded-[28px] bg-night px-6 py-14 text-white sm:px-12 md:px-16 md:py-20" data-reveal>
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -right-24 h-[420px] w-[620px] rotate-[-18deg] bg-[linear-gradient(100deg,#feb101,#fd7200_45%,#fe5301_75%,#e20f01)] opacity-[0.22] blur-[70px]" />
          <div aria-hidden="true" className="pointer-events-none absolute right-10 top-10 hidden md:block">
            <svg width="120" height="104" viewBox="0 0 14 12" className="opacity-90">
              <defs><linearGradient id="ctaR" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#feb101" /><stop offset="1" stopColor="#fe5301" /></linearGradient></defs>
              <path d="M5 0h9L9 5H0z" fill="url(#ctaR)" />
              <path d="M5 7h7l-5 5H0z" fill="url(#ctaR)" opacity=".7" />
            </svg>
          </div>
          <div className="relative max-w-3xl">
            <p className="eyebrow text-white/60">{eyebrow}</p>
            <h2 className="display mt-6 text-[36px] sm:text-[48px] lg:text-[60px]">{title}</h2>
            {body ? <div className="lede mt-6">{body}</div> : null}
            <div className="mt-10 flex flex-wrap gap-3">
              <Button href={primary.href} variant="flame" track={primary.track}>{primary.label}</Button>
              {secondary ? <Button href={secondary.href} variant="ghost" track={secondary.track}>{secondary.label}</Button> : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
