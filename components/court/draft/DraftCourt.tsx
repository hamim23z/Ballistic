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
// Empty slots are dashed rings and can't be tapped. A filled slot can be
// tapped to move that player: the spots they can play light up, and tapping one
// moves them there (or swaps, if the other player can play their old spot).
export default function DraftCourt({
  lineup,
  moving,
  openFor,
  locked,
  onSelect,
}: {
  lineup: Lineup;
  moving: PositionId | null;
  /** Empty slots the spun roster can fill, softly highlighted while picking. */
  openFor: Set<PositionId>;
  locked: boolean;
  onSelect: (id: PositionId) => void;
}) {
  const mover = moving ? lineup[moving] : null;

  function canMoveTo(id: PositionId) {
    if (!moving || !mover || id === moving || !mover.positions.includes(id)) return false;
    const occupant = lineup[id];
    return !occupant || occupant.positions.includes(moving);
  }

  return (
    <div
      className="relative mx-auto aspect-[500/470] w-full max-w-[640px] overflow-hidden rounded-2xl border border-court-line shadow-2xl shadow-black/50"
      style={{ animation: 'rise 0.8s ease-out 0.2s both' }}
    >
      <HalfCourt />

      <ul className="absolute inset-0" aria-label="Your lineup">
        {POSITIONS.map((position, index) => {
          const player = lineup[position.id];
          const isMoving = moving === position.id;
          const target = canMoveTo(position.id);
          const open = !player && openFor.has(position.id) && !moving;
          const interactive = !locked && (moving ? isMoving || target : Boolean(player));

          const ring = isMoving
            ? 'border-2 border-white bg-ember text-white shadow-[0_0_36px_rgba(255,90,31,0.7)] scale-110'
            : player
              ? [
                  'border-2 border-ember bg-ember text-white shadow-[0_0_28px_rgba(255,90,31,0.55)]',
                  moving && !target ? 'opacity-40' : '',
                ].join(' ')
              : target
                ? 'border-2 border-ember bg-ember/15 text-white shadow-[0_0_28px_rgba(255,90,31,0.45)]'
                : open
                  ? 'border-2 border-dashed border-ember bg-court-ink/80 text-white'
                  : [
                      'border-2 border-dashed border-ember-glow/40 bg-court-ink/80 text-slate-400',
                      moving ? 'opacity-40' : '',
                    ].join(' ');

          const label = player && target ? (
            <>
              <span className="text-ember-glow">Swap</span> {player.name.split(' ').at(-1)}
            </>
          ) : player ? (
            <>
              <span className="text-ember-glow">{position.id}</span>{' '}
              <span className="sm:hidden">{player.name.split(' ').at(-1)}</span>
              <span className="max-sm:hidden">{player.name}</span>
            </>
          ) : target ? (
            'Move here'
          ) : open ? (
            'Open'
          ) : (
            'Empty'
          );

          const body = (
            <>
              {(target || open) && (
                <span
                  aria-hidden="true"
                  className="absolute top-0 h-14 w-14 rounded-full bg-ember/40 animate-pulse-glow sm:h-[4.5rem] sm:w-[4.5rem]"
                />
              )}
              <span
                className={[
                  'relative flex h-14 w-14 items-center justify-center rounded-full font-display font-bold transition-all duration-200 sm:h-[4.5rem] sm:w-[4.5rem]',
                  player ? 'text-base sm:text-xl' : 'text-sm sm:text-lg',
                  interactive
                    ? 'group-hover/slot:scale-110 group-active/slot:scale-95 group-focus-visible/slot:ring-2 group-focus-visible/slot:ring-ember-glow group-focus-visible/slot:ring-offset-2 group-focus-visible/slot:ring-offset-court-ink'
                    : '',
                  ring,
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
                  player && target
                    ? 'bg-court-ink/90 text-white ring-1 ring-ember'
                    : player
                    ? 'bg-court-ink/90 text-white'
                    : target || open
                      ? 'bg-ember/90 text-white'
                      : 'bg-court-ink/70 text-slate-400',
                ].join(' ')}
              >
                {label}
              </span>
            </>
          );

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
                {interactive ? (
                  <button
                    type="button"
                    onClick={() => onSelect(position.id)}
                    aria-pressed={isMoving}
                    aria-label={
                      isMoving
                        ? `${position.id}: ${player?.name}. Moving. Select again to cancel.`
                        : target
                          ? `Move ${mover?.name} to ${position.id}${player ? `, swapping with ${player.name}` : ''}`
                          : `${position.id}: ${player?.name}. Select to move.`
                    }
                    className="group/slot relative flex flex-col items-center focus-visible:outline-none!"
                  >
                    {body}
                  </button>
                ) : (
                  <div
                    role="img"
                    aria-label={player ? `${position.id}: ${player.name}` : `${position.id}: empty`}
                    className="relative flex flex-col items-center"
                  >
                    {body}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
