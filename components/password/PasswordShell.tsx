'use client';

import Link from 'next/link';
import { useEffect, type ReactNode } from 'react';
import { useAnimate } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';

type PasswordShellProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  /** Shakes the card each time it increments (e.g. a form error). */
  shakeKey: number;
  /** The animated illustration shown beside the card. */
  scene: ReactNode;
  children: ReactNode;
};

// Shared layout for /forgot-password and /update-password: the form card on
// one side, the page's animated scene on the other.
export default function PasswordShell({
  eyebrow,
  title,
  subtitle,
  shakeKey,
  scene,
  children,
}: PasswordShellProps) {
  const reduced = useReducedMotion();
  const [cardRef, animate] = useAnimate<HTMLElement>();

  useEffect(() => {
    if (shakeKey === 0 || reduced || !cardRef.current) return;
    animate(cardRef.current, { x: [0, -10, 9, -6, 4, 0] }, { duration: 0.45 });
  }, [shakeKey, reduced, animate, cardRef]);

  return (
    <main className="grain relative isolate min-h-screen overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(100deg, #0a0e14 0%, #0b101a 38%, #14110f 72%, #1e140d 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, rgba(255,179,122,0.04) 0px, rgba(255,179,122,0.04) 1px, transparent 1px, transparent 76px)',
          maskImage: 'linear-gradient(90deg, transparent 30%, black 85%)',
          WebkitMaskImage: 'linear-gradient(90deg, transparent 30%, black 85%)',
        }}
      />

      <Link
        href="/"
        className="group absolute left-6 top-6 z-20 flex items-center gap-2 sm:left-10 sm:top-8"
      >
        <svg
          viewBox="0 0 32 32"
          className="h-7 w-7 transition-transform duration-500 group-hover:rotate-180"
          aria-hidden="true"
        >
          <circle cx="16" cy="16" r="14" fill="#ff5a1f" />
          <path
            d="M16 2v28M2 16h28M6 6c4 4 4 16 0 20M26 6c-4 4-4 16 0 20"
            stroke="#0a0e14"
            strokeWidth="1.4"
            fill="none"
          />
        </svg>
        <span className="font-display text-base font-bold text-white">Ballistic</span>
      </Link>

      <div className="relative z-10 grid min-h-screen lg:grid-cols-2">
        <div className="order-2 flex items-start justify-center px-5 pb-16 sm:px-8 lg:order-1 lg:items-center lg:py-16">
          <section
            ref={cardRef}
            aria-labelledby="password-title"
            className="w-full max-w-lg rounded-2xl border border-ember/40 bg-court-navy/85 px-7 py-8 shadow-[0_0_60px_-12px_rgba(255,90,31,0.4)] backdrop-blur sm:px-9 sm:py-10"
          >
            <p
              className="text-xs font-semibold uppercase tracking-[0.3em] text-ember-glow"
              style={{ animation: 'rise 0.7s ease-out both' }}
            >
              {eyebrow}
            </p>
            <h1
              id="password-title"
              className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl"
              style={{ animation: 'rise 0.8s ease-out 0.1s both' }}
            >
              {title}
            </h1>
            <p
              className="mt-2 text-sm leading-relaxed text-slate-400"
              style={{ animation: 'rise 0.8s ease-out 0.2s both' }}
            >
              {subtitle}
            </p>
            <div className="mt-7" style={{ animation: 'rise 0.8s ease-out 0.3s both' }}>
              {children}
            </div>
          </section>
        </div>

        <div className="order-1 flex items-end justify-center px-10 pb-6 pt-24 sm:px-16 lg:order-2 lg:items-center lg:py-16">
          <div className="w-full max-w-[16rem] sm:max-w-xs lg:max-w-xl">{scene}</div>
        </div>
      </div>
    </main>
  );
}
