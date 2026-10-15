"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { contact } from "@/lib/data";
import PageHero from "./PageHero";
import { BranchesMap } from "./home/Features";
import { WhatsAppIcon } from "./Brand";

const EASE = [0.16, 1, 0.3, 1] as const;

function Storefront() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  return (
    <div className="container-x pb-12 md:pb-16">
      <motion.div
        ref={ref}
        initial={{ clipPath: "inset(30% 8% 0% 8% round 40px)", opacity: 0 }}
        animate={{ clipPath: "inset(0% 0% 0% 0% round 40px)", opacity: 1 }}
        transition={{ duration: 1.4, delay: 0.5, ease: EASE }}
        className="relative h-[42svh] min-h-[280px] overflow-hidden rounded-[40px]"
      >
        <motion.div style={{ y }} className="absolute inset-[-10%]">
          <Image src="/img/ig/snp2.jpg" alt="The Double Shot Mall Road storefront on opening day" fill priority sizes="(max-width: 1360px) 100vw, 1300px" className="object-cover object-[50%_14%]" />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function LocationsView() {
  return (
    <>
      <PageHero title="Locations" lead="Eight branches across Lahore. Every one mirrors the original in menu, ambiance and service.">
        <Storefront />
      </PageHero>

      <BranchesMap />

      <section className="py-16 md:py-24" aria-labelledby="delivery-title">
        <div className="container-x">
          <div className="grid items-center gap-10 overflow-hidden rounded-[40px] bg-mint-wash md:grid-cols-[1.1fr_0.9fr]">
            <div className="px-7 py-12 md:px-14 md:py-16">
              <h2 id="delivery-title" className="font-display text-[clamp(52px,6.5vw,100px)] leading-[0.9]">
                Can&apos;t make it in?
              </h2>
              <p className="mt-5 max-w-[40ch] text-lg text-pine/70">Delivery is available in all of DHA Lahore. Message us and we&apos;ll take it from there.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent("I'd like to place an order!")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-lg"
                >
                  <WhatsAppIcon className="h-[18px] w-[18px]" /> Order on WhatsApp
                </a>
                <a href="/menu" className="btn btn-ghost btn-lg">
                  See the menu <ArrowUpRight size={17} aria-hidden />
                </a>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, rotate: 6, y: 40 }}
              whileInView={{ opacity: 1, rotate: 3, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 70, damping: 14 }}
              className="relative mx-auto mb-10 aspect-[9/14] w-[min(300px,70vw)] overflow-hidden rounded-[28px] shadow-[0_40px_70px_-30px_rgba(35,42,40,0.5)] md:mb-0"
            >
              <Image src="/img/ig-mallroad.jpg" alt="Poster announcing the Mall Road branch on Shahrah-e-Quaid-e-Azam" fill sizes="300px" className="object-cover" />
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
