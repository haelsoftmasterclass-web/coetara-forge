import type { Market } from "@/lib/api/types";

const STATUS_LABEL: Record<Market["status"], string> = { planned: "Planned", active: "Active", paused: "Paused" };

/** Target markets from Django. Each shows its real status, so planned markets never read as operational. */
export default function Markets({ markets, dark = false }: { markets: Market[]; dark?: boolean }) {
  if (!markets.length) return null;
  return (
    <ul className="flex flex-wrap gap-2">
      {markets.map((m) => (
        <li
          key={m.country_code}
          className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[14px] ${dark ? "border-line-dark text-white" : "border-line bg-white text-ink"}`}
        >
          <span className="font-medium">{m.name}</span>
          <span className={`font-mono text-[10px] uppercase tracking-[0.1em] ${dark ? "text-white/60" : "text-muted"}`}>
            {m.is_home_market ? "Home market · " : ""}
            {STATUS_LABEL[m.status]}
          </span>
        </li>
      ))}
    </ul>
  );
}
