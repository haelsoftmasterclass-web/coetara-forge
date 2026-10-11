/* eslint-disable @next/next/no-img-element */
/**
 * Image uploaded through Django Admin. Rendered with explicit dimensions and lazy
 * loading so it never shifts layout; the API only returns photos people approved.
 */
export default function MediaImage({
  src,
  alt,
  width,
  height,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={className}
    />
  );
}

/** Initials avatar for profiles without an approved photo. */
export function Initials({ name, className = "" }: { name: string; className?: string }) {
  const initials = name
    .replace(/\[.*?\]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
  return (
    <div aria-hidden="true" className={`flex items-center justify-center bg-sand font-display font-bold text-ember-deep [font-stretch:110%] ${className}`}>
      {initials}
    </div>
  );
}
