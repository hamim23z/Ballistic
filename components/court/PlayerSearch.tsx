'use client';

import { useId, useState } from 'react';
import { initials } from '@/components/court/draft/DraftCourt';

export type SearchOption = { id: string; name: string; meta: string };

// Type-ahead player picker shared by the guessing modes. Suggestions match the
// start of any word in the name; Enter picks the highlighted one.
export default function PlayerSearch({
  options,
  placeholder,
  cta,
  label,
  disabled = false,
  onFocus,
  onPick,
}: {
  options: SearchOption[];
  placeholder: string;
  cta: string;
  label: string;
  disabled?: boolean;
  onFocus?: () => void;
  onPick: (option: SearchOption) => void;
}) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const listId = useId();

  const needle = query.trim().toLowerCase();
  const matches = needle
    ? options
        .filter((o) => o.name.toLowerCase().split(/\s+/).some((word) => word.startsWith(needle)) || o.name.toLowerCase().startsWith(needle))
        .slice(0, 5)
    : [];
  const open = matches.length > 0;
  const current = matches[Math.min(active, matches.length - 1)];

  function pick(option: SearchOption | undefined) {
    if (!option) return;
    onPick(option);
    setQuery('');
    setActive(0);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown' && open) {
      event.preventDefault();
      setActive((i) => (i + 1) % matches.length);
    } else if (event.key === 'ArrowUp' && open) {
      event.preventDefault();
      setActive((i) => (i - 1 + matches.length) % matches.length);
    } else if (event.key === 'Escape') {
      setQuery('');
    }
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        pick(current);
      }}
    >
      <div className="flex gap-2">
        <label className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-court-line bg-court-ink px-3 py-2.5 transition-colors focus-within:border-ember/60 focus-within:ring-2 focus-within:ring-ember/20">
          <span className="sr-only">{label}</span>
          <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-slate-500" aria-hidden="true">
            <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="2" fill="none" />
            <path d="M13 13l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={open && current ? `${listId}-${current.id}` : undefined}
            autoComplete="off"
            spellCheck={false}
            disabled={disabled}
            value={query}
            placeholder={placeholder}
            onFocus={onFocus}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 focus-visible:outline-none! disabled:cursor-not-allowed"
          />
        </label>
        <button
          type="submit"
          disabled={disabled || !current}
          className="shrink-0 rounded-lg bg-ember px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-ember/20 transition-all enabled:hover:-translate-y-0.5 enabled:hover:bg-ember-soft enabled:active:translate-y-0 disabled:cursor-not-allowed disabled:bg-court-line disabled:text-slate-500 disabled:shadow-none"
        >
          {cta}
        </button>
      </div>

      <ul
        id={listId}
        role="listbox"
        aria-label="Suggestions"
        className={open ? 'mt-2 overflow-hidden rounded-xl border border-court-line bg-court-navy shadow-2xl shadow-black/50' : 'hidden'}
      >
        {matches.map((option, i) => {
          const selected = option === current;
          return (
            <li
              key={option.id}
              id={`${listId}-${option.id}`}
              role="option"
              aria-selected={selected}
              onMouseDown={(event) => event.preventDefault()}
              onMouseEnter={() => setActive(i)}
              onClick={() => pick(option)}
              className={[
                'flex cursor-pointer items-center gap-3 px-3 py-2.5 text-sm',
                selected ? 'bg-ember/10' : '',
                i > 0 ? 'border-t border-court-line' : '',
              ].join(' ')}
            >
              <span
                aria-hidden="true"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-court-line bg-court-ink font-display text-[11px] font-bold text-ember-glow"
              >
                {initials(option.name)}
              </span>
              <span className="min-w-0 flex-1 truncate font-semibold text-white">{option.name}</span>
              <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wider text-slate-500">{option.meta}</span>
            </li>
          );
        })}
      </ul>
    </form>
  );
}
