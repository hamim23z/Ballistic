import Link from 'next/link';
import type { ReactNode } from 'react';

export function Header() {
  return (
    <header>
      <Link href="/" className="brand">
        <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">
          <circle cx="16" cy="16" r="14" fill="#ff5a1f" />
          <path d="M16 2v28M2 16h28M6 6c4 4 4 16 0 20M26 6c-4 4-4 16 0 20" stroke="#0a0e14" strokeWidth="1.4" fill="none" />
        </svg>
        Ballistic
      </Link>
      <Link href="/court" className="back">
        <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
          <path d="M12 5l-5 5 5 5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Game modes
      </Link>
    </header>
  );
}

export function Foot({ note = 'Simulated game with sample data, not a prediction' }: { note?: string }) {
  return (
    <div className="foot">
      <span>Ballistic sim</span>
      <span>{note}</span>
    </div>
  );
}

export function Seg<T extends string>({
  items,
  value,
  onChange,
  label,
}: {
  items: [T, ReactNode][];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div className="seg" role="group" aria-label={label}>
      {items.map(([v, text]) => (
        <button key={v} type="button" className={v === value ? 'on' : ''} aria-pressed={v === value} onClick={() => onChange(v)}>
          {text}
        </button>
      ))}
    </div>
  );
}

export const SearchIcon = () => (
  <svg viewBox="0 0 20 20" aria-hidden="true">
    <circle cx="8.5" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M13 13l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
