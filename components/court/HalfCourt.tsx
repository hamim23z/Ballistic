// A regulation half court drawn to scale: 50 ft wide by 47 ft deep, 10 SVG
// units per foot, baseline at the top. Purely decorative; the position
// buttons sit on top of it in CourtBoard.
export default function HalfCourt() {
  const line = 'rgba(255, 179, 122, 0.55)';
  return (
    <svg viewBox="0 0 500 470" className="absolute inset-0 h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="court-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#141d31" />
          <stop offset="100%" stopColor="#0d1424" />
        </linearGradient>
        <pattern id="court-planks" width="500" height="22" patternUnits="userSpaceOnUse">
          <rect width="500" height="22" fill="transparent" />
          <line x1="0" y1="21.5" x2="500" y2="21.5" stroke="rgba(255,179,122,0.035)" />
        </pattern>
        <radialGradient id="court-glow" cx="50%" cy="10%" r="65%">
          <stop offset="0%" stopColor="rgba(255,90,31,0.22)" />
          <stop offset="100%" stopColor="rgba(255,90,31,0)" />
        </radialGradient>
      </defs>

      <rect width="500" height="470" fill="url(#court-floor)" />
      <rect width="500" height="470" fill="url(#court-planks)" />
      <rect width="500" height="470" fill="url(#court-glow)" />

      <g fill="none" stroke={line} strokeWidth="2.5">
        {/* Painted key */}
        <rect x="170" y="0" width="160" height="190" fill="rgba(255,90,31,0.12)" />
        {/* Free throw circle: solid outside the key, dashed inside */}
        <path d="M 190 190 A 60 60 0 0 0 310 190" />
        <path d="M 190 190 A 60 60 0 0 1 310 190" strokeDasharray="10 9" />
        {/* Three point line */}
        <path d="M 30 0 L 30 142 A 237.5 237.5 0 1 0 470 142 L 470 0" />
        {/* Restricted area */}
        <path d="M 210 40 L 210 52.5 A 40 40 0 0 0 290 52.5 L 290 40" />
        {/* Lane hash marks */}
        {[70, 80, 110, 140].map((y) => (
          <g key={y}>
            <line x1="160" y1={y} x2="170" y2={y} />
            <line x1="330" y1={y} x2="340" y2={y} />
          </g>
        ))}
        {/* Half court line and center circle */}
        <line x1="0" y1="470" x2="500" y2="470" strokeWidth="4" />
        <path d="M 190 470 A 60 60 0 0 1 310 470" fill="rgba(255,90,31,0.10)" />
        <path d="M 230 470 A 20 20 0 0 1 270 470" />
      </g>

      {/* Backboard and rim */}
      <line x1="220" y1="40" x2="280" y2="40" stroke="#ffb37a" strokeWidth="4" strokeLinecap="round" />
      <line x1="250" y1="40" x2="250" y2="45" stroke="#ffb37a" strokeWidth="2.5" />
      <circle cx="250" cy="52.5" r="7.5" fill="none" stroke="#ff5a1f" strokeWidth="3" />

      {/* Outer boundary */}
      <rect x="1.5" y="1.5" width="497" height="467" fill="none" stroke={line} strokeWidth="3" />
    </svg>
  );
}
