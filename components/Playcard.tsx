'use client';

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type PointerEvent,
  type ReactNode,
} from 'react';
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  type Transition,
} from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';
import { GUEST_STORAGE_KEY, useStoredGuestName } from '@/lib/useStoredGuestName';
import type { User } from '@supabase/supabase-js';
import JerseyPreview from '@/components/JerseyPreview';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/env';
import TipOffOverlay, { TIP_OFF_MS } from '@/components/TipOffOverlay';

type CardId = 'guest' | 'account';
type AccountMode = 'signin' | 'signup';
type GuestView = 'welcome-back' | 'form' | 'confirmed';

const inputClass =
  'w-full rounded-lg border border-court-line bg-court-ink/70 px-4 py-3 text-sm text-white placeholder:text-slate-600 transition-shadow focus:border-ember focus:shadow-[0_0_0_4px_rgba(255,90,31,0.15),0_0_28px_rgba(255,90,31,0.25)] focus-visible:rounded-lg! focus-visible:outline-none!';

const NOT_CONFIGURED_MESSAGE = 'Accounts are not set up yet. Try again soon.';

function displayName(user: User): string {
  const username = user.user_metadata?.username;
  return typeof username === 'string' && username ? username : (user.email ?? 'Player');
}

function FormMessage({ tone, children }: { tone: 'error' | 'info'; children: ReactNode }) {
  return (
    <p
      role={tone === 'error' ? 'alert' : 'status'}
      className={`rounded-lg border px-3 py-2 text-center text-xs ${
        tone === 'error'
          ? 'border-red-500/40 bg-red-500/10 text-red-300'
          : 'border-ember/30 bg-ember/10 text-ember-glow'
      }`}
    >
      {children}
    </p>
  );
}

function PrimaryButton({
  children,
  type = 'button',
  onClick,
  disabled = false,
}: {
  children: ReactNode;
  type?: 'button' | 'submit';
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="group/btn relative w-full overflow-hidden rounded-lg bg-ember px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-ember/20 transition-all hover:-translate-y-0.5 hover:bg-ember-soft hover:shadow-ember/40 active:translate-y-0 disabled:pointer-events-none disabled:opacity-60 focus-visible:rounded-lg! focus-visible:outline-none! focus-visible:ring-2 focus-visible:ring-ember-glow/70"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/30 duration-0 group-hover/btn:translate-x-[450%] group-hover/btn:duration-700 transition-transform ease-out motion-reduce:hidden"
      />
      <span className="relative">{children}</span>
    </button>
  );
}

function AccordionCard({
  isActive,
  onActivate,
  title,
  subtitle,
  transition,
  reducedMotion,
  children,
}: {
  isActive: boolean;
  onActivate: () => void;
  title: string;
  subtitle: string;
  transition: Transition;
  reducedMotion: boolean;
  children: ReactNode;
}) {
  const rotateX = useSpring(0, { stiffness: 220, damping: 22 });
  const rotateY = useSpring(0, { stiffness: 220, damping: 22 });
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glare = useMotionTemplate`radial-gradient(420px circle at ${glareX}% ${glareY}%, rgba(255, 138, 80, 0.14), transparent 60%)`;

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (reducedMotion || event.pointerType !== 'mouse') return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    rotateY.set((px - 0.5) * 5);
    rotateX.set(-(py - 0.5) * 5);
    glareX.set(px * 100);
    glareY.set(py * 100);
  }

  function handlePointerLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className={`group relative overflow-hidden rounded-2xl border backdrop-blur transition-[border-color,background-color,box-shadow] duration-300 ${
        isActive
          ? 'border-ember/50 bg-court-navy/85 shadow-[0_0_60px_-12px_rgba(255,90,31,0.4)]'
          : 'border-court-line bg-court-navy/55 hover:border-ember/30'
      }`}
    >
      <button
        type="button"
        onClick={() => {
          if (!isActive) onActivate();
        }}
        aria-expanded={isActive}
        className={`block w-full px-7 py-6 text-left sm:px-8 ${
          isActive ? 'cursor-default' : 'cursor-pointer'
        }`}
      >
        <span
          className={`block font-display text-lg font-bold ${
            isActive ? 'text-white' : 'text-slate-300'
          }`}
        >
          {title}
        </span>
        <span className={`mt-1 block text-sm ${isActive ? 'text-slate-400' : 'text-slate-600'}`}>
          {subtitle}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isActive && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={transition}
            className="overflow-hidden"
          >
            <motion.div
              initial={{ y: 10, scale: 0.97 }}
              animate={{ y: 0, scale: 1 }}
              transition={transition}
              className="px-7 pb-7 pt-1 sm:px-8 sm:pb-8 sm:pt-2"
            >
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: glare }}
      />
    </motion.div>
  );
}

export default function PlayCard() {
  const [activeCard, setActiveCard] = useState<CardId>('guest');
  const [accountMode, setAccountMode] = useState<AccountMode>('signin');
  const [guestName, setGuestName] = useState('');
  const [guestConfirmedName, setGuestConfirmedName] = useState<string | null>(null);
  const [showFreshGuestForm, setShowFreshGuestForm] = useState(false);
  const [tipOffActive, setTipOffActive] = useState(false);
  const [tipOffName, setTipOffName] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [guestError, setGuestError] = useState<string | null>(null);
  const [guestBusy, setGuestBusy] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accountBusy, setAccountBusy] = useState(false);
  const [accountError, setAccountError] = useState<string | null>(null);
  const [accountNotice, setAccountNotice] = useState<string | null>(null);
  const tipOffTimer = useRef<number | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const storedGuestName = useStoredGuestName();

  useEffect(() => {
    return () => {
      if (tipOffTimer.current !== null) window.clearTimeout(tipOffTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const supabase = getSupabaseBrowserClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const accountUser = user && !user.is_anonymous ? user : null;

  const guestView: GuestView = guestConfirmedName
    ? 'confirmed'
    : storedGuestName && !showFreshGuestForm
      ? 'welcome-back'
      : 'form';

  const guestSubtitle =
    guestView === 'welcome-back' && storedGuestName
      ? `Welcome back, ${storedGuestName}`
      : guestView === 'confirmed'
        ? "You're in"
        : 'Just a username — no signup needed';

  const transition: Transition = prefersReducedMotion
    ? { duration: 0 }
    : { type: 'spring', stiffness: 320, damping: 24 };

  // Guests get a real (anonymous) Supabase user so their season can be saved
  // and later upgraded to a full account.
  async function ensureGuestSession(name: string): Promise<boolean> {
    if (!isSupabaseConfigured) {
      setGuestError(NOT_CONFIGURED_MESSAGE);
      return false;
    }
    const supabase = getSupabaseBrowserClient();
    const { data: current } = await supabase.auth.getUser();

    if (current.user) {
      if (current.user.is_anonymous && current.user.user_metadata?.username !== name) {
        const { error } = await supabase.auth.updateUser({ data: { username: name } });
        if (error) {
          setGuestError(error.message);
          return false;
        }
      }
      return true;
    }

    const { error } = await supabase.auth.signInAnonymously({
      options: { data: { username: name } },
    });
    if (error) {
      setGuestError(error.message);
      return false;
    }
    return true;
  }

  async function launchTipOff(name: string) {
    const trimmed = name.trim();
    if (!trimmed || tipOffActive || guestBusy) return;
    setGuestError(null);
    setGuestBusy(true);
    const ok = await ensureGuestSession(trimmed);
    setGuestBusy(false);
    if (!ok) return;
    window.localStorage.setItem(GUEST_STORAGE_KEY, trimmed);

    if (prefersReducedMotion) {
      setGuestConfirmedName(trimmed);
      return;
    }

    setTipOffName(trimmed);
    setTipOffActive(true);
    tipOffTimer.current = window.setTimeout(() => {
      setTipOffActive(false);
      setGuestConfirmedName(trimmed);
    }, TIP_OFF_MS);
  }

  function handleGuestSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    launchTipOff(guestName);
  }

  function switchAccountMode(mode: AccountMode) {
    setAccountMode(mode);
    setAccountError(null);
    setAccountNotice(null);
  }

  async function handleAccountSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (accountBusy) return;
    setAccountError(null);
    setAccountNotice(null);
    if (!isSupabaseConfigured) {
      setAccountError(NOT_CONFIGURED_MESSAGE);
      return;
    }

    const supabase = getSupabaseBrowserClient();
    setAccountBusy(true);
    try {
      if (accountMode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setAccountError(error.message);
          return;
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { username: username.trim() },
            emailRedirectTo: `${window.location.origin}/auth/callback?next=/play`,
          },
        });
        if (error) {
          setAccountError(error.message);
          return;
        }
        if (!data.session) {
          setAccountNotice('Check your email to confirm your account, then sign in.');
          return;
        }
      }
      setPassword('');
    } finally {
      setAccountBusy(false);
    }
  }

  async function handleSignOut() {
    setAccountError(null);
    setAccountNotice(null);
    const { error } = await getSupabaseBrowserClient().auth.signOut();
    if (error) setAccountError(error.message);
  }

  return (
    <>
      <div className="w-full max-w-lg space-y-4">
        <AccordionCard
          isActive={activeCard === 'guest'}
          onActivate={() => setActiveCard('guest')}
          title="Play as Guest"
          subtitle={guestSubtitle}
          transition={transition}
          reducedMotion={prefersReducedMotion}
        >
          {guestView === 'confirmed' && guestConfirmedName && (
            <div className="space-y-4">
              <JerseyPreview name={guestConfirmedName} />
              <p className="rounded-lg border border-ember/30 bg-ember/10 px-3 py-3 text-center text-sm text-ember-glow">
                You&rsquo;re in &mdash; {guestConfirmedName}
              </p>
            </div>
          )}

          {guestView === 'welcome-back' && storedGuestName && (
            <div className="space-y-4">
              <JerseyPreview name={storedGuestName} />
              {guestError && <FormMessage tone="error">{guestError}</FormMessage>}
              <PrimaryButton onClick={() => launchTipOff(storedGuestName)} disabled={guestBusy}>
                Continue as {storedGuestName}
              </PrimaryButton>
              <button
                type="button"
                onClick={() => setShowFreshGuestForm(true)}
                className="w-full text-center text-xs text-slate-500 transition-colors hover:text-slate-300"
              >
                Not you?
              </button>
            </div>
          )}

          {guestView === 'form' && (
            <form onSubmit={handleGuestSubmit} className="space-y-4">
              <JerseyPreview name={guestName} />
              <input
                type="text"
                value={guestName}
                onChange={(event) => setGuestName(event.target.value)}
                placeholder="Pick a username"
                maxLength={24}
                required
                autoComplete="nickname"
                aria-label="Username"
                className={inputClass}
              />
              {guestError && <FormMessage tone="error">{guestError}</FormMessage>}
              <PrimaryButton type="submit" disabled={guestBusy}>
                {guestBusy ? 'Tipping off…' : 'Continue as Guest'}
              </PrimaryButton>
              <p className="text-center text-xs text-slate-600">
                Guest sessions stay on this device
              </p>
            </form>
          )}
        </AccordionCard>

        <AccordionCard
          isActive={activeCard === 'account'}
          onActivate={() => setActiveCard('account')}
          title="Sign In / Sign Up"
          subtitle={
            accountUser
              ? `Signed in as ${displayName(accountUser)}`
              : 'Save your season across devices'
          }
          transition={transition}
          reducedMotion={prefersReducedMotion}
        >
          {accountUser ? (
            <div className="space-y-4">
              <JerseyPreview name={displayName(accountUser)} />
              <FormMessage tone="info">
                You&rsquo;re signed in &mdash; {displayName(accountUser)}
              </FormMessage>
              {accountError && <FormMessage tone="error">{accountError}</FormMessage>}
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full text-center text-xs text-slate-500 transition-colors hover:text-slate-300"
              >
                Sign out
              </button>
            </div>
          ) : (
            <>
              <div className="mb-4 flex gap-1 rounded-lg border border-court-line bg-court-ink/60 p-1">
                <button
                  type="button"
                  onClick={() => switchAccountMode('signin')}
                  className={`flex-1 rounded-md py-2 text-xs font-semibold transition-colors ${
                    accountMode === 'signin'
                      ? 'bg-ember text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => switchAccountMode('signup')}
                  className={`flex-1 rounded-md py-2 text-xs font-semibold transition-colors ${
                    accountMode === 'signup'
                      ? 'bg-ember text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              <AnimatePresence mode="wait" initial={false}>
                {accountMode === 'signin' ? (
                  <motion.form
                    key="signin"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.18 }}
                    onSubmit={handleAccountSubmit}
                    className="space-y-3"
                  >
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="Email"
                      aria-label="Email"
                      autoComplete="email"
                      required
                      className={inputClass}
                    />
                    <input
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Password"
                      aria-label="Password"
                      autoComplete="current-password"
                      required
                      className={inputClass}
                    />
                    {accountError && <FormMessage tone="error">{accountError}</FormMessage>}
                    <PrimaryButton type="submit" disabled={accountBusy}>
                      {accountBusy ? 'Signing in…' : 'Sign In'}
                    </PrimaryButton>
                  </motion.form>
                ) : (
                  <motion.form
                    key="signup"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.18 }}
                    onSubmit={handleAccountSubmit}
                    className="space-y-3"
                  >
                    <input
                      type="text"
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                      placeholder="Username"
                      aria-label="Username"
                      autoComplete="nickname"
                      maxLength={24}
                      required
                      className={inputClass}
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="Email"
                      aria-label="Email"
                      autoComplete="email"
                      required
                      className={inputClass}
                    />
                    <input
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Password (6+ characters)"
                      aria-label="Password"
                      autoComplete="new-password"
                      minLength={6}
                      required
                      className={inputClass}
                    />
                    {accountError && <FormMessage tone="error">{accountError}</FormMessage>}
                    {accountNotice && <FormMessage tone="info">{accountNotice}</FormMessage>}
                    <PrimaryButton type="submit" disabled={accountBusy}>
                      {accountBusy ? 'Creating account…' : 'Create Account'}
                    </PrimaryButton>
                  </motion.form>
                )}
              </AnimatePresence>
            </>
          )}
        </AccordionCard>
      </div>

      <TipOffOverlay show={tipOffActive} name={tipOffName} />
    </>
  );
}
