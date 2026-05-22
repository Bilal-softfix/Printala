"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { HiOutlineShoppingBag, HiOutlineArrowRight } from "react-icons/hi";
import { Product } from "@/types";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";

interface Props {
  product: Product;
  index?: number;
  priority?: boolean;
}

export default function ProductCard({
  product,
  index = 0,
  priority = false,
}: Props) {
  const addItem = useCartStore((s) => s.addItem);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, product.sizes[0]);
    toast.success(`"${product.name}" added! 🔥`);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.34, 1.56, 0.64, 1],
      }}
    >
      <Link
        href={`/product/${product._id}`}
        className="product-card block group"
        aria-label={`View ${product.name} — ₹${product.price}`}
      >
        {/* Image */}
        <div className="comic-card mb-4 overflow-hidden">
          <div className="relative aspect-[3/4] overflow-hidden rounded-t-[calc(1.25rem-3px)]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="card-image object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />

            <div className="card-overlay" />

            {/* Badges */}
            <div className="card-badge flex flex-wrap gap-1.5">
              {product.bestseller && (
                <span className="badge-bestseller">Bestseller</span>
              )}
              {product.isNew && <span className="badge-new">New!</span>}
              {product.comparePrice && (
                <span className="badge-sale">
                  {Math.round(
                    ((product.comparePrice - product.price) /
                      product.comparePrice) *
                      100,
                  )}
                  % OFF
                </span>
              )}
              {product.type === "split-poster" && (
                <span className="badge-split">{product.panels} Panel</span>
              )}
            </div>

            {/* Quick Add */}
            <button
              onClick={handleQuickAdd}
              className="card-quick-add w-10 h-10 bg-magenta text-white
                         border-2 border-charcoal shadow-[2px_2px_0_#2F3542]
                         rounded-xl flex items-center justify-center
                         hover:bg-magenta-light transition-colors duration-300"
              aria-label={`Quick add ${product.name}`}
            >
              <HiOutlineShoppingBag size={16} />
            </button>

            {/* Hover Actions */}
            <div className="card-actions">
              <div className="flex items-center justify-between text-white">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-yellow font-bold">
                    {product.category === "split-poster"
                      ? `${product.panels}-Panel Split`
                      : product.category}
                  </p>
                  <h3 className="text-sm font-bold mt-1 line-clamp-1">
                    {product.name}
                  </h3>
                </div>
                <div
                  className="w-8 h-8 rounded-lg border-2 border-white/40
                                flex items-center justify-center shrink-0
                                group-hover:bg-yellow group-hover:border-charcoal group-hover:text-charcoal
                                transition-all duration-300"
                >
                  <HiOutlineArrowRight size={12} />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Info — Inside card border */}
          <div className="p-3 border-t-3 border-charcoal bg-white rounded-b-[calc(1.25rem-3px)]">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3
                  className="font-bold text-sm text-charcoal line-clamp-1
                               group-hover:text-magenta transition-colors"
                >
                  {product.name}
                </h3>
                <p className="text-xs text-text-muted mt-0.5">
                  {product.type === "split-poster"
                    ? `${product.panels} panels • ${product.sizes.length} sizes`
                    : `${product.sizes.length} sizes`}
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="font-comic text-lg text-magenta">
                  ₹{product.price.toFixed(2)}
                </span>
                {product.comparePrice && (
                  <span className="block text-xs text-text-muted line-through">
                    ₹{product.comparePrice.toFixed(2)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
