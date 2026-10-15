"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { contact, formatPKR, rickshot } from "@/lib/data";
import PageHero from "./PageHero";
import { Spill } from "./Brand";
import { WhatsAppIcon } from "./Brand";

const EASE = [0.16, 1, 0.3, 1] as const;

function HeroRickshaw() {
  const reduce = useReducedMotion();
  return (
    <div className="container-x pb-10 md:pb-14">
      <div className="relative mx-auto h-[min(28svh,300px)] max-w-[1000px] md:h-[min(38svh,420px)]">
        <div className="absolute inset-x-0 bottom-3 h-[3px] overflow-hidden" aria-hidden>
          <motion.div
            className="h-full w-[200%]"
            style={{ backgroundImage: "repeating-linear-gradient(90deg, var(--color-sage) 0 30px, transparent 30px 60px)" }}
            animate={reduce ? undefined : { x: ["-50%", "0%"] }}
            transition={{ duration: 1, repeat: 2, ease: "linear", delay: 0.4 }}
          />
        </div>
        <motion.div
          className="absolute inset-0 flex items-end justify-center"
          initial={reduce ? false : { x: "-120vw" }}
          animate={{ x: "0vw" }}
          transition={{ duration: 2.2, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div animate={reduce ? undefined : { y: [0, -2, 0, -1, 0] }} transition={{ duration: 0.35, repeat: 6, delay: 0.4 }} className="h-full">
            <Image
              src="/img/cut-rickshot.png"
              alt="The mint green Double Shot coffee rickshaw with a cat illustration"
              width={1400}
              height={815}
              priority
              sizes="(max-width: 1000px) 90vw, 760px"
              className="h-full w-auto drop-shadow-[0_34px_30px_rgba(35,42,40,0.25)]"
            />
          </motion.div>
        </motion.div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.6, ease: EASE }}
        className="mt-8 flex flex-wrap justify-center gap-3"
      >
        <a href="#plan" className="btn btn-primary btn-lg">
          Build your package <ArrowDown size={17} aria-hidden />
        </a>
        <a href={rickshot.bookingForm} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-lg">
          Booking form <ArrowUpRight size={17} aria-hidden />
        </a>
      </motion.div>
    </div>
  );
}

function Planner() {
  const [pkgIdx, setPkgIdx] = useState(2);
  const [extra, setExtra] = useState(0);
  const [far, setFar] = useState(false);
  const pkg = rickshot.packages[pkgIdx];
  const total = rickshot.setupFee + pkg.price + extra * pkg.extra + (far ? 5000 : 0);

  return (
    <section id="plan" className="scroll-mt-24 py-24 md:py-32" aria-labelledby="plan-title">
      <div className="container-x">
        <h2 id="plan-title" className="font-display text-[clamp(52px,7vw,104px)]">
          Pick your pour count
        </h2>
        <p className="mt-4 max-w-[52ch] text-lg text-pine/70">
          Every package includes our baristas for four hours from setup, plus a one-time set-up fee of {formatPKR(rickshot.setupFee)}.
        </p>

        <div className="mt-14 grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
          <div>
            <div role="radiogroup" aria-label="Drinks included" className="grid grid-cols-4 gap-2">
              {rickshot.packages.map((p, i) => {
                const on = i === pkgIdx;
                return (
                  <button
                    key={p.drinks}
                    role="radio"
                    aria-checked={on}
                    type="button"
                    onClick={() => setPkgIdx(i)}
                    className="group relative flex flex-col items-start pb-5 text-left"
                  >
                    <span className={`font-display text-[clamp(64px,9vw,148px)] leading-[0.82] transition-colors duration-500 ${on ? "text-sage-deep" : "text-pine/20 group-hover:text-pine/40"}`}>
                      {p.drinks}
                    </span>
                    <span className={`mt-1 text-sm font-medium transition-colors ${on ? "text-pine" : "text-pine/45"}`}>{p.popular ? "drinks, most popular" : "drinks"}</span>
                    {on && <motion.span layoutId="pkg-line" className="absolute bottom-0 left-0 h-[3px] w-full rounded-full bg-sage" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                  </button>
                );
              })}
            </div>
            <div className="mt-2 h-px bg-pine/10" aria-hidden />
            <AnimatePresence mode="wait">
              <motion.div
                key={pkg.drinks}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="mt-10 grid gap-8 sm:grid-cols-2"
              >
                <div>
                  <p className="text-sm text-pine/55">Package price</p>
                  <p className="font-display mt-1 text-[clamp(44px,5vw,72px)] leading-none tabular-nums">{formatPKR(pkg.price)}</p>
                </div>
                <div>
                  <p className="text-sm text-pine/55">Each extra drink</p>
                  <p className="font-display mt-1 text-[clamp(44px,5vw,72px)] leading-none tabular-nums">{formatPKR(pkg.extra)}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative h-fit overflow-hidden rounded-[32px] bg-mint-wash p-7 md:p-9 lg:sticky lg:top-32">
            <h3 className="font-display text-[40px]">Your estimate</h3>
            <label htmlFor="extra" className="mt-6 flex items-baseline justify-between font-medium">
              Extra drinks <span className="font-display text-[28px] text-sage-deep tabular-nums">{extra}</span>
            </label>
            <input id="extra" type="range" min={0} max={100} step={5} value={extra} onChange={(e) => setExtra(Number(e.target.value))} className="mt-3 w-full accent-[#4a7c71]" />
            <label className="mt-6 flex cursor-pointer items-start gap-3">
              <input type="checkbox" checked={far} onChange={(e) => setFar(e.target.checked)} className="mt-1 h-5 w-5 accent-[#4a7c71]" />
              <span>
                Venue more than 20 km from DHA Phase VI <span className="text-pine/55">(+{formatPKR(5000)})</span>
              </span>
            </label>
            <dl className="mt-7 space-y-2 text-[15px]">
              <div className="flex justify-between"><dt className="text-pine/60">Set-up fee</dt><dd className="tabular-nums">{formatPKR(rickshot.setupFee)}</dd></div>
              <div className="flex justify-between"><dt className="text-pine/60">{pkg.drinks} drinks</dt><dd className="tabular-nums">{formatPKR(pkg.price)}</dd></div>
              {extra > 0 && <div className="flex justify-between"><dt className="text-pine/60">{extra} extra drinks</dt><dd className="tabular-nums">{formatPKR(extra * pkg.extra)}</dd></div>}
              {far && <div className="flex justify-between"><dt className="text-pine/60">Travel</dt><dd className="tabular-nums">{formatPKR(5000)}</dd></div>}
            </dl>
            <div className="mt-5 flex items-baseline justify-between border-t border-pine/10 pt-5">
              <span className="font-semibold">{pkg.drinks + extra} drinks</span>
              <motion.span key={total} initial={{ opacity: 0.3, y: 6 }} animate={{ opacity: 1, y: 0 }} className="font-display text-[44px] tabular-nums">
                {formatPKR(total)}
              </motion.span>
            </div>
            <a
              href={`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(`Hi! I'd like to book RickShot: ${pkg.drinks + extra} drinks, estimate ${formatPKR(total)}.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-lg mt-6 w-full"
            >
              <WhatsAppIcon className="h-[18px] w-[18px]" /> Send on WhatsApp
            </a>
            <p className="mt-3 text-center text-sm text-pine/55">An estimate. We confirm the final quote.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function EventMenu() {
  return (
    <section className="bg-milk py-24 md:py-32" aria-labelledby="event-menu-title">
      <div className="container-x grid items-center gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div className="relative order-2 mx-auto h-[380px] w-full max-w-[520px] lg:order-1 lg:h-[480px]">
          <Spill className="absolute inset-0 h-full w-full" color="var(--color-mint-soft)" glossy />
          {[
            { src: "/img/cup-vanilla.png", w: 461, h: 532, cls: "left-[6%] bottom-[10%] h-[44%]", r: -8, d: 0 },
            { src: "/img/hero-can.png", w: 377, h: 700, cls: "left-[36%] bottom-[12%] h-[66%] z-10", r: 0, d: 0.1 },
            { src: "/img/cup-hazelnut.png", w: 633, h: 736, cls: "right-[4%] bottom-[10%] h-[48%]", r: 8, d: 0.2 },
          ].map((c) => (
            <motion.div
              key={c.src}
              className={`absolute ${c.cls}`}
              initial={{ opacity: 0, y: 80, rotate: c.r * 2 }}
              whileInView={{ opacity: 1, y: 0, rotate: c.r }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ type: "spring", stiffness: 80, damping: 14, delay: c.d }}
            >
              <Image src={c.src} alt="" width={c.w} height={c.h} className="h-full w-auto drop-shadow-[0_24px_24px_rgba(35,42,40,0.25)]" />
            </motion.div>
          ))}
        </div>
        <div className="order-1 lg:order-2">
          <h2 id="event-menu-title" className="font-display text-[clamp(52px,7vw,104px)]">
            The event menu
          </h2>
          <ul className="mt-10 grid gap-x-10 gap-y-7 sm:grid-cols-2">
            {rickshot.menu.map((m, i) => (
              <motion.li key={m.name} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.05, ease: EASE }}>
                <p className="font-display text-[clamp(34px,3vw,44px)] leading-none">{m.name}</p>
                <p className="mt-1.5 text-pine/60">{m.temp}</p>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function GoodToKnow() {
  return (
    <section className="py-24 md:py-32" aria-labelledby="terms-title">
      <div className="container-x">
        <h2 id="terms-title" className="font-display text-[clamp(52px,7vw,104px)]">
          Good to know
        </h2>
        <dl className="mt-12 grid gap-x-16 gap-y-12 md:grid-cols-2">
          {rickshot.terms.map((t, i) => (
            <motion.div key={t.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: (i % 2) * 0.08, ease: EASE }}>
              <dt className="font-display text-[clamp(40px,4vw,60px)] leading-none text-sage-deep">{t.title}</dt>
              <dd className="mt-3 max-w-[40ch] text-lg text-pine/70">{t.text}</dd>
            </motion.div>
          ))}
        </dl>

        <div className="relative mt-24 overflow-hidden rounded-[40px] bg-mint-soft px-7 py-14 text-center md:px-14 md:py-20">
          <Spill className="pointer-events-none absolute -left-24 -top-24 h-[360px] w-[360px] opacity-60" color="#ffffff" drips={false} />
          <Spill className="pointer-events-none absolute -bottom-32 -right-20 h-[400px] w-[400px] opacity-50" color="#ffffff" drips={false} />
          <p className="font-display relative mx-auto max-w-[16ch] text-[clamp(48px,6vw,92px)] leading-[0.9]">Bring the bar to your event</p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <a href={rickshot.bookingForm} target="_blank" rel="noopener noreferrer" className="btn btn-lg bg-white text-pine shadow-sm hover:bg-mint-wash">
              Booking form <ArrowUpRight size={17} aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function RickShotView() {
  return (
    <>
      <PageHero title="RickShot" lead="Our mobile brew bar. Baristas, high-end equipment and calibrated beans, at your venue.">
        <HeroRickshaw />
      </PageHero>
      <Planner />
      <EventMenu />
      <GoodToKnow />
    </>
  );
}
