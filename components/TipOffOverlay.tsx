'use client';

import { AnimatePresence, motion } from 'framer-motion';

export const TIP_OFF_MS = 2000;

const TOSS_TIMES = [0, 0.35, 0.65, 0.82, 1];

export default function TipOffOverlay({ show, name }: { show: boolean; name: string }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="tip-off"
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-court-ink/90 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.span
            aria-hidden="true"
            className="absolute h-40 w-40 rounded-full border-2 border-ember"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 0, 7], opacity: [0, 0.8, 0] }}
            transition={{ duration: 1.5, times: [0, 0.62, 1], ease: 'easeOut' }}
          />

          <div className="relative flex flex-col items-center">
            <div className="relative h-72 w-24">
              <motion.span
                aria-hidden="true"
                className="absolute bottom-0 left-2 right-2 h-3 rounded-[50%] bg-black/70 blur-sm"
                animate={{ scaleX: [1, 0.35, 1, 0.8, 1], opacity: [0.8, 0.3, 0.8, 0.5, 0.8] }}
                transition={{ duration: 1.5, times: TOSS_TIMES, ease: 'easeInOut' }}
              />

              <motion.div
                className="absolute bottom-3 left-1/2 -ml-8 h-16 w-16"
                animate={{
                  y: [0, -230, 0, -56, 0],
                  rotate: [0, 200, 360, 420, 480],
                }}
                transition={{
                  duration: 1.5,
                  times: TOSS_TIMES,
                  ease: ['easeOut', 'easeIn', 'easeOut', 'easeIn'],
                }}
              >
                <svg viewBox="0 0 32 32" className="h-full w-full" aria-hidden="true">
                  <circle cx="16" cy="16" r="14" fill="#ff5a1f" />
                  <path
                    d="M16 2v28M2 16h28M6 6c4 4 4 16 0 20M26 6c-4 4-4 16 0 20"
                    stroke="#0a0e14"
                    strokeWidth="1.4"
                    fill="none"
                  />
                </svg>
              </motion.div>
            </div>

            <motion.p
              className="mt-6 font-display text-5xl font-bold uppercase tracking-widest text-white sm:text-6xl"
              initial={{ opacity: 0, y: 14, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.7, type: 'spring', stiffness: 260, damping: 18 }}
            >
              Tip-off
            </motion.p>
            <motion.p
              className="mt-2 text-sm text-ember-glow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.3 }}
            >
              Good luck, {name}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}