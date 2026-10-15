"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Plus } from "lucide-react";
import { formatPKR, type Product } from "@/lib/data";
import { useStore } from "@/lib/store";
import { QtyStepper } from "./CartDrawer";

export function StockLabel({ inStock }: { inStock: boolean }) {
  return <span className={`text-[13px] font-medium ${inStock ? "text-sage-deep" : "text-pine/45"}`}>{inStock ? "In stock" : "Out of stock"}</span>;
}

export default function ProductCard({
  product,
  priority = false,
  variant = "photo",
  compact = false,
}: {
  product: Product;
  priority?: boolean;
  variant?: "photo" | "cutout";
  /** Image height follows the viewport so the whole card fits inside the pinned home rail. */
  compact?: boolean;
}) {
  const { lines, add } = useStore();
  const qty = lines.find((l) => l.slug === product.slug)?.qty ?? 0;
  const useCutout = variant === "cutout" && product.cutout;

  return (
    <article className="group flex h-full flex-col">
      <div className={`relative overflow-hidden rounded-[28px] ${compact ? "aspect-[4/5] md:aspect-auto md:h-[min(30vh,320px)]" : "aspect-[4/5]"} ${useCutout ? "bg-mint-wash" : "bg-mint-soft"}`}>
        {useCutout ? (
          <>
            <div
              className="absolute inset-x-[10%] bottom-[9%] h-[10%] rounded-[50%] bg-pine/10 blur-md transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-x-75"
              aria-hidden
            />
            <motion.div className="absolute inset-0 flex items-center justify-center p-[14%] pb-[16%]" whileHover={{ y: -10 }} transition={{ type: "spring", stiffness: 200, damping: 16 }}>
              <Image
                src={product.cutout!}
                alt={product.name}
                width={420}
                height={600}
                priority={priority}
                sizes="(max-width: 640px) 70vw, 320px"
                className="h-full w-auto object-contain drop-shadow-[0_24px_24px_rgba(35,42,40,0.22)]"
              />
            </motion.div>
          </>
        ) : (
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 30vw"
            className={`object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.06] ${product.inStock ? "" : "grayscale-[0.5]"}`}
          />
        )}
      </div>
      <div className="mt-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-display text-[30px] leading-[0.95]">{product.name}</h3>
          <p className={`mt-1.5 max-w-[36ch] text-[15px] leading-relaxed text-pine/65 ${variant === "cutout" ? "line-clamp-2" : ""}`}>{product.blurb}</p>
        </div>
        <div className="shrink-0 pt-1 text-right">
          <p className="font-semibold tabular-nums">{formatPKR(product.price)}</p>
          <StockLabel inStock={product.inStock} />
          {product.note && <p className="text-[13px] font-medium text-caramel-deep">{product.note}</p>}
        </div>
      </div>
      <div className="mt-auto pt-4">
        {!product.inStock ? (
          <button type="button" disabled className="btn cursor-not-allowed bg-pine/5 text-pine/45">
            Out of stock
          </button>
        ) : qty > 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-3">
            <QtyStepper slug={product.slug} qty={qty} />
            <span className="text-sm text-pine/60">In your cart</span>
          </motion.div>
        ) : (
          <button type="button" onClick={() => add(product.slug)} className="btn btn-primary h-11 pl-4 pr-5 text-[15px]">
            <Plus size={16} aria-hidden /> Add to cart
          </button>
        )}
      </div>
    </article>
  );
}
