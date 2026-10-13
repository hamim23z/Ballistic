'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion, useAnimate } from 'framer-motion';
import { useReducedMotion } from '@/lib/useReducedMotion';

// How long the door takes to swing open and flash. The form waits this long
// before swapping to its confirmation state.
export const DOOR_MS = 1800;

const OPEN_TIMES = [0, 0.12, 0.5, 0.72, 1];
const openTransition = { duration: DOOR_MS / 1000, times: OPEN_TIMES };

// A cross-section of the tunnel at depth d: 0 is the mouth, 1 is the back wall.
function section(d: number) {
  return { x0: 30 + 170 * d, x1: 570 - 170 * d, y0: 40 + 160 * d, y1: 620 - 120 * d };
}

const DOOR = { x: 255, y: 330, w: 90, h: 170 };
const FRAME_PATH = 'M249 500 V324 H351 V500';

const RED = '#ff3b30';
const RATTLE = { x: [0, -5, 5, -4, 3, -1, 0] };

type TunnelSceneProps = {
  /** 0 to 1: how lit the door frame is. Driven by the new password's length. */
  charge: number;
  /** Both checks pass: the door is ready to open. */
  ready: boolean;
  /** The confirmation doesn't match what was typed. */
  mismatch: boolean;
  /** Increment to swing the door open. 0 means never opened. */
  openKey: number;
  /** Increment to rattle the door (e.g. a form error). */
  violationKey: number;
  /** True once the form is in its confirmation state: shows the locker. */
  settled: boolean;
};

export default function TunnelScene(props: TunnelSceneProps) {
  const reduced = useReducedMotion();
  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-md lg:max-w-xl">
      <svg viewBox="0 0 600 640" className="h-auto w-full">
        <defs>
          <radialGradient id="tn-pool" cx="50%" cy="62%" r="55%">
            <stop offset="0%" stopColor="#ff8a4d" stopOpacity="0.3" />
            <stop offset="60%" stopColor="#ff5a1f" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#ff5a1f" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="tn-wall-l" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#141c2c" />
            <stop offset="100%" stopColor="#0a0e14" />
          </linearGradient>
          <linearGradient id="tn-wall-r" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor="#141c2c" />
            <stop offset="100%" stopColor="#0a0e14" />
          </linearGradient>
          <linearGradient id="tn-floor" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor="#1a2233" />
            <stop offset="100%" stopColor="#0c111b" />
          </linearGradient>
          <linearGradient id="tn-door" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#24304a" />
            <stop offset="100%" stopColor="#141c2c" />
          </linearGradient>
          <radialGradient id="tn-light" cx="50%" cy="60%" r="70%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#ffe2c4" />
            <stop offset="100%" stopColor="#ffb37a" />
          </radialGradient>
          <filter id="tn-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
          {/* Fade the scene's edges into the page */}
          <radialGradient id="tn-fade" cx="50%" cy="50%" r="62%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="62%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#000000" />
          </radialGradient>
          <mask id="tn-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="600" height="640">
            <rect x="0" y="0" width="600" height="640" fill="url(#tn-fade)" />
          </mask>
          <filter id="tn-soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="22" />
          </filter>
        </defs>

        <motion.circle
          cx="300"
          cy="380"
          r="320"
          fill="url(#tn-pool)"
          animate={reduced ? undefined : { opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />

        <g mask="url(#tn-mask)">
          <AnimatePresence mode="wait">
            {props.settled ? (
              <Locker key="locker" reduced={reduced} />
            ) : (
              <motion.g key="tunnel" exit={{ opacity: 0, transition: { duration: 0 } }}>
                <Tunnel {...props} reduced={reduced} />
              </motion.g>
            )}
          </AnimatePresence>
        </g>
      </svg>
    </div>
  );
}

function Tunnel({
  charge,
  ready,
  mismatch,
  openKey,
  violationKey,
  reduced,
}: TunnelSceneProps & { reduced: boolean }) {
  const [doorRef, animate] = useAnimate<SVGGElement>();
  const opening = openKey > 0 && !reduced;
  const lit = Math.max(charge, ready ? 1 : 0);
  const frameColor = mismatch ? RED : ready ? '#ffd9b8' : '#ffb37a';

  // Rattle the handle when the passwords stop matching or the form errors.
  useEffect(() => {
    if (!mismatch || reduced || !doorRef.current) return;
    animate(doorRef.current, RATTLE, { duration: 0.4 });
  }, [mismatch, reduced, animate, doorRef]);

  useEffect(() => {
    if (violationKey === 0 || reduced || !doorRef.current) return;
    animate(doorRef.current, RATTLE, { duration: 0.4 });
  }, [violationKey, reduced, animate, doorRef]);

  const back = section(1);
  const lights = [0.12, 0.38, 0.62, 0.82];

  return (
    <>
      {/* Tunnel walls, ceiling and floor */}
      <polygon points={`30,40 570,40 ${back.x1},${back.y0} ${back.x0},${back.y0}`} fill="#0c111b" />
      <polygon points={`30,40 ${back.x0},${back.y0} ${back.x0},${back.y1} 30,620`} fill="url(#tn-wall-l)" />
      <polygon points={`570,40 ${back.x1},${back.y0} ${back.x1},${back.y1} 570,620`} fill="url(#tn-wall-r)" />
      <polygon points={`30,620 570,620 ${back.x1},${back.y1} ${back.x0},${back.y1}`} fill="url(#tn-floor)" />
      <rect x={back.x0} y={back.y0} width={back.x1 - back.x0} height={back.y1 - back.y0} fill="#0b101a" />

      {/* Edges of the tunnel */}
      <g fill="none" stroke="rgba(255, 138, 80, 0.18)" strokeWidth="2">
        <path d={`M30 40 L${back.x0} ${back.y0} M570 40 L${back.x1} ${back.y0}`} />
        <path d={`M30 620 L${back.x0} ${back.y1} M570 620 L${back.x1} ${back.y1}`} />
        <rect x={back.x0} y={back.y0} width={back.x1 - back.x0} height={back.y1 - back.y0} />
      </g>

      {/* Team stripe running down both walls */}
      <g stroke="#ff5a1f" strokeWidth="5" opacity="0.55" strokeLinecap="round">
        <path d={`M30 360 L${back.x0} 380 M570 360 L${back.x1} 380`} />
      </g>
      <g stroke="#ff5a1f" strokeWidth="2" opacity="0.3" strokeLinecap="round">
        <path d={`M30 378 L${back.x0} 389 M570 378 L${back.x1} 389`} />
      </g>

      {/* Ceiling lights, stepping back toward the door */}
      {lights.map((d, i) => {
        const near = section(d);
        const far = section(d + 0.07);
        const half = (near.x1 - near.x0) * 0.16;
        const farHalf = (far.x1 - far.x0) * 0.16;
        return (
          <motion.polygon
            key={d}
            points={`${300 - half},${near.y0} ${300 + half},${near.y0} ${300 + farHalf},${far.y0} ${300 - farHalf},${far.y0}`}
            fill="#ffd9b8"
            animate={reduced ? { opacity: 0.7 } : { opacity: [0.6, 0.8, 0.6] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
          />
        );
      })}

      {/* Floor center line and the glow spilling from under the door */}
      <path d="M300 620 L300 500" stroke="rgba(255, 138, 80, 0.2)" strokeWidth="3" strokeDasharray="14 12" />
      <motion.ellipse
        cx="300"
        cy="512"
        rx="120"
        ry="22"
        fill={mismatch ? RED : '#ffb37a'}
        filter="url(#tn-soft)"
        initial={false}
        animate={{ opacity: 0.08 + lit * 0.5 }}
        transition={{ duration: reduced ? 0 : 0.3 }}
      />

      {/* Sign over the door */}
      <rect x="236" y="290" width="128" height="26" rx="4" fill="#070a10" stroke="rgba(255, 138, 80, 0.35)" strokeWidth="1.5" />
      <motion.text
        x="300"
        y="308"
        textAnchor="middle"
        fontSize="12"
        fontWeight="700"
        letterSpacing="2.5"
        className="font-display"
        initial={false}
        animate={
          mismatch && !reduced
            ? { fill: RED, opacity: [1, 0.3, 1, 0.5, 1] }
            : { fill: lit > 0 ? (mismatch ? RED : '#ffb37a') : '#5b6577', opacity: 1 }
        }
        transition={{ duration: reduced ? 0 : 0.5 }}
      >
        LOCKER ROOM
      </motion.text>
      <motion.text
        x="300"
        y="308"
        textAnchor="middle"
        fontSize="12"
        fontWeight="700"
        letterSpacing="2.5"
        filter="url(#tn-glow)"
        className="font-display"
        fill={mismatch ? RED : '#ff8a4d'}
        initial={false}
        animate={{ opacity: lit }}
        transition={{ duration: reduced ? 0 : 0.3 }}
      >
        LOCKER ROOM
      </motion.text>

      {/* Light behind the door, seen once it swings open */}
      <rect x={DOOR.x} y={DOOR.y} width={DOOR.w} height={DOOR.h} fill="url(#tn-light)" />

      <g ref={doorRef}>
        {/* The door */}
        <motion.g
          initial={false}
          animate={opening ? { scaleX: [1, 1, 0.14, 0.14, 0.14], skewY: [0, 0, -14, -14, -14] } : { scaleX: 1, skewY: 0 }}
          transition={opening ? { ...openTransition, ease: ['linear', 'easeIn', 'easeOut', 'linear'] } : { duration: 0 }}
          style={{ originX: 0, originY: 0.5 }}
        >
          <rect x={DOOR.x} y={DOOR.y} width={DOOR.w} height={DOOR.h} fill="url(#tn-door)" stroke="#2a3852" strokeWidth="2" />
          {/* Window, lit from inside */}
          <rect x="285" y="350" width="30" height="34" rx="3" fill="#070a10" />
          <motion.rect
            x="285"
            y="350"
            width="30"
            height="34"
            rx="3"
            fill={mismatch ? RED : '#ffd9b8'}
            initial={false}
            animate={{ opacity: lit * 0.85 }}
            transition={{ duration: reduced ? 0 : 0.3 }}
          />
          <rect x="268" y="410" width="64" height="4" rx="2" fill="#2a3852" />
          <circle cx="333" cy="430" r="5" fill="#8b95a5" />
        </motion.g>

        {/* Light leaking under the door */}
        <motion.rect
          x={DOOR.x + 2}
          y="497"
          width={DOOR.w - 4}
          height="3"
          fill={mismatch ? RED : '#ffd9b8'}
          initial={false}
          animate={{ opacity: lit }}
          transition={{ duration: reduced ? 0 : 0.3 }}
        />
      </g>

      {/* Door frame: the light strip traces around it as the password is typed */}
      <path d={FRAME_PATH} fill="none" stroke="#1f2a3d" strokeWidth="6" />
      <motion.path
        d={FRAME_PATH}
        fill="none"
        stroke={frameColor}
        strokeWidth="14"
        opacity="0.5"
        filter="url(#tn-glow)"
        initial={false}
        animate={{ pathLength: lit }}
        transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 140, damping: 20 }}
      />
      <motion.path
        d={FRAME_PATH}
        fill="none"
        stroke={frameColor}
        strokeWidth="4"
        initial={false}
        animate={{ pathLength: lit, opacity: lit > 0 ? 1 : 0 }}
        transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 140, damping: 20 }}
      />

      {/* Keypad by the door */}
      <rect x="366" y="398" width="20" height="34" rx="4" fill="#070a10" stroke="#2a3852" strokeWidth="1.5" />
      <motion.circle
        cx="376"
        cy="409"
        r="4.5"
        initial={false}
        animate={
          mismatch && !reduced
            ? { fill: RED, opacity: [1, 0.2, 1] }
            : { fill: mismatch ? RED : ready ? '#ffd9b8' : lit > 0 ? '#ff7a45' : '#3a4357', opacity: 1 }
        }
        transition={mismatch ? { duration: 0.5, repeat: Infinity } : { duration: 0.2 }}
      />
      <g fill="#2a3852">
        <rect x="370" y="417" width="4" height="4" rx="1" />
        <rect x="378" y="417" width="4" height="4" rx="1" />
        <rect x="370" y="424" width="4" height="4" rx="1" />
        <rect x="378" y="424" width="4" height="4" rx="1" />
      </g>

      {/* Status under the keypad */}
      <text
        x="376"
        y="446"
        textAnchor="middle"
        fontSize="6.5"
        fontWeight="700"
        letterSpacing="1"
        fill={mismatch ? RED : ready ? '#ffd9b8' : '#5b6577'}
      >
        {mismatch ? 'NO MATCH' : ready ? 'READY' : 'LOCKED'}
      </text>

      {/* Submit: flash of light as the door swings open */}
      {opening && (
        <>
          <motion.ellipse
            key={`burst-${openKey}`}
            cx="300"
            cy="415"
            fill="#ffe2c4"
            filter="url(#tn-soft)"
            initial={{ rx: 40, ry: 80, opacity: 0 }}
            animate={{ rx: [40, 40, 90, 420, 420], ry: [80, 80, 150, 460, 460], opacity: [0, 0, 0.7, 1, 1] }}
            transition={openTransition}
          />
          <motion.rect
            key={`flash-${openKey}`}
            x="0"
            y="0"
            width="600"
            height="640"
            fill="#fff4e8"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0, 0.08, 0.85, 0.95] }}
            transition={openTransition}
          />
        </>
      )}
    </>
  );
}

// Confirmation: an empty locker with the player's jersey hanging in it.
function Locker({ reduced }: { reduced: boolean }) {
  return (
    <motion.g
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduced ? 0 : 0.5 }}
    >
      {/* Leftover glow from the flash */}
      {!reduced && (
        <motion.rect
          x="0"
          y="0"
          width="600"
          height="640"
          fill="#fff4e8"
          initial={{ opacity: 0.9 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      )}

      {/* Wall and floor */}
      <rect x="40" y="70" width="520" height="470" rx="6" fill="#0c111b" />
      <rect x="40" y="540" width="520" height="70" fill="#141c2c" />
      <path d="M40 540 H560" stroke="rgba(255, 138, 80, 0.25)" strokeWidth="2" />

      {/* Spotlight on the open locker */}
      <path d="M240 70 H360 L420 540 H180 Z" fill="#ffe2c4" opacity="0.07" />

      {/* Closed lockers on either side */}
      {[60, 430].map((x) => (
        <g key={x}>
          <rect x={x} y="110" width="110" height="420" rx="4" fill="#141c2c" stroke="#2a3852" strokeWidth="2" />
          <g stroke="#2a3852" strokeWidth="3" strokeLinecap="round">
            {[140, 152, 164, 176].map((y) => (
              <path key={y} d={`M${x + 25} ${y} H${x + 85}`} />
            ))}
          </g>
          <rect x={x + 88} y="300" width="6" height="34" rx="3" fill="#3a4357" />
        </g>
      ))}

      {/* The open, empty locker */}
      <rect x="190" y="110" width="220" height="420" rx="4" fill="#070a10" stroke="#ff5a1f" strokeWidth="2.5" />
      <rect x="198" y="118" width="204" height="404" rx="2" fill="#0b101a" />
      {/* Shelf and nameplate */}
      <rect x="198" y="172" width="204" height="8" fill="#1f2a3d" />
      <rect x="250" y="130" width="100" height="28" rx="3" fill="#0f1729" stroke="rgba(255, 138, 80, 0.5)" strokeWidth="1.5" />
      <text x="300" y="150" textAnchor="middle" fontSize="14" fontWeight="700" letterSpacing="3" fill="#ffb37a" className="font-display">
        YOU
      </text>
      {/* Rail */}
      <path d="M206 206 H394" stroke="#5b6577" strokeWidth="4" strokeLinecap="round" />

      {/* Jersey on a hanger, swaying a little after the door opened */}
      <motion.g
        initial={reduced ? false : { rotate: 7 }}
        animate={reduced ? { rotate: 0 } : { rotate: [7, -5, 3, -1.5, 0] }}
        transition={{ duration: 2.2, ease: 'easeOut' }}
        style={{ originX: 0.5, originY: 0 }}
      >
        <path d="M300 206 q-7 -10 0 -14 q7 -4 7 4" fill="none" stroke="#8b95a5" strokeWidth="3" strokeLinecap="round" />
        <path d="M300 214 L240 238 M300 214 L360 238" stroke="#8b95a5" strokeWidth="3" strokeLinecap="round" />
        <g transform="translate(224 222) scale(0.76)">
          <path
            d="M62 6 H84 C90 40 110 40 116 6 H138 C138 34 148 56 170 66 V208 Q170 216 162 216 H38 Q30 216 30 208 V66 C52 56 62 34 62 6 Z"
            fill="#ff5a1f"
          />
          <g fill="none" stroke="#0a0e14" strokeLinecap="round">
            <path d="M84 6 C90 40 110 40 116 6" strokeWidth="5" />
            <path d="M62 6 C62 34 52 56 30 66" strokeWidth="5" />
            <path d="M138 6 C138 34 148 56 170 66" strokeWidth="5" />
            <path d="M30 196 H170" strokeWidth="4" />
            <path d="M30 205 H170" strokeWidth="2" />
          </g>
          <g fill="#0a0e14" textAnchor="middle" className="font-display" fontWeight="700">
            <text x="100" y="96" fontSize="22" letterSpacing="1">
              YOU
            </text>
            <text x="100" y="170" fontSize="78">
              00
            </text>
          </g>
        </g>
      </motion.g>

      {/* Bench */}
      <rect x="120" y="560" width="360" height="14" rx="4" fill="#2a3852" />
      <path d="M150 574 V604 M450 574 V604" stroke="#1f2a3d" strokeWidth="8" strokeLinecap="round" />
    </motion.g>
  );
}
