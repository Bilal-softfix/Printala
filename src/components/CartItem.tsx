"use client";

import Image from "next/image";
import { HiMinus, HiPlus, HiOutlineTrash } from "react-icons/hi";
import { motion } from "framer-motion";
import { CartItem as CartItemType } from "@/types";
import { useCartStore } from "@/store/cartStore";

export default function CartItem({ item }: { item: CartItemType }) {
  const { removeItem, updateQuantity } = useCartStore();
  const { product, quantity, selectedSize } = item;
  const linePrice = (product.price + selectedSize.priceModifier) * quantity;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex gap-4 py-4 border-b-2 border-charcoal/10"
    >
      <div
        className="relative w-20 h-28 rounded-xl overflow-hidden bg-bg-tertiary shrink-0
                      border-2 border-charcoal shadow-[2px_2px_0_#2F3542]"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>

      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <h4 className="font-bold text-sm text-charcoal truncate">
            {product.name}
          </h4>
          <p className="text-xs text-text-muted mt-0.5">
            {selectedSize.label} — {selectedSize.dimensions}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-0 border-2 border-charcoal rounded-lg overflow-hidden">
            <button
              onClick={() =>
                updateQuantity(product._id, selectedSize.label, quantity - 1)
              }
              className="p-1.5 hover:bg-sky hover:text-white transition-colors"
              aria-label="Decrease"
            >
              <HiMinus size={12} />
            </button>
            <span className="w-8 text-center text-xs font-black border-x-2 border-charcoal py-1.5">
              {quantity}
            </span>
            <button
              onClick={() =>
                updateQuantity(product._id, selectedSize.label, quantity + 1)
              }
              className="p-1.5 hover:bg-sky hover:text-white transition-colors"
              aria-label="Increase"
            >
              <HiPlus size={12} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-comic text-base text-magenta">
              ₹{linePrice.toFixed(2)}
            </span>
            <button
              onClick={() => removeItem(product._id, selectedSize.label)}
              className="text-text-muted hover:text-red-500 transition-colors"
              aria-label={`Remove ₹{product.name}`}
            >
              <HiOutlineTrash size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
