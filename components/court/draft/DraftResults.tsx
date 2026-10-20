'use client';

import type { Ref } from 'react';
import { POSITIONS } from '@/components/court/modes';
import type { DraftMode } from '@/components/court/draft/copy';
import type { DraftResult, Lineup } from '@/components/court/draft/types';

const SEASON = 82;

// Shown in place of the player picker once the lineup is submitted.
export default function DraftResults({
  result,
  mode,
  lineup,
  headingRef,
  onEdit,
  onRestart,
}: {
  result: DraftResult;
  mode: DraftMode;
  lineup: Lineup;
  headingRef: Ref<HTMLHeadingElement>;
  onEdit: () => void;
  onRestart: () => void;
}) {
  const losses = SEASON - result.wins;
  const diff = result.wins - result.par;
  // Par is a floor when winning and a ceiling when tanking.
  const tanking = mode.goal === 'lose';
  const beatPar = tanking ? diff <= 0 : diff >= 0;
  const perfect = result.wins === (tanking ? 0 : SEASON);
  const verdict = mode.verdict
    ? perfect ? mode.verdict.perfect : beatPar ? mode.verdict.beatPar : mode.verdict.missedPar
    : null;
  const highlighted = (game: number) => (game < result.wins) !== tanking;

  return (
    <aside
      aria-labelledby="results-heading"
      className="relative flex min-h-0 flex-col overflow-hidden rounded-2xl border border-court-line bg-court-navy/80 backdrop-blur lg:h-full"
      style={{ animation: 'rise 0.6s ease-out both' }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-ember/25 blur-3xl"
      />

      <div className="relative min-h-0 flex-1 overflow-y-auto p-5 [scrollbar-color:#1f2a3d_transparent] [scrollbar-width:thin] sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-ember-glow">{mode.resultsEyebrow}</p>
          <span className="shrink-0 whitespace-nowrap rounded-full border border-court-line px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Sample result
          </span>
        </div>

        <h2
          id="results-heading"
          ref={headingRef}
          tabIndex={-1}
          className="mt-4 font-display text-6xl font-bold leading-none text-white focus-visible:outline-none! sm:text-7xl"
        >
          {tanking ? result.wins : <span className="text-gradient">{result.wins}</span>}
          <span className="text-slate-600">–</span>
          {tanking ? <span className="text-gradient">{losses}</span> : losses}
        </h2>
        <p className="mt-2 text-sm text-slate-400">{mode.resultsSubline}</p>
        {verdict && <p className="mt-3 font-display text-base font-semibold text-white">{verdict}</p>}

        <div
          aria-hidden="true"
          className="mt-5 grid grid-cols-[repeat(41,minmax(0,1fr))] gap-[3px]"
        >
          {Array.from({ length: SEASON }, (_, game) => (
            <span
              key={game}
              className={[
                'aspect-square rounded-[2px]',
                highlighted(game) ? 'bg-ember' : 'bg-court-line',
              ].join(' ')}
              style={{ animation: `rise 0.4s ease-out ${0.2 + game * 0.012}s both` }}
            />
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-court-line bg-court-ink/60 px-4 py-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{mode.parLabel}</p>
            <p className="font-display text-lg font-bold text-white">{result.par} wins</p>
          </div>
          <span
            className={[
              'rounded-full px-3 py-1 text-sm font-bold',
              beatPar ? 'bg-ember/20 text-ember-glow' : 'bg-slate-500/20 text-slate-300',
            ].join(' ')}
          >
            {diff === 0
              ? `Even with ${mode.parLabel.toLowerCase()}`
              : `${diff > 0 ? '+' : '−'}${Math.abs(diff)} ${diff > 0 ? 'over' : 'under'} ${mode.parLabel.toLowerCase()}`}
          </span>
        </div>

        <h3 className="mt-6 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Your five</h3>
        <ul className="mt-2 divide-y divide-court-line rounded-xl border border-court-line">
          {POSITIONS.map((position) => (
            <li key={position.id} className="flex items-center gap-3 px-4 py-2.5 text-sm">
              <span className="w-7 font-display font-bold text-ember-glow">{position.id}</span>
              <span className="min-w-0 flex-1 truncate text-white">{lineup[position.id]?.name}</span>
              <span className="shrink-0 text-xs text-slate-500">
                {lineup[position.id]?.era} {lineup[position.id]?.team}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative flex gap-3 border-t border-court-line p-4 sm:px-6">
        <button
          type="button"
          onClick={onEdit}
          className="flex-1 rounded-lg border border-court-line px-4 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:border-ember/60 hover:text-white"
        >
          Edit lineup
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="flex-1 rounded-lg bg-ember px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-ember/20 transition-all hover:-translate-y-0.5 hover:bg-ember-soft active:translate-y-0"
        >
          {mode.restart}
        </button>
      </div>
    </aside>
  );
}
