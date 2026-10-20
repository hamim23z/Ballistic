'use client';

import { POSITIONS, type PositionId } from '@/components/court/modes';
import type { DraftMode } from '@/components/court/draft/copy';
import { spinLabel, type DraftPlayer, type DraftSpin, type Lineup } from '@/components/court/draft/types';
import { initials } from '@/components/court/draft/DraftCourt';
import SpinReel from '@/components/court/draft/SpinReel';
import StatLine from '@/components/court/draft/StatLine';

// Side panel: spin for a team-era, then put one player from that roster into
// an open spot they can play.
export default function PlayerPicker({
  players,
  spinOptions,
  mode,
  spin,
  round,
  lineup,
  draftedIds,
  onSpun,
  onPlace,
}: {
  players: DraftPlayer[];
  spinOptions: DraftSpin[];
  mode: DraftMode;
  spin: DraftSpin | null;
  /** Changes after every pick so the reel resets for the next spin. */
  round: number;
  lineup: Lineup;
  draftedIds: Set<string>;
  onSpun: (spin: DraftSpin) => void;
  onPlace: (player: DraftPlayer, position: PositionId) => void;
}) {
  const full = POSITIONS.every((p) => lineup[p.id]);
  const roster = spin ? players.filter((p) => p.team === spin.team && p.era === spin.era) : [];

  return (
    <aside
      aria-labelledby="picker-heading"
      className="flex min-h-0 flex-col rounded-2xl border border-court-line bg-court-ink/60 backdrop-blur max-lg:max-h-[85vh] lg:h-full"
      style={{ animation: 'rise 0.8s ease-out 0.35s both' }}
    >
      <div className="border-b border-court-line px-5 pb-4 pt-4">
        <div className="flex items-center justify-between gap-3">
          <h2 id="picker-heading" className="font-display text-lg font-bold text-white">
            {full ? (
              mode.fullTitle
            ) : spin ? (
              <>
                Pick from the <span className="text-gradient">{spin.team}</span>
              </>
            ) : (
              <>
                Spin for a <span className="text-gradient">{mode.pickerIdleAccent}</span>
              </>
            )}
          </h2>
          <span className="rounded-full border border-court-line px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Sample teams
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-400">
          {full
            ? mode.fullHint
            : spin
              ? mode.pickerSpunHint.replace('{team}', spinLabel(spin))
              : mode.pickerIdleHint}
        </p>

        {!full && (
          <div className="mt-4">
            <SpinReel key={round} options={spinOptions} idleLabel={mode.reelIdle} landed={spin} onLand={onSpun} />
          </div>
        )}
      </div>

      <div
        tabIndex={spin ? 0 : -1}
        role="region"
        aria-label={spin ? `${spinLabel(spin)} roster` : 'Roster'}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3 [scrollbar-color:#1f2a3d_transparent] [scrollbar-width:thin] focus-visible:rounded-b-2xl! focus-visible:outline-offset-[-2px]!"
      >
        {!spin ? (
          <div className="flex h-full min-h-40 flex-col items-center justify-center gap-3 px-4 py-8 text-center">
            <div aria-hidden="true" className="flex -space-x-2">
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-10 w-10 rounded-full border-2 border-dashed border-court-line bg-court-navy/60" />
              ))}
            </div>
            <p className="text-sm text-slate-500">
              {full ? 'All five spots are filled.' : 'The roster shows up here after you spin.'}
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {roster.every((p) => draftedIds.has(p.id) || p.positions.every((pos) => lineup[pos])) && (
              <li className="rounded-xl border border-dashed border-ember/50 bg-ember/5 p-3 text-sm text-ember-glow">
                Nobody here fits an open spot. Tap a player on the court to move them and free one up.
              </li>
            )}
            {roster.map((player, index) => {
              const drafted = draftedIds.has(player.id);
              const openSpots = player.positions.filter((pos) => !lineup[pos]);
              const blocked = drafted || openSpots.length === 0;
              return (
                <li
                  key={player.id}
                  className={[
                    'rounded-xl border bg-court-navy/60 p-3 transition-colors duration-200',
                    blocked ? 'border-court-line/60' : 'border-court-line hover:border-ember/40',
                  ].join(' ')}
                  style={{ animation: `rise 0.4s ease-out ${index * 0.05}s both` }}
                >
                  <div className={['flex items-center gap-3', blocked ? 'opacity-50' : ''].join(' ')}>
                    <span
                      aria-hidden="true"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-court-line bg-court-ink font-display text-sm font-bold text-ember-glow"
                    >
                      {initials(player.name)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-sm font-bold text-white sm:text-base">{player.name}</p>
                      <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        {player.era} {player.team}
                      </p>
                    </div>
                    {drafted ? (
                      <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-slate-400">
                        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
                          <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Drafted
                      </span>
                    ) : openSpots.length === 0 ? (
                      <span className="shrink-0 text-xs font-semibold text-slate-500">No open spot</span>
                    ) : null}
                  </div>

                  <div className={blocked ? 'opacity-50' : ''}>
                    <StatLine stats={player.stats} />
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <span className="mr-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      Plays
                    </span>
                    {POSITIONS.filter((p) => player.positions.includes(p.id)).map(({ id }) => {
                      const open = !lineup[id] && !drafted;
                      return (
                        <button
                          key={id}
                          type="button"
                          disabled={!open}
                          onClick={() => onPlace(player, id)}
                          aria-label={
                            open
                              ? `Draft ${player.name} at ${id}`
                              : drafted
                                ? `${player.name} is already drafted`
                                : `${id} is taken`
                          }
                          className={[
                            'min-w-11 rounded-md border px-2.5 py-1.5 font-display text-xs font-bold transition-all',
                            open
                              ? 'border-ember/60 bg-ember/10 text-ember-glow hover:-translate-y-0.5 hover:border-ember hover:bg-ember hover:text-white active:translate-y-0'
                              : 'cursor-not-allowed border-court-line text-slate-600 line-through decoration-slate-600',
                          ].join(' ')}
                        >
                          {open && <span aria-hidden="true">+ </span>}
                          {id}
                        </button>
                      );
                    })}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}
