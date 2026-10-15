"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, CalendarHeart } from "lucide-react";
import { contact, rickshot } from "@/lib/data";
import { Field } from "./Field";
import PageHero from "./PageHero";
import { FacebookIcon, InstagramIcon, WhatsAppIcon } from "./Brand";

const EASE = [0.16, 1, 0.3, 1] as const;

const channels = [
  { label: "WhatsApp", value: contact.whatsappDisplay, href: `https://wa.me/${contact.whatsapp}`, icon: WhatsAppIcon, note: "Orders, delivery and quick questions" },
  { label: "Instagram", value: "@doubleshotlhr", href: contact.instagram, icon: InstagramIcon, note: "New drinks, openings and events" },
  { label: "Facebook", value: "doubleshotlhr", href: contact.facebook, icon: FacebookIcon, note: "Updates from every branch" },
  { label: "Events and workshops", value: "Booking form", href: rickshot.bookingForm, icon: CalendarHeart, note: "RickShot, workshops and private events" },
];

export default function ContactView() {
  const [sent, setSent] = useState(false);

  return (
    <PageHero title="Contact" lead="WhatsApp is the fastest way to reach us. For events and workshops, use the booking form.">
      <div className="container-x pb-20 pt-6 md:pb-28">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <ul className="grid content-start gap-3">
            {channels.map((c, i) => (
              <motion.li key={c.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 + i * 0.08, ease: EASE }}>
                <a
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-5 rounded-[28px] bg-white/80 p-5 shadow-[0_20px_50px_-36px_rgba(35,42,40,0.5)] backdrop-blur transition-colors hover:bg-mint-wash md:p-6"
                >
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-mint-soft text-sage-deep transition-colors group-hover:bg-sage group-hover:text-white">
                    <c.icon className="h-6 w-6" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm text-pine/55">{c.label}</span>
                    <span className="font-display block truncate text-[clamp(30px,3vw,42px)] leading-none">{c.value}</span>
                    <span className="mt-1 block text-[15px] text-pine/60">{c.note}</span>
                  </span>
                  <ArrowUpRight size={22} className="shrink-0 text-sage transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden />
                </a>
              </motion.li>
            ))}
          </ul>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.8, ease: EASE }} className="rounded-[32px] bg-mint-wash p-7 md:p-10">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex h-full flex-col justify-center py-16">
                  <p className="font-display text-[64px] leading-none text-sage-deep">Message sent.</p>
                  <p className="mt-4 max-w-[36ch] text-lg text-pine/70">Thanks for writing in. This is a design preview, so nothing was actually sent yet.</p>
                  <button type="button" onClick={() => setSent(false)} className="mt-8 w-fit font-semibold underline underline-offset-4">
                    Write another message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  exit={{ opacity: 0, y: -10 }}
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSent(true);
                  }}
                  className="space-y-5"
                >
                  <h2 className="font-display text-[48px] leading-none">Send a message</h2>
                  <Field label="Your name" name="name" autoComplete="name" required />
                  <Field label="Email" name="email" type="email" autoComplete="email" required />
                  <div>
                    <label htmlFor="topic" className="mb-2 block font-medium">
                      What is it about?
                    </label>
                    <select id="topic" name="topic" className="h-14 w-full rounded-2xl border border-pine/15 bg-white px-4 text-base outline-none focus:border-sage-deep">
                      <option>General question</option>
                      <option>RickShot event</option>
                      <option>Workshops</option>
                      <option>Feedback on a branch</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="message" className="mb-2 block font-medium">
                      Message
                    </label>
                    <textarea id="message" name="message" required rows={4} className="w-full rounded-2xl border border-pine/15 bg-white p-4 text-base outline-none focus:border-sage-deep" />
                  </div>
                  <button type="submit" className="btn btn-primary btn-lg w-full">
                    Send message
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </PageHero>
  );
}
