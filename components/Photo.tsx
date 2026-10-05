/* eslint-disable @next/next/no-img-element */
import type { MediaSlot } from "@/content/media";

/** Editorial image frame. Falls back to a branded placeholder that shows the photo brief. */
export default function Photo({ slot, className = "", ratio = "aspect-[4/5]" }: { slot: MediaSlot; className?: string; ratio?: string }) {
  if (slot.src) {
    return (
      <figure className={`relative overflow-hidden rounded-[22px] bg-sand ${ratio} ${className}`}>
        <img src={slot.src} alt={slot.alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      </figure>
    );
  }
  return (
    <figure
      className={`on-dark relative isolate flex max-w-full flex-col justify-end overflow-hidden rounded-[22px] bg-night p-6 text-white ${ratio} ${className}`}
      role="img"
      aria-label={slot.alt}
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_75%_20%,rgba(254,177,1,0.35),transparent_45%),radial-gradient(circle_at_20%_90%,rgba(226,15,1,0.35),transparent_50%)]" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(#ffffff22_1px,transparent_1px)] bg-[size:14px_14px]" />
      <svg aria-hidden="true" viewBox="0 0 14 12" className="absolute right-6 top-6 w-14 opacity-90">
        <path d="M5 0h9L9 5H0z" fill="#feb101" />
        <path d="M5 7h7l-5 5H0z" fill="#fe5301" />
      </svg>
      <figcaption className="max-w-[34ch]">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-amber">Photography</span>
        <span className="mt-2 block text-[14px] leading-snug text-white/70">{slot.brief}</span>
      </figcaption>
    </figure>
  );
}
