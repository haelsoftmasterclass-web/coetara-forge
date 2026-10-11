import { PrimaryButton, SecondaryButton } from "./Buttons";

type Link = { label: string; href: string };

export default function CtaBand({
  eyebrow,
  title,
  body,
  primary,
  secondary,
}: {
  eyebrow: string;
  title: React.ReactNode;
  body?: React.ReactNode;
  primary: Link;
  secondary?: Link;
}) {
  return (
    <section className="bg-paper py-16 md:py-24" aria-label={eyebrow}>
      <div className="wrap">
        <div className="on-dark relative overflow-hidden rounded-[var(--radius-band)] bg-night px-6 py-14 text-white sm:px-12 md:px-16 md:py-20">
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 -right-24 h-[420px] w-[620px] rotate-[-18deg] bg-[linear-gradient(100deg,#ff9a1f,#fd7301_40%,#f2500a_70%,#e31700)] opacity-[0.22] blur-[70px]" />
          <div className="relative max-w-3xl">
            <p className="eyebrow text-white/65">{eyebrow}</p>
            <h2 className="display mt-6 text-[34px] sm:text-[46px] lg:text-[56px]">{title}</h2>
            {body ? <div className="lede mt-6">{body}</div> : null}
            <div className="mt-10 flex flex-wrap gap-3">
              <PrimaryButton href={primary.href} tone="brand">{primary.label}</PrimaryButton>
              {secondary ? <SecondaryButton href={secondary.href}>{secondary.label}</SecondaryButton> : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
