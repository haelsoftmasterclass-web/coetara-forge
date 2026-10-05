/* eslint-disable @next/next/no-img-element */
export default function Logo({ dark = false, className = "" }: { dark?: boolean; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <img src="/brand/forge-mark-256.png" alt="" width={34} height={32} className="h-8 w-auto" />
      <span className="flex flex-col leading-none">
        <img
          src={dark ? "/brand/forge-wordmark-white.png" : "/brand/forge-wordmark.png"}
          alt="Coetara Forge"
          width={96}
          height={15}
          className="h-[15px] w-auto"
        />
        <span className={`mt-1 font-mono text-[9px] tracking-[0.32em] ${dark ? "text-white/55" : "text-muted"}`}>COETARA</span>
      </span>
    </span>
  );
}
