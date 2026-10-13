'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';
import PasswordShell from '@/components/password/PasswordShell';
import { SWAT_MS } from '@/components/password/ShotClockScene';
import { ErrorText, Field, PasswordInput, SubmitButton } from '@/components/password/ui';

const MIN_LENGTH = 8;

//----------------------------------------------------------------------------------
// PLACEHOLDER: save the new password for the signed-in user.
// Swap the body for the real Supabase call, for example:
//
//   const supabase = createClient(); // from '@/lib/supabase/client'
//   const { error } = await supabase.auth.updateUser({ password });
//   return { error: error ? error.message : null };
//
// Return { error: null } on success, or { error: 'message' } to show it on the form.
async function updatePassword(password: string): Promise<{ error: string | null }> {
  void password;
  await new Promise((resolve) => setTimeout(resolve, 600));
  return { error: null };
}
//----------------------------------------------------------------------------------

export default function UpdatePasswordForm() {
  const reduced = useReducedMotion();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [swatKey, setSwatKey] = useState(0);
  const [violationKey, setViolationKey] = useState(0);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  const longEnough = password.length >= MIN_LENGTH;
  const matches = confirm.length > 0 && password === confirm;
  const showMismatch = confirm.length > 0 && !matches;

  function fail(message: string) {
    setError(message);
    setViolationKey((k) => k + 1);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;
    setError('');

    if (!longEnough) return fail(`Use at least ${MIN_LENGTH} characters.`);
    if (password !== confirm) return fail("Those passwords don't match.");

    setLoading(true);
    const result = await updatePassword(password);

    if (result.error) {
      fail(result.error);
      setLoading(false);
      return;
    }

    setSwatKey((k) => k + 1);
    timer.current = window.setTimeout(
      () => {
        setLoading(false);
        setDone(true);
      },
      reduced ? 0 : SWAT_MS,
    );
  }

  const fade = reduced ? { duration: 0 } : { duration: 0.2 };

  return (
    <PasswordShell
      eyebrow="Change password"
      title={done ? 'Password updated' : 'New possession'}
      subtitle={
        done
          ? "Your old password just got sent into the fifth row. Use the new one next time you sign in."
          : 'Pick a new password for your account. You will use it the next time you sign in.'
      }
      swatKey={swatKey}
      violationKey={violationKey}
      settled={done}
      settledLabel="New possession"
    >
      <div aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          {done ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={fade}
              className="space-y-4"
            >
              <p className="rounded-lg border border-ember/30 bg-ember/10 px-4 py-3 text-sm text-ember-glow">
                All set. Your password has been changed.
              </p>
              <Link
                href="/play"
                className="block w-full rounded-lg bg-ember px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-ember/20 transition-all hover:-translate-y-0.5 hover:bg-ember-soft"
              >
                Back to the game
              </Link>
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
              <Field
                label="New password"
                hint={
                  <span className={longEnough ? 'text-ember-glow' : undefined}>
                    {longEnough ? '✓ ' : ''}At least {MIN_LENGTH} characters
                  </span>
                }
              >
                {(id, hintId) => (
                  <PasswordInput
                    id={id}
                    value={password}
                    onChange={setPassword}
                    autoComplete="new-password"
                    describedBy={hintId}
                  />
                )}
              </Field>

              <Field
                label="Confirm password"
                hint={
                  confirm.length === 0 ? undefined : matches ? (
                    <span className="text-ember-glow">✓ Passwords match</span>
                  ) : (
                    <span className="text-red-300">Passwords don&rsquo;t match yet</span>
                  )
                }
              >
                {(id, hintId) => (
                  <PasswordInput
                    id={id}
                    value={confirm}
                    onChange={setConfirm}
                    autoComplete="new-password"
                    invalid={showMismatch}
                    describedBy={hintId}
                  />
                )}
              </Field>

              {error && <ErrorText>{error}</ErrorText>}
              <SubmitButton loading={loading} loadingText="Saving...">
                Update password
              </SubmitButton>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </PasswordShell>
  );
}
