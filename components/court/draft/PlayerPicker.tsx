'use client';

import type { PositionId } from '@/components/court/modes';
import { spinLabel, type DraftPlayer, type DraftSpin } from '@/components/court/draft/types';
import { initials } from '@/components/court/draft/DraftCourt';
import SpinReel from '@/components/court/draft/SpinReel';

// Side panel for the active slot: spin for a team-era, then pick one player
// from that roster.
export default function PlayerPicker({
  players,
  spinOptions,
  active,
  spin,
  draftedIds,
  onSpun,
  onPick,
}: {
  players: DraftPlayer[];
  spinOptions: DraftSpin[];
  active: PositionId | null;
  spin: DraftSpin | null;
  draftedIds: Set<string>;
  onSpun: (spin: DraftSpin) => void;
  onPick: (player: DraftPlayer) => void;
}) {
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
            {active ? (
              <>
                {spin ? 'Pick' : 'Spin'} your <span className="text-gradient">{active}</span>
              </>
            ) : (
              'Lineup full'
            )}
          </h2>
          <span className="rounded-full border border-court-line px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Sample teams
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-400">
          {!active
            ? 'Select a spot on the court to swap a player in.'
            : spin
              ? `Choose one player from the ${spinLabel(spin)}.`
              : 'Spin to land on a team and era, then pick one player from that roster.'}
        </p>

        {active && (
          <div className="mt-4">
            <SpinReel key={active} options={spinOptions} landed={spin} slot={active} onLand={onSpun} />
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
                <span
                  key={i}
                  className="h-10 w-10 rounded-full border-2 border-dashed border-court-line bg-court-navy/60"
                />
              ))}
            </div>
            <p className="text-sm text-slate-500">
              {active ? 'The roster shows up here after you spin.' : 'All five spots are filled.'}
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {roster.map((player, index) => {
              const drafted = draftedIds.has(player.id);
              const fits = active ? player.positions.includes(active) : false;
              return (
                <li key={player.id} style={{ animation: `rise 0.4s ease-out ${index * 0.05}s both` }}>
                  <button
                    type="button"
                    onClick={() => onPick(player)}
                    disabled={drafted || !active}
                    className="group/player flex w-full items-center gap-3 rounded-xl border border-court-line bg-court-navy/60 p-3 text-left transition-[border-color,background-color,transform] duration-200 enabled:hover:-translate-y-0.5 enabled:hover:border-ember/50 enabled:hover:bg-court-navy disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-offset-[-2px]!"
                  >
                    <span
                      aria-hidden="true"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-court-line bg-court-ink font-display text-sm font-bold text-ember-glow transition-colors group-enabled/player:group-hover/player:border-ember"
                    >
                      {initials(player.name)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-display text-sm font-bold text-white sm:text-base">
                        {player.name}
                      </span>
                      <span className="mt-1 flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                          {player.era} {player.team}
                        </span>
                        {player.positions.map((pos) => (
                          <span
                            key={pos}
                            className={[
                              'rounded px-1.5 py-px text-[10px] font-bold',
                              pos === active ? 'bg-ember/20 text-ember-glow' : 'bg-court-line/70 text-slate-400',
                            ].join(' ')}
                          >
                            {pos}
                          </span>
                        ))}
                      </span>
                    </span>
                    <span className="shrink-0 text-xs font-semibold">
                      {drafted ? (
                        <span className="flex items-center gap-1 text-slate-400">
                          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
                            <path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          Drafted
                        </span>
                      ) : active ? (
                        <span
                          className={[
                            'rounded-md border px-2 py-1 transition-colors group-hover/player:border-ember group-hover/player:bg-ember group-hover/player:text-white',
                            fits ? 'border-ember/50 text-ember-glow' : 'border-court-line text-slate-300',
                          ].join(' ')}
                        >
                          <span className="sr-only">Add to </span>
                          <span aria-hidden="true">+ </span>
                          {active}
                        </span>
                      ) : null}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}
