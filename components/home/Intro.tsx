"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Armchair, ArrowRight, Ruler, Sunrise } from "lucide-react";
import ScrollWords from "../ScrollWords";
import { Ring, RotatingText, Spill } from "../Brand";

const EASE = [0.16, 1, 0.3, 1] as const;

export function Marquee() {
  const items = ["Rise & Shot", "Calibrated to the decimal", "Open from 5:45 am", "Eight branches in Lahore", "Pakistan's first specialty Drive-Thru"];
  const row = [...items, ...items];
  return (
    <div className="marquee-wrap overflow-hidden border-y border-pine/8 bg-mint-wash py-5" aria-hidden>
      <div className="marquee-track flex w-max gap-12">
        {[...row, ...row].map((t, i) => (
          <span key={i} className="font-display flex items-center gap-12 text-[34px] text-pine/85">
            {t}
            <Ring className="h-5 w-auto text-sage" strokeWidth={12} />
          </span>
        ))}
      </div>
    </div>
  );
}

function RevealLines({ lines, className }: { lines: string[]; className: string }) {
  return (
    <h2 className={className}>
      {lines.map((l, i) => (
        <span key={l} className="block overflow-hidden pb-[0.05em]">
          <motion.span
            className="block"
            initial={{ y: "105%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 1, delay: i * 0.12, ease: EASE }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </h2>
  );
}

/** "Read our journey" with a looping nudge and a dashed path that draws on hover. */
export function JourneyLink({ href = "/journey", label = "Read our journey" }: { href?: string; label?: string }) {
  const reduce = useReducedMotion();
  return (
    <Link href={href} className="group relative inline-flex items-center gap-4">
      <span className="btn btn-primary btn-lg pr-2">
        {label}
        <span className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white">
          <motion.span
            animate={reduce ? undefined : { x: [0, 5, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="transition-transform duration-500 group-hover:translate-x-10"
          >
            <ArrowRight size={18} aria-hidden />
          </motion.span>
          <ArrowRight size={18} className="absolute -translate-x-10 transition-transform duration-500 group-hover:translate-x-0" aria-hidden />
        </span>
      </span>
      <svg viewBox="0 0 160 60" className="hidden h-12 w-32 overflow-visible text-sage sm:block" aria-hidden fill="none">
        <path
          d="M2 30 C 40 2, 80 58, 140 26"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="5 6"
          strokeLinecap="round"
          pathLength={1}
          className="[stroke-dashoffset:1] transition-[stroke-dashoffset] duration-700 ease-out group-hover:[stroke-dashoffset:0]"
          style={{ strokeDasharray: "1 1" }}
        />
        <path d="M134 18 L146 25 L136 35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-0 transition-opacity delay-500 duration-300 group-hover:opacity-100" />
      </svg>
      <span className="pointer-events-none absolute -bottom-7 left-2 text-sm font-medium text-sage-deep opacity-0 transition-all duration-500 group-hover:-bottom-8 group-hover:opacity-100">
        Next: how four tables became eight branches
      </span>
    </Link>
  );
}

export function Origin() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yMain = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);
  const ySmall = useTransform(scrollYProgress, [0, 1], ["30%", "-25%"]);
  const yCan = useTransform(scrollYProgress, [0, 1], ["40%", "-40%"]);
  const rotCan = useTransform(scrollYProgress, [0, 1], [-20, 16]);

  const facts = [
    { icon: Ruler, label: "350 sq ft" },
    { icon: Armchair, label: "Four tables" },
    { icon: Sunrise, label: "Open at 6 am, every day" },
  ];

  return (
    <section ref={ref} className="relative overflow-hidden py-24 md:py-36" aria-labelledby="origin-title">
      <div className="container-x grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
        <div>
          <RevealLines lines={["It started with", "four tables."]} className="font-display text-[clamp(56px,8vw,120px)] text-sage" />
          <ScrollWords
            className="mt-9 max-w-[30ch] text-[clamp(24px,2.6vw,36px)] font-medium leading-[1.22] tracking-[-0.01em]"
            text="May 2023, DHA Phase 6. One of Lahore's first specialty coffee shops, and within a month it had a cult following."
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1, ease: EASE }}
            className="mt-6 max-w-[52ch] text-lg leading-relaxed text-pine/70"
          >
            We put money into top-tier equipment, strict SOPs and daily oversight from our CEO, Ali Chughtai, from the first espresso shot to the last pour. On our first anniversary, May 17, 2024, the second branch opened. Today there are eight.
          </motion.p>
          <ul className="mt-8 flex flex-wrap gap-2.5">
            {facts.map((f, i) => (
              <motion.li
                key={f.label}
                initial={{ opacity: 0, scale: 0.85, y: 10 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 + i * 0.08 }}
                className="flex items-center gap-2 rounded-full bg-mint-wash px-4 py-2.5 text-[15px] font-medium text-pine"
              >
                <f.icon size={17} className="text-sage-deep" aria-hidden />
                {f.label}
              </motion.li>
            ))}
          </ul>
          <div className="mt-12 pb-6">
            <JourneyLink />
          </div>
        </div>

        <div className="relative mx-auto h-[540px] w-full max-w-[560px] md:h-[640px]">
          <Spill className="absolute -right-10 top-6 h-[78%] w-[78%]" color="var(--color-mint-soft)" />
          <motion.div
            style={{ y: yMain }}
            initial={{ clipPath: "inset(100% 0% 0% 0% round 36px)" }}
            whileInView={{ clipPath: "inset(0% 0% 0% 0% round 36px)" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1.3, ease: EASE }}
            className="absolute right-0 top-0 h-[82%] w-[70%] overflow-hidden rounded-[36px]"
          >
            <Image src="/img/ig-lattes.jpg" alt="Three layered iced lattes on the Double Shot bar" fill sizes="(max-width: 1024px) 70vw, 30vw" className="object-cover" />
          </motion.div>
          <motion.div
            style={{ y: ySmall }}
            initial={{ opacity: 0, rotate: -14, scale: 0.85 }}
            whileInView={{ opacity: 1, rotate: -6, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ type: "spring", stiffness: 90, damping: 16, delay: 0.35 }}
            className="absolute bottom-4 left-0 h-[46%] w-[46%] overflow-hidden rounded-[28px] border-[6px] border-white shadow-[0_30px_60px_-20px_rgba(35,42,40,0.35)]"
          >
            <Image src="/img/ig-empanadas.jpg" alt="Breakfast empanadas stacked on a Double Shot cup" fill sizes="(max-width: 1024px) 45vw, 20vw" className="object-cover" />
          </motion.div>
          <div className="absolute left-[18%] top-[6%] z-10">
            <RotatingText
              text="Since May 2023 • DHA Phase 6 • "
              className="h-28 w-28 rounded-full bg-white text-sage-deep shadow-[0_14px_40px_-16px_rgba(35,42,40,0.35)] md:h-32 md:w-32"
              center={<Ring className="h-7 w-auto text-sage" strokeWidth={12} />}
            />
          </div>
          <motion.div style={{ y: yCan, rotate: rotCan }} className="absolute -right-2 bottom-[2%] z-10 md:-right-8">
            <Image src="/img/hero-can.png" alt="" width={110} height={205} className="h-36 w-auto drop-shadow-[0_24px_24px_rgba(35,42,40,0.3)] md:h-44" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
