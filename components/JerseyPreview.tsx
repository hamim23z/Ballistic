'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';

function numberFor(name: string) {
  let hash = 0;
  for (const char of name) {
    hash = (hash * 31 + char.charCodeAt(0)) % 100;
  }
  return String(hash);
}

/**
 * A generic jersey (no team, no league) that prints whatever username is
 * being typed, plus a number derived from it.
 */
export default function JerseyPreview({ name }: { name: string }) {
  const reduced = useReducedMotion();
  const trimmed = name.trim();
  const isEmpty = trimmed.length === 0;
  const display = isEmpty ? 'YOU' : trimmed.toUpperCase();
  const number = isEmpty ? '00' : numberFor(trimmed);
  const nameSize = Math.min(22, 104 / Math.max(display.length, 1) / 0.68);

  return (
    <div className="relative mx-auto h-40 w-36">
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember/25 blur-xl"
      />

      <motion.div
        key={String(reduced)}
        className="relative h-full w-full"
        animate={reduced ? undefined : { y: [0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg
          viewBox="0 0 200 224"
          className="h-full w-full drop-shadow-[0_10px_24px_rgba(255,90,31,0.35)]"
          role="img"
          aria-label={isEmpty ? 'Jersey preview' : `Jersey for ${trimmed}, number ${number}`}
        >
          <defs>
            <linearGradient id="jersey-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff7a45" />
              <stop offset="100%" stopColor="#ff5a1f" />
            </linearGradient>
          </defs>

          <path
            d="M62 6 H84 C90 40 110 40 116 6 H138 C138 34 148 56 170 66 V208 Q170 216 162 216 H38 Q30 216 30 208 V66 C52 56 62 34 62 6 Z"
            fill="url(#jersey-fill)"
          />

          <g fill="none" stroke="#0a0e14" strokeLinecap="round">
            <path d="M84 6 C90 40 110 40 116 6" strokeWidth="5" />
            <path d="M62 6 C62 34 52 56 30 66" strokeWidth="5" />
            <path d="M138 6 C138 34 148 56 170 66" strokeWidth="5" />
            <path d="M30 196 H170" strokeWidth="4" />
            <path d="M30 205 H170" strokeWidth="2" />
            <path d="M40 74 V190 M160 74 V190" strokeWidth="2.5" opacity="0.3" />
          </g>

          <g opacity={isEmpty ? 0.45 : 1} fill="#0a0e14" textAnchor="middle" className="font-display" fontWeight="700">
            <text x="100" y="96" fontSize={nameSize} letterSpacing="1">
              {display}
            </text>
            <motion.text
              key={number}
              x="100"
              y="170"
              fontSize="78"
              initial={reduced ? false : { scale: 0.8, opacity: 0.4 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 18 }}
            >
              {number}
            </motion.text>
          </g>
        </svg>
      </motion.div>
    </div>
  );
}