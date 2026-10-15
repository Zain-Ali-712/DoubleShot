"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { contact } from "@/lib/data";

/*
 * Drinks and food named on doubleshot.com.pk and @doubleshotlhr (see scraped-data.md).
 * Bar prices are not published online, so none are shown.
 * Where we have no photo of a specific drink, the frame shows the bar itself.
 */
type Item = { name: string; note: string; img: string; alt: string; fit?: "contain" };

const GROUPS: { title: string; items: Item[] }[] = [
  {
    title: "Coffee",
    items: [
      { name: "Spanish Latte", note: "The perfect go-to, and the one we seal in cans.", img: "/img/hero-can.png", alt: "A Double Shot Spanish Latte can", fit: "contain" },
      { name: "Vanilla Latte", note: "Layered, hot or iced.", img: "/img/ig/lat2.jpg", alt: "An iced Vanilla Latte" },
      { name: "Salted Caramel Latte", note: "New to the layered line-up.", img: "/img/ig/lat3.jpg", alt: "An iced Salted Caramel Latte" },
      { name: "Hazelnut Latte", note: "Layered, hot or iced.", img: "/img/ig/lat4.jpg", alt: "An iced Hazelnut Latte" },
      { name: "Flat White", note: "Our preferred version, made to our own recipe.", img: "/img/ig-coffeeday.jpg", alt: "Baristas behind the Double Shot bar" },
      { name: "Cappuccino", note: "Espresso, steamed milk, a deep cap of foam.", img: "/img/ig-coffeeday.jpg", alt: "Baristas behind the Double Shot bar" },
      { name: "Chocolate Classic", note: "Rich chocolate, hot or iced.", img: "/img/ig-lattes.jpg", alt: "Drinks lined up on the Double Shot bar" },
    ],
  },
  {
    title: "Matcha and breakfast",
    items: [
      { name: "Matcha", note: "Yoocha high-grown Japanese matcha, poured over ice.", img: "/img/matcha.png", alt: "Yoocha matcha beside an iced matcha" },
      { name: "Egg & Cheese Empanada", note: "Your next breakfast is sorted.", img: "/img/ig/emp2.jpg", alt: "Egg & Cheese and Chicken Red Sauce empanadas" },
      { name: "Chicken Red Sauce Empanada", note: "Your next breakfast is sorted.", img: "/img/ig-empanadas.jpg", alt: "Empanadas stacked on a Double Shot cup" },
    ],
  },
];

const ALL = GROUPS.flatMap((g) => g.items);

export default function BarList() {
  const [active, setActive] = useState(ALL[1].name);
  const item = ALL.find((i) => i.name === active)!;

  return (
    <section className="py-24 md:py-32" aria-labelledby="bar-title">
      <div className="container-x">
        <h2 id="bar-title" className="font-display text-[clamp(56px,7.5vw,112px)]">
          Poured at the bar
        </h2>
        <p className="mt-4 max-w-[52ch] text-lg text-pine/70">
          Handcrafted in every branch, with imported Barista Edition alternate milks on hand. Prices are at the counter.
        </p>

        <div className="mt-14 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[32px] bg-mint-wash">
              <AnimatePresence initial={false}>
                <motion.div
                  key={item.img + item.name}
                  className="absolute inset-0"
                  initial={{ clipPath: "inset(100% 0% 0% 0%)", scale: 1.08 }}
                  animate={{ clipPath: "inset(0% 0% 0% 0%)", scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                >
                  {item.fit === "contain" ? (
                    <div className="flex h-full items-center justify-center bg-mint-soft p-[14%]">
                      <Image src={item.img} alt={item.alt} width={377} height={700} className="h-full w-auto object-contain drop-shadow-[0_30px_30px_rgba(35,42,40,0.25)]" />
                    </div>
                  ) : (
                    <Image src={item.img} alt={item.alt} fill sizes="(max-width: 1024px) 90vw, 36vw" className="object-cover" />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
            <AnimatePresence mode="wait">
              <motion.p key={item.name} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 text-pine/65" aria-live="polite">
                {item.note}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {GROUPS.map((g) => (
              <div key={g.title}>
                <h3 className="text-lg font-semibold text-sage-deep">{g.title}</h3>
                <ul className="mt-4">
                  {g.items.map((d) => {
                    const on = d.name === active;
                    return (
                      <li key={d.name}>
                        <button
                          type="button"
                          onMouseEnter={() => setActive(d.name)}
                          onFocus={() => setActive(d.name)}
                          onClick={() => setActive(d.name)}
                          aria-pressed={on}
                          className="group flex w-full items-center gap-3 py-2 text-left"
                        >
                          <motion.span
                            animate={{ width: on ? 28 : 0, opacity: on ? 1 : 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 28 }}
                            className="block h-[3px] rounded-full bg-sage"
                            aria-hidden
                          />
                          <span className={`font-display text-[clamp(34px,3.2vw,48px)] leading-[1] transition-colors duration-300 ${on ? "text-sage-deep" : "text-pine/80 group-hover:text-pine"}`}>
                            {d.name}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
            <a
              href={`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent("Hi! Could you share today's bar menu and prices?")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost w-fit self-end"
            >
              Ask for today&apos;s prices <ArrowUpRight size={17} aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
