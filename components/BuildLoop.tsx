/** Build → Test → Learn → Refine loop. forge.js cycles the active node; all copy is readable at rest. */
const nodes = [
  { name: "Build", body: "Ship the smallest thing that can face a real customer." },
  { name: "Test", body: "Put it in front of the people who have the problem." },
  { name: "Learn", body: "Read the evidence honestly: usage, objections, willingness to pay." },
  { name: "Refine", body: "Change what the evidence says to change, then build again." },
];

export default function BuildLoop() {
  const R = 150;
  const C = 200;
  const pos = [
    { x: C, y: C - R },
    { x: C + R, y: C },
    { x: C, y: C + R },
    { x: C - R, y: C },
  ];
  return (
    <div className="grid items-center gap-12 lg:grid-cols-[440px_1fr]" data-loop>
      <div className="relative mx-auto w-full max-w-[400px]" aria-hidden="true">
        <svg viewBox="0 0 400 400" className="w-full">
          <defs>
            <linearGradient id="loopG" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="#feb101" />
              <stop offset="1" stopColor="#e20f01" />
            </linearGradient>
          </defs>
          <circle cx={C} cy={C} r={R} fill="none" stroke="#e7e3de" strokeWidth="1.5" />
          <g className="orbit">
            <circle cx={C} cy={C} r={R} fill="none" stroke="url(#loopG)" strokeWidth="3" strokeDasharray="120 823" strokeLinecap="round" />
          </g>
          <text x={C} y={C - 6} textAnchor="middle" fontSize="13" fontFamily="var(--font-mono)" letterSpacing="2" fill="#5d6066">REPEAT</text>
          <text x={C} y={C + 18} textAnchor="middle" fontSize="12" fontFamily="var(--font-mono)" fill="#8b8d91">every week</text>
          {pos.map((p, i) => (
            <g key={nodes[i].name} data-loop-node={i} className="transition-all">
              <circle cx={p.x} cy={p.y} r="44" fill="#fff" stroke="#03080c" strokeWidth="1.5" />
              <text x={p.x} y={p.y + 6} textAnchor="middle" fontSize="17" fontWeight="700" fontFamily="var(--font-display)" fill="#03080c">
                {nodes[i].name.toUpperCase()}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <ol className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
        {nodes.map((n, i) => (
          <li key={n.name} className="bg-white p-6 transition-colors data-[active]:bg-ink data-[active]:text-white" data-loop-item={i}>
            <span className="font-mono text-[12px] text-ember-deep">0{i + 1}</span>
            <h3 className="heading mt-3 text-[24px]">{n.name}</h3>
            <p className="mt-2 text-[15px] leading-relaxed opacity-75">{n.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
