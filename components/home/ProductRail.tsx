"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { ArrowRight, MoveRight } from "lucide-react";
import { getProduct, products } from "@/lib/data";
import ProductCard from "../ProductCard";
import { Ring } from "../Brand";

function useIsDesktop() {
  const [d, setD] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const set = () => setD(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);
  return d;
}

function SideHint({ progress }: { progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  return (
    <div className="flex items-center gap-4" aria-hidden>
      <span className="flex items-center gap-2 text-sm font-semibold text-sage-deep">
        Scroll sideways
        <motion.span animate={reduce ? undefined : { x: [0, 8, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}>
          <MoveRight size={18} />
        </motion.span>
      </span>
      <span className="relative h-[3px] w-28 overflow-hidden rounded-full bg-pine/10 md:w-40">
        <motion.span style={{ scaleX: progress }} className="absolute inset-0 origin-left rounded-full bg-sage" />
      </span>
    </div>
  );
}

function ViewAllCard() {
  return (
    <Link
      href="/menu"
      className="group relative flex aspect-[4/5] h-full flex-col justify-between overflow-hidden rounded-[28px] bg-mint-soft p-7 md:aspect-auto transition-colors duration-500 hover:bg-mint-2"
    >
      <Ring className="absolute -right-20 -top-16 h-72 w-auto text-white/60 transition-transform duration-700 group-hover:rotate-45" strokeWidth={7} />
      <div className="relative flex items-center justify-between">
        <p className="text-[15px] font-medium text-pine/70">{products.length} products, plus the bar menu</p>
      </div>
      <div className="relative">
        <p className="font-display text-[clamp(80px,min(9vw,13vh),150px)] leading-[0.78] text-pine transition-transform duration-500 group-hover:-translate-y-1">
          View
          <br />
          <span className="text-sage-deep">all</span>
        </p>
        <div className="mt-6 flex items-center justify-between">
          <div className="flex -space-x-3" aria-hidden>
            {["/img/hero-can.png", "/img/cut-matcha.png", "/img/cut-tumbler.png", "/img/cut-cap.png"].map((src) => (
              <span key={src} className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border-2 border-mint-soft bg-white p-1.5">
                <Image src={src} alt="" width={40} height={40} className="h-full w-auto object-contain" />
              </span>
            ))}
          </div>
          <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-white text-pine transition-transform duration-500 group-hover:translate-x-2">
            <ArrowRight size={22} aria-hidden />
          </span>
        </div>
      </div>
    </Link>
  );
}

// Rail order: the strongest cut-outs first, Gift Basket third from last.
const RAIL = ["cans", "cold-brew", "brazil-cerrado-beans", "yoocha-matcha", "tumbler", "gift-basket", "denim-cap", "gift-shot"]
  .map((s) => getProduct(s))
  .filter((p): p is NonNullable<typeof p> => Boolean(p));

export default function ProductRail() {
  const desktop = useIsDesktop();
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (!track.current) return;
      setDist(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
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
  const { scrollXProgress } = useScroll({ container: track });

  const heading = (
    <div className="container-x flex flex-col justify-between gap-6 md:flex-row md:items-end">
      <div>
        <h2 id="shelf-title" className="font-display max-w-[13ch] text-[clamp(48px,min(7vw,11vh),104px)]">
          Take Double Shot home
        </h2>
        <p className="mt-4 max-w-[46ch] text-lg text-pine/70 [@media(max-height:780px)]:hidden">Cans, cold brew, fresh beans, matcha and merch, delivered across DHA Lahore.</p>
      </div>
      <SideHint progress={desktop ? scrollYProgress : scrollXProgress} />
    </div>
  );

  const cards = (
    <>
      {RAIL.map((p) => (
        <div key={p.slug} className="w-[78vw] shrink-0 snap-start sm:w-[46vw] md:w-[280px]">
          <ProductCard product={p} variant="cutout" compact />
        </div>
      ))}
      <div className="w-[78vw] shrink-0 snap-start sm:w-[46vw] md:w-[280px]">
        <ViewAllCard />
      </div>
    </>
  );

  if (!desktop) {
    return (
      <section ref={section} className="bg-milk py-24" aria-labelledby="shelf-title">
        {heading}
        <div ref={track} className="no-scrollbar mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-2">
          {cards}
        </div>
      </section>
    );
  }

  return (
    <section ref={section} className="relative bg-milk" style={{ height: `calc(100vh + ${dist}px)` }} aria-labelledby="shelf-title">
      <div className="sticky top-0 flex h-screen flex-col justify-center gap-6 overflow-hidden pt-[88px] [@media(max-height:780px)]:gap-4">
        {heading}
        <motion.div ref={track} style={{ x }} className="flex w-max gap-6 pl-[max(16px,calc((100vw-1360px)/2+48px))] pr-12">
          {cards}
        </motion.div>
      </div>
    </section>
  );
}
