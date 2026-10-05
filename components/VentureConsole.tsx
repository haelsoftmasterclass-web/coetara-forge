import { Check } from "./Icons";

/**
 * Product-style interface showing how a venture moves through the Forge gates.
 * It is explicitly an illustration of the model (no real company, no numbers).
 */
const rows = [
  { gate: "Unmet Need", evidence: "Customer interviews logged", state: "passed" },
  { gate: "Technology Readiness", evidence: "Prototype tested with users", state: "passed" },
  { gate: "Route to Market", evidence: "Pilot partner conversations", state: "active" },
  { gate: "Team & Operator Fit", evidence: "Operating lead identified", state: "queued" },
  { gate: "Business Model", evidence: "Pricing test planned", state: "queued" },
] as const;

export default function VentureConsole() {
  return (
    <div className="relative">
      <div aria-hidden="true" className="absolute -inset-6 -z-10 rounded-[36px] bg-[radial-gradient(closest-side,rgba(254,177,1,0.25),rgba(254,83,1,0.1),transparent)] blur-2xl" />
      <div className="overflow-hidden rounded-[22px] border border-line bg-white shadow-[0_40px_80px_-40px_rgba(3,8,12,0.35)]">
        <div className="flex items-center justify-between border-b border-line bg-sand/70 px-5 py-3">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-line" />
            <span className="h-2.5 w-2.5 rounded-full bg-line" />
            <span className="h-2.5 w-2.5 rounded-full bg-line" />
          </div>
          <span className="font-mono text-[11px] tracking-[0.12em] text-muted">FORGE · VENTURE FILE</span>
          <span className="tag !py-0.5 !text-[10px]">Illustration</span>
        </div>
        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-faint">Venture in progress</p>
              <p className="heading mt-1 text-[22px]">From problem to company</p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-ink px-3 py-1.5 font-mono text-[11px] text-amber">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber" /> STAGE 05 · LAUNCH
            </span>
          </div>

          <div className="mt-5 grid grid-cols-8 gap-1" aria-hidden="true">
            {["Discover", "Validate", "Form", "Build", "Launch", "Measure", "Refine", "Invest"].map((s, i) => (
              <div key={s} className="grid gap-1.5">
                <span className={`h-1.5 rounded-full ${i < 4 ? "bg-ink" : i === 4 ? "bg-[linear-gradient(90deg,#feb101,#fe5301)]" : "bg-line"}`} />
                <span className="hidden truncate font-mono text-[9px] uppercase text-faint sm:block">{s}</span>
              </div>
            ))}
          </div>

          <ul className="mt-5 divide-y divide-line rounded-xl border border-line">
            {rows.map((r) => (
              <li key={r.gate} className="flex items-center gap-3 px-4 py-3">
                <span
                  className={[
                    "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                    r.state === "passed" ? "bg-ink text-amber" : r.state === "active" ? "border-2 border-orange" : "border border-dashed border-faint/60",
                  ].join(" ")}
                >
                  {r.state === "passed" ? <Check className="h-3.5 w-3.5" /> : null}
                  {r.state === "active" ? <span className="h-2 w-2 rounded-full bg-orange" /> : null}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-semibold leading-tight">{r.gate}</p>
                  <p className="truncate text-[12.5px] text-muted">{r.evidence}</p>
                </div>
                <span className={`font-mono text-[10px] uppercase tracking-[0.1em] ${r.state === "passed" ? "text-ink" : r.state === "active" ? "text-ember-deep" : "text-faint"}`}>
                  {r.state === "passed" ? "Evidence in" : r.state === "active" ? "Testing" : "Next"}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex items-center justify-between rounded-xl bg-sand px-4 py-3">
            <p className="text-[13px] text-ink-2">
              <span className="font-semibold">Forge Review:</span> keep building, test pricing with pilot customers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
