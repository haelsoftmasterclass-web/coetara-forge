import Link from "next/link";
import { Arrow } from "./Icons";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  /** Short label shown in a badge, e.g. "Coming soon" for destinations not yet live. */
  badge?: string;
};

function isExternal(href: string) {
  return /^https?:\/\//.test(href);
}

function ButtonLink({ href, children, className = "", badge, variant }: ButtonProps & { variant: string }) {
  const content = (
    <>
      <span>{children}</span>
      {badge ? <span className="rounded-full bg-white/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em]">{badge}</span> : null}
      <Arrow />
    </>
  );
  if (isExternal(href)) {
    return (
      <a href={href} className={`btn ${variant} ${className}`} rel="noopener noreferrer">
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={`btn ${variant} ${className}`}>
      {content}
    </Link>
  );
}

export function PrimaryButton(props: ButtonProps & { tone?: "ink" | "brand" }) {
  return <ButtonLink {...props} variant={props.tone === "brand" ? "btn-brand" : "btn-primary"} />;
}

export function SecondaryButton(props: ButtonProps) {
  return <ButtonLink {...props} variant="btn-secondary" />;
}

export function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="link-arrow">
      {children}
      <Arrow />
    </Link>
  );
}
