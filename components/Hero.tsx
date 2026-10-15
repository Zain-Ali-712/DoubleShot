"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { heroSlides, getProduct, formatPKR } from "@/lib/data";
import { useStore } from "@/lib/store";
import { Spill, Wordmark } from "./Brand";
import LiquidSpill from "./LiquidSpill";

const CYCLE_MS = 5600;
const INTRO_MS = 1900;
const EASE = [0.16, 1, 0.3, 1] as const;

type Role = "center" | "right" | "left";

// Where each product enters from on first load: bottom, left, right.
const ENTRY = [
  { x: "0vw", y: "110vh", rotate: 220, scale: 0.6 },
  { x: "-120vw", y: "20vh", rotate: -300, scale: 0.5 },
  { x: "120vw", y: "-30vh", rotate: 300, scale: 0.5 },
];

function roleFor(i: number, active: number): Role {
  const d = (i - active + 3) % 3;
  return d === 0 ? "center" : d === 1 ? "right" : "left";
}

function useIsNarrow() {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const set = () => setNarrow(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);
  return narrow;
}

/** Applies the pointer tilt to the centre product only. */
function Tilt({
  active,
  rx,
  ry,
  tx,
  ty,
  children,
}: {
  active: boolean;
  rx: MotionValue<number>;
  ry: MotionValue<number>;
  tx: MotionValue<number>;
  ty: MotionValue<number>;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      style={active ? { rotateX: rx, rotateY: ry, x: tx, y: ty, transformPerspective: 900 } : { rotateX: 0, rotateY: 0, x: 0, y: 0 }}
      className="will-change-transform"
    >
      {children}
    </motion.div>
  );
}

export default function Hero() {
  const [active, setActive] = useState(0);
  const [spins, setSpins] = useState([0, 0, 0]);
  const [paused, setPaused] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const reduce = useReducedMotion();
  const narrow = useIsNarrow();
  const { add, setCartOpen } = useStore();
  const ref = useRef<HTMLElement>(null);

  // Pointer tilt: raw pointer position, smoothed by soft springs so nothing jumps.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 70, damping: 18, mass: 0.9 };
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);
  const rx = useTransform(sy, [-0.5, 0.5], [9, -9]);
  const ry = useTransform(sx, [-0.5, 0.5], [-13, 13]);
  const tx = useTransform(sx, [-0.5, 0.5], [-18, 18]);
  const ty = useTransform(sy, [-0.5, 0.5], [-12, 12]);
  const spillX = useTransform(sx, [-0.5, 0.5], [14, -14]);
  const spillY = useTransform(sy, [-0.5, 0.5], [10, -10]);
  const liquidX = useTransform(sx, [-0.5, 0.5], [10, -10]);
  const liquidY = useTransform(sy, [-0.5, 0.5], [6, -6]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const stageY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const markY = useTransform(scrollYProgress, [0, 1], ["0%", "-60%"]);
  const nameY = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const slide = heroSlides[active];
  const product = getProduct(slide.slug)!;

  const goTo = useCallback(
    (next: number) => {
      if (next === active) return;
      // The product arriving at centre gets one full extra turn.
      setSpins((s) => s.map((v, i) => (i === next ? v + 1 : v)));
      setActive(next);
    },
    [active],
  );

  useEffect(() => {
    if (reduce || paused || !introDone) return;
    const t = setTimeout(() => goTo((active + 1) % 3), CYCLE_MS);
    return () => clearTimeout(t);
  }, [active, paused, introDone, reduce, goTo]);

  useEffect(() => {
    const t = setTimeout(() => setIntroDone(true), reduce ? 0 : INTRO_MS);
    return () => clearTimeout(t);
  }, [reduce]);

  function onPointerMove(e: React.PointerEvent) {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  }

  function onPointerLeave() {
    px.set(0);
    py.set(0);
  }

  const ox = narrow ? 37 : 33;
  const targets: Record<Role, { x: string; y: string; scale: number; rotate: number; opacity: number; zIndex: number }> = {
    center: { x: "0vw", y: narrow ? "-3vh" : "4vh", scale: 1, rotate: 0, opacity: 1, zIndex: 3 },
    right: { x: `${ox}vw`, y: narrow ? "11vh" : "-8vh", scale: narrow ? 0.3 : 0.32, rotate: 14, opacity: 0.95, zIndex: 2 },
    left: { x: `-${ox}vw`, y: narrow ? "11vh" : "-1vh", scale: narrow ? 0.3 : 0.32, rotate: -12, opacity: 0.95, zIndex: 2 },
  };

  return (
    <section
      ref={ref}
      aria-roledescription="carousel"
      aria-label="Signature products"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-white"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {/* Soft wash so the white page has some depth */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        animate={{ background: `radial-gradient(60% 55% at 50% 58%, ${slide.accent} 0%, rgba(255,255,255,0) 70%)` }}
        transition={{ duration: 1.2, ease: EASE }}
      />

      {/* Liquid spill pouring in from the top */}
      <motion.div
        className="absolute inset-0 -z-[5]"
        style={{ opacity: fade }}
        initial={reduce ? false : { y: "-45%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 1.5, ease: EASE }}
      >
        <LiquidSpill className="absolute inset-0" x={liquidX} y={liquidY} />
      </motion.div>

      {/* Spill and ring behind the centre product, below the wordmark */}
      <motion.div style={{ y: stageY }} className="pointer-events-none absolute inset-0 -z-[1] flex items-center justify-center">
        {/* Spill behind the centre product only */}
        <motion.div
          style={{ x: spillX, y: spillY }}
          className="absolute translate-y-[3vh] md:translate-y-[10vh]"
          initial={reduce ? false : { scale: 0, rotate: -40 }}
          animate={{ scale: 1, rotate: active * 40 }}
          transition={{ duration: 1.4, delay: reduce ? 0 : 0.35, ease: EASE }}
        >
          <motion.div animate={{ color: slide.spill }} transition={{ duration: 1 }} className="h-[min(84vw,42vh)] w-[min(84vw,42vh)] md:h-[min(44vw,56vh)] md:w-[min(44vw,56vh)]">
            <Spill className="h-full w-full" color="currentColor" glossy />
          </motion.div>
        </motion.div>
        <motion.div
          aria-hidden
          className="absolute translate-y-[1vh] text-sage/30 md:translate-y-[5vh]"
          initial={reduce ? false : { scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1, rotate: active * 120 }}
          transition={{ duration: 1.4, ease: EASE }}
        >
          <svg viewBox="0 0 100 100" className="h-[min(96vw,54vh)] w-[min(96vw,54vh)] md:h-[min(56vw,70vh)] md:w-[min(56vw,70vh)]" fill="none">
            <circle cx="50" cy="50" r="49" stroke="currentColor" strokeWidth="0.6" />
            <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="0.3" strokeDasharray="0.6 2.4" />
          </svg>
        </motion.div>

      </motion.div>

      {/* Brand wordmark, top and prominent, sitting on the liquid */}
      <motion.div style={{ y: markY, opacity: fade }} className="relative z-0 flex justify-center pt-[96px] sm:pt-[104px]">
        <div className="overflow-hidden pb-[0.06em]">
          <motion.div
            initial={reduce ? false : { y: "105%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 1.1, delay: 0.2, ease: EASE }}
          >
            <Wordmark className="text-[clamp(58px,min(13vw,21vh),210px)] text-white drop-shadow-[0_6px_18px_rgba(74,124,113,0.35)]" label="Double Shot" />
          </motion.div>
        </div>
      </motion.div>

      {/* Product name, behind the stage and lower down */}
      <motion.div
        style={{ y: nameY, opacity: fade }}
        className="pointer-events-none absolute inset-x-0 top-[50%] -z-[2] flex justify-center md:top-[56%]"
        aria-hidden
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.p
            key={slide.slug}
            className="font-display flex whitespace-nowrap text-[clamp(64px,min(14vw,24vh),232px)] leading-[0.8]"
            style={{ color: slide.spill, opacity: 0.75 }}
          >
            {slide.name.split("").map((ch, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.04em]">
                <motion.span
                  className="inline-block"
                  initial={{ y: "105%" }}
                  animate={{ y: "0%" }}
                  exit={{ y: "-105%" }}
                  transition={{ duration: 0.8, delay: (introDone ? 0.15 : 1.1) + i * 0.025, ease: EASE }}
                >
                  {ch === " " ? " " : ch}
                </motion.span>
              </span>
            ))}
          </motion.p>
        </AnimatePresence>
      </motion.div>

      {/* Stage */}
      <motion.div style={{ y: stageY }} className="absolute inset-0 z-10 flex items-center justify-center">
        {heroSlides.map((s, i) => {
          const role = roleFor(i, active);
          const t = targets[role];
          const isMatcha = s.slug === "yoocha-matcha";
          return (
            <motion.div
              key={s.slug}
              className="absolute"
              initial={reduce ? false : ENTRY[i]}
              animate={{ ...t, rotate: t.rotate + spins[i] * 360 }}
              transition={{
                duration: introDone ? 1.25 : 1.6,
                delay: introDone ? (role === "center" ? 0.08 : 0) : 0.15 + i * 0.12,
                ease: EASE,
              }}
              style={{ zIndex: t.zIndex }}
            >
              <Tilt active={role === "center"} rx={rx} ry={ry} tx={tx} ty={ty}>
                <motion.button
                  type="button"
                  tabIndex={role === "center" ? -1 : 0}
                  onClick={() => goTo(i)}
                  aria-label={role === "center" ? undefined : `Show ${s.name}`}
                  aria-hidden={role === "center" ? true : undefined}
                  className="block cursor-pointer outline-offset-8"
                  whileHover={role === "center" ? { scale: 1.03 } : { scale: 1.08 }}
                  transition={{ type: "spring", stiffness: 160, damping: 18 }}
                >
                  <Image
                    src={s.image}
                    alt=""
                    width={isMatcha ? 531 : 380}
                    height={isMatcha ? 591 : 700}
                    priority
                    quality={90}
                    sizes="(max-width: 768px) 70vw, 460px"
                    className={`w-auto drop-shadow-[0_36px_36px_rgba(35,42,40,0.28)] ${
                      isMatcha ? "h-[30svh] md:h-[min(46vh,470px)]" : "h-[36svh] md:h-[min(54vh,540px)]"
                    }`}
                  />
                </motion.button>
              </Tilt>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Copy and controls */}
      <motion.div style={{ opacity: fade }} className="container-x relative z-20 mt-auto pb-7 pt-10 md:pb-10">
        <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[380px]">
            <h1 className="sr-only">Double Shot, specialty coffee in Lahore</h1>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={slide.slug}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease: EASE }}
                aria-live="polite"
              >
                <p className="text-[16px] leading-snug text-pine/75 md:text-[17px] [@media(max-height:760px)]:text-[15px]">{slide.line}</p>
                <p className="font-display mt-2 text-[38px] md:text-[46px] [@media(max-height:760px)]:text-[34px]">{formatPKR(product.price)}</p>
              </motion.div>
            </AnimatePresence>
            <div className="mt-3 flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => {
                  add(product.slug);
                  setCartOpen(true);
                }}
                className="btn btn-primary"
              >
                <ShoppingBag size={17} aria-hidden /> Add to cart
              </button>
              <Link href="/menu" className="btn btn-ghost group">
                Full menu <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" aria-hidden />
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3" role="group" aria-label="Choose a product">
            {heroSlides.map((s, i) => (
              <button
                key={s.slug}
                type="button"
                onClick={() => goTo(i)}
                aria-current={i === active ? "true" : undefined}
                className="group flex flex-col items-start gap-2 text-left"
              >
                <span className={`text-sm font-medium transition-colors ${i === active ? "text-pine" : "text-pine/55 group-hover:text-pine"}`}>{s.name}</span>
                <span className="relative block h-[3px] w-24 overflow-hidden rounded-full bg-pine/10 md:w-32">
                  {i === active && (
                    <motion.span
                      key={`${active}-${paused}`}
                      className="absolute inset-y-0 left-0 bg-sage"
                      initial={{ width: reduce || paused ? "100%" : "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: reduce || paused ? 0 : CYCLE_MS / 1000 + (introDone ? 0 : INTRO_MS / 1000), ease: "linear" }}
                    />
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
