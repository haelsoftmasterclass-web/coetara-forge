/**
 * Three-layer system diagram: what goes in, the Forge layer in the middle, what can come out.
 * Used as the hero visual on the partner landing pages.
 */
function Down() {
  return (
    <div className="flex justify-center py-3" aria-hidden="true">
      <svg width="12" height="34" viewBox="0 0 12 34" className="text-ink/30">
        <path d="M6 1v28M1.5 25 6 30l4.5-5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeDasharray="3 3" />
      </svg>
    </div>
  );
}

export default function LayerDiagram({
  label,
  inputs,
  inputsLabel = "In",
  layer,
  layerBody,
  outputs,
  outputsLabel = "Out",
}: {
  label: string;
  inputs: string[];
  inputsLabel?: string;
  layer: string;
  layerBody: string;
  outputs: string[];
  outputsLabel?: string;
}) {
  return (
    <figure className="relative mx-auto max-w-[480px] overflow-hidden rounded-[22px] border border-line bg-white p-5 shadow-[0_40px_80px_-50px_rgba(3,8,12,0.35)] sm:p-7">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(#03080c08_1px,transparent_1px),linear-gradient(to_right,#03080c08_1px,transparent_1px)] bg-[size:24px_24px]" />
      <figcaption className="relative flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
        <span>{label}</span>
        <span className="h-2 w-5 skew-x-[-20deg] bg-[linear-gradient(90deg,#feb101,#fe5301)]" aria-hidden="true" />
      </figcaption>

      <div className="relative mt-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">{inputsLabel}</p>
        <ul className="mt-2.5 flex flex-wrap gap-2">
          {inputs.map((x) => (
            <li key={x} className="rounded-full border border-line bg-white px-3.5 py-1.5 text-[13.5px] font-semibold">{x}</li>
          ))}
        </ul>
      </div>

      <Down />

      <div className="relative rounded-2xl bg-[linear-gradient(100deg,#feb101,#fd7200_45%,#fe5301_80%)] p-5 text-ink">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/60">Forge layer</p>
        <p className="heading mt-1.5 text-[22px] sm:text-[24px]">{layer}</p>
        <p className="mt-1.5 text-[14px] leading-snug text-ink/75">{layerBody}</p>
      </div>

      <Down />

      <div className="relative">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-faint">{outputsLabel}</p>
        <ul className="mt-2.5 flex flex-wrap gap-2">
          {outputs.map((x, i) => (
            <li
              key={x}
              className={`rounded-full px-3.5 py-1.5 text-[13.5px] font-semibold ${i === outputs.length - 1 ? "bg-ink text-white" : "border border-ink/15 bg-sand"}`}
            >
              {x}
            </li>
          ))}
        </ul>
      </div>
    </figure>
  );
}
