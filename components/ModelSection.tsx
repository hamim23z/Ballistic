'use client';
import { motion } from 'framer-motion';

export default function ModelSection() {
  return (
    <section id="model" className="relative bg-court-navy/40 px-5 py-24 sm:px-8">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-ember-glow">
            Why 82-0 is (almost) impossible
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
            Honest odds, not a highlight reel
          </h2>
          <p className="mt-5 leading-relaxed text-slate-400">
            If each game is won with probability{' '}
            <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm text-ember-glow">p</code>,
            a perfect season needs{' '}
            <code className="rounded bg-white/10 px-1.5 py-0.5 text-sm text-ember-glow">
              p<sup>82</sup>
            </code>
            . Even a coin-flip shot at 82-0 takes roughly a 99.2% game-by-game
            win rate &mdash; far beyond what any real roster sustains. So
            instead of hiding that math, we put it on the scoreboard.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-court-line bg-court-ink/60 p-5">
              <h3 className="font-display text-base font-semibold text-white">
                Realistic mode
              </h3>
              <p className="mt-1.5 text-sm text-slate-400">
                82-0 stays a moonshot. The real goal is chasing 73 wins against
                a fair, calibrated model.
              </p>
            </div>
            <div className="rounded-xl border border-court-line bg-court-ink/60 p-5">
              <h3 className="font-display text-base font-semibold text-white">
                Arcade mode
              </h3>
              <p className="mt-1.5 text-sm text-slate-400">
                Margins scale up, so an outstanding draft can plausibly run
                the table &mdash; on purpose, and labeled as such.
              </p>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-court-line bg-court-ink/70 p-6 sm:p-8"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Perfect-season odds vs. per-game win rate
          </p>
          <div className="mt-6 flex h-48 items-end gap-3 sm:h-56">
            {[
              { p: 0.9, h: 2 },
              { p: 0.95, h: 8 },
              { p: 0.98, h: 26 },
              { p: 0.99, h: 55 },
              { p: 0.992, h: 100 },
            ].map((bar) => (
              <div key={bar.p} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-ember to-ember-glow"
                  style={{ height: `${(bar.h / 100) * 140}px` }}
                />
                <span className="text-[11px] font-medium text-slate-500">
                  {(bar.p * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-xs text-slate-500">
            Per-game win probability required &mdash; small changes near the
            top swing perfect-season odds enormously.
          </p>
        </motion.div>
      </div>
    </section>
  );
}