"use client";

import Image from "next/image";
import Link from "next/link";
import { HiMinus, HiPlus } from "react-icons/hi";
import { motion } from "framer-motion";
import { CartItem as CartItemType } from "@/types";
import { useCartStore, MAX_QTY } from "@/store/cartStore";
import { rupees } from "@/lib/cart";

export default function CartItem({ item }: { item: CartItemType }) {
  const { removeItem, updateQuantity, closeCart } = useCartStore();
  const { product, quantity, selectedSize } = item;
  const linePrice = (product.price + selectedSize.priceModifier) * quantity;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex gap-4 border-b border-black/10 py-5"
    >
      <Link
        href={`/product/${product._id}`}
        onClick={closeCart}
        className="relative h-28 w-20 shrink-0 bg-paper-2 p-1.5"
      >
        <span className="relative block h-full w-full overflow-hidden shadow-[0_6px_14px_-6px_rgba(0,0,0,0.4)]">
          <Image src={product.image} alt={product.name} fill className="object-cover" sizes="80px" />
        </span>
      </Link>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h4 className="truncate text-sm font-medium text-ink-text">{product.name}</h4>
            <p className="mt-1 text-xs text-ink-text/70">
              {selectedSize.label} · {selectedSize.dimensions}
            </p>
          </div>
          <span className="shrink-0 text-sm font-semibold text-ink-text">{rupees(linePrice)}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center border border-black/15">
            <button
              onClick={() => updateQuantity(product._id, selectedSize.label, quantity - 1)}
              className="grid h-8 w-8 place-items-center transition-colors hover:bg-paper-2"
              aria-label={`Decrease quantity of ${product.name}`}
            >
              <HiMinus size={11} />
            </button>
            <span className="w-7 text-center text-xs font-semibold tabular-nums">{quantity}</span>
            <button
              onClick={() => updateQuantity(product._id, selectedSize.label, quantity + 1)}
              disabled={quantity >= MAX_QTY}
              className="grid h-8 w-8 place-items-center transition-colors hover:bg-paper-2"
              aria-label={`Increase quantity of ${product.name}`}
            >
              <HiPlus size={11} />
            </button>
          </div>
          <button
            onClick={() => removeItem(product._id, selectedSize.label)}
            className="border-b border-transparent text-xs text-ink-text/70 transition-colors hover:border-accent hover:text-accent"
            aria-label={`Remove ${product.name}`}
          >
            Remove
          </button>
        </div>
      </div>
    </motion.div>
  );
}
