'use client';
import { motion } from 'framer-motion';
import HeroVisual from './HeroVisual';

export default function Hero() {
  return (
    <section
      id="top"
      className="court-lines-bg grain relative isolate flex min-h-[100svh] items-center overflow-hidden pt-24"
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-5 sm:px-8 md:grid-cols-2 md:gap-6">
        <div className="text-center md:text-left">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-court-line bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-widest text-ember-glow"
          >
            Draft · Simulate · Defend your odds
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl"
          >
            <span className="text-gradient">Ballistic</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-3 font-display text-xl font-medium text-slate-200 sm:text-2xl"
          >
            A whole new ballgame.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mx-auto mt-5 max-w-lg text-balance text-base leading-relaxed text-slate-400 sm:text-lg md:mx-0"
          >
            Draft an all-time lineup, watch a season play out game by game, and
            see honest odds instead of a fantasy. Every result comes with the
            math behind it — expected wins, calibrated probabilities, and a
            model that has to earn every claim it makes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center md:justify-start"
          >
            <a
              href="#features"
              className="w-full rounded-full bg-ember px-7 py-3.5 text-center text-base font-semibold text-white shadow-lg shadow-ember/25 transition-transform hover:scale-[1.03] hover:bg-ember-soft sm:w-auto"
            >
              See how it works
            </a>
            <a
              href="#model"
              className="w-full rounded-full border border-court-line px-7 py-3.5 text-center text-base font-semibold text-slate-200 transition-colors hover:border-slate-500 hover:text-white sm:w-auto"
            >
              See the model
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 text-xs text-slate-500"
          >
            Independent project &mdash; not affiliated with any league or team
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <HeroVisual />
        </motion.div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-court-ink"
      />
    </section>
  );
}