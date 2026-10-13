'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion, useAnimate } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';

// How long the play takes to finish after submit. The form waits this long
// before swapping to its confirmation state.
export const HUDDLE_MS = 2200;

type Point = { x: number; y: number };
type Route = {
  /** Which O runs this route. */
  player: number;
  /** The line as drawn on the board. */
  points: Point[];
  /** Arrowhead for a cut or dribble, a flat bar for a screen. */
  end: 'arrow' | 'screen';
};

const HOOP: Point = { x: 300, y: 470 };

// Where the five O's line up before the play is drawn.
const START: Point[] = [
  { x: 300, y: 205 }, // 1: point guard, has the ball
  { x: 130, y: 330 }, // 2: left wing, ends up in the corner
  { x: 470, y: 330 }, // 3: right wing
  { x: 362, y: 352 }, // 4: right elbow
  { x: 246, y: 452 }, // 5: left block
];

function line(a: Point, b: Point): Point[] {
  return [a, b];
}

function curve(a: Point, c: Point, b: Point, steps = 18): Point[] {
  return Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps;
    const u = 1 - t;
    return { x: u * u * a.x + 2 * u * t * c.x + t * t * b.x, y: u * u * a.y + 2 * u * t * c.y + t * t * b.y };
  });
}

// A dribble is drawn as a zigzag along a straight line.
function zigzag(a: Point, b: Point, waves = 7, size = 9): Point[] {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  const nx = -dy / len;
  const ny = dx / len;
  const pts: Point[] = [a];
  for (let i = 1; i < waves * 2; i++) {
    const t = i / (waves * 2);
    const side = i % 2 === 0 ? 0 : i % 4 === 1 ? 1 : -1;
    pts.push({ x: a.x + dx * t + nx * size * side, y: a.y + dy * t + ny * size * side });
  }
  pts.push(b);
  return pts;
}

// The play, one route per step. It is drawn in this order as the email is typed.
const ROUTES: Route[] = [
  { player: 0, points: zigzag(START[0], { x: 404, y: 248 }), end: 'arrow' },
  { player: 4, points: line(START[4], { x: 182, y: 398 }), end: 'screen' },
  { player: 1, points: curve(START[1], { x: 232, y: 438 }, { x: 112, y: 492 }), end: 'arrow' },
  { player: 3, points: curve(START[3], { x: 372, y: 420 }, { x: 318, y: 446 }), end: 'arrow' },
  { player: 2, points: curve(START[2], { x: 430, y: 220 }, { x: 318, y: 206 }), end: 'arrow' },
];

const PASSER = ROUTES[0].points[ROUTES[0].points.length - 1];
const SHOOTER = ROUTES[2].points[ROUTES[2].points.length - 1];

function toPath(points: Point[]) {
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
}

// The point a fraction of the way along a polyline, by length.
function pointAt(points: Point[], fraction: number): Point {
  if (fraction <= 0) return points[0];
  const lengths = points.slice(1).map((p, i) => Math.hypot(p.x - points[i].x, p.y - points[i].y));
  let remaining = lengths.reduce((a, b) => a + b, 0) * Math.min(fraction, 1);
  for (let i = 0; i < lengths.length; i++) {
    if (remaining <= lengths[i]) {
      const t = remaining / lengths[i];
      return { x: points[i].x + (points[i + 1].x - points[i].x) * t, y: points[i].y + (points[i + 1].y - points[i].y) * t };
    }
    remaining -= lengths[i];
  }
  return points[points.length - 1];
}

// Each defender sits between their man and the hoop.
function guardSpot(o: Point): Point {
  const dx = HOOP.x - o.x;
  const dy = HOOP.y - o.y;
  const len = Math.hypot(dx, dy) || 1;
  return { x: o.x + (dx / len) * 30, y: o.y + (dy / len) * 30 };
}

// The drawn line stops short of where the player ends up, so the arrowhead
// sits just in front of the O instead of under it.
function trimEnd(points: Point[], by = 22): Point[] {
  const pts = [...points];
  let left = by;
  while (pts.length > 2) {
    const a = pts[pts.length - 2];
    const b = pts[pts.length - 1];
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    if (len > left) {
      const t = (len - left) / len;
      pts[pts.length - 1] = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
      return pts;
    }
    left -= len;
    pts.pop();
  }
  const [a, b] = pts;
  const len = Math.hypot(b.x - a.x, b.y - a.y);
  const t = Math.max(0, (len - left) / len);
  return [a, { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }];
}

const DRAWN = ROUTES.map((r) => trimEnd(r.points));

function routeEnd(pts: Point[]) {
  const tip = pts[pts.length - 1];
  const prev = pts[pts.length - 2];
  const angle = (Math.atan2(tip.y - prev.y, tip.x - prev.x) * 180) / Math.PI;
  return { tip, angle };
}

const INK = '#1b2333';
const O_INK = '#e5481a';
const X_INK = '#2558c9';
const BOARD = '#e8ebef';

type HuddleSceneProps = {
  /** 0 to 1: how much of the play is drawn. Driven by typing. */
  progress: number;
  /** Increment to finish the play with the pass to the corner. 0 means not called. */
  playKey: number;
  /** True once the form is in its confirmation state. */
  settled: boolean;
  /** Increment to shake the board (e.g. a form error). */
  violationKey: number;
};

export default function HuddleScene({ progress, playKey, settled, violationKey }: HuddleSceneProps) {
  const reduced = useReducedMotion();
  const [boardRef, animate] = useAnimate<SVGGElement>();
  const calling = playKey > 0 || settled;
  const drawn = calling ? ROUTES.length : progress * ROUTES.length;
  const fractions = ROUTES.map((_, i) => Math.max(0, Math.min(1, drawn - i)));
  const step = fractions.filter((f) => f >= 1).length;

  useEffect(() => {
    if (violationKey === 0 || reduced || !boardRef.current) return;
    animate(boardRef.current, { x: [0, -8, 7, -5, 3, 0], rotate: [0, -1, 1, -0.5, 0] }, { duration: 0.45 });
  }, [violationKey, reduced, animate, boardRef]);

  const offense = START.map((start, i) => {
    const index = ROUTES.findIndex((r) => r.player === i);
    return index === -1 ? start : pointAt(ROUTES[index].points, fractions[index]);
  });

  const glide = reduced ? { duration: 0 } : { type: 'spring' as const, stiffness: 120, damping: 18 };
  const trail = reduced ? { duration: 0 } : { type: 'spring' as const, stiffness: 70, damping: 16 };

  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-md lg:max-w-xl">
      <svg viewBox="0 0 600 640" className="h-auto w-full">
        <defs>
          <radialGradient id="hd-pool" cx="50%" cy="48%" r="55%">
            <stop offset="0%" stopColor="#ff8a4d" stopOpacity="0.26" />
            <stop offset="60%" stopColor="#ff5a1f" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#ff5a1f" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hd-board" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f1f3f6" />
            <stop offset="55%" stopColor="#e2e6eb" />
            <stop offset="100%" stopColor="#cfd5dc" />
          </linearGradient>
          <linearGradient id="hd-frame" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5b6577" />
            <stop offset="100%" stopColor="#2c3445" />
          </linearGradient>
          <linearGradient id="hd-sheen" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
          <filter id="hd-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>

        <motion.circle
          cx="300"
          cy="310"
          r="320"
          fill="url(#hd-pool)"
          animate={reduced ? undefined : { opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />

        <g ref={boardRef} style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
          {/* Easel legs */}
          <g stroke="#2c3445" strokeWidth="10" strokeLinecap="round">
            <path d="M150 540 L104 628 M450 540 L496 628" />
          </g>

          {/* Board and frame */}
          <rect x="38" y="76" width="524" height="472" rx="16" fill="url(#hd-frame)" />
          <rect x="50" y="88" width="500" height="448" rx="8" fill="url(#hd-board)" />
          <rect x="50" y="88" width="500" height="448" rx="8" fill="url(#hd-sheen)" />
          {/* Marker tray */}
          <rect x="170" y="546" width="260" height="12" rx="4" fill="#3a4357" />
          <rect x="196" y="538" width="46" height="9" rx="4" fill={O_INK} />
          <rect x="250" y="538" width="46" height="9" rx="4" fill={X_INK} />
          <rect x="304" y="538" width="46" height="9" rx="4" fill={INK} />

          {/* Half court, printed on the board */}
          <g fill="none" stroke="#8b95a5" strokeWidth="2.5" opacity="0.6">
            <path d="M50 130 H550 M240 130 A60 60 0 0 0 360 130" />
            <path d="M88 512 V444 A212 212 0 0 1 512 444 V512" />
            <rect x="245" y="372" width="110" height="140" />
            <path d="M245 372 A55 55 0 0 1 355 372" />
            <path d="M270 494 H330" strokeWidth="4" />
            <circle cx={HOOP.x} cy={HOOP.y + 8} r="9" />
            <path d="M50 512 H550" />
          </g>

          {/* Marker notes */}
          <g className="font-display" fontWeight="700" fill={INK}>
            <text x="68" y="116" fontSize="15" letterSpacing="2">
              TIMEOUT PLAY
            </text>
            <text x="532" y="116" fontSize="15" textAnchor="end" letterSpacing="1" opacity={step === 0 ? 0.35 : 0.85}>
              {step}/{ROUTES.length}
            </text>
          </g>

          {/* Routes, drawn as the email is typed */}
          <g fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            {ROUTES.map((route, i) => {
              const { tip, angle } = routeEnd(DRAWN[i]);
              return (
                <g key={i}>
                  <motion.path
                    d={toPath(DRAWN[i])}
                    initial={false}
                    animate={{ pathLength: fractions[i], opacity: fractions[i] > 0 ? 1 : 0 }}
                    transition={glide}
                  />
                  <motion.g
                    initial={false}
                    animate={{ opacity: fractions[i] >= 1 ? 1 : 0 }}
                    transition={reduced ? { duration: 0 } : { duration: 0.2 }}
                    transform={`translate(${tip.x} ${tip.y}) rotate(${angle})`}
                  >
                    {route.end === 'arrow' ? <path d="M-14 -9 L2 0 L-14 9" /> : <path d="M0 -14 V14" strokeWidth="5" />}
                  </motion.g>
                </g>
              );
            })}
          </g>

          {/* Defense: X's shadow their man, a beat behind */}
          {offense.map((o, i) => {
            const spot = guardSpot(o);
            return (
              <motion.g key={`x-${i}`} initial={false} animate={{ x: spot.x, y: spot.y }} transition={trail}>
                <motion.g
                  animate={reduced ? undefined : { x: [-5, 5, -5] }}
                  transition={{ duration: 1.4 + i * 0.17, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
                >
                  <path d="M-11 -11 L11 11 M11 -11 L-11 11" stroke={X_INK} strokeWidth="5" strokeLinecap="round" />
                </motion.g>
              </motion.g>
            );
          })}

          {/* Offense: O's move along their routes, idling in place between steps */}
          {offense.map((o, i) => (
            <motion.g key={`o-${i}`} initial={false} animate={{ x: o.x, y: o.y }} transition={glide}>
              <motion.g
                animate={reduced ? undefined : { x: [0, 3, 0, -3, 0], y: [0, -3, 0, 2, 0] }}
                transition={{ duration: 2.2 + i * 0.3, repeat: Infinity, ease: 'easeInOut', delay: i * 0.35 }}
              >
                <circle r="15" fill={BOARD} stroke={O_INK} strokeWidth="5" />
                <text y="5" textAnchor="middle" fontSize="14" fontWeight="700" fill={O_INK} className="font-display">
                  {i + 1}
                </text>
              </motion.g>
            </motion.g>
          ))}

          {/* Submit: the skip pass to the corner, then the whistle */}
          {playKey > 0 && !settled && !reduced && <Pass key={playKey} />}
          {settled && <PassLine />}
          <AnimatePresence>{settled && <TimeoutBanner key="banner" reduced={reduced} />}</AnimatePresence>
        </g>
      </svg>
    </div>
  );
}

const PASS_CTRL: Point = { x: 260, y: 300 };
const PASS_END: Point = { x: SHOOTER.x + 14, y: SHOOTER.y - 10 };
const PASS_PATH = `M${PASSER.x} ${PASSER.y} Q ${PASS_CTRL.x} ${PASS_CTRL.y} ${PASS_END.x} ${PASS_END.y}`;
const PASS_TIMES = [0, 0.3, 0.62, 0.72, 1];
const passTransition = { duration: HUDDLE_MS / 1000, times: PASS_TIMES };

// The ball's flight as keyframes: wait, follow the pass line, then sit in the corner.
const FLIGHT = curve(PASSER, PASS_CTRL, PASS_END, 12);
const flightTimes = [0, ...FLIGHT.map((_, i) => 0.3 + (0.32 * i) / (FLIGHT.length - 1)), 1];
const flight = {
  x: [PASSER.x, ...FLIGHT.map((p) => p.x), PASS_END.x],
  y: [PASSER.y, ...FLIGHT.map((p) => p.y), PASS_END.y],
  opacity: [0, ...FLIGHT.map(() => 1), 0],
};

function PassLine() {
  return (
    <path d={PASS_PATH} fill="none" stroke={O_INK} strokeWidth="4" strokeDasharray="10 9" strokeLinecap="round" />
  );
}

function Pass() {
  return (
    <>
      <motion.path
        d={PASS_PATH}
        fill="none"
        stroke={O_INK}
        strokeWidth="4"
        strokeDasharray="10 9"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: [0, 0, 1, 1, 1] }}
        transition={passTransition}
      />
      {/* The ball rides the pass line */}
      <motion.circle
        r="9"
        fill="#ff7a45"
        stroke="#0a0e14"
        strokeWidth="1.5"
        initial={{ x: PASSER.x, y: PASSER.y, opacity: 0 }}
        animate={flight}
        transition={{ duration: HUDDLE_MS / 1000, times: flightTimes, ease: 'linear' }}
      />
      {/* Catch ring in the corner */}
      <motion.circle
        cx={SHOOTER.x}
        cy={SHOOTER.y}
        fill="none"
        stroke={O_INK}
        strokeWidth="3"
        initial={{ r: 16, opacity: 0 }}
        animate={{ r: [16, 16, 16, 44, 52], opacity: [0, 0, 1, 0.4, 0] }}
        transition={passTransition}
      />
      <Whistle />
    </>
  );
}

// "FWEEET!" burst once the ball lands.
function Whistle() {
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: [0, 0, 0, 1, 1], scale: [0.5, 0.5, 0.5, 1.1, 1] }}
      transition={passTransition}
      style={{ originX: 0.5, originY: 0.5 }}
    >
      <g stroke={O_INK} strokeWidth="5" strokeLinecap="round">
        <path d="M300 236 V214 M346 252 L362 236 M254 252 L238 236 M362 292 H386 M238 292 H214" />
      </g>
      <text
        x="300"
        y="306"
        textAnchor="middle"
        fontSize="54"
        fontWeight="700"
        fill={O_INK}
        stroke={BOARD}
        strokeWidth="10"
        strokeLinejoin="round"
        paintOrder="stroke"
        className="font-display"
      >
        FWEEET!
      </text>
    </motion.g>
  );
}

function TimeoutBanner({ reduced }: { reduced: boolean }) {
  return (
    <motion.g
      initial={reduced ? false : { opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 18 }}
    >
      <rect x="110" y="236" width="380" height="96" rx="14" fill="#0f1729" stroke="#ff5a1f" strokeWidth="3" />
      {/* Whistle */}
      <g transform="translate(160 284)">
        <circle r="18" fill="#ffb37a" />
        <rect x="-4" y="-18" width="36" height="14" rx="4" fill="#ffb37a" />
        <circle r="6" fill="#0f1729" />
      </g>
      <text x="206" y="278" fontSize="26" fontWeight="700" fill="#ffffff" className="font-display">
        Timeout called
      </text>
      <text x="206" y="306" fontSize="15" fontWeight="600" letterSpacing="2" fill="#ffb37a">
        CHECK YOUR INBOX
      </text>
    </motion.g>
  );
}
