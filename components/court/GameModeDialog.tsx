'use client';

import { useEffect, useId, useRef, type MouseEvent } from 'react';
import type { CourtPosition } from '@/components/court/modes';

// Native <dialog> opened with showModal(): the browser handles Escape, focus
// trapping and the inert page behind it. Clicking the dimmed backdrop closes
// it too. Centered on desktop, a bottom sheet on phones.
export default function GameModeDialog({
  position,
  onClose,
}: {
  position: CourtPosition | null;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (position && !dialog.open) dialog.showModal();
    if (!position && dialog.open) dialog.close();
  }, [position]);

  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) ref.current?.close();
  }

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={handleBackdropClick}
      className="m-auto w-[calc(100%-2.5rem)] max-w-md overflow-visible bg-transparent p-0 text-slate-200 backdrop:bg-court-ink/75 backdrop:backdrop-blur-sm open:[animation:rise_0.35s_ease-out] max-sm:mb-0 max-sm:w-full max-sm:max-w-none"
    >
      {position && (
        <div className="relative overflow-hidden rounded-2xl border border-court-line bg-court-navy/95 p-6 shadow-2xl shadow-black/60 max-sm:rounded-b-none max-sm:pb-8 sm:p-7">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-ember/20 blur-3xl"
          />
          <div aria-hidden="true" className="mx-auto mb-5 h-1 w-10 rounded-full bg-court-line sm:hidden" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-ember bg-court-ink font-display text-sm font-bold text-white shadow-[0_0_24px_rgba(255,90,31,0.35)]">
                {position.id}
              </span>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-ember-glow">
                {position.name}
              </p>
            </div>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              className="-mr-2 -mt-1 flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-court-line/60 hover:text-white"
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
                <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="sr-only">Close</span>
            </button>
          </div>

          <h2 id={titleId} className="relative mt-6 font-display text-2xl font-bold text-white">
            {position.modeTitle || <span className="sr-only">{position.name} game mode</span>}
          </h2>
          {!position.modeTitle && (
            <div aria-hidden="true" className="relative -mt-1 h-8 w-3/4 rounded-md border border-dashed border-court-line" />
          )}

          {position.modeDescription ? (
            <p className="relative mt-3 text-sm leading-relaxed text-slate-400">{position.modeDescription}</p>
          ) : (
            <div aria-hidden="true" className="relative mt-4 space-y-2">
              <div className="h-3 w-full rounded border border-dashed border-court-line" />
              <div className="h-3 w-11/12 rounded border border-dashed border-court-line" />
              <div className="h-3 w-2/3 rounded border border-dashed border-court-line" />
            </div>
          )}

          <button
            type="button"
            className="group/btn relative mt-7 w-full overflow-hidden rounded-lg bg-ember px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-ember/20 transition-all hover:-translate-y-0.5 hover:bg-ember-soft hover:shadow-ember/40 active:translate-y-0 focus-visible:rounded-lg! focus-visible:outline-none! focus-visible:ring-2 focus-visible:ring-ember-glow/70"
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/30 duration-0 group-hover/btn:translate-x-[450%] group-hover/btn:duration-700 transition-transform ease-out motion-reduce:hidden"
            />
            <span className="relative">Start</span>
          </button>
        </div>
      )}
    </dialog>
  );
}
