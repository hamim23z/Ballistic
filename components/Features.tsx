'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

type Feature = {
  title: string;
  body: string;
  icon: ReactNode;
};

const ICON_PROPS = {
  viewBox: '0 0 40 40',
  className: 'h-7 w-7',
  fill: 'none',
} as const;

const FEATURES: Feature[] = [
  {
    title: 'Draft your five',
    body: 'Spin a team and era, get four options at each position, and watch your lineup’s strengths and weaknesses update pick by pick.',
    icon: (
      <svg {...ICON_PROPS} aria-hidden="true">
        <rect x="5" y="10" width="12" height="18" rx="2" stroke="#ff7a45" strokeWidth="2" transform="rotate(-8 11 19)" />
        <rect x="14" y="8" width="12" height="20" rx="2" stroke="#ff5a1f" strokeWidth="2" />
        <rect x="23" y="10" width="12" height="18" rx="2" stroke="#ff7a45" strokeWidth="2" transform="rotate(8 29 19)" />
      </svg>
    ),
  },
  {
    title: 'A model that defends itself',
    body: 'Ratings are era-adjusted and validated against real held-out seasons — not a raw stat sum that treats 1985 and 2024 as the same game.',
    icon: (
      <svg {...ICON_PROPS} aria-hidden="true">
        <path d="M4 30c6-2 8-16 12-16s5 12 9 12 6-14 11-14" stroke="#ff5a1f" strokeWidth="2" strokeLinecap="round" />
        <path d="M4 34h32" stroke="#ff7a45" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      </svg>
    ),
  },
  {
    title: 'Every result, with real odds',
    body: 'Expected wins and perfect-season probability ship with every simulated year, so a lucky 41-41 reads as luck, not a bug.',
    icon: (
      <svg {...ICON_PROPS} aria-hidden="true">
        <circle cx="20" cy="20" r="14" stroke="#ff5a1f" strokeWidth="2" />
        <path d="M20 20V10M20 20l8 4" stroke="#ff7a45" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Trades that hold up',
    body: 'AI teams value talent the way real teams do — stars cost more than the sum of their parts — and a fairness meter keeps every deal honest.',
    icon: (
      <svg {...ICON_PROPS} aria-hidden="true">
        <path d="M8 14h20M8 14l6-6M8 14l6 6" stroke="#ff5a1f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M32 26H12M32 26l-6-6M32 26l-6 6" stroke="#ff7a45" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'A full season, simulated',
    body: 'Standings, injuries, rest days, in-season trades, and a playoff bracket — the same seed always gives the same season, so daily challenges stay fair.',
    icon: (
      <svg {...ICON_PROPS} aria-hidden="true">
        <rect x="6" y="7" width="28" height="26" rx="3" stroke="#ff5a1f" strokeWidth="2" />
        <path d="M6 15h28" stroke="#ff5a1f" strokeWidth="2" />
        <path d="M13 4v6M27 4v6" stroke="#ff7a45" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Quizzes, challenges, friends',
    body: 'Guess the stat line, chase a weekly leaderboard, or send a friend the same seeded draft and compare results — no advantage, just bragging rights.',
    icon: (
      <svg {...ICON_PROPS} aria-hidden="true">
        <circle cx="14" cy="15" r="6" stroke="#ff5a1f" strokeWidth="2" />
        <circle cx="26" cy="22" r="6" stroke="#ff7a45" strokeWidth="2" />
      </svg>
    ),
  },
];

export default function Features() {
  return (
    <section id="features" className="relative bg-court-ink px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Built like a product, not a demo
          </h2>
          <p className="mt-4 text-slate-400">
            Every number on the screen traces back to a model you can inspect
            &mdash; and every feature below ships as a real, working release.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
              className="group rounded-2xl border border-court-line bg-court-navy/60 p-6 transition-colors hover:border-ember/40 hover:bg-court-navy"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-ember/10 transition-colors group-hover:bg-ember/20">
                {feature.icon}
              </div>
              <h3 className="font-display text-lg font-semibold text-white">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {feature.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
