'use client';

import { useEffect, useRef, useState } from 'react';
import DraftCourt from '@/components/court/draft/DraftCourt';
import PlayerPicker from '@/components/court/draft/PlayerPicker';
import DraftResults from '@/components/court/draft/DraftResults';
import { POSITIONS, type PositionId } from '@/components/court/modes';
import type { DraftMode } from '@/components/court/draft/copy';
import { spinLabel, type DraftPlayer, type DraftResult, type DraftSpin, type Lineup } from '@/components/court/draft/types';

const ORDER = POSITIONS.map((p) => p.id);

const EMPTY_LINEUP: Lineup = { PG: null, SG: null, SF: null, PF: null, C: null };

export default function DraftBoard({
  players,
  spinOptions,
  result,
  mode,
}: {
  players: DraftPlayer[];
  spinOptions: DraftSpin[];
  result: DraftResult;
  mode: DraftMode;
}) {
  const [lineup, setLineup] = useState<Lineup>(EMPTY_LINEUP);
  const [spin, setSpin] = useState<DraftSpin | null>(null);
  const [moving, setMoving] = useState<PositionId | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const resultsHeading = useRef<HTMLHeadingElement>(null);
  const resultsPanel = useRef<HTMLDivElement>(null);

  const filled = ORDER.filter((id) => lineup[id]).length;
  const complete = filled === ORDER.length;
  const draftedIds = new Set(ORDER.flatMap((id) => (lineup[id] ? [lineup[id].id] : [])));

  // Empty spots someone on the spun roster could fill, lit up on the court.
  const openFor = new Set<PositionId>(
    spin
      ? players
          .filter((p) => p.team === spin.team && p.era === spin.era && !draftedIds.has(p.id))
          .flatMap((p) => p.positions.filter((pos) => !lineup[pos]))
      : [],
  );

  useEffect(() => {
    if (!submitted) return;
    resultsPanel.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    resultsHeading.current?.focus({ preventScroll: true });
  }, [submitted]);

  useEffect(() => {
    if (!moving) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setMoving(null);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [moving]);

  function spun(next: DraftSpin) {
    setSpin(next);
    setAnnouncement(`Spin landed on the ${spinLabel(next)}.`);
  }

  function place(player: DraftPlayer, position: PositionId) {
    setLineup({ ...lineup, [position]: player });
    setSpin(null);
    setMoving(null);
    setAnnouncement(`${player.name} drafted at ${position}.`);
  }

  function selectSlot(id: PositionId) {
    if (!moving) {
      setMoving(id);
      setAnnouncement(`Moving ${lineup[id]?.name}. Choose a highlighted spot, or press Escape to cancel.`);
      return;
    }
    if (id === moving) {
      setMoving(null);
      setAnnouncement('Move cancelled.');
      return;
    }
    const mover = lineup[moving];
    const occupant = lineup[id];
    setLineup({ ...lineup, [id]: mover, [moving]: occupant });
    setMoving(null);
    setAnnouncement(
      occupant
        ? `${mover?.name} moved to ${id}, ${occupant.name} moved to ${moving}.`
        : `${mover?.name} moved to ${id}.`,
    );
  }

  function restart() {
    setLineup(EMPTY_LINEUP);
    setSpin(null);
    setMoving(null);
    setSubmitted(false);
    setAnnouncement('New draft started.');
  }

  const moverName = moving ? lineup[moving]?.name : null;

  return (
    <>
      <section aria-labelledby="draft-heading" className="flex min-h-0 flex-col">
        <p
          className="text-xs font-semibold uppercase tracking-[0.3em] text-ember-glow"
          style={{ animation: 'rise 0.7s ease-out both' }}
        >
          {mode.eyebrow}
        </p>
        <div className="mt-3 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between lg:gap-6">
          <h1
            id="draft-heading"
            className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl"
            style={{ animation: 'rise 0.8s ease-out 0.1s both' }}
          >
            {mode.headline.before}
            <span className="text-gradient">{mode.headline.accent}</span>
            {mode.headline.after}
          </h1>
          {/* Beside the headline on desktop so the court keeps its height; one sentence per line there. */}
          {mode.tagline && (
            <p
              className="text-base font-semibold text-slate-400 lg:shrink-0 lg:pb-1.5 lg:text-right lg:text-sm lg:leading-snug"
              style={{ animation: 'rise 0.8s ease-out 0.15s both' }}
            >
              {mode.tagline.split(/(?<=\.)\s+/).map((sentence) => (
                <span key={sentence} className="lg:block">
                  {sentence}{' '}
                </span>
              ))}
            </p>
          )}
        </div>

        <div className="mt-6 flex min-h-0 flex-1 items-center">
          <DraftCourt lineup={lineup} moving={moving} openFor={openFor} locked={submitted} onSelect={selectSlot} />
        </div>

        <div
          className="mx-auto mt-5 flex w-full max-w-[640px] flex-wrap items-center gap-3"
          style={{ animation: 'rise 0.8s ease-out 0.3s both' }}
        >
          <div className="flex gap-1" aria-hidden="true">
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
          <p className="text-sm font-semibold text-slate-300">
            {filled} <span className="text-slate-500">/ 5 drafted</span>
          </p>

          <button
            type="button"
            onClick={() => {
              setMoving(null);
              setSubmitted(true);
            }}
            disabled={!complete || submitted}
            aria-describedby="submit-hint"
            className="group/btn relative ml-auto overflow-hidden rounded-lg bg-ember px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-ember/20 transition-all enabled:hover:-translate-y-0.5 enabled:hover:bg-ember-soft enabled:hover:shadow-ember/40 enabled:active:translate-y-0 disabled:cursor-not-allowed disabled:bg-court-line disabled:text-slate-500 disabled:shadow-none focus-visible:rounded-lg! focus-visible:outline-none! focus-visible:ring-2 focus-visible:ring-ember-glow/70 max-sm:w-full"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/30 duration-0 transition-transform ease-out group-enabled/btn:group-hover/btn:translate-x-[450%] group-enabled/btn:group-hover/btn:duration-700 motion-reduce:hidden"
            />
            <span className="relative">{submitted ? mode.submitted : mode.finalize}</span>
          </button>
          {moverName ? (
            <div
              className="flex w-full items-center justify-between gap-3 rounded-lg border border-ember/60 bg-ember/10 py-1.5 pl-3.5 pr-1.5 text-sm font-semibold text-white"
              style={{ animation: 'rise 0.3s ease-out both' }}
            >
              <span className="min-w-0 truncate">
                Moving {moverName}. Tap a lit spot.
              </span>
              <button
                type="button"
                onClick={() => setMoving(null)}
                className="shrink-0 rounded-md bg-court-line px-3 py-1 text-xs text-slate-200 transition-colors hover:bg-ember hover:text-white"
              >
                Cancel
              </button>
            </div>
          ) : (
            <p id="submit-hint" className="w-full text-xs text-slate-500 sm:text-right">
              {complete
                ? 'Tap a player on the court to move them.'
                : 'Fill all five spots to finalize. Tap a drafted player to move them.'}
            </p>
          )}
        </div>
      </section>

      <div ref={resultsPanel} className="flex min-h-0 scroll-mt-6 flex-col">
        {submitted ? (
          <DraftResults
            result={result}
            mode={mode}
            lineup={lineup}
            headingRef={resultsHeading}
            onEdit={() => setSubmitted(false)}
            onRestart={restart}
          />
        ) : (
          <PlayerPicker
            players={players}
            spinOptions={spinOptions}
            mode={mode}
            spin={spin}
            round={filled}
            lineup={lineup}
            draftedIds={draftedIds}
            onSpun={spun}
            onPlace={place}
          />
        )}
      </div>

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </>
  );
}
