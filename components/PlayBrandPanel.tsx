export default function PlayBrandPanel() {
  return (
    <div className="relative flex items-center justify-center px-8 pb-24 pt-8 lg:py-24">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute select-none font-display text-[40vw] font-bold leading-none lg:text-[17vw]"
        style={{ color: 'transparent', WebkitTextStroke: '2px rgba(255, 138, 80, 0.16)' }}
      >
        82-0
      </span>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[75%] w-[95%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[#0a0e14]/75 blur-3xl"
      />

      <div className="relative text-center">
        <p
          className="text-xs font-semibold uppercase tracking-[0.3em] text-ember-glow"
          style={{ animation: 'rise 0.7s ease-out both' }}
        >
          82 games &middot; Playoffs &middot; Championship
        </p>

        <h2 className="mt-5 font-display text-6xl font-bold leading-[0.95] text-white sm:text-7xl xl:text-8xl">
          <span
            className="block text-gradient drop-shadow-[0_2px_20px_rgba(10,14,20,0.9)]"
            style={{ animation: 'rise 0.8s ease-out 0.1s both' }}
          >
            Tip-off
          </span>
          <span
            className="block [text-shadow:0_2px_28px_rgba(10,14,20,0.95)]"
            style={{ animation: 'rise 0.8s ease-out 0.25s both' }}
          >
            starts here.
          </span>
        </h2>

        <p
          className="mx-auto mt-6 max-w-sm text-base leading-relaxed text-slate-400"
          style={{ animation: 'rise 0.8s ease-out 0.4s both' }}
        >
          Draft your squad from any era. Chase perfection, sim a full season, or go for a title
        </p>
      </div>
    </div>
  );
}