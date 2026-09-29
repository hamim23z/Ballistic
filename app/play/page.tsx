import type { Metadata } from 'next';
import Link from 'next/link';
import PlayCard from '@/components/Playcard';
import PlayBrandPanel from '@/components/PlayBrandPanel';
import PlayScene from '@/components/PlayScene';

export const metadata: Metadata = {
  title: 'Play Now · Ballistic',
  description: 'Jump into Ballistic as a guest, or sign in to save your season.',
};

export default function PlayPage() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden">
      <PlayScene />

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
        <div className="flex items-center justify-center px-5 pb-12 pt-24 sm:px-8 lg:pt-16">
          <PlayCard />
        </div>
        <PlayBrandPanel />
      </div>
    </main>
  );
}