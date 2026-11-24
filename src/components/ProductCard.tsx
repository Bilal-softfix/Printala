"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { Product } from "@/types";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { EASE } from "@/lib/motion";
import toast from "react-hot-toast";
import { isOrderableId } from "@/lib/utils";
import TiltCard from "./TiltCard";
import SplitPosterPreview from "@/components/SplitPosterPreview";

interface Props {
  product: Product;
  index?: number;
  priority?: boolean;
}

/** Editorial product card: the print hangs on a paper wall, info sits below. */
export default function ProductCard({
  product,
  index = 0,
  priority = false,
}: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const isSplit = product?.type === "split-poster";
  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const handleQuickAdd = () => {
    if (!isOrderableId(product._id))
      return toast.error("This poster is unavailable right now. Please refresh and try again.");
    addItem(product, product.sizes[0]);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: EASE, delay: (index % 4) * 0.07 }}
      className={`group relative ${isSplit ? "col-span-2" : ""}`}
    >
      <TiltCard max={isSplit ? 3 : 5} glare={false}>
        <Link
          href={`/product/${product._id}`}
          className="block"
          aria-label={`View ${product.name} — ${formatPrice(product.price)}`}
        >
          {/* The wall */}
          <div
            className={`relative overflow-hidden bg-paper-2 ${isSplit ? "px-[6%] py-[9%]" : "aspect-[3/4] p-[9%]"}`}
          >
            {isSplit ? (
              <SplitPosterPreview
                src={product.image}
                alt={product.name}
                panels={product.panels}
                priority={priority}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="relative h-full w-full shadow-[0_2px_4px_rgba(0,0,0,0.12),0_18px_36px_-12px_rgba(0,0,0,0.35)] transition-[transform,box-shadow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1.5 group-hover:shadow-[0_2px_4px_rgba(0,0,0,0.12),0_30px_50px_-14px_rgba(0,0,0,0.45)]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
                  priority={priority}
                />
              </div>
            )}

            {/* Labels */}
            <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5 text-[9.5px] font-semibold uppercase tracking-[0.18em]">
              {discount > 0 && (
                <span className="bg-accent px-2 py-1 text-white">−{discount}%</span>
              )}
              {product.bestseller && (
                <span className="bg-ink-text px-2 py-1 text-cream">Bestseller</span>
              )}
              {product.isNew && (
                <span className="bg-cream px-2 py-1 text-ink-text">New</span>
              )}
              {isSplit && (
                <span className="bg-cream px-2 py-1 text-ink-text">
                  {product.panels || 3} panels
                </span>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex items-start justify-between gap-3 pt-4">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-medium text-ink-text">
                <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">
                  {product.name}
                </span>
              </h3>
              <p className="mt-1 text-xs capitalize text-ink-text/70">
                {isSplit
                  ? `${product.panels || 3}-panel split · ${product.sizes.length} sizes`
                  : `${product.category.replace("-", " ")} · ${product.sizes.length} sizes`}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <span className="block text-sm font-semibold text-ink-text">
                {formatPrice(product.price)}
              </span>
              {product.comparePrice && (
                <span className="block text-xs text-ink-text/70 line-through">
                  {formatPrice(product.comparePrice)}
                </span>
              )}
            </div>
          </div>
        </Link>
      </TiltCard>

      {/* Quick add — always visible on touch, reveals on hover with a mouse */}
      <button
        type="button"
        onClick={handleQuickAdd}
        aria-label={`Add ${product.name} to bag`}
        className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-ink-text text-cream shadow-lg transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-accent focus-visible:opacity-100 [@media(hover:hover)]:translate-y-1 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100"
      >
        <HiOutlineShoppingBag size={17} aria-hidden="true" />
      </button>
    </motion.article>
  );
}
