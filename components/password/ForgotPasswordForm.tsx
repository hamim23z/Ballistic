'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';
import PasswordShell from '@/components/password/PasswordShell';
import { SWAT_MS } from '@/components/password/ShotClockScene';
import { ErrorText, Field, SubmitButton, inputClass } from '@/components/password/ui';

//----------------------------------------------------------------------------------
// PLACEHOLDER: send the reset email.
// Swap the body for the real Supabase call, for example:
//
//   const supabase = createClient(); // from '@/lib/supabase/client'
//   const { error } = await supabase.auth.resetPasswordForEmail(email, {
//     redirectTo: `${window.location.origin}/update-password`,
//   });
//   return { error: error ? error.message : null };
//
// Return { error: null } on success, or { error: 'message' } to show it on the form.
async function sendResetLink(email: string): Promise<{ error: string | null }> {
  void email;
  await new Promise((resolve) => setTimeout(resolve, 600));
  return { error: null };
}
//----------------------------------------------------------------------------------

export default function ForgotPasswordForm() {
  const reduced = useReducedMotion();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [swatKey, setSwatKey] = useState(0);
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

    const result = await sendResetLink(email.trim());

    if (result.error) {
      setError(result.error);
      setViolationKey((k) => k + 1);
      setLoading(false);
      return;
    }

    setSwatKey((k) => k + 1);
    timer.current = window.setTimeout(
      () => {
        setLoading(false);
        setSent(true);
      },
      reduced ? 0 : SWAT_MS,
    );
  }

  function handleSendAgain() {
    setSent(false);
    setSwatKey(0);
  }

  const fade = reduced ? { duration: 0 } : { duration: 0.2 };

  return (
    <PasswordShell
      eyebrow="Reset password"
      title={sent ? 'Check your inbox' : 'Lost your password?'}
      subtitle={
        sent
          ? 'The shot clock is reset. Follow the link in the email to pick a new password.'
          : "Enter the email on your account and we'll send you a link to reset it."
      }
      swatKey={swatKey}
      violationKey={violationKey}
      settled={sent}
      settledLabel="Reset"
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
                If an account exists for <span className="font-semibold text-white">{email.trim()}</span>, a
                reset link is on its way.
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
              <Field label="Email">
                {(id) => (
                  <input
                    id={id}
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    aria-invalid={error ? true : undefined}
                    className={inputClass}
                  />
                )}
              </Field>
              {error && <ErrorText>{error}</ErrorText>}
              <SubmitButton loading={loading} loadingText="Sending...">
                Send reset link
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
