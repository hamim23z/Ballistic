import type { Mystery } from '@/components/court/mystery/types';

export type Phase = 'playing' | 'won' | 'lost';

const KEYFRAMES = `
@keyframes mystery-sweep { 0% { transform: rotate(-7deg) } 100% { transform: rotate(7deg) } }
@keyframes mystery-spark { 0% { transform: translateY(0) scale(1); opacity: 1 } 100% { transform: translateY(-60px) scale(.4); opacity: 0 } }
`;

// How blurry the silhouette is for each number of clues unlocked.
const BLUR = [10, 8, 6, 4, 3, 2, 1];

const SPARKS = [
  [10, 30, 0], [88, 20, 0.4], [96, 60, 0.9], [4, 70, 1.3], [50, 0, 0.7], [76, 88, 1.6], [20, 90, 0.2],
];

// The trading card in the middle of the stage. A blurred silhouette while
// playing; on the reveal it sharpens into the player under a spotlight, warm
// for a win and cold, stamped "Airball", for a miss.
export default function MysteryCard({ mystery, phase, unlocked }: { mystery: Mystery; phase: Phase; unlocked: number }) {
  const revealed = phase !== 'playing';
  const missed = phase === 'lost';

  return (
    <div className="relative">
      <style>{KEYFRAMES}</style>
      {revealed && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-48 left-1/2 -ml-[320px] h-[640px] w-[640px] origin-top"
          style={{
            background: missed
              ? 'conic-gradient(from 165deg at 50% 0%, transparent 0deg, rgba(148,163,184,.28) 15deg, transparent 30deg)'
              : 'conic-gradient(from 162deg at 50% 0%, transparent 0deg, rgba(255,210,168,.5) 18deg, transparent 36deg)',
            animation: 'mystery-sweep 2.4s ease-in-out infinite alternate',
          }}
        />
      )}

      <div
        role="img"
        aria-label={revealed ? `${mystery.name}, ${mystery.team}, ${mystery.years}` : 'Mystery player, hidden'}
        className={[
          'relative aspect-[3/4] w-48 overflow-hidden rounded-2xl border-2 p-1 transition-shadow duration-700 sm:w-60 lg:w-64',
          missed
            ? 'border-slate-500/60 shadow-[0_0_40px_rgba(100,116,139,0.35)]'
            : revealed
              ? 'border-ember-glow shadow-[0_0_60px_rgba(255,90,31,0.55)]'
              : 'border-ember/60 shadow-2xl shadow-black/60',
        ].join(' ')}
      >
        <div
          className={[
            'relative h-full w-full overflow-hidden rounded-xl',
            missed ? 'bg-gradient-to-b from-slate-700 to-slate-900 grayscale' : 'bg-gradient-to-b from-[#2a1a14] via-[#141d31] to-[#0d1424]',
          ].join(' ')}
        >
          <div aria-hidden="true" className={`absolute left-1/2 top-6 h-40 w-40 -translate-x-1/2 rounded-full blur-2xl ${missed ? 'bg-slate-400/20' : 'bg-ember/35'}`} />
          <span className="absolute left-3 top-3 z-10 rounded-md bg-court-ink/80 px-1.5 py-0.5 font-display text-xs font-bold text-ember-glow">
            #{revealed ? mystery.jersey : '??'}
          </span>
          <span className="absolute right-3 top-3 z-10 text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400">Ballistic</span>

          <Silhouette jersey={mystery.jersey} phase={phase} blur={revealed ? 0 : BLUR[unlocked] ?? 1} />

          {!revealed && (
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 font-display text-6xl font-bold text-ember/40 sm:text-7xl"
            >
              ?
            </span>
          )}
          <div className="absolute inset-x-2 bottom-2 z-10 rounded-lg border border-white/10 bg-court-ink/85 px-3 py-2 backdrop-blur">
            <p
              key={String(revealed)}
              className={`truncate font-display text-base font-bold sm:text-lg ${revealed ? 'text-white' : 'tracking-[0.3em] text-slate-500'}`}
              style={revealed ? { animation: 'rise 0.5s ease-out both' } : undefined}
            >
              {revealed ? mystery.name : '???? ?????'}
            </p>
            <p className="truncate text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              {revealed ? `${mystery.team} · ${mystery.years}` : `Mystery No. ${mystery.number}`}
            </p>
          </div>
          {missed && (
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-[30%] z-20 -translate-x-1/2 -rotate-12 rounded-md border-2 border-rose-400 px-3 py-1 font-display text-2xl font-bold uppercase tracking-widest text-rose-300 sm:text-3xl"
              style={{ animation: 'rise 0.4s ease-out 0.3s both' }}
            >
              Airball
            </span>
          )}
        </div>
      </div>

      {revealed && (
        <div
          aria-hidden="true"
          className={`absolute -bottom-6 left-1/2 h-10 w-[140%] -translate-x-1/2 rounded-[50%] blur-xl ${missed ? 'bg-slate-400/25' : 'bg-ember-glow/35'}`}
        />
      )}
      {phase === 'won' &&
        SPARKS.map(([x, y, delay], i) => (
          <span
            key={i}
            aria-hidden="true"
            className="absolute h-2 w-2 rounded-full bg-ember-glow shadow-[0_0_10px_#ffb37a]"
            style={{ left: `${x}%`, top: `${y}%`, animation: `mystery-spark 1.8s ${delay}s ease-out infinite` }}
          />
        ))}
    </div>
  );
}

function Silhouette({ jersey, phase, blur }: { jersey: string; phase: Phase; blur: number }) {
  const revealed = phase !== 'playing';
  const missed = phase === 'lost';
  return (
    <svg
      viewBox="0 0 200 240"
      aria-hidden="true"
      className="absolute inset-x-0 bottom-12 h-[78%] w-full transition-[filter] duration-700"
      style={{ filter: `blur(${blur}px)` }}
    >
      <defs>
        <linearGradient id="mystery-jersey" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={missed ? '#64748b' : '#ff7a45'} />
          <stop offset="100%" stopColor={missed ? '#334155' : '#c2410c'} />
        </linearGradient>
        <linearGradient id="mystery-skin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={missed ? '#475569' : '#7a5442'} />
          <stop offset="100%" stopColor={missed ? '#1e293b' : '#3a271f'} />
        </linearGradient>
      </defs>
      <g fill={revealed ? 'url(#mystery-skin)' : '#05070b'}>
        <ellipse cx="100" cy="72" rx="29" ry="35" />
        <path d="M86 100h28v26H86z" />
        <path d="M22 240c0-62 22-100 78-108 56 8 78 46 78 108z" />
      </g>
      {revealed && (
        <>
          <path d="M52 240v-80c10-14 22-22 30-24 6 14 30 14 36 0 8 2 20 10 30 24v80z" fill="url(#mystery-jersey)" />
          <text x="100" y="214" textAnchor="middle" fontFamily="Space Grotesk, sans-serif" fontWeight="700" fontSize="44" fill="#0a0e14" opacity=".85">
            {jersey}
          </text>
        </>
      )}
    </svg>
  );
}
