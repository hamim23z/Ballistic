'use client';

import PlayerSearch, { type SearchOption } from '@/components/court/PlayerSearch';
import { Flame } from '@/components/court/pass-chain/icons';
import { stintLabel, type ChainPlayer } from '@/components/court/pass-chain/types';

const RULES = [
  ['No repeats', 'Each player touches the ball once per run.'],
  ['No take-backs', 'A pass to someone who was never a teammate is a turnover.'],
  ['Beat the clock', '24 seconds a pass. Quick passes keep the streak hot.'],
];

// Side panel while a run is live: who has the ball, where they played, and the pass box.
export default function PassPanel({
  current,
  options,
  made,
  hot,
  onFocus,
  onPass,
}: {
  current: ChainPlayer;
  options: SearchOption[];
  made: number;
  hot: number;
  onFocus: () => void;
  onPass: (option: SearchOption) => void;
}) {
  return (
    <aside
      aria-labelledby="pass-heading"
      className="flex min-h-0 flex-col rounded-2xl border border-court-line bg-court-ink/60 backdrop-blur lg:h-full"
      style={{ animation: 'rise 0.8s ease-out 0.35s both' }}
    >
      <div className="border-b border-court-line px-5 pb-4 pt-4">
        <div className="flex items-center justify-between gap-3">
          <h2 id="pass-heading" className="font-display text-lg font-bold text-white">
            Ball’s with <span className="text-gradient">{current.name}</span>
          </h2>
          <span className="shrink-0 rounded-full border border-court-line px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Sample players
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-400">
          {made === 0
            ? 'Tip-off. Pass to anyone who ever shared a locker room with him. The clock starts when you do.'
            : 'Find his next teammate before the shot clock runs out.'}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="mr-1 self-center text-[10px] font-semibold uppercase tracking-wider text-slate-500">Played for</span>
          {current.stints.map((stint) => (
            <span
              key={`${stint.team}-${stint.from}`}
              className="rounded-md border border-court-line bg-court-navy/60 px-2 py-1 text-[11px] font-semibold text-slate-200"
            >
              {stintLabel(stint)}
            </span>
          ))}
        </div>
      </div>

      <div className="flex-1 p-4 sm:p-5">
        <PlayerSearch
          key={current.id}
          options={options}
          label={`Pass from ${current.name} to`}
          placeholder="Name a teammate…"
          cta="Pass"
          onFocus={onFocus}
          onPick={onPass}
        />

        <ul className="mt-5 space-y-2.5 text-sm text-slate-400">
          {RULES.map(([title, detail]) => (
            <li key={title} className="flex gap-3">
              <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ember" />
              <span>
                <span className="font-semibold text-white">{title}.</span> {detail}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-court-line px-5 py-3">
        <span className="flex items-center gap-1.5 text-sm font-semibold text-slate-300">
          <Flame className="h-4 w-4" />
          {hot >= 3 ? `Streak bonus ×${hot}` : 'Three quick passes lights it up'}
        </span>
        <span className="text-xs text-slate-500">Passes made: {made}</span>
      </div>
    </aside>
  );
}
