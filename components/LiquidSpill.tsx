"use client";

import { motion, useReducedMotion, type MotionValue } from "motion/react";
import { useMorph } from "./Brand";

/*
 * Glossy liquid pouring in from the top of the hero, in brand mint/sage.
 * Pure SVG: an organic edge with drips, gloss highlights and scattered droplets.
 * The edge slowly breathes, drips stretch, and a few drops fall.
 */

// Wavy bottom edge, right to left. Each entry is one cubic segment: c1x c1y c2x c2y x y.
const EDGE: number[][] = [
  [1410, 268, 1385, 302, 1342, 298],
  [1300, 294, 1288, 250, 1238, 258],
  [1188, 266, 1198, 334, 1148, 338],
  [1108, 342, 1098, 300, 1062, 306],
  [1032, 311, 1030, 352, 1024, 402],
  [1020, 430, 1034, 444, 1020, 458],
  [1006, 470, 988, 454, 994, 430],
  [1000, 398, 996, 330, 958, 322],
  [910, 312, 898, 372, 848, 374],
  [798, 376, 788, 322, 740, 318],
  [700, 315, 688, 360, 662, 382],
  [642, 396, 648, 436, 632, 446],
  [616, 456, 600, 442, 606, 422],
  [612, 398, 620, 372, 590, 354],
  [560, 336, 520, 362, 480, 352],
  [440, 342, 430, 290, 380, 292],
  [330, 294, 320, 342, 280, 346],
  [250, 349, 240, 320, 210, 318],
  [180, 316, 170, 360, 150, 374],
  [136, 384, 140, 410, 126, 416],
  [112, 422, 100, 408, 106, 392],
  [112, 372, 108, 330, 78, 318],
  [48, 306, 28, 300, 0, 300],
];

function edgePath(phase: number, amp: number) {
  let d = "M0,0 H1440 V252 ";
  EDGE.forEach((seg, i) => {
    const o = (k: number) => Math.sin(phase + i * 0.9 + k) * amp;
    d += `C${seg[0]},${(seg[1] + o(0)).toFixed(1)} ${seg[2]},${(seg[3] + o(1)).toFixed(1)} ${seg[4]},${(seg[5] + o(2)).toFixed(1)} `;
  });
  return d + "Z";
}

const P0 = edgePath(0, 0);
const breathe = (phase: number) => edgePath(phase, 8 * Math.sin(phase * 0.6) ** 2 + 2);

// Deterministic droplets (no Math.random, so server and client match).
const DROPS = Array.from({ length: 34 }, (_, i) => {
  const r = (n: number) => {
    const x = Math.sin(i * 127.1 + n * 311.7) * 43758.5453;
    return x - Math.floor(x);
  };
  const near = i < 22;
  const q = (v: number) => Math.round(v * 10) / 10;
  return {
    x: q(r(1) * 1440),
    y: q(near ? 300 + r(2) * 200 : 480 + r(2) * 380),
    s: q(near ? 3 + r(3) * 9 : 2 + r(3) * 5),
    stretch: q(1 + r(4) * 0.5),
    rot: q(-30 + r(5) * 60),
    d: q(r(6) * 4),
  };
});

// Where drops fall from: the tips of the long drips.
const FALLING = [
  { x: 1020, y: 462, delay: 0.8 },
  { x: 632, y: 450, delay: 2.6 },
  { x: 126, y: 420, delay: 4.2 },
];

export default function LiquidSpill({
  className = "",
  x,
  y,
}: {
  className?: string;
  x?: MotionValue<number>;
  y?: MotionValue<number>;
}) {
  const reduce = useReducedMotion();
  const ref = useMorph(breathe, 0.45, !reduce);
  return (
    <motion.div style={{ x, y }} className={`pointer-events-none ${className}`} aria-hidden>
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMin slice" className="h-full w-full overflow-visible">
        <defs>
          <linearGradient id="liq-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6ea095" />
            <stop offset="55%" stopColor="#8cb8a5" />
            <stop offset="100%" stopColor="#a9d3c3" />
          </linearGradient>
          <radialGradient id="liq-sheen" cx="0.3" cy="0.25" r="0.7">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
            <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="drop-fill" cx="0.38" cy="0.32" r="0.75">
            <stop offset="0%" stopColor="#e6f3ee" />
            <stop offset="45%" stopColor="#a9d3c3" />
            <stop offset="100%" stopColor="#5f9387" />
          </radialGradient>
          <filter id="liq-soft" x="-5%" y="-5%" width="110%" height="120%">
            <feGaussianBlur stdDeviation="2.2" />
          </filter>
          <filter id="liq-shadow" x="-5%" y="-5%" width="110%" height="130%">
            <feDropShadow dx="0" dy="14" stdDeviation="14" floodColor="#4a7c71" floodOpacity="0.22" />
          </filter>
        </defs>

        {/* Body of the liquid */}
        <path ref={ref(0)} d={P0} fill="url(#liq-fill)" filter="url(#liq-shadow)" />
        {/* Sheen and edge gloss */}
        <path ref={ref(1)} d={P0} fill="url(#liq-sheen)" />
        <path ref={ref(2)} d={P0} fill="none" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="5" filter="url(#liq-soft)" transform="translate(0 -16)" />
        {/* Long glossy streaks inside the liquid */}
        <g fill="#ffffff" filter="url(#liq-soft)">
          <ellipse cx="300" cy="150" rx="210" ry="9" opacity="0.28" transform="rotate(-4 300 150)" />
          <ellipse cx="900" cy="200" rx="260" ry="7" opacity="0.22" transform="rotate(3 900 200)" />
          <ellipse cx="1240" cy="120" rx="150" ry="6" opacity="0.25" />
          <ellipse cx="620" cy="80" rx="120" ry="5" opacity="0.2" />
        </g>

        {/* Droplets */}
        {DROPS.map((d, i) => (
          <motion.g
            key={i}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1, y: reduce ? 0 : [0, -4, 0] }}
            transition={{
              opacity: { duration: 0.6, delay: 0.6 + d.d * 0.2 },
              scale: { type: "spring", stiffness: 200, damping: 12, delay: 0.6 + d.d * 0.2 },
              y: { duration: 4 + d.d, repeat: Infinity, ease: "easeInOut", delay: d.d },
            }}
            style={{ transformOrigin: `${d.x}px ${d.y}px` }}
          >
            <ellipse cx={d.x} cy={d.y} rx={d.s} ry={Math.round(d.s * d.stretch * 10) / 10} fill="url(#drop-fill)" transform={`rotate(${d.rot} ${d.x} ${d.y})`} />
            <circle cx={Math.round((d.x - d.s * 0.35) * 10) / 10} cy={Math.round((d.y - d.s * 0.4) * 10) / 10} r={Math.round(Math.max(0.8, d.s * 0.28) * 10) / 10} fill="#ffffff" opacity="0.9" />
          </motion.g>
        ))}

        {/* Drops falling from the drip tips */}
        {!reduce &&
          FALLING.map((f, i) => (
            <motion.g
              key={i}
              initial={{ y: 0, opacity: 0 }}
              animate={{ y: [0, 0, 220], opacity: [0, 1, 0], scaleY: [0.6, 1, 1.3] }}
              transition={{ duration: 2.4, times: [0, 0.35, 1], repeat: Infinity, repeatDelay: 3.5, delay: f.delay, ease: "easeIn" }}
              style={{ transformOrigin: `${f.x}px ${f.y}px` }}
            >
              <ellipse cx={f.x} cy={f.y + 10} rx="7" ry="10" fill="url(#drop-fill)" />
              <circle cx={f.x - 2.5} cy={f.y + 6} r="2" fill="#ffffff" opacity="0.9" />
            </motion.g>
          ))}
      </svg>
    </motion.div>
  );
}
