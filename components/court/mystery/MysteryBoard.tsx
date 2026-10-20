'use client';

import { useEffect, useRef, useState } from 'react';
import type { SearchOption } from '@/components/court/PlayerSearch';
import ClueLadder from '@/components/court/mystery/ClueLadder';
import ClueTiles from '@/components/court/mystery/ClueTiles';
import MysteryCard, { type Phase } from '@/components/court/mystery/MysteryCard';
import MysteryResults from '@/components/court/mystery/MysteryResults';
import type { Guess, Mystery } from '@/components/court/mystery/types';

const MAX_GUESSES = 3;
/** How many clues get a flip tile on the stage. The rest live only on the ladder. */
const TILES = 3;
const MISS_LINES = ['Not him. Keep climbing.', 'Swing and a miss.', 'Wrong guy. The ladder’s right there.'];

export default function MysteryBoard({
  mysteries,
  pool,
  startStreak,
}: {
  mysteries: Mystery[];
  pool: SearchOption[];
  startStreak: number;
}) {
  const [index, setIndex] = useState(0);
  const [unlocked, setUnlocked] = useState(0);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [streak, setStreak] = useState(startStreak);
  const [announcement, setAnnouncement] = useState('');
  const resultsHeading = useRef<HTMLHeadingElement>(null);
  const resultsPanel = useRef<HTMLDivElement>(null);

  const mystery = mysteries[index % mysteries.length];
  const maxPoints = mystery.clues.length;
  const points = Math.max(1, maxPoints - unlocked);
  const won = guesses.some((g) => g.correct);
  const phase: Phase = won ? 'won' : guesses.length >= MAX_GUESSES ? 'lost' : 'playing';
  const revealed = phase !== 'playing';

  useEffect(() => {
    if (!revealed) return;
    resultsPanel.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    resultsHeading.current?.focus({ preventScroll: true });
  }, [revealed]);

  const guessed = new Set(guesses.map((g) => g.id));
  const options = pool.filter((o) => !guessed.has(o.id));

  const lastGuess = guesses.at(-1);
  const lastMissLine =
    lastGuess && !lastGuess.correct
      ? mystery.nearMisses?.[lastGuess.id] ?? MISS_LINES[(guesses.length - 1) % MISS_LINES.length]
      : null;

  function unlock() {
    if (revealed || unlocked >= mystery.clues.length) return;
    const clue = mystery.clues[unlocked];
    setUnlocked(unlocked + 1);
    setAnnouncement(`Clue ${unlocked + 1}, ${clue.label}: ${clue.value}. Now worth ${Math.max(1, maxPoints - unlocked - 1)} points.`);
  }

  function guess(option: SearchOption) {
    if (revealed) return;
    const correct = option.id === mystery.answerId;
    const next = [...guesses, { id: option.id, name: option.name, correct }];
    setGuesses(next);
    if (correct) setAnnouncement(`Correct. It’s ${mystery.name}. ${points} points.`);
    else if (next.length >= MAX_GUESSES) setAnnouncement(`Out of guesses. It was ${mystery.name}.`);
    else setAnnouncement(`${option.name} is not it. ${MAX_GUESSES - next.length} guesses left.`);
  }

  function nextMystery() {
    setStreak(won ? streak + 1 : 0);
    setIndex(index + 1);
    setUnlocked(0);
    setGuesses([]);
    setAnnouncement('New mystery player. All clues locked.');
  }

  return (
    <>
      <section aria-labelledby="mystery-heading" className="flex min-h-0 min-w-0 flex-col">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ember-glow" style={{ animation: 'rise 0.7s ease-out both' }}>
          Mystery Player · Name the hooper
        </p>
        <div className="mt-3 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between lg:gap-6">
          <h1
            id="mystery-heading"
            className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl"
            style={{ animation: 'rise 0.8s ease-out 0.1s both' }}
          >
            Guess <span className="text-gradient">who</span>.
          </h1>
          <p
            className="text-base font-semibold text-slate-400 lg:shrink-0 lg:pb-1.5 lg:text-right lg:text-sm lg:leading-snug"
            style={{ animation: 'rise 0.8s ease-out 0.15s both' }}
          >
            <span className="lg:block">Fewer clues.</span> <span className="lg:block">Bigger bragging rights.</span>
          </p>
        </div>

        <div
          className="relative mt-6 flex min-h-[460px] flex-1 flex-col overflow-hidden rounded-2xl border border-court-line shadow-2xl shadow-black/50"
          style={{ animation: 'rise 0.8s ease-out 0.2s both' }}
        >
          <div
            aria-hidden="true"
            className={`absolute inset-0 bg-gradient-to-b transition-colors duration-700 ${phase === 'lost' ? 'from-[#121826] to-[#0a0e14]' : 'from-[#141d31] to-[#0d1424]'}`}
          />
          <svg aria-hidden="true" viewBox="0 0 800 460" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
            <path d="M260 460V300h280v160M320 300a80 80 0 01160 0" stroke="rgba(255,179,122,0.12)" strokeWidth="2" fill="none" />
            <path d="M120 460a280 280 0 01560 0" stroke="rgba(255,179,122,0.08)" strokeWidth="2" fill="none" />
          </svg>

          <div className="relative flex items-center justify-between gap-3 p-4 sm:p-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-500">Today’s mystery</p>
              <p className="mt-1 font-display text-lg font-bold text-white">No. {mystery.number}</p>
            </div>
            <div className="flex gap-2">
              <div className="rounded-xl border border-court-line bg-court-ink/70 px-3 py-2 text-right">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Streak</p>
                <p className="font-display text-lg font-bold text-white">{phase === 'won' ? streak + 1 : phase === 'lost' ? 0 : streak}</p>
              </div>
              <div className={`rounded-xl border px-3 py-2 text-right ${revealed ? 'border-court-line bg-court-ink/70' : 'border-ember/50 bg-ember/10'}`}>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Worth</p>
                <p key={points} className={`font-display text-lg font-bold ${revealed ? 'text-slate-400' : 'text-ember-glow'}`} style={{ animation: 'rise 0.3s ease-out both' }}>
                  {revealed ? '—' : `${points} pts`}
                </p>
              </div>
            </div>
          </div>

          <div className="relative flex flex-1 flex-col items-center justify-center gap-6 px-4 pb-6 sm:flex-row sm:gap-10 sm:px-8">
            <MysteryCard key={mystery.id} mystery={mystery} phase={phase} unlocked={unlocked} />
            <ClueTiles clues={mystery.clues.slice(0, TILES)} unlocked={phase === 'lost' ? TILES : unlocked} muted={phase === 'lost'} />
          </div>
        </div>
      </section>

      <div ref={resultsPanel} className="flex min-h-0 min-w-0 scroll-mt-6 flex-col">
        {revealed ? (
          <MysteryResults
            mystery={mystery}
            won={won}
            points={points}
            maxPoints={maxPoints}
            cluesUsed={unlocked}
            guesses={guesses}
            streak={streak}
            headingRef={resultsHeading}
            onNext={nextMystery}
          />
        ) : (
          <ClueLadder
            key={mystery.id}
            clues={mystery.clues}
            unlocked={unlocked}
            guesses={guesses}
            maxGuesses={MAX_GUESSES}
            lastMissLine={lastMissLine}
            options={options}
            onUnlock={unlock}
            onGuess={guess}
          />
        )}
      </div>

      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </>
  );
}
