'use client';

import type { Ref } from 'react';
import Link from 'next/link';
import { Flame } from '@/components/court/pass-chain/icons';
import type { ChainLink } from '@/components/court/pass-chain/ChainTrack';
import { sameTeamDifferentYears, stintLabel, type Turnover } from '@/components/court/pass-chain/types';

// Replaces the pass panel once the chain snaps: the run as a poster, and how it
// stacks up against earlier runs.
export default function ChainResults({
  links,
  turnover,
  runs,
  headingRef,
  onRestart,
}: {
  links: ChainLink[];
  turnover: Turnover;
  /** Passes made per run, oldest first. The last one is this run. */
  runs: number[];
  headingRef: Ref<HTMLHeadingElement>;
  onRestart: () => void;
}) {
  const made = links.length - 1;
  const best = Math.max(...runs, 1);
  const last = links[links.length - 1].player;

  let verdict: string;
  if (turnover.kind === 'shot-clock') {
    verdict = `Shot clock violation. The ball died in ${last.name}’s hands.`;
  } else {
    const team = sameTeamDifferentYears(last, turnover.player);
    verdict = team
      ? `${last.name.split(' ').at(-1)} and ${turnover.player.name.split(' ').at(-1)} both played for the ${team}. Just never at the same time.`
      : `${last.name} and ${turnover.player.name} never shared a locker room.`;
  }

  return (
    <aside
      aria-labelledby="chain-results-heading"
      className="relative flex min-h-0 flex-col overflow-hidden rounded-2xl border border-court-line bg-court-navy/80 backdrop-blur lg:h-full"
      style={{ animation: 'rise 0.6s ease-out both' }}
    >
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-ember/25 blur-3xl" />

      <div className="relative min-h-0 flex-1 overflow-y-auto p-5 [scrollbar-color:#1f2a3d_transparent] [scrollbar-width:thin] sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-rose-300">Turnover</p>
          <span className="shrink-0 whitespace-nowrap rounded-full border border-court-line px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            Sample players
          </span>
        </div>
        <h2
          id="chain-results-heading"
          ref={headingRef}
          tabIndex={-1}
          className="mt-4 font-display text-6xl font-bold leading-none text-white focus-visible:outline-none!"
        >
          <span className="text-gradient">{made}</span>{' '}
          <span className="text-3xl text-slate-400">{made === 1 ? 'pass' : 'passes'}</span>
        </h2>
        <p className="mt-3 font-display text-base font-semibold text-white">{verdict}</p>

        <div className="mt-5 rounded-xl border border-ember/30 bg-court-ink/70 p-4">
          <div className="flex items-center justify-between">
            <p className="font-display text-sm font-bold uppercase tracking-[0.2em] text-ember-glow">The Chain</p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Ballistic · Pass Chain</p>
          </div>
          <ol className="mt-3">
            {links.map((link, i) => (
              <li key={link.player.id} className="flex gap-3">
                <span aria-hidden="true" className="flex flex-col items-center">
                  <span className={`h-3 w-3 rounded-full ${i === links.length - 1 ? 'bg-ember shadow-[0_0_10px_#ff5a1f]' : 'bg-ember/70'}`} />
                  <span className="w-0.5 flex-1 bg-gradient-to-b from-ember/70 to-ember/30" />
                </span>
                <span className="-mt-1 pb-1.5">
                  <span className="font-display text-sm font-bold text-white">{link.player.name}</span>
                  {link.via && (
                    <span className="ml-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">{stintLabel(link.via)}</span>
                  )}
                </span>
              </li>
            ))}
            <li className="flex gap-3">
              <span aria-hidden="true" className="flex h-3 w-3 items-center justify-center text-[10px] font-bold text-rose-400">
                ✕
              </span>
              <span className="-mt-1">
                {turnover.kind === 'wrong-pass' ? (
                  <>
                    <span className="font-display text-sm font-bold text-slate-500 line-through">{turnover.player.name}</span>
                    <span className="ml-2 text-[10px] font-semibold uppercase tracking-wider text-rose-300">Never teammates</span>
                  </>
                ) : (
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-rose-300">Shot clock violation</span>
                )}
              </span>
            </li>
          </ol>
        </div>

        <h3 className="mt-6 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Your runs</h3>
        <ul className="mt-2 space-y-2">
          {runs.map((passes, i) => {
            const current = i === runs.length - 1;
            const top = passes === best;
            return (
              <li key={i} className="flex items-center gap-3 text-sm">
                <span className={`w-16 shrink-0 font-semibold ${current ? 'text-white' : 'text-slate-400'}`}>
                  {current ? 'This run' : `Run ${i + 1}`}
                </span>
                <span aria-hidden="true" className="h-2.5 flex-1 overflow-hidden rounded-full bg-court-line">
                  <span
                    className={`block h-full rounded-full ${top ? 'bg-ember shadow-[0_0_12px_#ff5a1f]' : 'bg-ember-glow/45'}`}
                    style={{ width: `${(passes / best) * 100}%`, animation: 'rise 0.5s ease-out both' }}
                  />
                </span>
                <span className="flex w-20 shrink-0 items-center justify-end gap-1 font-display font-bold text-white">
                  {top && <Flame className="h-4 w-4" />}
                  {passes}
                  {top && <span className="text-[10px] font-semibold uppercase tracking-wider text-ember-glow">Best</span>}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="relative flex gap-3 border-t border-court-line p-4 sm:px-6">
        <Link
          href="/court"
          className="flex-1 rounded-lg border border-court-line px-4 py-2.5 text-center text-sm font-semibold text-slate-200 transition-colors hover:border-ember/60 hover:text-white"
        >
          Game modes
        </Link>
        <button
          type="button"
          onClick={onRestart}
          className="flex-1 rounded-lg bg-ember px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-ember/20 transition-all hover:-translate-y-0.5 hover:bg-ember-soft active:translate-y-0"
        >
          Run it back
        </button>
      </div>
    </aside>
  );
}
