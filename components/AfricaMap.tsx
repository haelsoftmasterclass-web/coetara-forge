import { africaDots, hubs, MAP_SIZE, project } from "@/lib/africa";

/** Dot-matrix Africa with connected hubs: the network Forge is built for. */
export default function AfricaMap({ dark = false, showLabels = false, className = "" }: { dark?: boolean; showLabels?: boolean; className?: string }) {
  const dots = africaDots();
  const pts = hubs.map((h) => ({ ...h, ...project(h.lon, h.lat) }));
  const lagos = pts[0];
  return (
    <svg viewBox={`-10 -10 ${MAP_SIZE.w + 20} ${MAP_SIZE.h + 20}`} className={className} role="img" aria-label="Map of Africa showing connected hubs across the continent">
      <defs>
        <linearGradient id="mapFlame" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#feb101" />
          <stop offset="0.55" stopColor="#fd7200" />
          <stop offset="1" stopColor="#e20f01" />
        </linearGradient>
      </defs>
      <g fill={dark ? "#ffffff" : "#03080c"} fillOpacity={dark ? 0.16 : 0.13}>
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={4.1} />
        ))}
      </g>
      <g stroke="url(#mapFlame)" strokeWidth={1.4} fill="none" strokeLinecap="round" opacity={0.85}>
        {pts.slice(1).map((p) => {
          const mx = (lagos.x + p.x) / 2;
          const my = Math.min(lagos.y, p.y) - 60;
          return <path key={p.name} d={`M${lagos.x},${lagos.y} Q${mx},${my} ${p.x},${p.y}`} strokeDasharray="3 5" />;
        })}
      </g>
      {pts.map((p, i) => (
        <g key={p.name}>
          <circle cx={p.x} cy={p.y} r={3} fill="#fe5301" className="map-pulse" style={{ animationDelay: `${(i % 6) * 0.45}s` }} />
          <circle cx={p.x} cy={p.y} r={5.5} fill="url(#mapFlame)" stroke={dark ? "#07090c" : "#fff"} strokeWidth={2} />
          {showLabels ? (
            <text x={p.x + 10} y={p.y + 4} fontSize={13} fontFamily="var(--font-mono)" fill={dark ? "#ffffffaa" : "#03080caa"}>
              {p.name}
            </text>
          ) : null}
        </g>
      ))}
    </svg>
  );
}
