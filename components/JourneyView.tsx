"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import {
  animate,
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ArrowDown, ArrowUpRight, Car } from "lucide-react";
import { milestones } from "@/lib/data";
import ScrollWords from "./ScrollWords";
import PageHero from "./PageHero";
import { Spill } from "./Brand";

const EASE = [0.16, 1, 0.3, 1] as const;

function useIsDesktop() {
  const [d, setD] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const set = () => setD(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);
  return d;
}

/* ───────────── Photo masked into the brand spill shape ───────────── */

const BLOB =
  "M0.86,0.2 C0.96,0.32 0.99,0.52 0.93,0.69 C0.87,0.86 0.7,0.98 0.5,0.99 C0.3,1 0.12,0.9 0.05,0.72 C-0.02,0.54 0.02,0.32 0.15,0.17 C0.28,0.03 0.5,-0.02 0.66,0.03 C0.75,0.06 0.81,0.12 0.86,0.2 Z";

function BlobPhoto({ src, alt, className = "", y }: { src: string; alt: string; className?: string; y?: MotionValue<string> }) {
  const id = useId().replace(/:/g, "");
  return (
    <div className={`relative ${className}`}>
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <clipPath id={`blob-${id}`} clipPathUnits="objectBoundingBox">
            <path d={BLOB} />
          </clipPath>
        </defs>
      </svg>
      <div className="absolute inset-0 translate-x-[4%] translate-y-[5%] text-mint-2" aria-hidden>
        <svg viewBox="0 0 1 1" className="h-full w-full" preserveAspectRatio="none">
          <path d={BLOB} fill="currentColor" />
        </svg>
      </div>
      <motion.div className="absolute inset-0 overflow-hidden" style={{ clipPath: `url(#blob-${id})` }}>
        <motion.div style={{ y }} className="absolute inset-[-8%]">
          <Image src={src} alt={alt} fill sizes="(max-width: 1024px) 90vw, 45vw" className="object-cover" />
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ───────────── Hero cups ───────────── */

function HeroCups() {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 16 });
  const cups = [
    { src: "/img/cup-vanilla.png", w: 461, h: 532, cls: "left-0 bottom-0 h-[62%]", rot: -7, depth: -12, delay: 0.7, label: "Vanilla Latte" },
    { src: "/img/cup-caramel.png", w: 635, h: 744, cls: "left-1/2 -translate-x-1/2 bottom-[4%] h-[86%] z-10", rot: 0, depth: 0, delay: 0.85, label: "Salted Caramel Latte" },
    { src: "/img/cup-hazelnut.png", w: 633, h: 736, cls: "right-0 bottom-0 h-[66%]", rot: 7, depth: 12, delay: 1, label: "Hazelnut Latte" },
  ];
  return (
    <div
      className="relative h-[260px] w-[min(460px,88vw)] md:h-[340px]"
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
      }}
      onPointerLeave={() => mx.set(0)}
    >
      <span className="absolute inset-x-[8%] bottom-0 h-4 rounded-[50%] bg-pine/12 blur-md" aria-hidden />
      {cups.map((c) => (
        <Cup key={c.src} c={c} sx={sx} />
      ))}
    </div>
  );
}

function Cup({ c, sx }: { c: { src: string; w: number; h: number; cls: string; rot: number; depth: number; delay: number; label: string }; sx: MotionValue<number> }) {
  const x = useTransform(sx, [-0.5, 0.5], [-c.depth * 2 - 6, c.depth * 2 + 6]);
  const reduce = useReducedMotion();
  return (
    <motion.div style={{ x }} className={`absolute ${c.cls}`}>
      <motion.div
        initial={reduce ? false : { y: 140, opacity: 0, rotate: c.rot * 3 }}
        animate={{ y: 0, opacity: 1, rotate: c.rot }}
        transition={{ type: "spring", stiffness: 80, damping: 13, delay: c.delay }}
        whileHover={{ y: -12 }}
        className="h-full"
      >
        <Image src={c.src} alt={c.label} width={c.w} height={c.h} priority className="h-full w-auto drop-shadow-[0_24px_24px_rgba(35,42,40,0.26)]" />
      </motion.div>
    </motion.div>
  );
}

/* ───────────── Numbers band ───────────── */

function Count({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? to : 0);
  useEffect(() => {
    if (!inView || reduce) return;
    const c = animate(0, to, { duration: 1.8, ease: EASE, onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, to, reduce]);
  return (
    <span ref={ref} className="tabular-nums">
      {n}
      {suffix}
    </span>
  );
}

const numbers = [
  { n: 2023, label: "The year we opened in DHA Phase 6" },
  { n: 8, label: "Flagship branches across Lahore" },
  { n: 1000, suffix: "+", label: "Guests a day at each flagship" },
  { n: 60, suffix: "+", label: "Seats in every newer branch" },
];

function Numbers() {
  return (
    <section className="bg-mint-wash py-16 md:py-20" aria-label="Double Shot in numbers">
      <dl className="container-x grid grid-cols-2 gap-y-12 lg:grid-cols-4">
        {numbers.map((x, i) => (
          <motion.div
            key={x.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.08, ease: EASE }}
            className={`group px-4 md:px-8 ${i % 2 ? "border-l border-pine/10" : ""} ${i === 2 ? "lg:border-l" : ""}`}
          >
            <dt className="font-display text-[clamp(56px,6.5vw,104px)] leading-[0.85] text-pine transition-colors duration-500 group-hover:text-sage-deep">
              {x.n > 1900 ? x.n : <Count to={x.n} suffix={x.suffix} />}
            </dt>
            <dd className="mt-3 max-w-[22ch] text-pine/65">{x.label}</dd>
          </motion.div>
        ))}
      </dl>
    </section>
  );
}

/* ───────────── The beginning ───────────── */

function Beginning() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  return (
    <section ref={ref} className="py-24 md:py-36" aria-labelledby="beginning-title">
      <div className="container-x grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-24">
        <BlobPhoto src="/img/ig/snp4.jpg" alt="The Double Shot team behind the counter" className="mx-auto aspect-square w-full max-w-[560px]" y={y} />
        <div>
          <h2 id="beginning-title" className="font-display text-[clamp(52px,6.5vw,100px)] leading-[0.9]">
            May 2023,
            <br />
            <span className="text-sage">DHA Phase 6</span>
          </h2>
          <ScrollWords
            className="mt-8 max-w-[32ch] text-[clamp(22px,2.3vw,32px)] font-medium leading-[1.25]"
            text="350 square feet, four tables and a 6 am opening, seven days a week. Within a month, it had a cult following."
          />
          <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-pine/70">
            From day one we invested in top-tier equipment, strict SOPs and daily oversight from our CEO, Mr. Ali Chughtai, so every step from espresso shot to service holds the same standard.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ───────────── Horizontal timeline ───────────── */

function FloorPlan() {
  return (
    <div className="relative flex h-full items-center justify-center bg-mint-soft p-10">
      <svg viewBox="0 0 200 150" className="h-full max-h-[260px] w-full text-sage-deep" aria-hidden>
        <motion.rect x="10" y="10" width="180" height="130" rx="12" fill="#fff" fillOpacity="0.7" stroke="currentColor" strokeWidth="2.5" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.4, ease: EASE }} />
        {[
          [55, 50],
          [145, 50],
          [55, 100],
          [145, 100],
        ].map(([x, y], i) => (
          <motion.circle key={i} cx={x} cy={y} r="13" fill="currentColor" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.6 + i * 0.15 }} style={{ transformOrigin: `${x}px ${y}px` }} />
        ))}
      </svg>
    </div>
  );
}

function DriveThru() {
  const reduce = useReducedMotion();
  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden bg-caramel-soft">
      <motion.div initial={{ x: -220 }} whileInView={{ x: 0 }} viewport={{ once: true }} transition={{ duration: 1.6, ease: EASE }} className="flex h-28 w-28 items-center justify-center rounded-full bg-white text-caramel-deep shadow-lg">
        <Car size={52} strokeWidth={1.6} aria-hidden />
      </motion.div>
      <div className="absolute inset-x-0 bottom-10 h-[3px] overflow-hidden" aria-hidden>
        <motion.div className="h-full w-[200%]" style={{ backgroundImage: "repeating-linear-gradient(90deg, var(--color-caramel) 0 24px, transparent 24px 48px)" }} animate={reduce ? undefined : { x: ["-50%", "0%"] }} transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }} />
      </div>
    </div>
  );
}

function PhotoFill({ src, alt }: { src: string; alt: string }) {
  return <Image src={src} alt={alt} fill sizes="(max-width: 1024px) 90vw, 40vw" className="object-cover" />;
}

const visuals = [
  <FloorPlan key="a" />,
  <PhotoFill key="b" src="/img/ig-lattes.jpg" alt="Layered lattes on the Double Shot bar" />,
  <DriveThru key="c" />,
  <PhotoFill key="d" src="/img/ig-coffeeday.jpg" alt="The Double Shot team behind the bar" />,
  <PhotoFill key="e" src="/img/ig/snp2.jpg" alt="The Double Shot Mall Road storefront on opening day" />,
];

function MilestonePanel({ m, i }: { m: (typeof milestones)[number]; i: number }) {
  const year = m.when.split(" ").slice(-1)[0];
  return (
    <article className="grid w-full shrink-0 gap-8 lg:w-[min(1080px,78vw)] lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-14">
      <div>
        <p className="font-display text-[clamp(96px,13vw,200px)] leading-[0.8] text-transparent [-webkit-text-stroke:2px_var(--color-sage)]">{year}</p>
        <p className="mt-4 text-lg font-semibold text-sage-deep">{m.when}</p>
        <p className="mt-3 max-w-[40ch] text-xl leading-relaxed text-pine/80">{m.what}</p>
      </div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-[32px] shadow-[0_40px_80px_-50px_rgba(35,42,40,0.6)]">{visuals[i]}</div>
      <span className="sr-only">Milestone {i + 1} of {milestones.length}</span>
    </article>
  );
}

function Timeline() {
  const desktop = useIsDesktop();
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);

  useEffect(() => {
    const measure = () => track.current && setDist(Math.max(0, track.current.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [desktop]);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist]);
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  const heading = (
    <div className="container-x">
      <h2 id="timeline-title" className="font-display text-[clamp(52px,7vw,104px)]">
        How we got here
      </h2>
    </div>
  );

  if (!desktop) {
    return (
      <section ref={section} id="timeline" className="py-24" aria-labelledby="timeline-title">
        {heading}
        <div className="container-x mt-12 space-y-20">
          {milestones.map((m, i) => (
            <motion.div key={m.when} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.9, ease: EASE }}>
              <MilestonePanel m={m} i={i} />
            </motion.div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={section} id="timeline" className="relative" style={{ height: `calc(100vh + ${dist}px)` }} aria-labelledby="timeline-title">
      <div className="sticky top-0 flex h-screen flex-col justify-center gap-10 overflow-hidden pt-20">
        {heading}
        <motion.div ref={track} style={{ x }} className="flex w-max gap-24 pl-[max(16px,calc((100vw-1360px)/2+48px))] pr-[12vw]">
          {milestones.map((m, i) => (
            <MilestonePanel key={m.when} m={m} i={i} />
          ))}
        </motion.div>
        <div className="container-x">
          <div className="relative h-[2px] overflow-hidden rounded-full">
            <motion.span style={{ scaleX: progress }} className="absolute inset-0 origin-left bg-sage" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────── Polaroids ───────────── */

const shots = [
  { src: "/img/ig/snp2.jpg", cap: "Mall Road, opening day", x: "4%", y: "14%", r: -8, s: 0.6 },
  { src: "/img/ig/lat3.jpg", cap: "Salted Caramel Latte", x: "24%", y: "40%", r: 5, s: 1 },
  { src: "/img/ig-empanadas.jpg", cap: "Breakfast, sorted", x: "42%", y: "6%", r: -3, s: 0.8 },
  { src: "/img/ig/snp4.jpg", cap: "The team at the counter", x: "58%", y: "44%", r: 7, s: 0.5 },
  { src: "/img/ig/lat2.jpg", cap: "Vanilla Latte", x: "74%", y: "10%", r: -6, s: 0.9 },
  { src: "/img/ig-coffeeday.jpg", cap: "International Coffee Day", x: "84%", y: "48%", r: 4, s: 0.7 },
];

// Phone layout: two loose columns so nothing runs off screen.
const shotsMobile = [
  { x: "0%", y: "0%" },
  { x: "48%", y: "6%" },
  { x: "4%", y: "33%" },
  { x: "50%", y: "38%" },
  { x: "2%", y: "66%" },
  { x: "48%", y: "70%" },
];

function Polaroid({ s, i, bounds, progress, desktop }: { s: (typeof shots)[number]; i: number; bounds: React.RefObject<HTMLDivElement | null>; progress: MotionValue<number>; desktop: boolean }) {
  const y = useTransform(progress, [0, 1], [80 * s.s, -80 * s.s]);
  const rot = useTransform(progress, [0, 1], [s.r * 1.8, s.r * 0.6]);
  return (
    <motion.div style={{ left: desktop ? s.x : shotsMobile[i].x, top: desktop ? s.y : shotsMobile[i].y, y }} className="absolute w-[min(220px,44vw)]">
      <motion.figure
        drag
        dragConstraints={bounds}
        dragElastic={0.15}
        whileDrag={{ scale: 1.06, zIndex: 20, cursor: "grabbing" }}
        whileHover={{ scale: 1.04 }}
        style={{ rotate: rot }}
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 140, damping: 16, delay: i * 0.06 }}
        className="cursor-grab bg-white p-3 pb-4 shadow-[0_30px_60px_-30px_rgba(35,42,40,0.55)] [touch-action:none]"
      >
        <div className="relative aspect-square overflow-hidden">
          <Image src={s.src} alt={s.cap} fill sizes="220px" className="pointer-events-none object-cover" draggable={false} />
        </div>
        <figcaption className="mt-3 text-center text-sm font-medium text-pine/70">{s.cap}</figcaption>
      </motion.figure>
    </motion.div>
  );
}

function Snapshots() {
  const ref = useRef<HTMLElement>(null);
  const bounds = useRef<HTMLDivElement>(null);
  const desktop = useIsDesktop();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  return (
    <section ref={ref} className="relative overflow-hidden bg-mint-wash py-24 md:py-32" aria-labelledby="snapshots-title">
      <div className="container-x text-center">
        <h2 id="snapshots-title" className="font-display text-[clamp(52px,7vw,104px)]">
          Moments from the bar
        </h2>
        <p className="mx-auto mt-4 max-w-[44ch] text-lg text-pine/65">Straight from our Instagram. Pick one up and move it around.</p>
      </div>
      <div ref={bounds} className="container-x relative mt-10 h-[860px] lg:h-[620px]">
        {shots.map((s, i) => (
          <Polaroid key={s.src} s={s} i={i} bounds={bounds} progress={scrollYProgress} desktop={desktop} />
        ))}
      </div>
    </section>
  );
}

/* ───────────── Vision and growth ───────────── */

const growth = [
  { t: 0, n: 1, when: "May 2023", story: "The first shop opens in DHA Phase 6." },
  { t: 1, n: 2, when: "May 2024", story: "Branch two, on our first anniversary." },
  { t: 2.17, n: 6, when: "July 2025", story: "Six flagships across Lahore." },
  { t: 3.33, n: 8, when: "September 2026", story: "Mall Road makes it eight." },
];

function GrowthLine() {
  const [active, setActive] = useState(3);
  const W = 600;
  const H = 280;
  const px = (t: number) => 30 + (t / 3.33) * (W - 60);
  const py = (n: number) => H - 30 - ((n - 1) / 7) * (H - 80);
  const pts = growth.map((g) => [px(g.t), py(g.n)] as const);
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const cx = (x0 + x1) / 2;
    d += ` C${cx},${y0} ${cx},${y1} ${x1},${y1}`;
  }
  const area = `${d} L${pts[pts.length - 1][0]},${H} L${pts[0][0]},${H} Z`;
  const g = growth[active];

  return (
    <div>
      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full overflow-visible" role="img" aria-label="Branches over time: 1 in May 2023, 2 in May 2024, 6 in July 2025, 8 in September 2026">
          <defs>
            <linearGradient id="growth-area" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#8cb8a5" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#8cb8a5" stopOpacity="0" />
            </linearGradient>
          </defs>
          <motion.path d={area} fill="url(#growth-area)" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.8 }} />
          <motion.path d={d} fill="none" stroke="#4a7c71" strokeWidth="3.5" strokeLinecap="round" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.8, ease: EASE }} />
          {pts.map(([x, y], i) => (
            <g key={i}>
              <motion.circle cx={x} cy={y} initial={{ r: 0 }} whileInView={{ r: i === active ? 11 : 7 }} animate={{ r: i === active ? 11 : 7 }} viewport={{ once: true }} fill={i === active ? "#c9a06e" : "#ffffff"} stroke="#4a7c71" strokeWidth="3" />
              <text x={x} y={y - 22} textAnchor="middle" className="fill-pine" style={{ fontFamily: "var(--font-display)", fontSize: 34 }}>
                {growth[i].n}
              </text>
            </g>
          ))}
        </svg>
        <div className="absolute inset-0 flex">
          {growth.map((x, i) => (
            <button
              key={x.when}
              type="button"
              className="h-full flex-1"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              aria-label={`${x.when}: ${x.n} branch${x.n > 1 ? "es" : ""}. ${x.story}`}
            />
          ))}
        </div>
      </div>
      <div className="mt-4 flex justify-between text-sm text-pine/55">
        {growth.map((x, i) => (
          <span key={x.when} className={i === active ? "font-semibold text-pine" : ""}>
            {x.when.split(" ")[1]}
          </span>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.p key={g.when} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-6 text-lg text-pine/75" aria-live="polite">
          <span className="font-semibold text-pine">{g.when}.</span> {g.story}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

function Vision() {
  return (
    <section className="relative overflow-hidden py-24 md:py-36" aria-labelledby="vision-title">
      <Spill className="pointer-events-none absolute -right-56 top-0 h-[760px] w-[760px]" color="var(--color-mint-soft)" glossy />
      <Spill className="pointer-events-none absolute -left-48 bottom-0 h-[460px] w-[460px] opacity-70" color="var(--color-caramel-soft)" drips={false} />
      <div className="container-x relative">
        <h2 id="vision-title" className="sr-only">
          Our vision
        </h2>
        <ScrollWords
          className="mx-auto max-w-[24ch] text-center font-display text-[clamp(44px,6vw,96px)] leading-[0.95]"
          text="Hard work, innovation, minimalism and uncompromising quality, ready to be replicated anywhere in the world."
        />
        <div className="mt-24 grid gap-16 lg:grid-cols-[1.2fr_0.8fr] lg:gap-24">
          <div>
            <h3 className="font-display text-[clamp(36px,3.6vw,52px)]">Branches over time</h3>
            <div className="mt-8">
              <GrowthLine />
            </div>
          </div>
          <div className="space-y-12 lg:pt-4">
            {[
              { t: "Self-funded", d: "Every store is over $100,000 of capital investment with no external funding. No kiosks, no pop-ups." },
              { t: "Organic growth", d: "We don't franchise. A share of net profits funds each new branch, keeping the vision in our own hands." },
              { t: "On our own terms", d: "As we grow beyond Lahore, we'll stay humble enough to learn the nuances of every community." },
            ].map((v, i) => (
              <motion.div key={v.t} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.1, ease: EASE }}>
                <h3 className="font-display text-[40px] leading-none text-sage-deep">{v.t}</h3>
                <p className="mt-3 max-w-[42ch] text-lg leading-relaxed text-pine/70">{v.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────── Concept tabs ───────────── */

const concept = [
  { t: "Precision", d: "Every cup is calibrated to the decimal, whatever the time and however busy the bar. It has earned us a place among Lahore's most respected hospitality brands.", img: "/img/ig/lat4.jpg", alt: "A layered Hazelnut Latte" },
  { t: "Service", d: "Serving before hours, as early as 5:45 am, and adapting each drink to how you like it, day in and day out. Our workflow turns drinks around faster than most specialty shops.", img: "/img/ig-coffeeday.jpg", alt: "Baristas behind the Double Shot bar" },
  { t: "Consistency", d: "Each location mirrors the original in menu, ambiance and service. Walk into any branch and you'll find the same welcome, a sense of familiarity and a safe space.", img: "/img/ig/snp2.jpg", alt: "The Mall Road storefront" },
  { t: "Forward thinking", d: "We introduced Matcha before it became mainstream, stock imported Barista Edition alternate milks, and pour a Flat White made to our own recipe.", img: "/img/matcha.png", alt: "Yoocha matcha beside an iced matcha" },
];

function Concept() {
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (touched || !inView || reduce) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % concept.length), 5000);
    return () => clearTimeout(t);
  }, [active, touched, inView, reduce]);

  const pick = (i: number) => {
    setTouched(true);
    setActive(i);
  };
  const c = concept[active];

  return (
    <section ref={ref} className="bg-milk py-24 md:py-32" aria-labelledby="concept-title">
      <div className="container-x">
        <h2 id="concept-title" className="font-display text-[clamp(52px,7vw,104px)]">
          Our concept
        </h2>
        <div className="mt-12 grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
          <div role="tablist" aria-label="The ideas behind every cup" aria-orientation="vertical">
            {concept.map((x, i) => {
              const on = i === active;
              return (
                <button
                  key={x.t}
                  role="tab"
                  aria-selected={on}
                  type="button"
                  onClick={() => pick(i)}
                  onMouseEnter={() => pick(i)}
                  onFocus={() => pick(i)}
                  className="group relative block w-full py-3 text-left"
                >
                  <span className={`font-display block text-[clamp(48px,6vw,92px)] leading-[0.95] transition-colors duration-500 ${on ? "text-pine" : "text-pine/20 group-hover:text-pine/45"}`}>{x.t}</span>
                  {on && <motion.span layoutId="concept-line" className="absolute -left-6 top-1/2 hidden h-[3px] w-4 -translate-y-1/2 rounded-full bg-sage md:block" />}
                </button>
              );
            })}
          </div>
          <div role="tabpanel" aria-live="polite">
            <div className="relative aspect-[5/4] overflow-hidden rounded-[32px]">
              <AnimatePresence initial={false}>
                <motion.div
                  key={c.img}
                  className="absolute inset-0"
                  initial={{ clipPath: "inset(0% 0% 0% 100%)" }}
                  animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.9, ease: EASE }}
                >
                  <Image src={c.img} alt={c.alt} fill sizes="(max-width: 1024px) 90vw, 50vw" className="object-cover" />
                </motion.div>
              </AnimatePresence>
            </div>
            <AnimatePresence mode="wait">
              <motion.p key={c.t} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.4 }} className="mt-6 max-w-[54ch] text-lg leading-relaxed text-pine/75">
                {c.d}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────── Workshops ───────────── */

function Workshops() {
  return (
    <section className="py-16 md:py-24" aria-labelledby="workshops-title">
      <div className="container-x">
        <div className="relative grid items-center gap-10 overflow-hidden rounded-[40px] bg-mint-soft px-7 py-12 md:grid-cols-[1.1fr_0.9fr] md:px-14 md:py-16">
          <Spill className="pointer-events-none absolute -right-20 -top-24 h-[420px] w-[420px] opacity-60" color="#ffffff" drips={false} />
          <div className="relative">
            <h2 id="workshops-title" className="font-display text-[clamp(52px,6.5vw,100px)] leading-[0.9]">
              It takes a village
            </h2>
            <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-pine/75">
              Our workshops are for rising entrepreneurs and enthusiasts who want to learn the art of coffee and what it takes to run a coffee shop. Our team is built from within, on SOPs shaped by the London School of Coffee and matcha training in Kyoto.
            </p>
            <a href="https://forms.gle/YpgG7KCCUV7khvMaA" target="_blank" rel="noopener noreferrer" className="btn mt-8 bg-white text-pine shadow-sm hover:bg-mint-wash">
              Book a workshop <ArrowUpRight size={17} aria-hidden />
            </a>
          </div>
          <motion.div
            initial={{ opacity: 0, rotate: -10, y: 40 }}
            whileInView={{ opacity: 1, rotate: -4, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 70, damping: 14 }}
            className="relative mx-auto aspect-[3/4] w-full max-w-[320px] overflow-hidden rounded-[24px] shadow-[0_40px_70px_-30px_rgba(35,42,40,0.5)]"
          >
            <Image src="/img/ig/ws1.jpg" alt="Double Shot workshops and events poster" fill sizes="320px" className="object-cover" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ───────────── Page ───────────── */

export default function JourneyView() {
  return (
    <>
      <PageHero title="Our journey" lead="From 350 square feet and four tables to eight homes across Lahore.">
        <div className="container-x grid items-end gap-8 pb-10 md:grid-cols-[1fr_auto] md:pb-14">
          <a href="#timeline" className="btn btn-ghost order-2 w-fit md:order-1">
            See how we got here <ArrowDown size={17} aria-hidden />
          </a>
          <div className="order-1 flex justify-center md:order-2 md:justify-end">
            <HeroCups />
          </div>
        </div>
      </PageHero>
      <Numbers />
      <Beginning />
      <Timeline />
      <Snapshots />
      <Vision />
      <Concept />
      <Workshops />
    </>
  );
}
