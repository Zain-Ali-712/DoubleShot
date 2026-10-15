"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { ArrowUpRight, Building2, CalendarHeart, GraduationCap, MapPin, Pause, Play, Sunrise, Users, Volume2, VolumeX } from "lucide-react";
import { branches, formatPKR, rickshot } from "@/lib/data";
import { Ring, Spill } from "../Brand";

const BranchMap = dynamic(() => import("../BranchMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse rounded-[32px] bg-mint-wash" />,
});

const EASE = [0.16, 1, 0.3, 1] as const;

/* ───────────────────────── Calculated & calibrated ───────────────────────── */

const precision = [
  { icon: Sunrise, k: "5:45 am", t: "Early doors", v: "The earliest we open. Lahore starts early, so do we." },
  { icon: Users, k: "1000+", t: "Daily guests", v: "Customers served a day at each flagship, every cup calibrated to the decimal." },
  { icon: GraduationCap, k: "London & Kyoto", t: "Training", v: "SOPs shaped by the London School of Coffee in Shoreditch and matcha courses in Kyoto." },
  { icon: Building2, k: "Self-funded", t: "Growth", v: "Every branch is built on our own terms. No franchises, no kiosks, no pop-ups." },
];

export function Precision() {
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.4 });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (touched || !inView || reduce) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % precision.length), 3800);
    return () => clearTimeout(t);
  }, [active, touched, inView, reduce]);

  const pick = (i: number) => {
    setTouched(true);
    setActive(i);
  };
  const cur = precision[active];

  return (
    <section ref={ref} className="relative overflow-hidden bg-white py-24 md:py-32" aria-labelledby="precision-title">
      <div className="container-x grid items-center gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div>
          <h2 id="precision-title" className="font-display text-[clamp(48px,6vw,92px)] text-pine">
            Calculated, and <span className="text-sage">calibrated</span> to precision.
          </h2>
          <p className="mt-5 max-w-[44ch] text-lg text-pine/70">
            Top-tier equipment, strict SOPs and daily oversight from our CEO. Walk into any branch and the cup tastes the same.
          </p>
          <div role="tablist" aria-label="What precision means to us" className="mt-8 grid gap-2 sm:grid-cols-2">
            {precision.map((p, i) => {
              const on = i === active;
              return (
                <button
                  key={p.k}
                  role="tab"
                  aria-selected={on}
                  type="button"
                  onMouseEnter={() => pick(i)}
                  onFocus={() => pick(i)}
                  onClick={() => pick(i)}
                  className={`relative flex items-center gap-3 rounded-2xl px-4 py-3.5 text-left transition-colors ${on ? "text-pine" : "text-pine/60 hover:text-pine"}`}
                >
                  {on && <motion.span layoutId="precision-pill" className="absolute inset-0 rounded-2xl bg-mint-soft" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                  <span className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${on ? "bg-white text-sage-deep" : "bg-mint-wash text-sage"}`}>
                    <p.icon size={18} aria-hidden />
                  </span>
                  <span className="relative">
                    <span className="block text-xs font-semibold text-pine/50">{p.t}</span>
                    <span className="block font-semibold">{p.k}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Calibration dial */}
        <div className="relative mx-auto aspect-square w-full max-w-[460px]" role="tabpanel" aria-live="polite">
          <Spill className="absolute inset-[-6%] h-[112%] w-[112%]" color="var(--color-mint-wash)" drips={false} />
          <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full text-sage" aria-hidden>
            {Array.from({ length: 60 }, (_, i) => {
              const a = (i / 60) * Math.PI * 2;
              const long = i % 15 === 0;
              const r1 = long ? 80 : 84;
              return (
                <line
                  key={i}
                  x1={(100 + Math.cos(a) * r1).toFixed(2)}
                  y1={(100 + Math.sin(a) * r1).toFixed(2)}
                  x2={(100 + Math.cos(a) * 90).toFixed(2)}
                  y2={(100 + Math.sin(a) * 90).toFixed(2)}
                  stroke="currentColor"
                  strokeOpacity={long ? 0.9 : 0.35}
                  strokeWidth={long ? 1.6 : 0.8}
                />
              );
            })}
            <circle cx="100" cy="100" r="68" fill="#fff" />
            <circle cx="100" cy="100" r="68" fill="none" stroke="currentColor" strokeWidth="5" />
          </svg>
          <motion.div className="absolute inset-0" animate={{ rotate: active * 90 }} transition={{ type: "spring", stiffness: 60, damping: 14 }}>
            <svg viewBox="0 0 200 200" className="h-full w-full text-caramel" aria-hidden>
              <path d="M178 100 L164 92 L164 108 Z" fill="currentColor" />
              <circle cx="100" cy="100" r="76" fill="none" stroke="currentColor" strokeWidth="1.6" strokeDasharray="30 448" strokeLinecap="round" transform="rotate(-11 100 100)" />
            </svg>
          </motion.div>
          <div className="absolute inset-[22%] flex flex-col items-center justify-center text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={cur.k}
                initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <cur.icon className="mx-auto text-sage" size={26} aria-hidden />
                <p className="font-display mt-2 text-[clamp(36px,4.6vw,58px)] leading-[0.9]">{cur.k}</p>
                <p className="mx-auto mt-2 max-w-[24ch] text-[14px] leading-snug text-pine/65 md:text-[15px]">{cur.v}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── RickShot strip ───────────────────────── */

export function RickShotStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const reduce = useReducedMotion();
  const [beep, setBeep] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 16 });
  const sy = useSpring(my, { stiffness: 60, damping: 16 });
  const blobX = useTransform(sx, [-0.5, 0.5], [-30, 30]);
  const blobY = useTransform(sy, [-0.5, 0.5], [-20, 20]);
  const ringX = useTransform(sx, [-0.5, 0.5], [24, -24]);
  const from = Math.min(...rickshot.packages.map((p) => p.price));

  return (
    <section className="py-16 md:py-24" aria-labelledby="rick-title">
      <div className="container-x">
        <div
          ref={ref}
          onPointerMove={(e) => {
            if (e.pointerType !== "mouse") return;
            const r = e.currentTarget.getBoundingClientRect();
            mx.set((e.clientX - r.left) / r.width - 0.5);
            my.set((e.clientY - r.top) / r.height - 0.5);
          }}
          onPointerLeave={() => {
            mx.set(0);
            my.set(0);
          }}
          className="relative grid items-center gap-8 overflow-hidden rounded-[40px] bg-mint-wash px-6 py-12 md:grid-cols-[0.8fr_1.2fr] md:px-14 md:py-16"
        >
          <motion.div style={{ x: blobX, y: blobY }} className="pointer-events-none absolute -right-20 -top-24 h-[420px] w-[420px]" aria-hidden>
            <Spill className="h-full w-full" color="var(--color-mint-soft)" />
          </motion.div>
          <motion.div style={{ x: ringX }} className="pointer-events-none absolute -bottom-24 left-[30%] text-mint-2" aria-hidden>
            <Ring className="h-72 w-auto" strokeWidth={6} />
          </motion.div>

          <div className="relative">
            <p className="flex items-center gap-2 font-semibold text-sage-deep">
              <CalendarHeart size={18} aria-hidden /> Events and catering
            </p>
            <h2 id="rick-title" className="font-display mt-3 text-[clamp(52px,6.5vw,96px)]">
              Our bar, on three wheels
            </h2>
            <p className="mt-4 max-w-[38ch] text-lg text-pine/70">
              RickShot brings our baristas, equipment and calibrated beans to your wedding, office or launch. From {formatPKR(from)} for 50 drinks.
            </p>
            <Link href="/rickshot" className="btn btn-primary mt-7">
              Plan your event <ArrowUpRight size={17} aria-hidden />
            </Link>
          </div>

          <div className="relative h-[220px] md:h-[340px]">
            {/* Road */}
            <div className="absolute inset-x-0 bottom-3 h-[3px] overflow-hidden" aria-hidden>
              <motion.div
                className="h-full w-[200%]"
                style={{ backgroundImage: "repeating-linear-gradient(90deg, var(--color-sage) 0 28px, transparent 28px 56px)" }}
                animate={inView && !reduce ? { x: ["-50%", "0%"] } : undefined}
                transition={{ duration: 1.1, repeat: 2, ease: "linear" }}
              />
            </div>
            <motion.button
              type="button"
              onClick={() => setBeep(true)}
              aria-label="Honk the RickShot horn"
              className="absolute bottom-3 right-0 w-[min(100%,560px)] origin-bottom"
              initial={reduce ? false : { x: "-140%" }}
              animate={inView ? { x: "0%" } : undefined}
              transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4, rotate: -0.6 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div animate={inView && !reduce ? { y: [0, -2, 0, -1, 0] } : undefined} transition={{ duration: 0.35, repeat: 6, delay: 0.1 }}>
                <Image
                  src="/img/cut-rickshot.png"
                  alt="The Double Shot RickShot coffee rickshaw"
                  width={1400}
                  height={815}
                  sizes="(max-width: 768px) 90vw, 560px"
                  className="h-auto w-full drop-shadow-[0_24px_22px_rgba(35,42,40,0.25)]"
                />
              </motion.div>
              <AnimatePresence>
                {beep && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.6, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ type: "spring", stiffness: 300, damping: 16 }}
                    onAnimationComplete={() => setTimeout(() => setBeep(false), 1100)}
                    className="font-display absolute -top-4 right-[18%] rounded-full bg-white px-5 py-2 text-[28px] text-sage-deep shadow-lg"
                  >
                    Beep beep!
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Branches with map ───────────────────────── */

export function BranchesMap() {
  const [active, setActive] = useState(0);
  const b = branches[active];

  return (
    <section className="bg-milk py-24 md:py-32" aria-labelledby="branches-title">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 id="branches-title" className="font-display text-[clamp(52px,7vw,104px)]">
            Eight doors in Lahore
          </h2>
          <p className="max-w-[36ch] text-lg text-pine/70">Hover or tap a branch to find it on the map. Every one mirrors the original: same menu, same welcome.</p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="relative lg:sticky lg:top-28 lg:h-[calc(100vh-160px)] lg:max-h-[640px]">
            <div className="h-[340px] overflow-hidden rounded-[32px] shadow-[0_30px_60px_-30px_rgba(35,42,40,0.35)] lg:h-full">
              <BranchMap branches={branches} active={active} onSelect={setActive} />
            </div>
            <div className="relative z-[500] mt-3 lg:pointer-events-none lg:absolute lg:bottom-5 lg:left-5 lg:mt-0 lg:w-[340px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={b.name}
                  initial={{ opacity: 0, y: 16, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  className="pointer-events-auto rounded-3xl bg-white/95 p-5 shadow-xl backdrop-blur"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-[40px] leading-[0.9]">{b.name}</p>
                      <p className="mt-1 flex items-center gap-1.5 text-[15px] text-pine/65">
                        <MapPin size={15} className="text-sage-deep" aria-hidden /> {b.area}
                      </p>
                    </div>
                    {b.note && <span className="shrink-0 rounded-full bg-caramel-soft px-3 py-1 text-xs font-semibold text-caramel-deep">New</span>}
                  </div>
                  {b.note && <p className="mt-2 text-sm text-pine/60">{b.note}</p>}
                  <a href={b.map} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-4 h-11 text-[15px]">
                    Get directions <ArrowUpRight size={16} aria-hidden />
                  </a>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <ul className="lg:py-4">
            {branches.map((br, i) => {
              const on = i === active;
              return (
                <li key={br.name}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onClick={() => setActive(i)}
                    aria-pressed={on}
                    className="group flex w-full items-center justify-between gap-4 border-b border-pine/10 py-4 text-left"
                  >
                    <span>
                      <span className={`font-display block text-[clamp(30px,3vw,44px)] transition-[color,transform] duration-500 ${on ? "translate-x-2 text-sage-deep" : "text-pine group-hover:translate-x-1"}`}>
                        {br.name}
                      </span>
                      <span className="block text-sm text-pine/55">{br.area}</span>
                    </span>
                    <motion.span
                      animate={{ scale: on ? 1 : 0.6, opacity: on ? 1 : 0.4 }}
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${on ? "bg-sage text-white" : "bg-mint-soft text-sage-deep"}`}
                    >
                      <MapPin size={16} aria-hidden />
                    </motion.span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Video and full-bleed image ───────────────────────── */

export function VideoFeature() {
  const ref = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 0.45], [0.86, 1]);
  const radius = useTransform(scrollYProgress, [0, 0.45], [56, 28]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  useEffect(() => {
    if (reduce) {
      video.current?.pause();
      setPlaying(false);
    }
  }, [reduce]);

  const toggleSound = () => {
    const v = video.current;
    if (!v) return;
    v.muted = !v.muted;
    if (!v.muted) {
      v.volume = 0.8;
      v.play();
      setPlaying(true);
    }
    setMuted(v.muted);
  };

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <section ref={ref} className="py-10 md:py-16" aria-labelledby="video-title">
      <motion.div style={{ scale, borderRadius: radius }} className="relative mx-auto h-[88svh] min-h-[560px] w-[min(100%-24px,1600px)] overflow-hidden">
        <motion.div style={{ y: bgY }} className="absolute inset-[-8%]">
          <Image src="/img/ig/snp2.jpg" alt="" fill sizes="100vw" className="object-cover object-[50%_30%] blur-[2px] brightness-[0.82]" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(25,35,32,0.72)] via-[rgba(25,35,32,0.35)] to-transparent" aria-hidden />

        <div className="relative grid h-full items-center gap-10 px-6 py-12 md:grid-cols-[1.1fr_0.9fr] md:px-16">
          <div className="text-white">
            <p className="flex items-center gap-2 font-semibold text-mint-2">
              <Ring className="h-4 w-auto" strokeWidth={12} /> Mall Road, September 2026
            </p>
            <h2 id="video-title" className="font-display mt-4 max-w-[12ch] text-[clamp(56px,7.5vw,120px)]">
              Not that we need a reason to celebrate coffee
            </h2>
            <p className="mt-5 max-w-[40ch] text-lg text-white/80">
              Our eighth home opened on one of Lahore&apos;s oldest streets, among historical buildings and stories of a place that refuses to rush.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/locations" className="btn btn-primary">
                Find a branch <ArrowUpRight size={17} aria-hidden />
              </Link>
              <a href="https://www.instagram.com/doubleshotlhr/" target="_blank" rel="noopener noreferrer" className="btn border border-white/40 text-white hover:bg-white/10">
                Watch more on Instagram
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[260px] md:max-w-[300px]">
            <motion.div
              initial={{ opacity: 0, y: 60, rotate: 6 }}
              whileInView={{ opacity: 1, y: 0, rotate: 3 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease: EASE }}
              className="relative aspect-[9/16] overflow-hidden rounded-[32px] border-[6px] border-white/90 shadow-2xl"
            >
              <video
                ref={video}
                className="h-full w-full object-cover"
                src="/video/coffeeday.mp4"
                poster="/img/ig-coffeeday.jpg"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="International Coffee Day at Double Shot, a short clip from our Instagram"
              />
              <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={toggleSound}
                  aria-pressed={!muted}
                  className="flex h-11 items-center gap-2 rounded-full bg-white/90 px-4 text-sm font-semibold text-pine shadow backdrop-blur transition-colors hover:bg-white"
                >
                  {muted ? <VolumeX size={18} aria-hidden /> : <Volume2 size={18} aria-hidden />}
                  {muted ? "Sound on" : "Sound off"}
                </button>
                <button
                  type="button"
                  onClick={toggle}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-pine shadow"
                  aria-label={playing ? "Pause video" : "Play video"}
                >
                  {playing ? <Pause size={18} /> : <Play size={18} />}
                </button>
              </div>
              {muted && (
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur"
                  animate={reduce ? undefined : { opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <VolumeX size={13} /> Tap for sound
                </motion.span>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

/* ───────────────────────── Latte line-up ───────────────────────── */

export function LatteLineup() {
  const shots = [
    { src: "/img/ig/lat2.jpg", name: "Vanilla Latte" },
    { src: "/img/ig/lat3.jpg", name: "Salted Caramel Latte" },
    { src: "/img/ig/lat4.jpg", name: "Hazelnut Latte" },
  ];
  return (
    <section className="py-24 md:py-32" aria-labelledby="lattes-title">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <h2 id="lattes-title" className="font-display max-w-[14ch] text-[clamp(52px,7vw,104px)]">
            Layered, with better sips
          </h2>
          <p className="max-w-[36ch] text-lg text-pine/70">Our lattes are now layered with new flavours. Make your own, at any branch.</p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {shots.map((s, i) => (
            <motion.figure
              key={s.name}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 1, delay: i * 0.1, ease: EASE }}
              className={`group ${i === 1 ? "sm:mt-16" : ""}`}
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-[28px]">
                <Image src={s.src} alt={s.name} fill sizes="(max-width: 640px) 90vw, 30vw" className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105" />
              </div>
              <figcaption className="font-display mt-4 text-[30px]">{s.name}</figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
