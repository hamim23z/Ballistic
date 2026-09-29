'use client';

import { motion, type Transition } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';

const SHOT_SECONDS = 2.6;
const PAUSE_SECONDS = 1.6;
const SHOT_TIMES = [0, 0.08, 0.5, 0.8, 1];

const shotTransition: Transition = {
  duration: SHOT_SECONDS,
  repeat: Infinity,
  repeatDelay: PAUSE_SECONDS,
  times: SHOT_TIMES,
  ease: ['linear', 'easeOut', 'easeIn', 'linear'],
};

const LINE = 'rgba(255, 138, 80, 0.4)';

// Half court drawn at 20 units per foot: 1000 x 940 (50ft wide, 47ft long),
// baseline along the top, hoop 5.25ft out from it.
const COURT_LINES = [
  'M2 940 V2 H998 V940 Z',
  'M340 2 V380 H660 V2',
  'M380 380 A120 120 0 0 1 620 380',
  'M60 2 V284 A475 475 0 0 0 940 284 V2',
  'M420 105 A80 80 0 0 0 580 105',
  'M380 940 A120 120 0 0 1 620 940',
  'M440 80 H560',
  'M500 80 V90',
];

export default function PlayScene() {
  const reduced = useReducedMotion();

  return (
    <div aria-hidden="true" className="grain pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(100deg, #0a0e14 0%, #0b101a 38%, #14110f 72%, #1e140d 100%)',
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, rgba(255,179,122,0.04) 0px, rgba(255,179,122,0.04) 1px, transparent 1px, transparent 76px)',
          maskImage: 'linear-gradient(90deg, transparent 30%, black 85%)',
          WebkitMaskImage: 'linear-gradient(90deg, transparent 30%, black 85%)',
        }}
      />

      <svg
        viewBox="0 0 1000 940"
        preserveAspectRatio="xMidYMin meet"
        className="absolute left-1/2 top-[6%] h-[85%] w-auto max-w-none -translate-x-1/2 lg:left-[58%] lg:top-[3%] lg:h-[110%]"
      >
        <defs>
          <radialGradient id="scene-pool" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff8a4d" stopOpacity="0.32" />
            <stop offset="55%" stopColor="#ff5a1f" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#ff5a1f" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="scene-ball" cx="35%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#ffb37a" />
            <stop offset="100%" stopColor="#ff5a1f" />
          </radialGradient>
          <filter id="scene-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        <motion.circle
          cx="500"
          cy="180"
          r="640"
          fill="url(#scene-pool)"
          animate={reduced ? undefined : { opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />

        <path d="M340 2 V380 H660 V2 Z" fill="rgba(255, 90, 31, 0.06)" />
        <circle cx="500" cy="380" r="120" fill="rgba(255, 90, 31, 0.035)" />

        <g key={String(reduced)} fill="none" stroke={LINE} strokeWidth="3" strokeLinecap="round">
          {COURT_LINES.map((d, index) => (
            <motion.path
              key={d}
              d={d}
              initial={reduced ? false : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.8, delay: 0.12 * index, ease: 'easeInOut' }}
            />
          ))}
          <motion.path
            d="M380 380 A120 120 0 0 0 620 380"
            strokeDasharray="10 12"
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 1 }}
          />
        </g>

        <circle cx="500" cy="105" r="15" fill="none" stroke="#ff5a1f" strokeWidth="12" opacity="0.4" filter="url(#scene-blur)" />
        <circle cx="500" cy="105" r="15" fill="none" stroke="#ffb37a" strokeWidth="4" />

        {!reduced && (
          <>
            <motion.circle
              r="11"
              fill="#000"
              initial={{ opacity: 0, cx: 200, cy: 600 }}
              animate={{
                cx: [200, 205, 382, 508, 500],
                cy: [600, 595, 356, 115, 105],
                opacity: [0, 0.3, 0.3, 0.3, 0],
              }}
              transition={shotTransition}
            />

            <motion.circle
              cx="500"
              cy="105"
              fill="none"
              stroke="#ffb37a"
              strokeWidth="4"
              initial={{ opacity: 0, r: 15 }}
              animate={{
                r: [15, 15, 15, 15, 70],
                opacity: [0, 0, 0, 0.9, 0],
              }}
              transition={shotTransition}
            />

            <motion.g
              initial={{ opacity: 0, x: 200, y: 600, scale: 1 }}
              animate={{
                x: [200, 205, 360, 500, 500],
                y: [600, 595, 330, 105, 105],
                scale: [1, 1, 1.9, 1.1, 0.5],
                opacity: [0, 1, 1, 1, 0],
              }}
              transition={shotTransition}
            >
              <circle r="16" fill="url(#scene-ball)" />
              <path
                d="M-16 0 H16 M0 -16 V16 M-11 -11 C-4 -4 -4 4 -11 11 M11 -11 C4 -4 4 4 11 11"
                stroke="#0a0e14"
                strokeWidth="1.6"
                fill="none"
                opacity="0.7"
              />
            </motion.g>

            <motion.text
              x="500"
              textAnchor="middle"
              fontSize="46"
              fontWeight="700"
              fill="#ffb37a"
              className="font-display"
              initial={{ opacity: 0, y: 105 }}
              animate={{
                y: [105, 105, 105, 88, 40],
                opacity: [0, 0, 0, 1, 0],
              }}
              transition={shotTransition}
            >
              +3
            </motion.text>
          </>
        )}
      </svg>

      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 58% 35%, transparent 35%, rgba(5, 7, 10, 0.7) 100%)',
        }}
      />
    </div>
  );
}