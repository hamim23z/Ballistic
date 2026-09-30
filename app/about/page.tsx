import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'About · Ballistic',
  description:
    'Why I built Ballistic: a fan-made mash-up of drafting, simming and predicting the NBA.',
};

const LOVES = [
  'Watching every game I can',
  'Fantasy drafts',
  'Hooping when I have free time',
  'Basketball, all of it',
];

const PILLARS = [
  {
    title: 'Draft',
    body: 'Build your squad across eras. Any decade, any style, your call.',
    icon: <path d="M5 6h14M5 12h14M5 18h9" />,
  },
  {
    title: 'Simulate',
    body: 'Run games, full seasons and playoffs, in the spirit of NBA 2K.',
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M10 8.5v7l6-3.5z" />
      </>
    ),
  },
  {
    title: 'Predict',
    body: 'Watch the odds move as the game plays out, and see if your gut was right.',
    icon: (
      <>
        <path d="M4 17l5-6 4 3 7-9" />
        <path d="M15 5h5v5" />
      </>
    ),
  },
];

export default function AboutPage() {
  return (
    <div className="court-lines-bg grain relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-24 h-[520px] w-[520px] -translate-x-1/2 rounded-full border border-ember/10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-24 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-ember/10 blur-3xl animate-pulse-glow"
      />

      <header className="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-5 py-6 sm:px-8">
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
          href="/play"
          className="rounded-lg bg-ember px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-ember-soft"
        >
          Play now
        </Link>
      </header>

      <main className="relative z-10 mx-auto max-w-5xl px-5 pb-24 sm:px-8">
        <section className="pb-20 pt-14 text-center sm:pt-20">
          <p
            className="text-xs font-semibold uppercase tracking-[0.3em] text-ember-glow"
            style={{ animation: 'rise 0.7s ease-out both' }}
          >
            About Ballistic
          </p>
          <h1
            className="mt-5 font-display text-5xl font-bold leading-[1.02] text-white sm:text-7xl"
            style={{ animation: 'rise 0.8s ease-out 0.1s both' }}
          >
            Made by a fan,
            <br />
            <span className="text-gradient">for fans.</span>
          </h1>
          <p
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-400"
            style={{ animation: 'rise 0.8s ease-out 0.25s both' }}
          >
            Ballistic is my attempt to squeeze everything I love about the NBA
            into one fun place.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-5">
          <div className="rounded-2xl border border-court-line bg-court-navy/60 p-7 backdrop-blur sm:p-9 md:col-span-3">
            <h2 className="font-display text-2xl font-bold text-white">Why I built this</h2>
            <div className="mt-5 space-y-4 leading-relaxed text-slate-400">
              <p>
                I&rsquo;ve loved the NBA for as long as I can remember. I&rsquo;ve
                been watching since I was a kid, and I still watch as many games
                as I can. LeBron James is my favorite player, and when I&rsquo;m
                not watching, I&rsquo;m usually playing or in the middle of a
                fantasy draft.
              </p>
              <p>
                I wanted to build something that pulls all of that together:
                predictions, a full sim in the spirit of NBA 2K, and drafting,
                all in one place. Ballistic is a fun, playful version of
                everything I enjoy about the game.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-court-line bg-court-navy/60 p-7 backdrop-blur sm:p-9 md:col-span-2">
            <h2 className="font-display text-2xl font-bold text-white">What I love</h2>
            <ul className="mt-5 space-y-3">
              {LOVES.map((item) => (
                <li key={item} className="flex items-start gap-3 text-slate-300">
                  <span
                    aria-hidden="true"
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ember"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="pt-24">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-ember-glow">
              The idea
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
              A fun version of everything
            </h2>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {PILLARS.map((pillar) => (
              <div
                key={pillar.title}
                className="group rounded-2xl border border-court-line bg-court-ink/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-ember/40 hover:shadow-[0_0_40px_-12px_rgba(255,90,31,0.4)]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-ember/15 text-ember-glow">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {pillar.icon}
                  </svg>
                </span>
                <h3 className="mt-5 font-display text-lg font-bold text-white">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{pillar.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="pt-24">
          <div className="relative overflow-hidden rounded-2xl border border-ember/30 bg-court-navy/70 p-8 sm:p-12">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-ember/20 blur-3xl"
            />
            <div className="relative max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-widest text-ember-glow">
                Where it started
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
                Inspired by 82-0
              </h2>
              <p className="mt-5 leading-relaxed text-slate-400">
                The spark for Ballistic came from 82-0, the game where you draft
                an all-time roster and try to go undefeated. I was hooked, and it
                made me want to build my own take on it. Ballistic is an
                independent project and isn&rsquo;t affiliated with 82-0. I&rsquo;m
                just a fan of it.
              </p>
              <a
                href="https://www.82-0.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex items-center gap-2 rounded-lg border border-ember/50 px-5 py-2.5 text-sm font-semibold text-ember-glow transition-colors hover:bg-ember/10"
              >
                Check out 82-0
                <span aria-hidden="true">&#8599;</span>
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
          </div>
        </section>

        <section className="pt-24 text-center">
          <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Ready for <span className="text-gradient">tip-off?</span>
          </h2>
          <Link
            href="/play"
            className="mt-7 inline-block rounded-lg bg-ember px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-ember/25 transition-all hover:-translate-y-0.5 hover:bg-ember-soft hover:shadow-ember/40"
          >
            Play now
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}