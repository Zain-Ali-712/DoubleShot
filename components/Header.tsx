"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, ShoppingBag, User, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { contact } from "@/lib/data";
import { FacebookIcon, InstagramIcon, Wordmark } from "./Brand";

const nav = [
  { href: "/menu", label: "Menu" },
  { href: "/journey", label: "Our journey" },
  { href: "/rickshot", label: "RickShot" },
  { href: "/locations", label: "Locations" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const { count, setCartOpen, user } = useStore();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 pt-3 sm:pt-4">
        <div className="container-x">
          <div
            className={`flex h-14 items-center justify-between gap-4 rounded-full border pl-5 pr-2 transition-[background-color,box-shadow,border-color] duration-500 sm:h-[60px] sm:pl-7 ${
              scrolled || open
                ? "border-pine/8 bg-white/85 shadow-[0_8px_30px_-14px_rgba(35,42,40,0.3)] backdrop-blur-xl"
                : "border-pine/5 bg-white/70 backdrop-blur-md"
            }`}
          >
            <Link href="/" aria-label="Double Shot, home" className="text-sage">
              <Wordmark className="text-[26px] sm:text-[30px]" label="" />
            </Link>

            <nav aria-label="Main" className="hidden lg:block">
              <ul className="flex items-center gap-1">
                {nav.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={`relative rounded-full px-4 py-2 text-[15px] font-medium transition-colors ${
                          active ? "bg-mint-soft text-pine" : "text-pine/75 hover:bg-mint-wash hover:text-pine"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex items-center gap-1.5">
              <div className="hidden items-center xl:flex">
                <a href={contact.instagram} target="_blank" rel="noopener noreferrer" aria-label="Double Shot on Instagram" className="flex h-10 w-10 items-center justify-center rounded-full text-pine/70 transition-colors hover:bg-mint-wash hover:text-sage-deep">
                  <InstagramIcon />
                </a>
                <a href={contact.facebook} target="_blank" rel="noopener noreferrer" aria-label="Double Shot on Facebook" className="flex h-10 w-10 items-center justify-center rounded-full text-pine/70 transition-colors hover:bg-mint-wash hover:text-sage-deep">
                  <FacebookIcon />
                </a>
                <span className="mx-1 h-5 w-px bg-pine/15" aria-hidden />
              </div>
              <Link
                href={user ? "/account" : "/login"}
                className="hidden h-11 items-center gap-2 rounded-full px-4 text-[15px] font-medium text-pine/80 transition-colors hover:bg-pine/5 hover:text-pine sm:flex"
              >
                <User size={18} strokeWidth={1.8} aria-hidden />
                {user ? user.name.split(" ")[0] : "Sign in"}
              </Link>
              <button
                type="button"
                onClick={() => setCartOpen(true)}
                className="relative flex h-11 items-center gap-2 rounded-full bg-btn pl-4 pr-5 text-[15px] font-semibold text-pine transition-[background-color,transform] hover:bg-btn-hover active:scale-95"
                aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
              >
                <ShoppingBag size={18} strokeWidth={1.8} aria-hidden />
                <span className="tabular-nums">{count}</span>
              </button>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex h-11 w-11 items-center justify-center rounded-full text-pine hover:bg-pine/5 lg:hidden"
                aria-expanded={open}
                aria-controls="mobile-nav"
                aria-label={open ? "Close menu" : "Open menu"}
              >
                {open ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 flex flex-col bg-mint-wash px-6 pb-10 pt-28 text-pine lg:hidden"
          >
            <nav aria-label="Mobile">
              <ul className="space-y-1">
                {[{ href: "/", label: "Home" }, ...nav].map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      href={item.href}
                      className={`font-display block py-1 text-[clamp(48px,14vw,72px)] ${
                        pathname === item.href ? "text-sage" : "text-pine"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <div className="mt-auto flex items-center justify-between border-t border-pine/10 pt-6">
              <Link href={user ? "/account" : "/login"} className="font-semibold text-pine">
                {user ? `Signed in as ${user.name.split(" ")[0]}` : "Sign in or create account"}
              </Link>
              <div className="flex gap-1">
                <a href={contact.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-sage-deep">
                  <InstagramIcon />
                </a>
                <a href={contact.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-sage-deep">
                  <FacebookIcon />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
