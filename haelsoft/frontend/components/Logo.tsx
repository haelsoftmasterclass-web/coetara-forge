import Image from "next/image";
import logo from "@/public/brand/haelsoft-logo.png";
import logoOnDark from "@/public/brand/haelsoft-logo-on-dark.png";

/** The supplied Haelsoft ribbon logo with an "EdTech" descriptor. */
export default function Logo({ dark = false, className = "", priority = false }: { dark?: boolean; className?: string; priority?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Image src={dark ? logoOnDark : logo} alt="Haelsoft" className="h-[26px] w-auto sm:h-7" sizes="160px" priority={priority} />
      <span
        className={`rounded-[5px] px-1.5 py-[3px] font-mono text-[10px] font-medium uppercase leading-none tracking-[0.18em] ${
          dark ? "bg-white/10 text-white/80" : "bg-sand text-ink-2"
        }`}
      >
        EdTech
      </span>
    </span>
  );
}
