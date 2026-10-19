'use client';

import { useEffect, useRef, useState } from 'react';
import DraftCourt from '@/components/court/draft/DraftCourt';
import PlayerPicker from '@/components/court/draft/PlayerPicker';
import DraftResults from '@/components/court/draft/DraftResults';
import { POSITIONS, type PositionId } from '@/components/court/modes';
import { spinLabel, type DraftPlayer, type DraftResult, type DraftSpin, type Lineup, type Spins } from '@/components/court/draft/types';

const ORDER = POSITIONS.map((p) => p.id);

const EMPTY_LINEUP: Lineup = { PG: null, SG: null, SF: null, PF: null, C: null };
const NO_SPINS: Spins = { PG: null, SG: null, SF: null, PF: null, C: null };

type Snapshot = { lineup: Lineup; spins: Spins; active: PositionId | null };

// The next empty slot after `from`, wrapping around; null when all are filled.
function nextEmpty(lineup: Lineup, from: PositionId | null): PositionId | null {
  const start = from ? ORDER.indexOf(from) : -1;
  for (let step = 1; step <= ORDER.length; step++) {
    const id = ORDER[(start + step) % ORDER.length];
    if (!lineup[id]) return id;
  }
  return null;
}

export default function DraftBoard({
  players,
  spinOptions,
  result,
}: {
  players: DraftPlayer[];
  spinOptions: DraftSpin[];
  result: DraftResult;
}) {
  const [lineup, setLineup] = useState<Lineup>(EMPTY_LINEUP);
  const [spins, setSpins] = useState<Spins>(NO_SPINS);
  const [active, setActive] = useState<PositionId | null>('PG');
  const [history, setHistory] = useState<Snapshot[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const resultsHeading = useRef<HTMLHeadingElement>(null);
  const resultsPanel = useRef<HTMLDivElement>(null);

  const filled = ORDER.filter((id) => lineup[id]).length;
  const complete = filled === ORDER.length;
  const draftedIds = new Set(ORDER.flatMap((id) => (lineup[id] ? [lineup[id].id] : [])));

  useEffect(() => {
    if (!submitted) return;
    resultsPanel.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    resultsHeading.current?.focus({ preventScroll: true });
  }, [submitted]);

  function commit(next: Lineup, nextActive: PositionId | null, message: string, nextSpins = spins) {
    setHistory((prev) => [...prev, { lineup, spins, active }]);
    setLineup(next);
    setSpins(nextSpins);
    setActive(nextActive);
    setAnnouncement(message);
  }

  function pick(player: DraftPlayer) {
    if (!active) return;
    const next = { ...lineup, [active]: player };
    commit(next, nextEmpty(next, active), `${player.name} added at ${active}.`);
  }

  function spun(spin: DraftSpin) {
    if (!active) return;
    commit(lineup, active, `${active} spin landed on the ${spinLabel(spin)}.`, { ...spins, [active]: spin });
  }

  function remove(id: PositionId) {
    const player = lineup[id];
    if (!player) return;
    commit({ ...lineup, [id]: null }, id, `${player.name} removed from ${id}.`);
  }

  function undo() {
    const last = history.at(-1);
    if (!last) return;
    setHistory((prev) => prev.slice(0, -1));
    setLineup(last.lineup);
    setSpins(last.spins);
    setActive(last.active);
    setAnnouncement('Last change undone.');
  }

  function clear() {
    commit(EMPTY_LINEUP, 'PG', 'Lineup cleared.', NO_SPINS);
  }

  function restart() {
    setLineup(EMPTY_LINEUP);
    setSpins(NO_SPINS);
    setActive('PG');
    setHistory([]);
    setSubmitted(false);
    setAnnouncement('New draft started.');
  }

  return (
    <>
      <section aria-labelledby="draft-heading" className="flex min-h-0 flex-col">
        <p
          className="text-xs font-semibold uppercase tracking-[0.3em] text-ember-glow"
          style={{ animation: 'rise 0.7s ease-out both' }}
        >
          82-0 · Spin &amp; draft
        </p>
        <h1
          id="draft-heading"
          className="mt-3 font-display text-4xl font-bold leading-tight text-white sm:text-5xl"
          style={{ animation: 'rise 0.8s ease-out 0.1s both' }}
        >
          Draft your <span className="text-gradient">five</span>.
        </h1>

        <div className="mt-6 flex min-h-0 flex-1 items-center">
          <DraftCourt
            lineup={lineup}
            spins={spins}
            active={active}
            locked={submitted}
            onSelect={setActive}
            onRemove={remove}
          />
        </div>

        <div
          className="mx-auto mt-5 flex w-full max-w-[640px] flex-wrap items-center gap-3"
          style={{ animation: 'rise 0.8s ease-out 0.3s both' }}
        >
          <div className="flex items-center gap-2.5" aria-hidden="true">
            <div className="flex gap-1">
              {ORDER.map((id) => (
                <span
                  key={id}
                  className={[
                    'h-1.5 w-5 rounded-full transition-colors duration-300',
                    lineup[id] ? 'bg-ember' : 'bg-court-line',
                  ].join(' ')}
                />
              ))}
            </div>
          </div>
          <p className="text-sm font-semibold text-slate-300">
            {filled} <span className="text-slate-500">/ 5 drafted</span>
          </p>

          <div className="ml-auto flex items-center gap-2 max-sm:w-full">
            <button
              type="button"
              onClick={undo}
              disabled={history.length === 0 || submitted}
              className="flex items-center gap-1.5 rounded-lg border border-court-line px-3 py-2 text-sm font-semibold text-slate-300 transition-colors enabled:hover:border-ember/60 enabled:hover:text-white disabled:opacity-40 max-sm:flex-1 max-sm:justify-center"
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
                <path d="M7 5L3 9l4 4M3.5 9H12a5 5 0 010 10h-2" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Undo
            </button>
            <button
              type="button"
              onClick={clear}
              disabled={(filled === 0 && !ORDER.some((id) => spins[id])) || submitted}
              className="rounded-lg border border-court-line px-3 py-2 text-sm font-semibold text-slate-300 transition-colors enabled:hover:border-ember/60 enabled:hover:text-white disabled:opacity-40 max-sm:flex-1"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setSubmitted(true)}
              disabled={!complete || submitted}
              aria-describedby={complete ? undefined : 'submit-hint'}
              className="group/btn relative overflow-hidden rounded-lg bg-ember px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-ember/20 transition-all enabled:hover:-translate-y-0.5 enabled:hover:bg-ember-soft enabled:hover:shadow-ember/40 enabled:active:translate-y-0 disabled:cursor-not-allowed disabled:bg-court-line disabled:text-slate-500 disabled:shadow-none focus-visible:rounded-lg! focus-visible:outline-none! focus-visible:ring-2 focus-visible:ring-ember-glow/70 max-sm:flex-[2]"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/30 duration-0 transition-transform ease-out group-enabled/btn:group-hover/btn:translate-x-[450%] group-enabled/btn:group-hover/btn:duration-700 motion-reduce:hidden"
              />
              <span className="relative">{submitted ? 'Submitted' : 'Finalize lineup'}</span>
            </button>
          </div>
          {!complete && (
            <p id="submit-hint" className="w-full text-xs text-slate-500 sm:text-right">
              Fill all five spots to finalize.
            </p>
          )}
        </div>
      </section>

      <div ref={resultsPanel} className="flex min-h-0 scroll-mt-6 flex-col">
        {submitted ? (
          <DraftResults
            result={result}
            lineup={lineup}
            headingRef={resultsHeading}
            onEdit={() => setSubmitted(false)}
            onRestart={restart}
          />
        ) : (
          <PlayerPicker
            players={players}
            spinOptions={spinOptions}
            active={active}
            spin={active ? spins[active] : null}
            draftedIds={draftedIds}
            onSpun={spun}
            onPick={pick}
          />
        )}
      </div>

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </>
  );
}
