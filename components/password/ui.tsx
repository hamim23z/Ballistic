'use client';

import { useId, useState, type ReactNode } from 'react';

// Same input and button styling as the /play forms (components/Playcard.tsx).
export const inputClass =
  'w-full rounded-lg border border-court-line bg-court-ink/70 px-4 py-3 text-sm text-white placeholder:text-slate-600 transition-shadow focus:border-ember focus:shadow-[0_0_0_4px_rgba(255,90,31,0.15),0_0_28px_rgba(255,90,31,0.25)] focus-visible:rounded-lg! focus-visible:outline-none! aria-invalid:border-red-400/70';

export function SubmitButton({
  children,
  loading = false,
  loadingText,
}: {
  children: ReactNode;
  loading?: boolean;
  loadingText: string;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      aria-busy={loading}
      className="group/btn relative w-full overflow-hidden rounded-lg bg-ember px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-ember/20 transition-all hover:-translate-y-0.5 hover:bg-ember-soft hover:shadow-ember/40 active:translate-y-0 disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0 focus-visible:rounded-lg! focus-visible:outline-none! focus-visible:ring-2 focus-visible:ring-ember-glow/70"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/30 duration-0 group-hover/btn:translate-x-[450%] group-hover/btn:duration-700 transition-transform ease-out motion-reduce:hidden"
      />
      <span className="relative">{loading ? loadingText : children}</span>
    </button>
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: ReactNode;
  children: (id: string, hintId: string | undefined) => ReactNode;
}) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </label>
      {children(id, hintId)}
      {hint && (
        <p id={hintId} className="text-xs text-slate-500">
          {hint}
        </p>
      )}
    </div>
  );
}

export function PasswordInput({
  id,
  value,
  onChange,
  autoComplete,
  invalid,
  describedBy,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: 'new-password' | 'current-password';
  invalid?: boolean;
  describedBy?: string;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        required
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
        className={`${inputClass} pr-16`}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-pressed={visible}
        aria-controls={id}
        className="absolute inset-y-0 right-2 my-auto h-8 rounded-md px-2 text-xs font-semibold text-slate-400 transition-colors hover:text-white"
      >
        {visible ? 'Hide' : 'Show'}
        <span className="sr-only"> password</span>
      </button>
    </div>
  );
}

export function ErrorText({ children }: { children: ReactNode }) {
  return (
    <p role="alert" className="rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
      {children}
    </p>
  );
}
