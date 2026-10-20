'use client';

import PlayerSearch, { type SearchOption } from '@/components/court/PlayerSearch';
import type { Clue, Guess } from '@/components/court/mystery/types';

function Lock() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
      <rect x="3" y="7" width="10" height="7" rx="1.5" fill="currentColor" />
      <path d="M5 7V5a3 3 0 016 0v2" stroke="currentColor" strokeWidth="1.6" fill="none" />
    </svg>
  );
}

// Side panel while playing: the clue ladder, then the guess box.
export default function ClueLadder({
  clues,
  unlocked,
  guesses,
  maxGuesses,
  lastMissLine,
  options,
  onUnlock,
  onGuess,
}: {
  clues: Clue[];
  unlocked: number;
  guesses: Guess[];
  maxGuesses: number;
  /** Feedback for the most recent wrong guess, if any. */
  lastMissLine: string | null;
  options: SearchOption[];
  onUnlock: () => void;
  onGuess: (option: SearchOption) => void;
}) {
  const left = maxGuesses - guesses.length;
  const lastWrong = guesses.at(-1);

  return (
    <aside
      aria-labelledby="ladder-heading"
      className="flex min-h-0 flex-col rounded-2xl border border-court-line bg-court-ink/60 backdrop-blur lg:h-full"
      style={{ animation: 'rise 0.8s ease-out 0.35s both' }}
    >
      <div className="border-b border-court-line px-5 pb-4 pt-4">
        <div className="flex items-center justify-between gap-3">
          <h2 id="ladder-heading" className="font-display text-lg font-bold text-white">
            Clue <span className="text-gradient">ladder</span>
          </h2>
          <span className="shrink-0 rounded-full border border-court-line px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Sample player
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-400">Every rung you climb costs a point.</p>
      </div>

      <ol aria-label="Clues" className="min-h-0 space-y-1 overflow-y-auto p-3">
        {clues.map((clue, i) => {
          const open = i < unlocked;
          const next = i === unlocked;
          return (
            <li
              key={clue.label}
              className={[
                'flex items-center gap-3 rounded-lg border px-3 py-1.5 transition-colors duration-300',
                open ? 'border-ember/40 bg-ember/10' : next ? 'border-dashed border-ember/50' : 'border-court-line/60 opacity-60',
              ].join(' ')}
            >
              <span className={`w-5 font-display text-sm font-bold ${open ? 'text-ember-glow' : 'text-slate-500'}`}>{i + 1}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-500">{clue.label}</span>
                {open ? (
                  <span key="open" className="block truncate text-sm font-semibold text-white" style={{ animation: 'rise 0.35s ease-out both' }}>
                    {clue.value}
                  </span>
                ) : (
                  <span className="block text-sm font-semibold text-slate-600">
                    <span aria-hidden="true">•••••••</span>
                    <span className="sr-only">Locked</span>
                  </span>
                )}
              </span>
              {open ? (
                <span aria-hidden="true" className="text-xs font-semibold text-ember-glow">
                  ✓
                </span>
              ) : next ? (
                <button
                  type="button"
                  onClick={onUnlock}
                  aria-label={`Unlock clue ${i + 1}, ${clue.label}, for one point`}
                  className="shrink-0 rounded-md bg-ember px-2.5 py-1 text-xs font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-ember-soft active:translate-y-0"
                >
                  Unlock −1
                </button>
              ) : (
                <span className="text-slate-600">
                  <Lock />
                </span>
              )}
            </li>
          );
        })}
      </ol>

      <div className="flex-1 border-t border-court-line p-4">
        {lastWrong && lastMissLine && (
          <p className="mb-3 flex flex-wrap items-center gap-2 text-sm" style={{ animation: 'rise 0.3s ease-out both' }}>
            <span className="rounded-md bg-rose-500/15 px-2 py-0.5 font-semibold text-rose-300 line-through">{lastWrong.name}</span>
            <span className="text-xs text-slate-500">{lastMissLine}</span>
          </p>
        )}
        <PlayerSearch
          options={options}
          label="Guess the mystery player"
          placeholder={unlocked === 0 ? 'Think you know? Name him…' : 'Name the mystery player…'}
          cta="Guess"
          onPick={onGuess}
        />
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-court-line px-5 py-3">
        <span className="flex items-center gap-2 text-sm font-semibold text-slate-300">
          Guesses
          <span className="flex gap-1" aria-hidden="true">
            {Array.from({ length: maxGuesses }, (_, g) => (
              <span key={g} className={`h-2.5 w-2.5 rounded-full transition-colors ${g < guesses.length ? 'bg-court-line' : 'bg-ember'}`} />
            ))}
          </span>
        </span>
        <span className="text-xs text-slate-500">
          {unlocked === 0 && guesses.length === 0 ? 'Guess blind for the full 6' : `${left} left`}
        </span>
      </div>
    </aside>
  );
}
