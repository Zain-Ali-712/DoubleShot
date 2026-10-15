"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatPKR } from "@/lib/data";
import { getLenis } from "./SmoothScroll";

export function QtyStepper({ slug, qty, size = "md" }: { slug: string; qty: number; size?: "sm" | "md" }) {
  const { setQty } = useStore();
  const h = size === "sm" ? "h-9" : "h-11";
  return (
    <div className={`inline-flex ${h} items-center rounded-full border border-pine/15 bg-milk`}>
      <button
        type="button"
        onClick={() => setQty(slug, qty - 1)}
        className={`flex ${h} w-10 items-center justify-center rounded-full text-pine hover:bg-pine/5`}
        aria-label={qty === 1 ? "Remove item" : "Decrease quantity"}
      >
        <Minus size={15} />
      </button>
      <span className="min-w-6 text-center text-[15px] font-semibold tabular-nums" aria-live="polite">
        {qty}
      </span>
      <button
        type="button"
        onClick={() => setQty(slug, qty + 1)}
        className={`flex ${h} w-10 items-center justify-center rounded-full text-pine hover:bg-pine/5`}
        aria-label="Increase quantity"
      >
        <Plus size={15} />
      </button>
    </div>
  );
}

export default function CartDrawer() {
  const { cartOpen, setCartOpen, lines, subtotal, remove, count } = useStore();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!cartOpen) return;
    const lenis = getLenis();
    lenis?.stop();
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setCartOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [cartOpen, setCartOpen]);

  return (
    <AnimatePresence>
      {cartOpen && (
        <div className="fixed inset-0 z-[60]">
          <motion.div
            className="absolute inset-0 bg-pine/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Your cart"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 32 }}
            className="absolute inset-y-0 right-0 flex w-full max-w-[440px] flex-col bg-foam shadow-2xl"
            data-lenis-prevent
          >
            <div className="flex items-center justify-between px-6 pb-4 pt-6">
              <h2 className="font-display text-[44px]">
                Your cart <span className="text-sage">({count})</span>
              </h2>
              <button
                ref={closeRef}
                type="button"
                onClick={() => setCartOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-pine/5"
                aria-label="Close cart"
              >
                <X size={22} />
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-start justify-center gap-5 px-6 pb-24">
                <p className="max-w-[28ch] text-lg text-pine/70">
                  Nothing here yet. Start with a can of Spanish Latte or a bag of fresh Brazil Cerrado.
                </p>
                <Link
                  href="/menu"
                  onClick={() => setCartOpen(false)}
                  className="rounded-full bg-btn px-6 py-3.5 font-semibold text-pine hover:bg-btn-hover"
                >
                  Browse the menu
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 space-y-3 overflow-y-auto px-6 pb-6">
                  <AnimatePresence initial={false}>
                    {lines.map((l) => (
                      <motion.li
                        key={l.slug}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        className="flex gap-4 rounded-2xl bg-milk p-3"
                      >
                        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-mint-soft">
                          <Image src={l.product.image} alt="" fill sizes="96px" className="object-cover" />
                        </div>
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-semibold leading-tight">{l.product.name}</p>
                              <p className="mt-0.5 text-sm text-pine/60">{formatPKR(l.product.price)}</p>
                              {l.product.note && <p className="mt-1 text-xs font-medium text-caramel-deep">{l.product.note}</p>}
                            </div>
                            <button
                              type="button"
                              onClick={() => remove(l.slug)}
                              className="text-sm text-pine/50 underline-offset-4 hover:text-pine hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                          <div className="mt-auto flex items-center justify-between pt-2">
                            <QtyStepper slug={l.slug} qty={l.qty} size="sm" />
                            <span className="font-semibold tabular-nums">{formatPKR(l.qty * l.product.price)}</span>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
                <div className="border-t border-pine/10 bg-milk px-6 pb-6 pt-5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-pine/70">Subtotal</span>
                    <span className="font-display text-[38px] tabular-nums">{formatPKR(subtotal)}</span>
                  </div>
                  <p className="mt-1 text-sm text-pine/55">Delivery is available across DHA Lahore. Fees are confirmed at checkout.</p>
                  <Link
                    href="/checkout"
                    onClick={() => setCartOpen(false)}
                    className="mt-4 flex h-14 w-full items-center justify-center rounded-full bg-btn font-semibold text-pine transition-colors hover:bg-btn-hover"
                  >
                    Go to checkout
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
