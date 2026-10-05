import { Arrow } from "./Icons";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "flame";
  track?: string;
  className?: string;
};

export default function Button({ href, children, variant = "primary", track, className = "" }: Props) {
  return (
    <a href={href} className={`btn btn-${variant} ${className}`} data-track={track}>
      <span>{children}</span>
      <Arrow />
    </a>
  );
}

export function TextLink({ href, children, track }: { href: string; children: React.ReactNode; track?: string }) {
  return (
    <a href={href} className="link-arrow" data-track={track}>
      {children}
      <Arrow />
    </a>
  );
}
