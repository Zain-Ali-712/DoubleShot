"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { formatPKR } from "@/lib/data";
import { useStore } from "@/lib/store";
import { QtyStepper } from "./CartDrawer";
import { Field } from "./Field";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function CheckoutView() {
  const { lines, subtotal, user, clear } = useStore();
  const [method, setMethod] = useState<"delivery" | "pickup">("delivery");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placed, setPlaced] = useState<{ ref: string; total: number } | null>(null);
  const pickupOnly = lines.some((l) => l.product.note === "Pickup only");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const next: Record<string, string> = {};
    if (String(f.get("name") ?? "").trim().length < 2) next.name = "Enter your name.";
    if (!/^(\+92|0)3\d{2}[\s-]?\d{7}$/.test(String(f.get("phone") ?? "").trim())) next.phone = "Enter a Pakistani mobile number, like 0322 9115222.";
    if (method === "delivery" && String(f.get("address") ?? "").trim().length < 6) next.address = "Enter your DHA delivery address.";
    setErrors(next);
    if (Object.keys(next).length) return;
    setPlaced({ ref: `DS-${Math.floor(100000 + Math.random() * 900000)}`, total: subtotal });
    clear();
  }

  if (placed) {
    return (
      <section className="flex min-h-[90svh] items-center pb-24 pt-36">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: EASE }} className="container-x max-w-3xl">
          <p className="font-display text-[clamp(72px,12vw,160px)] text-sage">Order placed.</p>
          <p className="mt-4 text-xl">
            Reference <span className="font-semibold">{placed.ref}</span>, total {formatPKR(placed.total)}.
          </p>
          <p className="mt-2 max-w-[48ch] text-pine/65">This is a frontend demo, so no order was sent. When the backend is connected, you&apos;ll get a confirmation here and on WhatsApp.</p>
          <Link href="/menu" className="mt-10 inline-flex h-12 items-center rounded-full bg-btn px-6 font-semibold text-pine hover:bg-btn-hover">
            Back to the menu
          </Link>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="pb-24 pt-36 md:pt-44">
      <div className="container-x">
        <h1 className="font-display text-[clamp(72px,11vw,150px)]">Checkout</h1>
        {lines.length === 0 ? (
          <div className="mt-8">
            <p className="text-lg text-pine/70">Your cart is empty. Add something from the menu to check out.</p>
            <Link href="/menu" className="mt-6 inline-flex h-12 items-center rounded-full bg-btn px-6 font-semibold text-pine hover:bg-btn-hover">
              Browse the menu
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <form onSubmit={onSubmit} noValidate className="space-y-8" id="checkout-form">
              <fieldset>
                <legend className="font-display text-[40px]">How do you want it?</legend>
                <div role="radiogroup" className="mt-4 grid grid-cols-2 gap-3">
                  {(["delivery", "pickup"] as const).map((m) => {
                    const disabled = m === "delivery" && pickupOnly;
                    const on = method === m && !disabled;
                    return (
                      <button
                        key={m}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        disabled={disabled}
                        onClick={() => setMethod(m)}
                        className={`rounded-2xl border-2 p-5 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-45 ${
                          on ? "border-sage bg-mint-soft text-pine" : "border-pine/12 bg-milk hover:border-pine/40"
                        }`}
                      >
                        <span className="block text-lg font-semibold">{m === "delivery" ? "Delivery" : "Self pickup"}</span>
                        <span className={`text-sm ${on ? "text-pine/70" : "text-pine/60"}`}>
                          {m === "delivery" ? "All of DHA Lahore" : "From any branch"}
                        </span>
                      </button>
                    );
                  })}
                </div>
                {pickupOnly && (
                  <p className="mt-3 text-sm font-medium text-caramel-deep">Cold Brew is pickup only, so this order is set to self pickup.</p>
                )}
              </fieldset>

              <fieldset className="space-y-5">
                <legend className="font-display text-[40px]">Your details</legend>
                <Field label="Full name" name="name" autoComplete="name" defaultValue={user?.name} error={errors.name} />
                <Field label="Mobile number" name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="03xx xxxxxxx" error={errors.phone} />
                <AnimatePresence initial={false}>
                  {method === "delivery" && !pickupOnly && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                      <Field label="Delivery address in DHA" name="address" autoComplete="street-address" error={errors.address} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </fieldset>

              <fieldset>
                <legend className="font-display text-[40px]">Payment</legend>
                <p className="mt-3 rounded-2xl bg-milk p-5 text-pine/75">Cash on {method === "delivery" && !pickupOnly ? "delivery" : "pickup"}. Online payment arrives with the backend.</p>
              </fieldset>
            </form>

            <aside className="h-fit rounded-[32px] bg-milk p-7 lg:sticky lg:top-32" aria-label="Order summary">
              <h2 className="font-display text-[44px]">Your order</h2>
              <ul className="mt-5 space-y-4">
                {lines.map((l) => (
                  <li key={l.slug} className="flex items-center gap-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-mint-soft">
                      <Image src={l.product.image} alt="" fill sizes="64px" className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{l.product.name}</p>
                      <div className="mt-1">
                        <QtyStepper slug={l.slug} qty={l.qty} size="sm" />
                      </div>
                    </div>
                    <span className="font-semibold tabular-nums">{formatPKR(l.qty * l.product.price)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-baseline justify-between border-t border-pine/10 pt-5">
                <span className="font-semibold">Total</span>
                <span className="font-display text-[44px] tabular-nums">{formatPKR(subtotal)}</span>
              </div>
              <p className="text-sm text-pine/55">Any delivery fee is confirmed when we call to verify your order.</p>
              <button type="submit" form="checkout-form" className="mt-6 h-14 w-full rounded-full bg-btn font-semibold text-pine hover:bg-btn-hover">
                Place order
              </button>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}
