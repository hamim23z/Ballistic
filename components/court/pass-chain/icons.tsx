export function Flame({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="chain-flame" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#ff5a1f" />
          <stop offset="100%" stopColor="#ffd2a8" />
        </linearGradient>
      </defs>
      <path
        d="M12 2c.8 3.6 5.5 5.6 5.5 11a5.5 5.5 0 01-11 0c0-2.6 1.3-4.3 2.4-5.4.1 2.1 1 3.3 2.1 3.6-.9-3.4.2-6.6 1-9.2z"
        fill="url(#chain-flame)"
      />
    </svg>
  );
}

export function Ball({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <circle cx="16" cy="16" r="14" fill="#ff5a1f" />
      <path d="M16 2v28M2 16h28M6 6c4 4 4 16 0 20M26 6c-4 4-4 16 0 20" stroke="#0a0e14" strokeWidth="1.6" fill="none" />
    </svg>
  );
}
