import Link from 'next/link';
import Footer from '@/components/Footer';

export const CONTACT_EMAIL = 'hamimc232@gmail.com';

export type LegalSection = {
  id: string;
  title: string;
  body: React.ReactNode;
};

export function Bullets({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ember" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function ContactLink() {
  return (
    <a
      href={`mailto:${CONTACT_EMAIL}`}
      className="text-ember-glow underline-offset-4 hover:underline"
    >
      {CONTACT_EMAIL}
    </a>
  );
}

type LegalPageProps = {
  eyebrow: string;
  title: string;
  lastUpdated: string;
  intro: React.ReactNode;
  sections: LegalSection[];
};

export default function LegalPage({
  eyebrow,
  title,
  lastUpdated,
  intro,
  sections,
}: LegalPageProps) {
  return (
    <div className="court-lines-bg grain relative isolate overflow-hidden">
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

      <main className="relative z-10 mx-auto max-w-3xl px-5 pb-24 sm:px-8">
        <section className="pb-10 pt-14 sm:pt-20">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ember-glow">
            {eyebrow}
          </p>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] text-white sm:text-6xl">
            {title}
          </h1>
          <p className="mt-4 text-sm text-slate-500">Last updated {lastUpdated}</p>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-slate-400">{intro}</div>
        </section>

        <nav
          aria-label="On this page"
          className="rounded-2xl border border-court-line bg-court-navy/60 p-6 backdrop-blur sm:p-7"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-ember-glow">
            On this page
          </p>
          <ol className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
            {sections.map((section, i) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="text-slate-300 transition-colors hover:text-ember-glow"
                >
                  {i + 1}. {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="mt-12 space-y-12">
          {sections.map((section, i) => (
            <section key={section.id} id={section.id} className="scroll-mt-8">
              <h2 className="font-display text-2xl font-bold text-white">
                <span className="text-ember-glow">{i + 1}.</span> {section.title}
              </h2>
              <div className="mt-4 space-y-4 leading-relaxed text-slate-400">
                {section.body}
              </div>
            </section>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
