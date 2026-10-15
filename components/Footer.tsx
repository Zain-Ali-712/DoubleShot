import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock, MapPin, Truck } from "lucide-react";
import { branches, contact } from "@/lib/data";
import { FacebookIcon, InstagramIcon, Ring, Spill, WhatsAppIcon, Wordmark } from "./Brand";

export default function Footer() {
  const socials = [
    { href: contact.instagram, label: "Instagram", icon: <InstagramIcon /> },
    { href: contact.facebook, label: "Facebook", icon: <FacebookIcon /> },
    { href: `https://wa.me/${contact.whatsapp}`, label: "WhatsApp", icon: <WhatsAppIcon /> },
  ];

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-mint-wash via-mint-soft to-[#cfe5db] pt-24 text-pine">
      <Spill className="pointer-events-none absolute -right-24 -top-28 h-[420px] w-[420px] opacity-70" color="var(--color-mint-2)" />
      <Spill className="pointer-events-none absolute -bottom-40 -left-32 h-[380px] w-[380px] opacity-60" color="#ffffff" drips={false} />
      <Image
        src="/img/hero-can.png"
        alt=""
        width={120}
        height={224}
        className="pointer-events-none absolute bottom-24 right-[6%] hidden h-36 w-auto rotate-12 drop-shadow-[0_20px_20px_rgba(35,42,40,0.22)] lg:block"
      />

      <div className="container-x relative">
        <div className="grid gap-14 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <p className="font-display text-[clamp(48px,6vw,80px)] text-sage-deep">Rise &amp; Shot.</p>
            <p className="mt-4 max-w-[36ch] text-pine/70">Specialty coffee from Lahore, calibrated to the decimal since May 2023.</p>
            <ul className="mt-6 space-y-2 text-[15px] text-pine/75">
              <li className="flex items-center gap-2.5">
                <Truck size={17} className="text-sage-deep" aria-hidden /> Delivery across DHA Lahore
              </li>
              <li className="flex items-center gap-2.5">
                <Clock size={17} className="text-sage-deep" aria-hidden /> Doors open as early as 5:45 am
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin size={17} className="text-sage-deep" aria-hidden /> {branches.length} branches in Lahore
              </li>
            </ul>
            <div className="mt-8 flex gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Double Shot on ${s.label}`}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-sage-deep shadow-sm transition-[transform,background-color,color] hover:-translate-y-0.5 hover:bg-sage hover:text-white"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-sage-deep">Explore</h2>
            <ul className="mt-4 space-y-2.5">
              {[
                ["/menu", "Menu"],
                ["/journey", "Our journey"],
                ["/rickshot", "RickShot events"],
                ["/locations", "Locations"],
                ["/contact", "Contact"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-pine/80 transition-colors hover:text-sage-deep">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-sage-deep">Branches</h2>
            <ul className="mt-4 space-y-2.5">
              {branches.map((b) => (
                <li key={b.name}>
                  <a href={b.map} target="_blank" rel="noopener noreferrer" className="text-pine/80 transition-colors hover:text-sage-deep">
                    {b.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-sage-deep">Order</h2>
            <p className="mt-4 text-pine/75">Message us on WhatsApp and we&apos;ll take it from there.</p>
            <a
              href={`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent("I'd like to place an order!")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn mt-5 bg-white text-pine shadow-sm hover:bg-sage hover:text-white"
            >
              <WhatsAppIcon className="h-[18px] w-[18px]" /> {contact.whatsappDisplay}
            </a>
            <Link href="/rickshot" className="mt-4 flex items-center gap-1.5 font-semibold text-sage-deep hover:text-pine">
              Book RickShot for an event <ArrowUpRight size={16} aria-hidden />
            </Link>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-start justify-between gap-8 border-t border-pine/10 pt-10 md:flex-row md:items-end">
          <Wordmark className="text-[clamp(56px,9vw,128px)] text-sage" label="Double Shot" />
          <div className="flex items-center gap-3 pb-2 text-sm text-pine/55">
            <Ring className="h-4 w-auto text-sage" strokeWidth={12} />
            <span>© {new Date().getFullYear()} Double Shot Coffee, Lahore. Design concept; cart and accounts are a demo.</span>
          </div>
        </div>
      </div>
      <div className="h-8" />
    </footer>
  );
}
