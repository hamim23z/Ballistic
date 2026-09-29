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
import JerseyPreview from '@/components/JerseyPreview';
import TipOffOverlay, { TIP_OFF_MS } from '@/components/TipOffOverlay';

type CardId = 'guest' | 'account';
type AccountMode = 'signin' | 'signup';
type GuestView = 'welcome-back' | 'form' | 'confirmed';

const inputClass =
  'w-full rounded-lg border border-court-line bg-court-ink/70 px-4 py-3 text-sm text-white placeholder:text-slate-600 transition-shadow focus:border-ember focus:shadow-[0_0_0_4px_rgba(255,90,31,0.15),0_0_28px_rgba(255,90,31,0.25)] focus-visible:rounded-lg! focus-visible:outline-none!';

function PrimaryButton({
  children,
  type = 'button',
  onClick,
}: {
  children: ReactNode;
  type?: 'button' | 'submit';
  onClick?: () => void;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="group/btn relative w-full overflow-hidden rounded-lg bg-ember px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-ember/20 transition-all hover:-translate-y-0.5 hover:bg-ember-soft hover:shadow-ember/40 active:translate-y-0 focus-visible:rounded-lg! focus-visible:outline-none! focus-visible:ring-2 focus-visible:ring-ember-glow/70"
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
  const tipOffTimer = useRef<number | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const storedGuestName = useStoredGuestName();

  useEffect(() => {
    return () => {
      if (tipOffTimer.current !== null) window.clearTimeout(tipOffTimer.current);
    };
  }, []);

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

  function launchTipOff(name: string) {
    const trimmed = name.trim();
    if (!trimmed || tipOffActive) return;
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

  function handleAccountSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
              <PrimaryButton onClick={() => launchTipOff(storedGuestName)}>
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
              <PrimaryButton type="submit">Continue as Guest</PrimaryButton>
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
          subtitle="Save your season across devices"
          transition={transition}
          reducedMotion={prefersReducedMotion}
        >
          <div className="mb-4 flex gap-1 rounded-lg border border-court-line bg-court-ink/60 p-1">
            <button
              type="button"
              onClick={() => setAccountMode('signin')}
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
              onClick={() => setAccountMode('signup')}
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
                <input type="email" placeholder="Email" aria-label="Email" className={inputClass} />
                <input
                  type="password"
                  placeholder="Password"
                  aria-label="Password"
                  className={inputClass}
                />
                <PrimaryButton type="submit">Sign In</PrimaryButton>
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
                  placeholder="Username"
                  aria-label="Username"
                  className={inputClass}
                />
                <input type="email" placeholder="Email" aria-label="Email" className={inputClass} />
                <input
                  type="password"
                  placeholder="Password"
                  aria-label="Password"
                  className={inputClass}
                />
                <PrimaryButton type="submit">Create Account</PrimaryButton>
              </motion.form>
            )}
          </AnimatePresence>
        </AccordionCard>
      </div>

      <TipOffOverlay show={tipOffActive} name={tipOffName} />
    </>
  );
}