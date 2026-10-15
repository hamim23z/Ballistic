'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';
import PasswordShell from '@/components/password/PasswordShell';
import HuddleScene, { HUDDLE_MS } from '@/components/password/HuddleScene';
import { ErrorText, Field, SubmitButton, inputClass } from '@/components/password/ui';

async function sendResetLink(identifier: string): Promise<{ error: string | null }> {
  try {
    const response = await fetch('/api/password/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier }),
    });
    if (response.ok) return { error: null };
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    return { error: body?.error ?? 'Something went wrong. Try again.' };
  } catch {
    return { error: 'Could not reach the server. Check your connection and try again.' };
  }
}

// Both entry points ask for the email or username and send a link; only the copy differs.
const COPY = {
  reset: {
    eyebrow: 'Reset password',
    title: 'Lost your password?',
    subtitle: "Enter the email or username on your account and we'll draw up a reset link for you.",
    button: 'Send reset link',
  },
  update: {
    eyebrow: 'Change password',
    title: 'Change your password',
    subtitle: "Enter the email or username on your account and we'll email you a link to pick a new password.",
    button: 'Email me a link',
  },
} as const;

// Typing this many characters draws the whole play on the whiteboard.
const FULL_PLAY_CHARS = 18;

export default function ForgotPasswordForm({ variant = 'reset' }: { variant?: keyof typeof COPY }) {
  const copy = COPY[variant];
  const reduced = useReducedMotion();
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [playKey, setPlayKey] = useState(0);
  const [violationKey, setViolationKey] = useState(0);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setError('');
    setLoading(true);

    const result = await sendResetLink(identifier.trim());

    if (result.error) {
      setError(result.error);
      setViolationKey((k) => k + 1);
      setLoading(false);
      return;
    }

    setPlayKey((k) => k + 1);
    timer.current = window.setTimeout(
      () => {
        setLoading(false);
        setSent(true);
      },
      reduced ? 0 : HUDDLE_MS,
    );
  }

  function handleSendAgain() {
    setSent(false);
    setPlayKey(0);
  }

  const fade = reduced ? { duration: 0 } : { duration: 0.2 };

  return (
    <PasswordShell
      eyebrow={copy.eyebrow}
      title={sent ? 'Timeout called' : copy.title}
      subtitle={
        sent
          ? 'Check your inbox. Follow the link in the email to pick a new password.'
          : copy.subtitle
      }
      shakeKey={violationKey}
      scene={
        <HuddleScene
          progress={Math.min(1, identifier.trim().length / FULL_PLAY_CHARS)}
          playKey={playKey}
          settled={sent}
          violationKey={violationKey}
        />
      }
    >
      <div aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          {sent ? (
            <motion.div
              key="sent"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={fade}
              className="space-y-4"
            >
              <p className="rounded-lg border border-ember/30 bg-ember/10 px-4 py-3 text-sm text-ember-glow">
                If an account exists for <span className="font-semibold text-white">{identifier.trim()}</span>, a
                link is on its way to the email on file.
              </p>
              <button
                type="button"
                onClick={handleSendAgain}
                className="w-full rounded-lg border border-court-line px-4 py-3 text-sm font-semibold text-slate-300 transition-colors hover:border-ember/40 hover:text-white"
              >
                Didn&rsquo;t get it? Send again
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={fade}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <Field label="Email or username">
                {(id) => (
                  <input
                    id={id}
                    type="text"
                    value={identifier}
                    onChange={(event) => setIdentifier(event.target.value)}
                    placeholder="you@example.com or your username"
                    autoComplete="username"
                    autoCapitalize="none"
                    spellCheck={false}
                    maxLength={254}
                    required
                    aria-invalid={error ? true : undefined}
                    className={inputClass}
                  />
                )}
              </Field>
              {error && <ErrorText>{error}</ErrorText>}
              <SubmitButton loading={loading} loadingText="Calling timeout...">
                {copy.button}
              </SubmitButton>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-6 text-center text-xs text-slate-500">
        Remembered it?{' '}
        <Link href="/play" className="font-semibold text-ember-glow hover:text-white">
          Back to sign in
        </Link>
      </p>
    </PasswordShell>
  );
}
