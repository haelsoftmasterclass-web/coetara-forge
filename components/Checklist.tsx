import { Check, Cross } from "./Icons";

export default function Checklist({ items, kind = "check", cols = 1, dark = false }: { items: string[]; kind?: "check" | "cross"; cols?: 1 | 2 | 3; dark?: boolean }) {
  const grid = cols === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : cols === 2 ? "sm:grid-cols-2" : "";
  return (
    <ul className={`grid gap-x-8 ${grid}`}>
      {items.map((it) => (
        <li key={it} className={`flex items-center gap-3.5 border-b py-3.5 text-[17px] ${dark ? "border-line-dark" : "border-line"}`}>
          <span
            className={[
              "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
              kind === "check" ? "bg-ink text-amber" : dark ? "bg-white/[0.06] text-white/50" : "bg-sand text-faint",
              kind === "check" && dark ? "!bg-white !text-ink" : "",
            ].join(" ")}
          >
            {kind === "check" ? <Check /> : <Cross />}
          </span>
          <span className={kind === "cross" ? (dark ? "text-white/70" : "text-ink-2") : ""}>{it}</span>
        </li>
      ))}
    </ul>
  );
}
