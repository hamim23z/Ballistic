'use client';

import { useEffect, useState } from 'react';

const EVENTS = [
  'Seeded sim running…',
  '3PT make · +3',
  'Defensive stop',
  'Fast break · +2',
  'Momentum shift',
  'Clutch free throws',
];

const CLUTCH_EVENTS = [
  'Final minute · crunch time',
  'Timeout · icing the shooter',
  'And-one!',
  'Defensive stand',
  'Live sim',
];

const START_HOME = 90;
const START_AWAY = 90;
const FINAL_HOME = 127;
const FINAL_AWAY = 120;
const FINAL_WIN_PCT = 97;
const GAME_CLOCK_SECONDS = 5 * 60;

const TOTAL_STEPS = 18;
const HOLD_STEPS = 3;
const CYCLE_LENGTH = TOTAL_STEPS + HOLD_STEPS;
const STEP_MS = 1400;
const CLUTCH_START_STEP = Math.round(TOTAL_STEPS * (1 - 60 / GAME_CLOCK_SECONDS));

export default function HeroVisual() {
  const [home, setHome] = useState(START_HOME);
  const [away, setAway] = useState(START_AWAY);
  const [winPct, setWinPct] = useState(50);
  const [clockSeconds, setClockSeconds] = useState(GAME_CLOCK_SECONDS);
  const [eventIndex, setEventIndex] = useState(0);

  useEffect(() => {
    let step = 0;
    let clockRemaining = GAME_CLOCK_SECONDS;

    const id = setInterval(() => {
      step = (step + 1) % CYCLE_LENGTH;
      const t = Math.min(step / TOTAL_STEPS, 1);
      const inClutch = step >= CLUTCH_START_STEP && step < TOTAL_STEPS;

      const homeNow = START_HOME + (FINAL_HOME - START_HOME) * t;
      const awayNow = START_AWAY + (FINAL_AWAY - START_AWAY) * t;
      setHome(Math.round(homeNow));
      setAway(Math.round(awayNow));

      if (t >= 1) {
        setWinPct(FINAL_WIN_PCT);
      } else {
        const margin = homeNow - awayNow;
        const timeRemainingFrac = Math.max(1 - t, 0.05);
        const urgency = 1 / Math.sqrt(timeRemainingFrac);
        const trend = 50 + margin * urgency;

        if (inClutch) {
          const clutchProgress =
            (step - CLUTCH_START_STEP) / (TOTAL_STEPS - CLUTCH_START_STEP);
          const wobble = Math.sin(clutchProgress * Math.PI * 2.5) * 14 * (1 - clutchProgress);
          setWinPct(Math.round(Math.min(99, Math.max(1, trend + wobble))));
        } else {
          setWinPct(Math.round(Math.min(99, Math.max(1, trend))));
        }
      }

      if (step === 0) {
        clockRemaining = GAME_CLOCK_SECONDS;
        setClockSeconds(GAME_CLOCK_SECONDS);
      }

      if (step < TOTAL_STEPS) {
        const pool = inClutch ? CLUTCH_EVENTS : EVENTS;
        setEventIndex((i) => (i + 1) % pool.length);
      }
    }, STEP_MS);

    const totalGameMs = TOTAL_STEPS * STEP_MS;
    const msPerGameSecond = totalGameMs / GAME_CLOCK_SECONDS;
    const clockId = setInterval(() => {
      clockRemaining = Math.max(0, clockRemaining - 1);
      setClockSeconds(clockRemaining);
    }, msPerGameSecond);

    return () => {
      clearInterval(id);
      clearInterval(clockId);
    };
  }, []);

  const isFinalMinute = clockSeconds > 0 && clockSeconds <= 60;
  const eventPool = isFinalMinute ? CLUTCH_EVENTS : EVENTS;
  const displayEvent = eventPool[eventIndex % eventPool.length];
  const minutes = Math.floor(clockSeconds / 60);
  const seconds = clockSeconds % 60;

  return (
    <div className="relative mx-auto w-full max-w-md">
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember/20 blur-3xl animate-pulse-glow"
      />

      <div className="relative rounded-2xl border border-court-line bg-court-navy/80 p-6 shadow-2xl shadow-black/40 backdrop-blur sm:p-7">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember opacity-75 motion-reduce:hidden" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-ember" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-widest text-ember-glow">
              Live sim
            </span>
          </div>
          <span
            className={`font-mono text-xs transition-colors ${
              isFinalMinute ? 'font-semibold text-ember-glow' : 'text-slate-400'
            }`}
          >
            Q4 &middot; {minutes}:{seconds.toString().padStart(2, '0')}
          </span>
        </div>

        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-300">Your draft</span>
            <span className="font-display text-2xl font-bold tabular-nums text-white">
              {home}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Sim opponent</span>
            <span className="font-display text-2xl font-bold tabular-nums text-slate-400">
              {away}
            </span>
          </div>
        </div>

        <div className="my-5 h-px bg-court-line" />

        <div>
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium uppercase tracking-wide text-slate-500">
              Win probability
            </span>
            <span className="font-semibold text-ember-glow">{winPct}%</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-ember to-ember-glow transition-[width] duration-700 ease-out"
              style={{ width: `${winPct}%` }}
            />
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2 rounded-lg bg-court-ink/60 px-3 py-2 text-xs text-slate-400">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-ember" aria-hidden="true" />
          <span className="truncate" aria-live="polite">
            {displayEvent}
          </span>
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-slate-600">
        Illustrative demo &mdash; real odds come from your drafted roster
      </p>
    </div>
  );
}