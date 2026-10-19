'use client';

import { useId, useMemo, useState } from 'react';
import { POSITIONS, type PositionId } from '@/components/court/modes';
import type { DraftPlayer } from '@/components/court/draft/types';
import { initials } from '@/components/court/draft/DraftCourt';

type Filter = PositionId | 'ALL';

const FILTERS: Filter[] = ['ALL', ...POSITIONS.map((p) => p.id)];

export default function PlayerPicker({
  players,
  active,
  draftedIds,
  onPick,
}: {
  players: DraftPlayer[];
  active: PositionId | null;
  draftedIds: Set<string>;
  onPick: (player: DraftPlayer) => void;
}) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('ALL');
  const searchId = useId();

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return players.filter(
      (player) =>
        (filter === 'ALL' || player.positions.includes(filter)) &&
        (!q || player.name.toLowerCase().includes(q) || player.era.includes(q)),
    );
  }, [players, query, filter]);

  return (
    <aside
      aria-labelledby="picker-heading"
      className="flex min-h-0 flex-col rounded-2xl border border-court-line bg-court-ink/60 backdrop-blur max-lg:max-h-[75vh] lg:h-full"
      style={{ animation: 'rise 0.8s ease-out 0.35s both' }}
    >
      <div className="border-b border-court-line px-5 pb-4 pt-4">
        <div className="flex items-center justify-between gap-3">
          <h2 id="picker-heading" className="font-display text-lg font-bold text-white">
            {active ? (
              <>
                Pick your <span className="text-gradient">{active}</span>
              </>
            ) : (
              'Lineup full'
            )}
          </h2>
          <span className="rounded-full border border-court-line px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Sample players
          </span>
        </div>
        {!active && (
          <p className="mt-1 text-sm text-slate-400">Select a spot on the court to swap a player in.</p>
        )}

        <label htmlFor={searchId} className="sr-only">
          Search players
        </label>
        <div className="relative mt-3">
          <svg
            viewBox="0 0 20 20"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500"
            aria-hidden="true"
          >
            <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.8" fill="none" />
            <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            id={searchId}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Escape' && query) {
                event.preventDefault();
                setQuery('');
              }
            }}
            placeholder="Search by name or decade"
            autoComplete="off"
            className="w-full rounded-lg border border-court-line bg-court-navy/80 py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 transition-colors focus:border-ember/70 focus-visible:outline-none! focus-visible:ring-2 focus-visible:ring-ember/40"
          />
        </div>

        <div role="group" aria-label="Filter by position" className="mt-3 flex flex-wrap gap-1.5">
          {FILTERS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setFilter(option)}
              aria-pressed={filter === option}
              className={[
                'rounded-full border px-3 py-1 text-xs font-semibold transition-colors',
                filter === option
                  ? 'border-ember bg-ember text-white'
                  : 'border-court-line text-slate-400 hover:border-ember/50 hover:text-white',
              ].join(' ')}
            >
              {option === 'ALL' ? 'All' : option}
            </button>
          ))}
        </div>
      </div>

      <div
        tabIndex={0}
        role="region"
        aria-label="Players"
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3 [scrollbar-color:#1f2a3d_transparent] [scrollbar-width:thin] focus-visible:rounded-b-2xl! focus-visible:outline-offset-[-2px]!"
      >
        {visible.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
            <p className="font-display text-base font-bold text-white">No players found</p>
            <p className="mt-1 text-sm text-slate-500">Try another name, decade or position.</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {visible.map((player) => {
              const drafted = draftedIds.has(player.id);
              const disabled = drafted || !active;
              return (
                <li key={player.id}>
                  <button
                    type="button"
                    onClick={() => onPick(player)}
                    disabled={disabled}
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
                          {player.era}
                        </span>
                        {player.positions.map((pos) => (
                          <span
                            key={pos}
                            className={[
                              'rounded px-1.5 py-px text-[10px] font-bold',
                              pos === active
                                ? 'bg-ember/20 text-ember-glow'
                                : 'bg-court-line/70 text-slate-400',
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
                        <span className="rounded-md border border-court-line px-2 py-1 text-slate-300 transition-colors group-hover/player:border-ember group-hover/player:bg-ember group-hover/player:text-white">
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
