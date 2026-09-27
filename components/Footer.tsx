export default function Footer() {
  return (
    <footer className="border-t border-court-line bg-court-ink px-5 py-10 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 32 32" className="h-6 w-6" aria-hidden="true">
            <circle cx="16" cy="16" r="14" fill="#ff5a1f" />
            <path
              d="M16 2v28M2 16h28M6 6c4 4 4 16 0 20M26 6c-4 4-4 16 0 20"
              stroke="#0a0e14"
              strokeWidth="1.4"
              fill="none"
            />
          </svg>
          <span className="font-display text-sm font-bold text-white">Ballistic</span>
        </div>

        <p className="max-w-md text-xs leading-relaxed text-slate-500">
          Ballistic is an independent project built for fun. It is not
          affiliated with, endorsed by, or sponsored by the NBA, any team, or
          any player. No team logos, player names, or likenesses are used.
        </p>

        <p className="text-xs text-slate-600">
          &copy; {new Date().getFullYear()} Ballistic
        </p>
      </div>
    </footer>
  );
}
