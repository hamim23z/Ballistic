'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';

// How long the full block plays, and when the hand meets the ball.
// Forms wait SWAT_MS before swapping to their confirmation state.
export const SWAT_MS = 1500;
const IMPACT_AT = 0.48;
export const IMPACT_MS = SWAT_MS * IMPACT_AT;

const SHOT_CLOCK = 24;
// The clock sits on 0 for this many ticks (the buzzer) before resetting.
const BUZZER_TICKS = 2;

const SWAT_TIMES = [0, 0.3, IMPACT_AT, 0.7, 1];
const swatTransition = { duration: SWAT_MS / 1000, times: SWAT_TIMES };

const BALL_LINES = 'M-16 0 H16 M0 -16 V16 M-11 -11 C-4 -4 -4 4 -11 11 M11 -11 C4 -4 4 4 11 11';

type ShotClockSceneProps = {
  /** Increment to play the block animation once. 0 means never played. */
  swatKey: number;
  /** Increment to flash a shot clock violation (e.g. a form error). */
  violationKey: number;
  /** When true the clock stops on a fresh 24, used for the confirmation state. */
  settled: boolean;
  /** Small label under the digits once settled. */
  settledLabel: string;
};

export default function ShotClockScene({
  swatKey,
  violationKey,
  settled,
  settledLabel,
}: ShotClockSceneProps) {
  const reduced = useReducedMotion();
  // Counts 24 down to -BUZZER_TICKS; anything at or below 0 shows as 0 with the buzzer on.
  const [tick, setTick] = useState(SHOT_CLOCK);
  const frozen = reduced || settled;

  useEffect(() => {
    if (frozen) return;
    const id = window.setInterval(() => {
      setTick((t) => (t <= -BUZZER_TICKS ? SHOT_CLOCK : t - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [frozen]);

  // The clock resets the moment the hand gets the ball: new possession.
  useEffect(() => {
    if (swatKey === 0) return;
    const id = window.setTimeout(() => setTick(SHOT_CLOCK), reduced ? 0 : IMPACT_MS);
    return () => window.clearTimeout(id);
  }, [swatKey, reduced]);

  const seconds = frozen ? SHOT_CLOCK : Math.max(0, tick);
  const buzzer = !frozen && tick <= 0;
  const low = !frozen && tick <= 5;
  const digitColor = buzzer ? '#ff3b30' : low ? '#ff7a45' : '#ffb37a';
  const label = settled ? settledLabel : buzzer ? 'Violation' : 'Shot clock';

  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-md lg:max-w-xl">
      <svg viewBox="0 0 600 640" className="h-auto w-full">
        <defs>
          <radialGradient id="pw-pool" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#ff8a4d" stopOpacity="0.28" />
            <stop offset="60%" stopColor="#ff5a1f" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#ff5a1f" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="pw-ball" cx="35%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#ffb37a" />
            <stop offset="100%" stopColor="#ff5a1f" />
          </radialGradient>
          <linearGradient id="pw-arm" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a3852" />
            <stop offset="100%" stopColor="#141c2c" />
          </linearGradient>
          <filter id="pw-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
        </defs>

        <motion.circle
          cx="300"
          cy="300"
          r="320"
          fill="url(#pw-pool)"
          animate={reduced ? undefined : { opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Shot clock */}
        <motion.g
          animate={buzzer ? { scale: [1, 1.04, 1] } : { scale: 1 }}
          transition={{ duration: 0.5, repeat: buzzer ? Infinity : 0 }}
          style={{ transformOrigin: '300px 90px' }}
        >
          <line x1="300" y1="150" x2="300" y2="176" stroke="#1f2a3d" strokeWidth="8" />
          <rect
            x="190"
            y="18"
            width="220"
            height="132"
            rx="18"
            fill="#070a10"
            stroke={buzzer ? '#ff3b30' : 'rgba(255, 138, 80, 0.45)'}
            strokeWidth="3"
          />
          {buzzer && (
            <motion.rect
              x="190"
              y="18"
              width="220"
              height="132"
              rx="18"
              fill="#ff3b30"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.22, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          )}
          <motion.rect
            key={`violation-${violationKey}`}
            x="190"
            y="18"
            width="220"
            height="132"
            rx="18"
            fill="#ff3b30"
            initial={{ opacity: 0 }}
            animate={violationKey > 0 && !reduced ? { opacity: [0, 0.35, 0, 0.35, 0] } : { opacity: 0 }}
            transition={{ duration: 0.7 }}
          />
          {/* Unlit segments behind the digits, like a real LED board */}
          <text
            x="300"
            y="114"
            textAnchor="middle"
            fontSize="96"
            fontWeight="700"
            fill="rgba(255, 138, 80, 0.07)"
            className="font-display"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            88
          </text>
          <text
            x="300"
            y="114"
            textAnchor="middle"
            fontSize="96"
            fontWeight="700"
            fill={digitColor}
            opacity="0.55"
            filter="url(#pw-glow)"
            className="font-display"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {String(seconds).padStart(2, '0')}
          </text>
          <text
            x="300"
            y="114"
            textAnchor="middle"
            fontSize="96"
            fontWeight="700"
            fill={digitColor}
            className="font-display"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            {String(seconds).padStart(2, '0')}
          </text>
          <text
            x="300"
            y="140"
            textAnchor="middle"
            fontSize="13"
            fontWeight="600"
            letterSpacing="4"
            fill={buzzer ? '#ff6b5e' : 'rgba(255, 179, 122, 0.7)'}
            className="uppercase"
          >
            {label.toUpperCase()}
          </text>
        </motion.g>

        {/* Backboard, rim and net */}
        <rect
          x="160"
          y="176"
          width="280"
          height="168"
          rx="6"
          fill="rgba(15, 23, 41, 0.55)"
          stroke="rgba(255, 138, 80, 0.4)"
          strokeWidth="3"
        />
        <rect
          x="252"
          y="252"
          width="96"
          height="70"
          fill="none"
          stroke="rgba(255, 138, 80, 0.4)"
          strokeWidth="3"
        />
        <g fill="none" stroke="rgba(226, 232, 240, 0.28)" strokeWidth="2" strokeLinecap="round">
          <path d="M256 344 L268 404 M276 344 L282 406 M300 344 V408 M324 344 L318 406 M344 344 L332 404" />
          <path d="M260 362 Q300 372 340 362 M266 384 Q300 392 334 384 M270 404 Q300 410 330 404" />
        </g>
        <ellipse cx="300" cy="344" rx="48" ry="9" fill="none" stroke="#ff5a1f" strokeWidth="12" opacity="0.35" filter="url(#pw-glow)" />
        <ellipse cx="300" cy="344" rx="48" ry="9" fill="none" stroke="#ffb37a" strokeWidth="4" />

        {/* Floor */}
        <path
          d="M40 600 H560 M150 600 A150 40 0 0 1 450 600"
          fill="none"
          stroke="rgba(255, 138, 80, 0.22)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Resting ball when idle, so the scene never looks empty */}
        <AnimatePresence>
          {swatKey === 0 && (
            <motion.g
              key="resting"
              initial={{ opacity: 0 }}
              animate={
                reduced
                  ? { opacity: 1, x: 120, y: 576 }
                  : { opacity: 1, x: 120, y: [576, 540, 576] }
              }
              exit={{ opacity: 0, transition: { duration: reduced ? 0 : 0.15 } }}
              transition={
                reduced
                  ? { duration: 0 }
                  : {
                      opacity: { duration: 0.3 },
                      y: { duration: 0.9, repeat: Infinity, ease: ['easeOut', 'easeIn'] },
                    }
              }
            >
              <circle r="22" fill="url(#pw-ball)" />
              <path d={BALL_LINES} transform="scale(1.375)" stroke="#0a0e14" strokeWidth="1.2" fill="none" opacity="0.7" />
            </motion.g>
          )}
        </AnimatePresence>

        {swatKey > 0 && !reduced && <Swat key={swatKey} />}
      </svg>
    </div>
  );
}

// One shot, one block. Remounted with a new key each time it plays.
function Swat() {
  return (
    <>
      {/* Blocker's arm rising from the right */}
      <motion.g
        initial={{ x: 470, y: 700, rotate: 18, opacity: 1 }}
        animate={{
          x: [470, 330, 262, 236, 470],
          y: [700, 420, 300, 304, 720],
          rotate: [18, -8, -28, -40, 10],
          opacity: [1, 1, 1, 1, 0],
        }}
        transition={{ ...swatTransition, ease: ['easeOut', 'easeOut', 'easeOut', 'easeIn'] }}
      >
        <Hand stroke="#9a6142" fill="#9a6142" grow={4} />
        <Hand stroke="url(#pw-arm)" fill="#2a3852" grow={0} />
      </motion.g>

      {/* Ball: jumper from the left, swatted back out of frame */}
      <motion.g
        initial={{ x: 120, y: 576, opacity: 1, rotate: 0 }}
        animate={{
          x: [120, 170, 236, 90, -90],
          y: [576, 380, 286, 150, 40],
          rotate: [0, 120, 240, 620, 900],
          scale: [1, 1.05, 1, 0.9, 0.8],
          opacity: [1, 1, 1, 1, 0],
        }}
        transition={{ ...swatTransition, ease: ['easeOut', 'linear', 'easeOut', 'linear'] }}
      >
        <circle r="22" fill="url(#pw-ball)" />
        <path d={BALL_LINES} transform="scale(1.375)" stroke="#0a0e14" strokeWidth="1.2" fill="none" opacity="0.7" />
      </motion.g>

      {/* Impact burst */}
      <motion.circle
        cx="236"
        cy="286"
        fill="none"
        stroke="#ffb37a"
        strokeWidth="4"
        initial={{ r: 10, opacity: 0 }}
        animate={{ r: [10, 10, 10, 90, 120], opacity: [0, 0, 1, 0.3, 0] }}
        transition={swatTransition}
      />
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0, 1, 1, 0] }}
        transition={swatTransition}
        stroke="#ffb37a"
        strokeWidth="4"
        strokeLinecap="round"
      >
        <path d="M236 240 V218 M276 254 L292 238 M196 254 L180 238 M286 292 H310 M186 292 H162" />
      </motion.g>
      <motion.text
        x="330"
        y="250"
        fontSize="54"
        fontWeight="700"
        fill="#ffb37a"
        className="font-display"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: [0, 0, 1, 1, 0], scale: [0.6, 0.6, 1.15, 1, 1], y: [0, 0, 0, -10, -30] }}
        transition={swatTransition}
        style={{ transformOrigin: '400px 240px' }}
      >
        SWAT!
      </motion.text>
    </>
  );
}

// Open palm and forearm, drawn twice (outline layer, then fill) so the pieces
// read as one silhouette.
function Hand({ stroke, fill, grow }: { stroke: string; fill: string; grow: number }) {
  return (
    <g strokeLinecap="round" fill="none">
      <path d="M16 30 L70 240" stroke={stroke} strokeWidth={40 + grow} />
      <g stroke={fill} strokeWidth={14 + grow}>
        <path d="M-12 -2 L-28 -40" />
        <path d="M0 -10 L-6 -58" />
        <path d="M14 -10 L18 -60" />
        <path d="M27 -2 L40 -46" />
        <path d="M-16 22 L-44 8" />
      </g>
      <ellipse cx="8" cy="12" rx={28 + grow / 2} ry={28 + grow / 2} fill={fill} stroke="none" />
    </g>
  );
}
