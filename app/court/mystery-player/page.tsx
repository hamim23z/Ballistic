import type { Metadata } from 'next';
import Link from 'next/link';
import MysteryBoard from '@/components/court/mystery/MysteryBoard';
import { PLACEHOLDER_MYSTERIES, PLACEHOLDER_MYSTERY_POOL, PLACEHOLDER_MYSTERY_STREAK } from '@/components/court/mystery/placeholder';

export const metadata: Metadata = {
  title: 'Mystery Player',
  description: 'A hidden player and a ladder of clues. Name them in as few clues as you can.',
};

export default function MysteryPlayerPage() {
  return (
    <main className="court-lines-bg grain relative isolate min-h-screen overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/4 top-1/3 -z-10 h-[60vh] w-[60vh] -translate-x-1/2 rounded-full bg-ember/10 blur-3xl animate-pulse-glow"
      />

      <header className="relative z-20 flex items-center justify-between px-6 pt-6 sm:px-10 sm:pt-8">
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
        <Link
          href="/court"
          className="group flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-semibold text-slate-400 transition-colors hover:text-white"
        >
          <svg
            viewBox="0 0 20 20"
            className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
            aria-hidden="true"
          >
            <path d="M12 5l-5 5 5 5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Game modes
        </Link>
      </header>

      <div className="relative z-10 mx-auto grid max-w-7xl gap-8 px-5 pb-10 pt-8 sm:px-10 lg:h-[calc(100vh-4rem)] lg:min-h-[720px] lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10 lg:pt-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <MysteryBoard mysteries={PLACEHOLDER_MYSTERIES} pool={PLACEHOLDER_MYSTERY_POOL} startStreak={PLACEHOLDER_MYSTERY_STREAK} />
      </div>
    </main>
  );
}
