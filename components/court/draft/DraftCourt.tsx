'use client';

import HalfCourt from '@/components/court/HalfCourt';
import { POSITIONS, type PositionId } from '@/components/court/modes';
import type { Lineup } from '@/components/court/draft/types';

export function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

// The half court from the mode picker, with one lineup slot per position.
// Empty slots are dashed rings; the active slot pulses; filled slots show the
// player's initials, name and a remove button.
export default function DraftCourt({
  lineup,
  active,
  locked,
  onSelect,
  onRemove,
}: {
  lineup: Lineup;
  active: PositionId | null;
  locked: boolean;
  onSelect: (id: PositionId) => void;
  onRemove: (id: PositionId) => void;
}) {
  return (
    <div
      className="relative mx-auto aspect-[500/470] w-full max-w-[640px] overflow-hidden rounded-2xl border border-court-line shadow-2xl shadow-black/50"
      style={{ animation: 'rise 0.8s ease-out 0.2s both' }}
    >
      <HalfCourt />

      <ul className="absolute inset-0" aria-label="Your lineup">
        {POSITIONS.map((position, index) => {
          const player = lineup[position.id];
          const isActive = active === position.id && !locked;
          return (
            <li
              key={position.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${(position.x / 500) * 100}%`, top: `${(position.y / 470) * 100}%` }}
            >
              <div
                className="relative flex flex-col items-center"
                style={{ animation: `rise 0.6s ease-out ${0.45 + index * 0.08}s both` }}
              >
                <button
                  type="button"
                  onClick={() => onSelect(position.id)}
                  disabled={locked}
                  aria-pressed={isActive}
                  aria-label={
                    player
                      ? `${position.id}: ${player.name}. Select to replace.`
                      : `${position.id}: empty. Select to fill.`
                  }
                  className="group/slot relative flex flex-col items-center focus-visible:outline-none! disabled:cursor-default"
                >
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute top-0 h-14 w-14 rounded-full bg-ember/45 animate-pulse-glow sm:h-[4.5rem] sm:w-[4.5rem]"
                    />
                  )}
                  <span
                    className={[
                      'relative flex h-14 w-14 items-center justify-center rounded-full font-display font-bold transition-all duration-200 group-focus-visible/slot:ring-2 group-focus-visible/slot:ring-ember-glow group-focus-visible/slot:ring-offset-2 group-focus-visible/slot:ring-offset-court-ink sm:h-[4.5rem] sm:w-[4.5rem]',
                      player
                        ? 'border-2 border-ember bg-ember text-base text-white shadow-[0_0_28px_rgba(255,90,31,0.55)] sm:text-xl'
                        : isActive
                          ? 'border-2 border-ember bg-court-ink text-sm text-white shadow-[0_0_28px_rgba(255,90,31,0.45)] sm:text-lg'
                          : 'border-2 border-dashed border-ember-glow/50 bg-court-ink/80 text-sm text-slate-300 sm:text-lg',
                      locked ? '' : 'group-hover/slot:scale-110 group-active/slot:scale-95',
                    ].join(' ')}
                  >
                    {player ? (
                      <span key={player.id} style={{ animation: 'rise 0.35s ease-out both' }}>
                        {initials(player.name)}
                      </span>
                    ) : (
                      position.id
                    )}
                  </span>
                  <span
                    className={[
                      'relative mt-1.5 max-w-[7.5rem] truncate whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider sm:max-w-[10rem] sm:text-xs',
                      player ? 'bg-court-ink/90 text-white' : 'bg-court-ink/70 text-slate-400',
                    ].join(' ')}
                  >
                    {player ? (
                      <>
                        <span className="text-ember-glow">{position.id}</span>{' '}
                        <span className="sm:hidden">{player.name.split(' ').at(-1)}</span>
                        <span className="max-sm:hidden">{player.name}</span>
                      </>
                    ) : isActive ? (
                      'Picking…'
                    ) : (
                      'Empty'
                    )}
                  </span>
                </button>

                {player && !locked && (
                  <button
                    type="button"
                    onClick={() => onRemove(position.id)}
                    className="absolute -top-1 left-[calc(50%+14px)] flex h-6 w-6 sm:left-[calc(50%+22px)] items-center justify-center rounded-full border border-court-line bg-court-navy text-slate-300 shadow-md transition-colors hover:border-ember hover:bg-ember hover:text-white focus-visible:outline-offset-1!"
                    style={{ animation: 'rise 0.3s ease-out both' }}
                  >
                    <svg viewBox="0 0 20 20" className="h-3 w-3" aria-hidden="true">
                      <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                    </svg>
                    <span className="sr-only">
                      Remove {player.name} from {position.id}
                    </span>
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
