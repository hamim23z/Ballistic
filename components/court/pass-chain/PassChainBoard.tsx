'use client';

import { useEffect, useRef, useState } from 'react';
import ChainTrack, { type ChainLink } from '@/components/court/pass-chain/ChainTrack';
import ChainResults from '@/components/court/pass-chain/ChainResults';
import PassPanel from '@/components/court/pass-chain/PassPanel';
import type { SearchOption } from '@/components/court/PlayerSearch';
import { careerSpan, sharedStint, type ChainPlayer, type Turnover } from '@/components/court/pass-chain/types';

const SHOT_CLOCK = 24;
/** A pass made with more than this many seconds left counts toward the hot streak. */
const QUICK_PASS_MS = 10_000;

export default function PassChainBoard({
  players,
  starts,
  pastRuns,
}: {
  players: ChainPlayer[];
  /** Player ids who start each run, cycled in order. */
  starts: string[];
  pastRuns: number[];
}) {
  const byId = new Map(players.map((p) => [p.id, p]));
  const [runIndex, setRunIndex] = useState(0);
  const [chain, setChain] = useState<string[]>([starts[0]]);
  const [turnover, setTurnover] = useState<Turnover | null>(null);
  const [history, setHistory] = useState<number[]>(pastRuns);
  const [hot, setHot] = useState(0);
  // The clock starts on the first focus of the pass box, then resets with every pass.
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [announcement, setAnnouncement] = useState('');
  const resultsHeading = useRef<HTMLHeadingElement>(null);
  const resultsPanel = useRef<HTMLDivElement>(null);

  const links: ChainLink[] = chain.map((id, i) => {
    const player = byId.get(id)!;
    return { player, via: i > 0 ? sharedStint(byId.get(chain[i - 1])!, player) : null };
  });
  const current = links[links.length - 1].player;
  const made = links.length - 1;

  const clock = startedAt === null ? SHOT_CLOCK : Math.max(0, SHOT_CLOCK - Math.floor((now - startedAt) / 1000));
  const ended: Turnover | null = turnover ?? (clock === 0 ? { kind: 'shot-clock' } : null);
  const over = ended !== null;
  const best = Math.max(...history, made);

  useEffect(() => {
    if (startedAt === null || over) return;
    const timer = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(timer);
  }, [startedAt, over]);

  useEffect(() => {
    if (!over) return;
    resultsPanel.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    resultsHeading.current?.focus({ preventScroll: true });
  }, [over]);

  const inChain = new Set(chain);
  const options: SearchOption[] = players
    .filter((p) => !inChain.has(p.id))
    .map((p) => ({ id: p.id, name: p.name, meta: careerSpan(p) }))
    .sort((a, b) => a.name.localeCompare(b.name));

  function startClock() {
    if (startedAt !== null) return;
    const t = Date.now();
    setStartedAt(t);
    setNow(t);
  }

  function pass(option: SearchOption) {
    if (ended) return;
    const target = byId.get(option.id);
    if (!target) return;
    const stint = sharedStint(current, target);
    if (!stint) {
      setTurnover({ kind: 'wrong-pass', player: target });
      setAnnouncement(`Turnover. ${current.name} and ${target.name} were never teammates. Chain ends at ${made}.`);
      return;
    }
    const t = Date.now();
    const quick = startedAt === null || t - startedAt < QUICK_PASS_MS;
    setChain([...chain, target.id]);
    setHot(quick ? hot + 1 : 0);
    setStartedAt(t);
    setNow(t);
    setAnnouncement(`Pass connects. ${target.name}, via the ${stint.team}. Chain of ${made + 1}.`);
  }

  function restart() {
    const next = runIndex + 1;
    setHistory([...history, made]);
    setRunIndex(next);
    setChain([starts[next % starts.length]]);
    setTurnover(null);
    setHot(0);
    setStartedAt(null);
    setAnnouncement(`New run. ${byId.get(starts[next % starts.length])?.name} has the ball.`);
  }

  return (
    <>
      <section aria-labelledby="chain-heading" className="flex min-h-0 min-w-0 flex-col">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ember-glow" style={{ animation: 'rise 0.7s ease-out both' }}>
          Pass Chain · Teammate link-up
        </p>
        <div className="mt-3 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between lg:gap-6">
          <h1
            id="chain-heading"
            className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl"
            style={{ animation: 'rise 0.8s ease-out 0.1s both' }}
          >
            Keep the ball <span className="text-gradient">moving</span>.
          </h1>
          <p
            className="text-base font-semibold text-slate-400 lg:shrink-0 lg:pb-1.5 lg:text-right lg:text-sm lg:leading-snug"
            style={{ animation: 'rise 0.8s ease-out 0.15s both' }}
          >
            <span className="lg:block">Every pass needs a teammate.</span> <span className="lg:block">One bad read, the chain snaps.</span>
          </p>
        </div>

        <div className="mt-6 flex min-h-0 flex-1 flex-col" style={{ animation: 'rise 0.8s ease-out 0.2s both' }}>
          <ChainTrack links={links} turnover={ended} best={best} clock={clock} hot={hot} />
        </div>
      </section>

      <div ref={resultsPanel} className="flex min-h-0 min-w-0 scroll-mt-6 flex-col">
        {ended ? (
          <ChainResults links={links} turnover={ended} runs={[...history, made]} headingRef={resultsHeading} onRestart={restart} />
        ) : (
          <PassPanel current={current} options={options} made={made} hot={hot} onFocus={startClock} onPass={pass} />
        )}
      </div>

      <p aria-live="polite" className="sr-only">
        {clock === 0 && !turnover ? `Shot clock violation. Chain ends at ${made}.` : announcement}
      </p>
    </>
  );
}
