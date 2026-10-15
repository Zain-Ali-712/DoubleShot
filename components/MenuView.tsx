"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ShoppingBag } from "lucide-react";
import { categories, formatPKR, getProduct, products, type Category } from "@/lib/data";
import { useStore } from "@/lib/store";
import ProductCard from "./ProductCard";
import PageHero from "./PageHero";
import BarList from "./BarList";
import { Spill } from "./Brand";

const EASE = [0.16, 1, 0.3, 1] as const;

const SHELF = [
  { slug: "cans", src: "/img/hero-can.png", w: 377, h: 700, scale: 1 },
  { slug: "cold-brew", src: "/img/hero-coldbrew.png", w: 415, h: 597, scale: 0.86 },
  { slug: "brazil-cerrado-beans", src: "/img/hero-beans.png", w: 366, h: 506, scale: 0.92 },
  { slug: "yoocha-matcha", src: "/img/cut-matcha.png", w: 531, h: 591, scale: 0.8 },
  { slug: "tumbler", src: "/img/cut-tumbler.png", w: 486, h: 846, scale: 0.98 },
  { slug: "denim-cap", src: "/img/cut-cap.png", w: 863, h: 645, scale: 0.5 },
];

function Shelf() {
  const reduce = useReducedMotion();
  return (
    <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory items-end gap-6 overflow-x-auto px-6 pb-2 md:mx-0 md:grid md:grid-cols-6 md:gap-4 md:overflow-visible md:px-0">
      {SHELF.map((s, i) => {
        const p = getProduct(s.slug)!;
        return (
          <motion.a
            key={s.slug}
            href={`#${s.slug}`}
            className="group flex w-[38vw] shrink-0 snap-center flex-col items-center md:w-auto"
            initial={reduce ? false : { y: 120, opacity: 0, rotate: i % 2 ? 8 : -8 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 80, damping: 14, delay: 0.55 + i * 0.09 }}
          >
            <div className="relative flex h-[30svh] max-h-[300px] min-h-[180px] w-full items-end justify-center">
              <motion.div
                className="flex h-full items-end justify-center"
                style={{ height: `${s.scale * 100}%` }}
                whileHover={reduce ? undefined : { y: -14 }}
                transition={{ type: "spring", stiffness: 220, damping: 16 }}
              >
                <Image
                  src={s.src}
                  alt=""
                  width={s.w}
                  height={s.h}
                  priority
                  sizes="(max-width: 768px) 38vw, 200px"
                  className="h-full w-auto object-contain drop-shadow-[0_22px_22px_rgba(35,42,40,0.22)]"
                />
              </motion.div>
              <span className="absolute -bottom-1 h-3 w-[70%] rounded-[50%] bg-pine/12 blur-[6px] transition-transform duration-500 group-hover:scale-x-75" aria-hidden />
            </div>
            <span className="mt-5 text-center text-[15px] font-semibold text-pine">{p.name}</span>
            <span className="text-sm text-pine/55 tabular-nums">{formatPKR(p.price)}</span>
          </motion.a>
        );
      })}
    </div>
  );
}

function CerradoChapter() {
  const p = getProduct("brazil-cerrado-beans")!;
  const { add, setCartOpen, lines } = useStore();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bagY = useTransform(scrollYProgress, [0, 1], ["14%", "-14%"]);
  const bagR = useTransform(scrollYProgress, [0, 1], [-6, 6]);
  const inCart = lines.some((l) => l.slug === p.slug);

  const specs = [
    { k: "Roast", v: "Medium" },
    { k: "Process", v: "Natural" },
    { k: "Notes", v: "Milk chocolate, hazelnut, pecan" },
  ];

  return (
    <section ref={ref} className="py-16 md:py-24" aria-labelledby="cerrado-title">
      <div className="container-x">
        <div className="relative grid overflow-hidden rounded-[40px] bg-mint-wash lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative z-10 px-7 py-12 md:px-14 md:py-16">
            <h2 id="cerrado-title" className="font-display text-[clamp(52px,6.5vw,100px)] leading-[0.88]">
              New season,
              <br />
              <span className="text-sage-deep">Brazil Cerrado</span>
            </h2>
            <p className="mt-6 max-w-[44ch] text-lg leading-relaxed text-pine/75">
              A single-origin bean with low acidity and full body. Roasted in Lahore&apos;s first solar-powered fluid bed roasting facility, in collaboration with Rhapsody Coffee.
            </p>
            <dl className="mt-10 grid max-w-[520px] grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3">
              {specs.map((s) => (
                <div key={s.k} className={s.k === "Notes" ? "col-span-2 sm:col-span-1" : ""}>
                  <dt className="text-sm text-pine/55">{s.k}</dt>
                  <dd className="font-display mt-1 text-[28px] leading-[1]">{s.v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-10 flex flex-wrap items-center gap-5">
              <button
                type="button"
                onClick={() => {
                  add(p.slug);
                  setCartOpen(true);
                }}
                className="btn btn-primary btn-lg"
              >
                <ShoppingBag size={18} aria-hidden /> {inCart ? "Add another bag" : "Add to cart"}
              </button>
              <span className="font-display text-[36px] tabular-nums">{formatPKR(p.price)}</span>
            </div>
          </div>
          <div className="relative min-h-[420px] lg:min-h-[560px]">
            <Spill className="absolute left-1/2 top-1/2 h-[96%] w-[96%] -translate-x-1/2 -translate-y-1/2" color="var(--color-mint-soft)" glossy />
            <motion.div style={{ y: bagY, rotate: bagR }} className="absolute inset-0 flex items-center justify-center">
              <Image src="/img/hero-beans.png" alt="A bag of Double Shot Brazil Cerrado beans" width={366} height={506} sizes="(max-width: 1024px) 60vw, 360px" className="h-[78%] w-auto drop-shadow-[0_40px_40px_rgba(35,42,40,0.28)]" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40, rotate: 10 }}
              whileInView={{ opacity: 1, x: 0, rotate: 4 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease: EASE, delay: 0.2 }}
              className="absolute bottom-8 right-6 h-36 w-36 overflow-hidden rounded-[24px] border-[5px] border-white shadow-xl md:h-44 md:w-44"
            >
              <Image src="/img/beans.jpg" alt="Brazil Cerrado beans beside the bag" fill sizes="176px" className="object-cover" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function MenuView() {
  const [cat, setCat] = useState<Category | "all">("all");
  const { count, subtotal, setCartOpen } = useStore();
  const list = cat === "all" ? products : products.filter((p) => p.category === cat);

  return (
    <>
      <PageHero title="The menu" lead="Cans, cold brew, fresh beans, matcha and merch, delivered across DHA Lahore.">
        <div className="container-x pb-12 md:pb-16">
          <Shelf />
        </div>
      </PageHero>

      <div className="relative">
        <div className="sticky top-[84px] z-30 sm:top-[92px]">
          <div className="container-x">
            <div
              role="tablist"
              aria-label="Filter the menu"
              className="no-scrollbar mx-auto flex w-max max-w-full gap-1 overflow-x-auto rounded-full border border-pine/8 bg-white/90 p-1.5 shadow-[0_10px_30px_-15px_rgba(35,42,40,0.3)] backdrop-blur-xl"
            >
              {categories.map((c) => {
                const on = cat === c.id;
                return (
                  <button
                    key={c.id}
                    role="tab"
                    aria-selected={on}
                    type="button"
                    onClick={() => setCat(c.id)}
                    className={`relative shrink-0 rounded-full px-4 py-2.5 text-[15px] font-semibold transition-colors sm:px-5 ${on ? "text-pine" : "text-pine/60 hover:text-pine"}`}
                  >
                    {on && <motion.span layoutId="menu-pill" className="absolute inset-0 rounded-full bg-btn" transition={{ type: "spring", stiffness: 380, damping: 34 }} />}
                    <span className="relative">{c.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <section className="pb-12 pt-14 md:pb-16 md:pt-20" aria-label="Products">
          <div className="container-x">
            <motion.div layout className="grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {list.map((p, i) => (
                  <motion.div
                    key={p.slug}
                    id={p.slug}
                    layout
                    className="scroll-mt-40"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.6, delay: i * 0.04, ease: EASE }}
                  >
                    <ProductCard product={p} variant="cutout" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>
      </div>

      <CerradoChapter />
      <BarList />

      <AnimatePresence>
        {count > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-x-0 bottom-4 z-40 px-4 md:hidden"
          >
            <button type="button" onClick={() => setCartOpen(true)} className="flex h-14 w-full items-center justify-between rounded-full bg-btn px-6 font-semibold text-pine shadow-2xl">
              <span>View cart ({count})</span>
              <span className="tabular-nums">{formatPKR(subtotal)}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
