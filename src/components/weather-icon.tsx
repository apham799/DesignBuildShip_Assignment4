import { cx } from "@/components/ui";

// A small picture of the weather, so conditions can be read at a glance. Always
// shown next to the words (describeWeather), so it's hidden from screen readers.
// Palette: brass for sun, moon and lightning (decoration), cream clouds outlined in
// ink, and the focus blue for rain.

type Kind = "clear" | "partly" | "cloudy" | "fog" | "rain" | "snow" | "storm";

function kindOf(code: number): Kind {
  if (code <= 1) return "clear";
  if (code === 2) return "partly";
  if (code === 3) return "cloudy";
  if (code === 45 || code === 48) return "fog";
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return "snow";
  if (code >= 95) return "storm";
  if (code >= 51) return "rain";
  return "cloudy";
}

const ink = "var(--color-ink)";
const brass = "var(--color-brass)";
const cream = "var(--color-cream-deep)";
const blue = "var(--color-focus)";

const Sun = ({ x = 16, y = 16, r = 6 }: { x?: number; y?: number; r?: number }) => (
  <g>
    {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
      <line
        key={a}
        x1={x + Math.cos((a * Math.PI) / 180) * (r + 3)}
        y1={y + Math.sin((a * Math.PI) / 180) * (r + 3)}
        x2={x + Math.cos((a * Math.PI) / 180) * (r + 6)}
        y2={y + Math.sin((a * Math.PI) / 180) * (r + 6)}
        stroke={brass}
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    ))}
    <circle cx={x} cy={y} r={r} fill={brass} />
  </g>
);

const Moon = () => <path d="M20 6 A10 10 0 1 0 26 22 A8 8 0 1 1 20 6 Z" fill={brass} />;

const Cloud = ({ dy = 0 }: { dy?: number }) => (
  <path
    d={`M9 ${24 + dy} H23 A5 5 0 0 0 23 ${14 + dy} A7 7 0 0 0 10.5 ${12.5 + dy} A5.8 5.8 0 0 0 9 ${24 + dy} Z`}
    fill={cream}
    stroke={ink}
    strokeWidth="1.8"
    strokeLinejoin="round"
  />
);

export function WeatherIcon({ code, time, className = "size-8" }: { code: number; time?: string; className?: string }) {
  const kind = kindOf(code);
  const hour = time ? Number(time.slice(11, 13)) : 12;
  const night = hour < 6 || hour >= 20;

  return (
    <svg viewBox="0 0 32 32" className={cx("shrink-0", className)} aria-hidden>
      {kind === "clear" && (night ? <Moon /> : <Sun />)}
      {kind === "partly" && (
        <>
          {night ? (
            <g transform="translate(-4 -5) scale(0.85)">
              <Moon />
            </g>
          ) : (
            <Sun x={11} y={11} r={5} />
          )}
          <Cloud dy={2} />
        </>
      )}
      {kind === "cloudy" && <Cloud />}
      {kind === "fog" && (
        <>
          <Cloud dy={-4} />
          {[24, 28].map((y) => (
            <line key={y} x1="7" y1={y} x2="25" y2={y} stroke={ink} strokeWidth="1.8" strokeLinecap="round" strokeDasharray="4 3" />
          ))}
        </>
      )}
      {kind === "rain" && (
        <>
          <Cloud dy={-5} />
          {[11, 16, 21].map((x) => (
            <line key={x} x1={x} y1="23" x2={x - 1.5} y2="28" stroke={blue} strokeWidth="2.2" strokeLinecap="round" />
          ))}
        </>
      )}
      {kind === "snow" && (
        <>
          <Cloud dy={-5} />
          {[11, 16, 21].map((x) => (
            <g key={x} stroke={blue} strokeWidth="1.6" strokeLinecap="round">
              <line x1={x} y1="23" x2={x} y2="28" />
              <line x1={x - 2.2} y1="25.5" x2={x + 2.2} y2="25.5" />
            </g>
          ))}
        </>
      )}
      {kind === "storm" && (
        <>
          <Cloud dy={-5} />
          <path d="M17 20 L13 26 H16.5 L14.5 31 L20 24 H16.5 L18.5 20 Z" fill={brass} stroke={ink} strokeWidth="1" strokeLinejoin="round" />
        </>
      )}
    </svg>
  );
}

// Which way the wind blows: a dial with "N" at the top and an arrow pointing where
// the wind is going (it comes FROM `fromDeg`), i.e. the way it pushes the ball.
export function WindArrow({ fromDeg, className = "size-6" }: { fromDeg: number; className?: string }) {
  const toward = (fromDeg + 180) % 360;
  return (
    <svg viewBox="0 0 32 32" className={cx("shrink-0", className)} aria-hidden>
      <circle cx="16" cy="16" r="13" fill="var(--color-surface)" stroke="var(--color-edge)" strokeWidth="1.5" />
      <text x="16" y="8.6" textAnchor="middle" fontSize="6" fontWeight="700" fill="var(--color-muted)" fontFamily="var(--font-sans)">
        N
      </text>
      <g transform={`rotate(${toward} 16 16)`}>
        <path d="M16 9.5 L20 18 L16 16.2 L12 18 Z" fill="var(--color-green)" />
        <line x1="16" y1="16.5" x2="16" y2="23" stroke="var(--color-green)" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
}
