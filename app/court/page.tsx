import type { Metadata } from 'next';
import Link from 'next/link';
import CourtBoard from '@/components/court/CourtBoard';
import NewsPanel from '@/components/court/NewsPanel';

export const metadata: Metadata = {
  title: 'Court',
  description: 'Pick a position on the court to choose your game mode.',
};

export default function CourtPage() {
  return (
    <main className="court-lines-bg grain relative isolate min-h-screen overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/4 top-1/3 -z-10 h-[60vh] w-[60vh] -translate-x-1/2 rounded-full bg-ember/10 blur-3xl animate-pulse-glow"
      />

      <header className="relative z-20 flex items-center px-6 pt-6 sm:px-10 sm:pt-8">
        <Link href="/" className="group flex items-center gap-2">
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
      </header>

      <div className="relative z-10 mx-auto grid max-w-7xl gap-8 px-5 pb-10 pt-8 sm:px-10 lg:h-[calc(100vh-4rem)] lg:min-h-[640px] lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10 lg:pt-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <section aria-labelledby="court-heading" className="flex min-h-0 flex-col">
          <p
            className="text-xs font-semibold uppercase tracking-[0.3em] text-ember-glow"
            style={{ animation: 'rise 0.7s ease-out both' }}
          >
            Choose your game mode
          </p>
          <h1
            id="court-heading"
            className="mt-3 font-display text-4xl font-bold leading-tight text-white sm:text-5xl"
            style={{ animation: 'rise 0.8s ease-out 0.1s both' }}
          >
            Pick a <span className="text-gradient">position</span>.
          </h1>
          <div className="mt-6 flex min-h-0 flex-1 items-center">
            <CourtBoard />
          </div>
        </section>

        <NewsPanel />
      </div>
    </main>
  );
}
