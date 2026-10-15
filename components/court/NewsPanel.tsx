type NewsItem = {
  headline: string;
  source: string;
  time: string;
  snippet: string;
  /** Link to the original article. Items without one render without a link. */
  url?: string;
};

// Placeholder stories so the layout can be judged. Swap in a real feed later:
// keep it to headline, source, a short snippet and a link out to the original.
const PLACEHOLDER_NEWS: NewsItem[] = [
  { headline: 'Sample headline: a big night from the league leaders', source: 'News source', time: '12m ago', snippet: 'A one or two sentence snippet from the article sits here, cut off before it runs too long for the card.' },
  { headline: 'Sample headline: trade talk heats up ahead of the deadline', source: 'News source', time: '48m ago', snippet: 'Short summary text. The full story opens on the publisher’s site.' },
  { headline: 'Sample headline: rookie watch', source: 'News source', time: '1h ago', snippet: 'Snippets are clamped to three lines so every card keeps the same rhythm in the list, no matter how much text the source provides.' },
  { headline: 'Sample headline: injury report for tonight’s slate', source: 'News source', time: '2h ago', snippet: 'Short summary text. The full story opens on the publisher’s site.' },
  { headline: 'Sample headline: the standings at the quarter mark', source: 'News source', time: '3h ago', snippet: 'A one or two sentence snippet from the article sits here.' },
  { headline: 'Sample headline: a longer headline to show how two full lines of text wrap inside the card', source: 'News source', time: '5h ago', snippet: 'Short summary text. The full story opens on the publisher’s site.' },
  { headline: 'Sample headline: what the numbers say about the best defenses', source: 'News source', time: '8h ago', snippet: 'A one or two sentence snippet from the article sits here.' },
  { headline: 'Sample headline: last night’s top plays', source: 'News source', time: '1d ago', snippet: 'Short summary text. The full story opens on the publisher’s site.' },
];

function ExternalIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3 w-3" aria-hidden="true">
      <path d="M6 3h7v7M13 3L5 11" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function NewsCard({ item }: { item: NewsItem }) {
  const body = (
    <>
      <div className="flex items-center justify-between gap-3 text-[11px] font-semibold uppercase tracking-wider">
        <span className="text-ember-glow">{item.source}</span>
        <span className="text-slate-500">{item.time}</span>
      </div>
      <h3 className="mt-2 line-clamp-2 font-display text-base font-bold leading-snug text-white transition-colors group-hover/news:text-ember-glow">
        {item.headline}
      </h3>
      <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-slate-400">{item.snippet}</p>
      <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-slate-300 transition-colors group-hover/news:text-ember">
        Read at {item.source}
        <ExternalIcon />
      </span>
    </>
  );

  const cardClass =
    'group/news block rounded-xl border border-court-line bg-court-navy/60 p-4 transition-[border-color,background-color,transform] duration-200 hover:-translate-y-0.5 hover:border-ember/50 hover:bg-court-navy';

  return (
    <article>
      {item.url ? (
        <a href={item.url} target="_blank" rel="noopener noreferrer" className={cardClass}>
          {body}
        </a>
      ) : (
        <div className={cardClass}>{body}</div>
      )}
    </article>
  );
}

export default function NewsPanel() {
  return (
    <aside
      aria-labelledby="news-heading"
      className="flex min-h-0 flex-col rounded-2xl border border-court-line bg-court-ink/60 backdrop-blur max-lg:max-h-[70vh] lg:h-full"
      style={{ animation: 'rise 0.8s ease-out 0.35s both' }}
    >
      <div className="flex items-center justify-between border-b border-court-line px-5 py-4">
        <h2 id="news-heading" className="flex items-center gap-2 font-display text-lg font-bold text-white">
          <span aria-hidden="true" className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ember opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-ember" />
          </span>
          Around the league
        </h2>
        <span className="rounded-full border border-court-line px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
          Sample feed
        </span>
      </div>

      <div
        tabIndex={0}
        role="region"
        aria-label="News stories"
        className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain p-4 [scrollbar-color:#1f2a3d_transparent] [scrollbar-width:thin] focus-visible:rounded-b-2xl! focus-visible:outline-offset-[-2px]!"
      >
        {PLACEHOLDER_NEWS.map((item) => (
          <NewsCard key={item.headline} item={item} />
        ))}
      </div>
    </aside>
  );
}
