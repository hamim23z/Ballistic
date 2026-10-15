'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';
import PasswordShell from '@/components/password/PasswordShell';
import TunnelScene, { DOOR_MS } from '@/components/password/TunnelScene';
import { ErrorText, Field, PasswordInput, SubmitButton } from '@/components/password/ui';

const MIN_LENGTH = 8;

type UpdateResult = { error: string | null; expired?: boolean };

async function updatePassword(tokenHash: string, password: string): Promise<UpdateResult> {
  try {
    const response = await fetch('/api/password/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tokenHash, password }),
    });
    if (response.ok) return { error: null };
    const body = (await response.json().catch(() => null)) as { error?: string; expired?: boolean } | null;
    return { error: body?.error ?? 'Something went wrong. Try again.', expired: body?.expired };
  } catch {
    return { error: 'Could not reach the server. Check your connection and try again.' };
  }
}

// Shown after someone follows the link in their reset email. tokenHash is the
// one-time token from that link; it is checked when the new password is saved.
export default function UpdatePasswordForm({ tokenHash }: { tokenHash: string }) {
  const reduced = useReducedMotion();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [expired, setExpired] = useState(false);
  const [openKey, setOpenKey] = useState(0);
  const [violationKey, setViolationKey] = useState(0);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  const longEnough = password.length >= MIN_LENGTH;
  const matches = confirm.length > 0 && password === confirm;
  // Still typing the confirmation and on track: not a mismatch yet.
  const onTrack = confirm.length > 0 && !matches && password.startsWith(confirm);
  const showMismatch = confirm.length > 0 && !matches && !onTrack;

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
    const result = await updatePassword(tokenHash, password);

    if (result.error) {
      if (result.expired) setExpired(true);
      fail(result.error);
      setLoading(false);
      return;
    }

    setOpenKey((k) => k + 1);
    timer.current = window.setTimeout(
      () => {
        setLoading(false);
        setDone(true);
      },
      reduced ? 0 : DOOR_MS,
    );
  }

  const fade = reduced ? { duration: 0 } : { duration: 0.2 };

  return (
    <PasswordShell
      eyebrow="Change password"
      title={done ? 'Password updated' : 'Head to the locker room'}
      subtitle={
        done
          ? 'Your locker is cleared out and your jersey is waiting. You are signed in with your new password.'
          : 'Pick a new password for your account. You will use it the next time you sign in.'
      }
      shakeKey={violationKey}
      scene={
        <TunnelScene
          charge={Math.min(1, password.length / MIN_LENGTH)}
          ready={longEnough && matches}
          mismatch={showMismatch}
          openKey={openKey}
          violationKey={violationKey}
          settled={done}
        />
      }
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
                  ) : onTrack ? (
                    <span>Keep going&hellip;</span>
                  ) : (
                    <span className="text-red-300">Passwords don&rsquo;t match</span>
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
              {expired ? (
                <Link
                  href="/forgot-password"
                  className="block w-full rounded-lg bg-ember px-4 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-ember/20 transition-all hover:-translate-y-0.5 hover:bg-ember-soft"
                >
                  Send a new link
                </Link>
              ) : (
                <SubmitButton loading={loading} loadingText="Saving...">
                  Update password
                </SubmitButton>
              )}
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </PasswordShell>
  );
}
