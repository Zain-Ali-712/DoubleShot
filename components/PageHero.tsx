"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import LiquidSpill from "./LiquidSpill";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * The opening band every inner page shares with the home hero:
 * the brand liquid pouring in from the top, with the page title sitting on it.
 */
export default function PageHero({
  title,
  lead,
  children,
  className = "",
}: {
  title: string;
  lead?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 18 });
  const sy = useSpring(py, { stiffness: 60, damping: 18 });
  const lx = useTransform(sx, [-0.5, 0.5], [12, -12]);
  const ly = useTransform(sy, [-0.5, 0.5], [8, -8]);

  return (
    <section
      className={`relative isolate flex min-h-[88svh] flex-col overflow-hidden bg-white ${className}`}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width - 0.5);
        py.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
    >
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[100svh]"
        initial={reduce ? false : { y: "-40%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 1.4, ease: EASE }}
      >
        <LiquidSpill className="absolute inset-0" x={lx} y={ly} />
      </motion.div>

      <div className="container-x pt-[100px] text-center sm:pt-[108px]">
        <h1 className="font-display text-[clamp(64px,min(13vw,21vh),200px)] text-white drop-shadow-[0_6px_18px_rgba(74,124,113,0.35)]">
          <span className="block overflow-hidden pb-[0.06em]">
            <motion.span className="block" initial={reduce ? false : { y: "105%" }} animate={{ y: "0%" }} transition={{ duration: 1.1, delay: 0.25, ease: EASE }}>
              {title}
            </motion.span>
          </span>
        </h1>
        {lead && (
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.55, ease: EASE }}
            className="mx-auto mt-3 max-w-[46ch] text-[17px] font-medium text-pine md:text-lg"
          >
            {lead}
          </motion.p>
        )}
      </div>

      {children && <div className="relative mt-auto">{children}</div>}
    </section>
  );
}
