"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { HiOutlineShoppingBag, HiOutlineArrowRight } from "react-icons/hi";
import { Product } from "@/types";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
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
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <Link
        href={`/product/${product._id}`}
        className="product-card block group"
        aria-label={`View ${product.name} — ${formatPrice(product.price)}`}
      >
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-t-[calc(1.25rem-1px)]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="card-image object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
          />

          <div className="card-overlay" />

          {/* Badges */}
          <div className="card-badge">
            {product.bestseller && (
              <span className="badge-bestseller">Bestseller</span>
            )}
            {product.isNew && <span className="badge-new">New</span>}
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
            className="card-quick-add w-10 h-10 bg-white text-primary rounded-xl
                       flex items-center justify-center shadow-lg
                       hover:bg-primary hover:text-white transition-colors"
            aria-label={`Quick add ${product.name}`}
          >
            <HiOutlineShoppingBag size={16} />
          </button>

          {/* Hover Actions */}
          <div className="card-actions">
            <div className="flex items-center justify-between text-white">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-widest text-white/70 font-semibold">
                  {product.category === "split-poster"
                    ? `${product.panels}-Panel Split`
                    : product.category}
                </p>
                <h3 className="text-sm font-bold mt-0.5 truncate">
                  {product.name}
                </h3>
              </div>
              <div
                className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0
                              group-hover:bg-white group-hover:text-primary transition-all"
              >
                <HiOutlineArrowRight size={14} color="black" />
              </div>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-3.5">
          <h3 className="font-semibold text-sm text-text truncate group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            {product.type === "split-poster"
              ? `${product.panels} panels · ${product.sizes.length} sizes`
              : `${product.sizes.length} sizes available`}
          </p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="font-bold text-base text-primary">
              {formatPrice(product.price)}
            </span>
            {product.comparePrice && (
              <span className="text-xs text-text-muted line-through">
                {formatPrice(product.comparePrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
