'use client';

import { useEffect, useRef, useState } from 'react';
import type { PositionId } from '@/components/court/modes';
import type { DraftSpin } from '@/components/court/draft/types';

const ITEM = 56; // px per reel row
const LAPS = 5; // full passes through the options before landing

// A slot-machine reel of team-eras. Three rows are visible; the middle one is
// the result. Remount it (key) for each lineup slot so it starts fresh.
export default function SpinReel({
  options,
  landed,
  slot,
  onLand,
}: {
  options: DraftSpin[];
  landed: DraftSpin | null;
  slot: PositionId;
  onLand: (spin: DraftSpin) => void;
}) {
  const strip = Array.from({ length: LAPS + 1 }, () => options).flat();
  const landedIndex = landed ? options.findIndex((o) => o.id === landed.id) : -1;

  const [center, setCenter] = useState(landedIndex >= 0 ? (LAPS - 1) * options.length + landedIndex : 1);
  const [spinning, setSpinning] = useState(false);
  const target = useRef<DraftSpin | null>(null);
  const fallback = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(fallback.current), []);

  function finish() {
    if (!target.current) return;
    clearTimeout(fallback.current);
    const spin = target.current;
    target.current = null;
    setSpinning(false);
    onLand(spin);
  }

  function spin() {
    const index = Math.floor(Math.random() * options.length);
    target.current = options[index];
    setSpinning(true);
    setCenter((LAPS - 1) * options.length + index);
    // In case transitionend never fires (tab hidden, reduced motion quirks).
    fallback.current = setTimeout(finish, 2600);
  }

  const done = Boolean(landed) && !spinning;

  return (
    <div>
      <div
        className={[
          'relative overflow-hidden rounded-xl border bg-court-ink/80 transition-colors duration-300',
          done ? 'border-ember/60' : 'border-court-line',
        ].join(' ')}
        style={{ height: ITEM * 3 }}
      >
        <div
          aria-hidden="true"
          className={[
            'pointer-events-none absolute inset-x-2 top-1/2 z-10 -translate-y-1/2 rounded-lg border transition-colors duration-300',
            done ? 'border-ember bg-ember/10 shadow-[0_0_28px_rgba(255,90,31,0.35)]' : 'border-court-line/80 bg-white/[0.02]',
          ].join(' ')}
          style={{ height: ITEM }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20 bg-[linear-gradient(180deg,#0a0e14_0%,transparent_32%,transparent_68%,#0a0e14_100%)]"
        />

        <ul
          aria-hidden="true"
          onTransitionEnd={(event) => {
            if (event.target === event.currentTarget) finish();
          }}
          className="relative"
          style={{
            transform: `translateY(${-(center - 1) * ITEM}px)`,
            transition: spinning ? 'transform 2.2s cubic-bezier(0.12, 0.7, 0.18, 1)' : 'none',
          }}
        >
          {strip.map((option, i) => (
            <li
              key={`${option.id}-${i}`}
              className={[
                'flex items-center justify-center gap-2.5 font-display transition-colors',
                i === center && done ? 'text-white' : 'text-slate-500',
              ].join(' ')}
              style={{ height: ITEM }}
            >
              <span className="text-xs font-semibold tracking-wider text-ember-glow/80">{option.era}</span>
              <span className="text-xl font-bold">{option.team}</span>
            </li>
          ))}
        </ul>

        {!landed && !spinning && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-court-ink/40 backdrop-blur-[2px]">
            <span className="font-display text-sm font-semibold uppercase tracking-[0.25em] text-slate-300">
              Spin for your {slot}
            </span>
          </div>
        )}
      </div>

      {!done && (
        <button
          type="button"
          onClick={spin}
          disabled={spinning}
          className="group/btn relative mt-3 w-full overflow-hidden rounded-lg bg-ember px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-ember/20 transition-all enabled:hover:-translate-y-0.5 enabled:hover:bg-ember-soft enabled:hover:shadow-ember/40 enabled:active:translate-y-0 disabled:cursor-wait disabled:opacity-80 focus-visible:rounded-lg! focus-visible:outline-none! focus-visible:ring-2 focus-visible:ring-ember-glow/70"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/30 duration-0 transition-transform ease-out group-enabled/btn:group-hover/btn:translate-x-[450%] group-enabled/btn:group-hover/btn:duration-700 motion-reduce:hidden"
          />
          <span className="relative flex items-center justify-center gap-2">
            <svg
              viewBox="0 0 20 20"
              className={['h-4 w-4', spinning ? 'animate-spin' : ''].join(' ')}
              aria-hidden="true"
            >
              <path d="M16 10a6 6 0 11-1.8-4.3M16 3.5v3.2h-3.2" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {spinning ? 'Spinning…' : `Spin for ${slot}`}
          </span>
        </button>
      )}
    </div>
  );
}
