'use client';

import { useState } from 'react';
import HalfCourt from '@/components/court/HalfCourt';
import GameModeDialog from '@/components/court/GameModeDialog';
import { POSITIONS, type CourtPosition } from '@/components/court/modes';

export default function CourtBoard() {
  const [selected, setSelected] = useState<CourtPosition | null>(null);

  return (
    <>
      <div
        className="relative mx-auto aspect-[500/470] w-full max-w-[640px] overflow-hidden rounded-2xl border border-court-line shadow-2xl shadow-black/50"
        style={{ animation: 'rise 0.8s ease-out 0.2s both' }}
      >
        <HalfCourt />

        <ul className="absolute inset-0">
          {POSITIONS.map((position, index) => (
            <li
              key={position.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${(position.x / 500) * 100}%`, top: `${(position.y / 470) * 100}%` }}
            >
              <button
                type="button"
                onClick={() => setSelected(position)}
                aria-haspopup="dialog"
                className="group/pos relative flex flex-col items-center focus-visible:outline-none!"
                style={{ animation: `rise 0.6s ease-out ${0.45 + index * 0.08}s both` }}
              >
                <span
                  aria-hidden="true"
                  className="absolute top-0 h-12 w-12 rounded-full bg-ember/40 animate-pulse-glow sm:h-16 sm:w-16"
                  style={{ animationDelay: `${index * 0.5}s` }}
                />
                <span className="relative flex h-12 w-12 items-center justify-center rounded-full border-2 border-ember bg-court-ink font-display text-sm font-bold text-white shadow-[0_0_24px_rgba(255,90,31,0.35)] transition-all duration-200 group-hover/pos:scale-110 group-hover/pos:bg-ember group-hover/pos:shadow-[0_0_36px_rgba(255,90,31,0.6)] group-focus-visible/pos:scale-110 group-focus-visible/pos:ring-2 group-focus-visible/pos:ring-ember-glow group-focus-visible/pos:ring-offset-2 group-focus-visible/pos:ring-offset-court-ink group-active/pos:scale-95 sm:h-16 sm:w-16 sm:text-lg">
                  {position.id}
                </span>
                <span className="relative mt-1.5 whitespace-nowrap rounded-full bg-court-ink/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-300 sm:text-xs">
                  {position.name}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <GameModeDialog position={selected} onClose={() => setSelected(null)} />
    </>
  );
}
