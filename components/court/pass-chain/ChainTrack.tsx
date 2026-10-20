import { initials } from '@/components/court/draft/DraftCourt';
import { Ball, Flame } from '@/components/court/pass-chain/icons';
import { stintLabel, type ChainPlayer, type Stint, type Turnover } from '@/components/court/pass-chain/types';

const KEYFRAMES = `
@keyframes chain-draw { from { stroke-dashoffset: 140 } to { stroke-dashoffset: 0 } }
@keyframes chain-ring { 0% { transform: scale(1); opacity: .7 } 100% { transform: scale(1.7); opacity: 0 } }
@keyframes chain-snap-l { to { transform: translate(-4px, 6px) rotate(-10deg) } }
@keyframes chain-snap-r { to { transform: translate(4px, 8px) rotate(12deg) } }
`;

export type ChainLink = { player: ChainPlayer; via: Stint | null };

// The court-side view of the run: the last few links, the pass arcs between
// them and either the pulsing next-pass slot or the snapped link.
export default function ChainTrack({
  links,
  turnover,
  best,
  clock,
  hot,
}: {
  links: ChainLink[];
  turnover: Turnover | null;
  best: number;
  clock: number;
  /** Passes in a row made with time to spare. Three or more and the run is on fire. */
  hot: number;
}) {
  const made = links.length - 1;
  const snapped = Boolean(turnover);
  const tail = links.slice(snapped ? -2 : -3);
  const earlier = links.length - tail.length;
  const missed = turnover?.kind === 'wrong-pass' ? turnover.player : null;

  return (
    <div className="relative flex min-h-[340px] flex-1 flex-col overflow-hidden rounded-2xl border border-court-line shadow-2xl shadow-black/50 sm:min-h-[420px]">
      <style>{KEYFRAMES}</style>
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-[#141d31] to-[#0d1424]" />
      <svg aria-hidden="true" viewBox="0 0 800 420" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <line x1="400" y1="0" x2="400" y2="420" stroke="rgba(255,179,122,0.18)" strokeWidth="2" />
        <circle cx="400" cy="210" r="70" stroke="rgba(255,179,122,0.18)" strokeWidth="2" fill="none" />
        <circle cx="400" cy="210" r="22" stroke="rgba(255,179,122,0.12)" strokeWidth="2" fill="none" />
      </svg>
      <div
        aria-hidden="true"
        className={[
          'absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl transition-colors duration-500',
          snapped ? 'bg-rose-500/10' : 'bg-ember/15',
        ].join(' ')}
      />

      <div className="relative flex items-start justify-between gap-3 p-4 sm:p-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-500">Chain</p>
          <p className="mt-1 flex items-center gap-1.5 font-display text-4xl font-bold leading-none text-white sm:text-5xl">
            <span key={made} className={snapped ? 'text-slate-400' : 'text-gradient'} style={{ animation: 'rise 0.35s ease-out both' }}>
              {made}
            </span>
            {made > 0 && !snapped && <Flame className="h-7 w-7 sm:h-9 sm:w-9" />}
            {snapped && (
              <span className="rounded-full bg-rose-500/15 px-2 py-1 font-body text-xs font-semibold uppercase tracking-wider text-rose-300">
                Snapped
              </span>
            )}
          </p>
          {hot >= 3 && !snapped && <p className="mt-1.5 text-xs font-semibold text-ember-glow">On fire · {hot} quick passes in a row</p>}
        </div>
        <div className="flex gap-2">
          <div className="rounded-xl border border-court-line bg-court-ink/70 px-3 py-2 text-right">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Best</p>
            <p className="font-display text-lg font-bold text-white">{best}</p>
          </div>
          <div
            className={[
              'rounded-xl border px-3 py-2 text-right',
              snapped ? 'border-court-line bg-court-ink/70' : clock <= 5 ? 'border-rose-400/60 bg-rose-500/10' : 'border-ember/50 bg-ember/10',
            ].join(' ')}
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Shot clock</p>
            <p
              className={[
                'font-display text-lg font-bold tabular-nums',
                snapped ? 'text-slate-500' : clock <= 5 ? 'text-rose-300' : 'text-ember-glow',
              ].join(' ')}
            >
              {snapped ? '—' : clock}
            </p>
          </div>
        </div>
      </div>

      <div className="relative flex flex-1 items-center justify-center px-1 py-6 sm:px-8">
        <ol aria-label="Latest passes" className="flex w-full max-w-[720px] items-start justify-center">
          {earlier > 0 && (
            <li className="contents">
              <Earlier count={earlier} />
              <Pass via="" kind="made" />
            </li>
          )}
          {tail.map((link, i) => {
            const last = i === tail.length - 1;
            const isStart = earlier + i === 0;
            // On phones only the last two links fit next to the slot.
            const phoneHidden = !snapped && tail.length === 3 && i === 0;
            return (
              <li key={link.player.id} className={`contents ${phoneHidden ? '[&>*]:max-sm:hidden' : ''}`}>
                {i > 0 && (
                  <Pass key={`pass-${links.length}`} via={link.via ? stintLabel(link.via) : ''} kind={last && !snapped ? 'fresh' : 'made'} />
                )}
                <Token name={link.player.name} kind={last && !snapped ? 'current' : isStart ? 'start' : 'link'} />
              </li>
            );
          })}
          {turnover ? (
            <li className="contents">
              <Pass via={missed ? 'Never teammates' : 'Shot clock'} kind="broken" />
              {missed ? <Token name={missed.name} kind="miss" /> : <ClockToken />}
            </li>
          ) : (
            <li className="contents">
              <Pass via="Your pass" kind="pending" />
              <NextSlot />
            </li>
          )}
        </ol>
      </div>

      <div className="relative border-t border-court-line bg-court-ink/60 px-4 py-3 sm:px-5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">The chain so far</p>
        <ol className="mt-2 flex flex-wrap items-center gap-x-1 gap-y-1.5 text-xs">
          {links.map((link, i) => (
            <li key={link.player.id} className="flex items-center gap-1">
              {i > 0 && (
                <span aria-hidden="true" className="text-ember/70">
                  →
                </span>
              )}
              <span
                className={[
                  'rounded-md px-1.5 py-0.5 font-semibold',
                  i === links.length - 1 && !snapped ? 'bg-ember text-white' : 'bg-court-line/70 text-slate-200',
                ].join(' ')}
              >
                {link.player.name.split(' ').at(-1)}
              </span>
            </li>
          ))}
          {missed && (
            <li className="flex items-center gap-1">
              <span aria-hidden="true" className="text-rose-400">
                ✕
              </span>
              <span className="rounded-md bg-rose-500/15 px-1.5 py-0.5 font-semibold text-rose-300 line-through">
                {missed.name.split(' ').at(-1)}
              </span>
            </li>
          )}
        </ol>
      </div>
    </div>
  );
}

function Token({ name, kind }: { name: string; kind: 'link' | 'current' | 'start' | 'miss' }) {
  const ring =
    kind === 'current'
      ? 'border-2 border-white bg-ember text-white shadow-[0_0_40px_rgba(255,90,31,0.7)]'
      : kind === 'miss'
        ? 'border-2 border-dashed border-rose-400/70 bg-court-ink text-slate-500'
        : kind === 'start'
          ? 'border-2 border-ember-glow bg-court-ink text-ember-glow shadow-[0_0_24px_rgba(255,179,122,0.25)]'
          : 'border-2 border-ember bg-ember/15 text-white';
  return (
    <div className="relative flex w-[60px] shrink-0 flex-col items-center sm:w-24 lg:w-28" style={{ animation: 'rise 0.45s ease-out both' }}>
      <span
        className={`relative flex h-14 w-14 items-center justify-center rounded-full font-display text-base font-bold sm:h-20 sm:w-20 sm:text-xl lg:h-24 lg:w-24 lg:text-2xl ${ring}`}
      >
        <span aria-hidden="true">{initials(name)}</span>
        {kind === 'current' && (
          <span className="absolute -bottom-1 -right-1 rounded-full bg-court-ink p-0.5">
            <Ball className="h-5 w-5 sm:h-6 sm:w-6" />
          </span>
        )}
        {kind === 'miss' && (
          <span
            aria-hidden="true"
            className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[11px] font-bold text-white sm:h-6 sm:w-6"
          >
            ✕
          </span>
        )}
      </span>
      <span
        className={[
          'mt-2 w-full text-center font-display text-[11px] font-bold leading-tight sm:text-sm',
          kind === 'miss' ? 'text-slate-500 line-through decoration-rose-400/70' : 'text-white',
        ].join(' ')}
      >
        {name}
      </span>
      {kind === 'start' && <span className="mt-1 text-[9px] font-semibold uppercase tracking-wider text-ember-glow sm:text-[10px]">Tip-off</span>}
      {kind === 'current' && (
        <span className="mt-1 text-[9px] font-semibold uppercase tracking-wider text-ember-glow sm:text-[10px]">Has the ball</span>
      )}
    </div>
  );
}

function Pass({ via, kind }: { via: string; kind: 'made' | 'fresh' | 'pending' | 'broken' }) {
  const arc = 'M2 36 Q50 -10 98 36';
  return (
    <div aria-hidden="true" className="relative -mx-1 flex min-w-8 max-w-40 flex-1 flex-col items-center self-start pt-1 sm:pt-2">
      {via && (
        <span
          className={[
            'absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider sm:-top-8 sm:text-[10px]',
            kind === 'broken'
              ? 'bg-rose-500/15 text-rose-300'
              : kind === 'pending'
                ? 'text-slate-500'
                : 'border border-ember/30 bg-court-ink/90 text-ember-glow',
          ].join(' ')}
        >
          {via}
        </span>
      )}
      <svg viewBox="0 0 100 40" className="h-8 w-full overflow-visible sm:h-12 lg:h-14">
        <defs>
          <linearGradient id="chain-pass" x1="0" x2="1">
            <stop offset="0%" stopColor="#ff5a1f" />
            <stop offset="50%" stopColor="#ffd2a8" />
            <stop offset="100%" stopColor="#ff5a1f" />
          </linearGradient>
        </defs>
        {kind === 'broken' ? (
          <>
            <path d="M2 36 Q22 6 42 8" stroke="#fb7185" strokeWidth="3" fill="none" strokeLinecap="round" style={{ transformOrigin: '2px 36px', animation: 'chain-snap-l .5s .3s ease-out both' }} />
            <path d="M58 8 Q78 6 98 36" stroke="#fb7185" strokeWidth="3" fill="none" strokeLinecap="round" style={{ transformOrigin: '98px 36px', animation: 'chain-snap-r .5s .3s ease-out both' }} />
            <path d="M46 2l4 8-5 4 6 6" stroke="#fb7185" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </>
        ) : kind === 'pending' ? (
          <path d={arc} stroke="rgba(255,179,122,0.45)" strokeWidth="2" strokeDasharray="4 6" fill="none" strokeLinecap="round" />
        ) : (
          <>
            <path d={arc} stroke="#ff5a1f" strokeOpacity=".35" strokeWidth="9" fill="none" strokeLinecap="round" style={{ filter: 'blur(4px)' }} />
            <path
              d={arc}
              stroke="url(#chain-pass)"
              strokeWidth="3"
              strokeDasharray="140"
              fill="none"
              strokeLinecap="round"
              style={kind === 'fresh' ? { animation: 'chain-draw .7s ease-out both' } : undefined}
            />
          </>
        )}
      </svg>
    </div>
  );
}

function NextSlot() {
  return (
    <div className="relative flex w-[60px] shrink-0 flex-col items-center sm:w-24 lg:w-28">
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-ember bg-court-ink/80 sm:h-20 sm:w-20 lg:h-24 lg:w-24">
        <span aria-hidden="true" className="absolute inset-0 rounded-full border-2 border-ember" style={{ animation: 'chain-ring 1.6s ease-out infinite' }} />
        <Ball className="h-7 w-7 opacity-90 sm:h-9 sm:w-9" />
      </span>
      <span className="mt-2 rounded-full bg-ember/90 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white sm:text-[10px]">
        Next pass
      </span>
    </div>
  );
}

function ClockToken() {
  return (
    <div className="relative flex w-[60px] shrink-0 flex-col items-center sm:w-24 lg:w-28">
      <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-dashed border-rose-400/70 bg-court-ink font-display text-lg font-bold text-rose-300 sm:h-20 sm:w-20 sm:text-2xl lg:h-24 lg:w-24">
        0
      </span>
      <span className="mt-2 text-center font-display text-[11px] font-bold leading-tight text-rose-300 sm:text-sm">Violation</span>
    </div>
  );
}

function Earlier({ count }: { count: number }) {
  return (
    <div className="flex w-12 shrink-0 flex-col items-center self-start pt-1.5 sm:w-16 sm:pt-3">
      <span className="relative flex h-11 w-11 items-center justify-center sm:h-14 sm:w-14">
        <span className="absolute inset-0 -translate-x-2 rounded-full border border-court-line bg-court-navy opacity-40" />
        <span className="absolute inset-0 -translate-x-1 rounded-full border border-court-line bg-court-navy opacity-70" />
        <span className="relative flex h-full w-full items-center justify-center rounded-full border border-court-line bg-court-navy font-display text-sm font-bold text-slate-300">
          +{count}
        </span>
      </span>
      <span className="mt-2 text-[9px] font-semibold uppercase tracking-wider text-slate-500 sm:text-[10px]">Earlier</span>
    </div>
  );
}
