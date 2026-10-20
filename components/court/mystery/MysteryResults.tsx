'use client';

import type { Ref } from 'react';
import Link from 'next/link';
import type { Guess, Mystery } from '@/components/court/mystery/types';

// Replaces the clue ladder once the player is revealed.
export default function MysteryResults({
  mystery,
  won,
  points,
  maxPoints,
  cluesUsed,
  guesses,
  streak,
  headingRef,
  onNext,
}: {
  mystery: Mystery;
  won: boolean;
  points: number;
  maxPoints: number;
  cluesUsed: number;
  guesses: Guess[];
  /** Streak before this one was played. */
  streak: number;
  headingRef: Ref<HTMLHeadingElement>;
  onNext: () => void;
}) {
  const verdict = won
    ? cluesUsed === 0
      ? 'Called it blind. No clues, no doubt, all net.'
      : `Nothing but net. ${cluesUsed} ${cluesUsed === 1 ? 'clue' : 'clues'}${guesses.length > 1 ? ` and ${guesses.length - 1} bad ${guesses.length === 2 ? 'read' : 'reads'}` : ''}, then you buried it.`
    : mystery.missLine;

  return (
    <aside
      aria-labelledby="mystery-results-heading"
      className="relative flex min-h-0 flex-col overflow-hidden rounded-2xl border border-court-line bg-court-navy/80 backdrop-blur lg:h-full"
      style={{ animation: 'rise 0.6s ease-out both' }}
    >
      <div aria-hidden="true" className={`pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full blur-3xl ${won ? 'bg-ember/30' : 'bg-slate-400/15'}`} />

      <div className="relative min-h-0 flex-1 overflow-y-auto p-5 [scrollbar-color:#1f2a3d_transparent] [scrollbar-width:thin] sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <p className={`text-xs font-semibold uppercase tracking-[0.25em] ${won ? 'text-ember-glow' : 'text-slate-400'}`}>
            {won ? 'Called it' : 'Out of guesses'}
          </p>
          <span className="shrink-0 whitespace-nowrap rounded-full border border-court-line px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Sample player
          </span>
        </div>
        <h2
          id="mystery-results-heading"
          ref={headingRef}
          tabIndex={-1}
          className="mt-4 font-display text-6xl font-bold leading-none text-white focus-visible:outline-none! sm:text-7xl"
        >
          {won ? <span className="text-gradient">{points}</span> : <span className="text-slate-500">0</span>}
          <span className="text-3xl text-slate-500"> / {maxPoints} pts</span>
        </h2>
        <p className="mt-3 font-display text-base font-semibold text-white">{verdict}</p>

        <div className="mt-5 grid gap-1.5" style={{ gridTemplateColumns: `repeat(${mystery.clues.length}, minmax(0, 1fr))` }} aria-hidden="true">
          {mystery.clues.map((clue, i) => (
            <span key={clue.label} className={`h-2 rounded-full ${i < cluesUsed ? (won ? 'bg-ember' : 'bg-slate-500') : 'bg-court-line'}`} />
          ))}
        </div>
        <p className="mt-2 text-xs text-slate-500">
          {cluesUsed} of {mystery.clues.length} clues used
        </p>

        <h3 className="mt-6 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Your guesses</h3>
        <ul className="mt-2 divide-y divide-court-line rounded-xl border border-court-line">
          {guesses.map((guess, i) => (
            <li key={guess.id} className="flex items-center gap-3 px-4 py-2.5 text-sm">
              <span className="w-5 font-display font-bold text-slate-500">{i + 1}</span>
              <span className={`min-w-0 flex-1 truncate ${guess.correct ? 'font-semibold text-white' : 'text-slate-500 line-through'}`}>{guess.name}</span>
              <span className={`text-xs font-bold ${guess.correct ? 'text-ember-glow' : 'text-rose-300'}`}>
                {guess.correct ? '✓ Bucket' : '✕ Miss'}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-court-line bg-court-ink/60 px-4 py-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Streak</p>
            <p className="font-display text-lg font-bold text-white">{won ? `${streak + 1} in a row` : 'Reset to 0'}</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-sm font-bold ${won ? 'bg-ember/20 text-ember-glow' : 'bg-slate-500/20 text-slate-300'}`}>
            {won ? '+1 · keep cooking' : streak > 0 ? `Was ${streak}. Ouch.` : 'Shake it off.'}
          </span>
        </div>
      </div>

      <div className="relative flex gap-3 border-t border-court-line p-4 sm:px-6">
        <Link
          href="/court"
          className="flex-1 rounded-lg border border-court-line px-4 py-2.5 text-center text-sm font-semibold text-slate-200 transition-colors hover:border-ember/60 hover:text-white"
        >
          Game modes
        </Link>
        <button
          type="button"
          onClick={onNext}
          className="flex-1 rounded-lg bg-ember px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-ember/20 transition-all hover:-translate-y-0.5 hover:bg-ember-soft active:translate-y-0"
        >
          {won ? 'Next mystery' : 'Try another'}
        </button>
      </div>
    </aside>
  );
}
