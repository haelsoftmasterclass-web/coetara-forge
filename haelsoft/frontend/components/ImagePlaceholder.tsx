/**
 * Branded stand-in for photography that has not been supplied yet. The brief tells
 * the content team what to shoot or license; replace it by passing a real image
 * (see README > Photography).
 */
export default function ImagePlaceholder({
  label,
  brief,
  className = "",
  ratio = "aspect-[4/5]",
}: {
  label: string;
  brief: string;
  className?: string;
  ratio?: string;
}) {
  return (
    <figure
      className={`on-dark relative isolate flex max-w-full flex-col justify-end overflow-hidden rounded-[var(--radius-card)] bg-night p-6 text-white ${ratio} ${className}`}
      role="img"
      aria-label={label}
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_75%_20%,rgba(255,154,31,0.38),transparent_45%),radial-gradient(circle_at_20%_90%,rgba(227,23,0,0.32),transparent_50%)]" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(#ffffff22_1px,transparent_1px)] bg-[size:14px_14px]" />
      <svg aria-hidden="true" viewBox="0 0 16 14" className="absolute right-6 top-6 w-12 opacity-90">
        <rect x="0" y="0" width="4.5" height="14" rx="2" fill="#ff9a1f" />
        <rect x="11.5" y="0" width="4.5" height="14" rx="2" fill="#f2500a" />
        <path d="M1 11.5C4 7 9 5 15 4.5" stroke="#e31700" strokeWidth="3" fill="none" strokeLinecap="round" />
      </svg>
      <figcaption className="max-w-[34ch]" aria-hidden="true">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber">Photography placeholder</span>
        <span className="mt-2 block text-[14px] leading-snug text-white/75">{brief}</span>
      </figcaption>
    </figure>
  );
}
