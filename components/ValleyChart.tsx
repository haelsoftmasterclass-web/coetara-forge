/**
 * Conceptual diagram of the commercialisation gap ("valley of death").
 * Not data: the curve shows where support and evidence typically thin out
 * between a working prototype and commercial validation.
 */
export default function ValleyChart({ stages, dark = false }: { stages: string[]; dark?: boolean }) {
  const W = 1000;
  const H = 360;
  const padX = 40;
  const base = 290;
  const step = (W - padX * 2) / (stages.length - 1);
  const xs = stages.map((_, i) => padX + i * step);
  const valleyFrom = xs[1] + step * 0.15;
  const valleyTo = xs[2] + step * 0.85;
  const ink = dark ? "#ffffff" : "#03080c";
  const path = `M ${xs[0]} 140 C ${xs[0] + step * 0.6} 130, ${xs[1] - step * 0.2} 150, ${xs[1]} 170 S ${xs[1] + step * 0.7} 262, ${(valleyFrom + valleyTo) / 2} 262 S ${xs[2] + step * 0.4} 200, ${xs[3] - step * 0.1} 120 S ${xs[stages.length - 1] - step * 0.3} 40, ${xs[stages.length - 1]} 30`;
  return (
    <figure className="overflow-x-auto" data-reveal>
      <svg viewBox={`0 0 ${W} ${H + 40}`} className="min-w-[640px]" role="img" aria-label={`Diagram: the commercialisation gap between ${stages[1]} and ${stages[stages.length - 2]}`}>
        <defs>
          <linearGradient id="vFlame" x1="0" x2="1">
            <stop offset="0" stopColor="#feb101" />
            <stop offset="0.5" stopColor="#fd7200" />
            <stop offset="1" stopColor="#e20f01" />
          </linearGradient>
          <pattern id="vHatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="8" stroke="#fe5301" strokeWidth="1.2" strokeOpacity="0.35" />
          </pattern>
        </defs>
        <rect x={valleyFrom} y={20} width={valleyTo - valleyFrom} height={base - 20} fill="url(#vHatch)" />
        <line x1={valleyFrom} y1={20} x2={valleyFrom} y2={base} stroke="#fe5301" strokeDasharray="4 4" />
        <line x1={valleyTo} y1={20} x2={valleyTo} y2={base} stroke="#fe5301" strokeDasharray="4 4" />
        <text x={(valleyFrom + valleyTo) / 2} y={44} textAnchor="middle" fontSize="13" fontFamily="var(--font-mono)" letterSpacing="2" fill="#e20f01">
          THE VALLEY OF DEATH
        </text>
        <text x={(valleyFrom + valleyTo) / 2} y={64} textAnchor="middle" fontSize="12" fontFamily="var(--font-mono)" fill={ink} fillOpacity="0.55">
          where Forge works
        </text>
        <line x1={padX} y1={base} x2={W - padX} y2={base} stroke={ink} strokeOpacity="0.2" />
        <path d={path} fill="none" stroke="url(#vFlame)" strokeWidth="4" strokeLinecap="round" data-draw />
        {xs.map((x, i) => (
          <g key={stages[i]}>
            <circle cx={x} cy={base} r={6} fill={dark ? "#07090c" : "#ffffff"} stroke={ink} strokeWidth="1.5" />
            <text x={x} y={base + 34} textAnchor="middle" fontSize="15" fontWeight="600" fill={ink}>
              {stages[i]}
            </text>
          </g>
        ))}
        <text x={padX} y={16} fontSize="11" fontFamily="var(--font-mono)" fill={ink} fillOpacity="0.45" letterSpacing="1.5">
          MOMENTUM &amp; SUPPORT (CONCEPTUAL)
        </text>
      </svg>
    </figure>
  );
}
