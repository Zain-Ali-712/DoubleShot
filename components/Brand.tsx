"use client";

import Image from "next/image";
import { useId, useRef } from "react";
import { motion, useAnimationFrame, useReducedMotion, useScroll, useTransform } from "motion/react";

/** The logo's cup ring: a circle with the small pour spout on the right. */
export function Ring({ className = "", strokeWidth = 11 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 120 100" className={className} aria-hidden fill="none">
      <circle cx="50" cy="50" r={45 - strokeWidth / 2} stroke="currentColor" strokeWidth={strokeWidth} />
      <path d="M116 50 L101 41 L101 59 Z" fill="currentColor" />
    </svg>
  );
}

/**
 * Vector rebuild of the DOUBLE SHOT wordmark, so it stays crisp at any size
 * (the only official logo file is a 600px PNG).
 */
export function Wordmark({ className = "", label = "Double Shot" }: { className?: string; label?: string }) {
  return (
    <span
      className={`font-display inline-flex items-center leading-none tracking-[0.06em] ${className}`}
      {...(label ? { role: "img", "aria-label": label } : { "aria-hidden": true })}
    >
      <span aria-hidden>DOUBLE&nbsp;SH</span>
      <Ring className="mx-[0.02em] h-[0.74em] w-auto -translate-y-[0.02em]" strokeWidth={9} />
      <span aria-hidden>T</span>
    </span>
  );
}

export function InstagramIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M13.5 21v-7.6h2.6l.4-3h-3V8.5c0-.9.3-1.5 1.5-1.5h1.6V4.3c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6V21h3.1z" />
    </svg>
  );
}

export function WhatsAppIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 2.2a9.7 9.7 0 0 0-8.3 14.7L2.3 21.8l5-1.3A9.7 9.7 0 1 0 12 2.2zm0 17.7c-1.5 0-3-.4-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 19.9zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3.9 2.5c.1.2 1.6 2.5 4 3.5 1.5.6 2.1.7 2.8.6.5-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1l-.1-.3z" />
    </svg>
  );
}

// Organic blob outlines that share one structure, so they can morph smoothly.
function blob(phase: number) {
  const n = 9;
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const r = 170 + Math.sin(i * 2.3 + phase) * 26 + Math.cos(i * 1.7 + phase * 1.3) * 18;
    return [240 + Math.cos(a) * r, 240 + Math.sin(a) * r];
  });
  // Closed Catmull-Rom spline converted to cubic Béziers.
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)} `;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += `C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)} `;
  }
  return d + "Z";
}

const BLOB0 = blob(0);

/** Morphs one or more <path>s every frame by regenerating them from a phase. */
export function useMorph(build: (phase: number) => string, speed: number, enabled: boolean) {
  const refs = useRef<(SVGPathElement | null)[]>([]);
  useAnimationFrame((t) => {
    if (!enabled) return;
    const d = build((t / 1000) * speed);
    for (const el of refs.current) el?.setAttribute("d", d);
  });
  return (i: number) => (el: SVGPathElement | null) => {
    refs.current[i] = el;
  };
}

/** Organic brand-colour "spill". Morphs slowly between blob outlines. */
export function Spill({
  className = "",
  color = "var(--color-mint-2)",
  drips = true,
  glossy = false,
}: {
  className?: string;
  color?: string;
  drips?: boolean;
  glossy?: boolean;
}) {
  const reduce = useReducedMotion();
  const id = useId().replace(/:/g, "");
  const ref = useMorph(blob, 0.35, !reduce);
  return (
    <svg viewBox="0 0 480 480" className={`overflow-visible ${className}`} aria-hidden>
      {glossy && (
        <defs>
          <radialGradient id={`${id}-sheen`} cx="0.32" cy="0.28" r="0.75">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.6" />
            <stop offset="55%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <filter id={`${id}-blur`}>
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>
      )}
      <path ref={ref(0)} d={BLOB0} fill={color} />
      {glossy && (
        <>
          <path ref={ref(1)} d={BLOB0} fill={`url(#${id}-sheen)`} />
          <ellipse cx="190" cy="120" rx="70" ry="10" fill="#fff" opacity="0.45" filter={`url(#${id}-blur)`} transform="rotate(-24 190 120)" />
        </>
      )}
      {drips && (
        <>
          <circle cx="408" cy="372" r="16" fill={color} />
          <circle cx="440" cy="330" r="8" fill={color} />
          <circle cx="70" cy="110" r="10" fill={color} />
        </>
      )}
    </svg>
  );
}

/** Circular text that rotates slowly and speeds up with scroll. */
export function RotatingText({
  text = "Rise & Shot • Calibrated to the decimal • ",
  className = "",
  center,
}: {
  text?: string;
  className?: string;
  center?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scrollSpin = useTransform(scrollYProgress, [0, 1], [0, 220]);
  return (
    <div ref={ref} className={`relative ${className}`} aria-hidden>
      <motion.div style={{ rotate: reduce ? 0 : scrollSpin }} className="absolute inset-0">
        <motion.svg
          viewBox="0 0 200 200"
          className="h-full w-full"
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        >
          <defs>
            <path id="ds-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
          </defs>
          <text className="fill-current" style={{ fontFamily: "var(--font-display)", fontSize: 21, letterSpacing: 3.2 }}>
            <textPath href="#ds-circle">{text.toUpperCase()}</textPath>
          </text>
        </motion.svg>
      </motion.div>
      {center && <div className="absolute inset-0 flex items-center justify-center">{center}</div>}
    </div>
  );
}

/**
 * Quiet connector between sections: a spill with a small product cut-out
 * and a rotating text badge, drifting with scroll.
 */
export function SectionBridge({
  image = "/img/hero-can.png",
  side = "right",
  text,
  tone = "var(--color-mint-soft)",
}: {
  image?: string;
  side?: "left" | "right";
  text?: string;
  tone?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const rot = useTransform(scrollYProgress, [0, 1], [side === "right" ? -18 : 18, side === "right" ? 10 : -10]);
  return (
    <div ref={ref} className="pointer-events-none relative h-28 md:h-40" aria-hidden>
      <div className={`container-x relative h-full ${side === "right" ? "flex justify-end" : "flex justify-start"}`}>
        <motion.div style={{ y }} className="relative -mt-10 h-48 w-48 md:-mt-16 md:h-64 md:w-64">
          <Spill className="absolute inset-0 h-full w-full" color={tone} />
          <motion.div style={{ rotate: rot }} className="absolute inset-0 flex items-center justify-center">
            <Image src={image} alt="" width={160} height={240} className="h-[62%] w-auto drop-shadow-[0_18px_20px_rgba(35,42,40,0.25)]" />
          </motion.div>
        </motion.div>
        {text && (
          <div className={`absolute top-0 hidden md:block ${side === "right" ? "right-[calc(clamp(16px,4vw,48px)+15rem)]" : "left-[calc(clamp(16px,4vw,48px)+15rem)]"}`}>
            <RotatingText text={text} className="h-28 w-28 text-sage" center={<Ring className="h-6 w-auto text-sage" strokeWidth={12} />} />
          </div>
        )}
      </div>
    </div>
  );
}
