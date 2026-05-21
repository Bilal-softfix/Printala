"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineArrowLeft, HiOutlineShoppingBag } from "react-icons/hi";
import { useCartStore } from "@/store/cartStore";
import CartItem from "@/components/CartItem";

export default function CartPage() {
  const { items, totalPrice, clearCart } = useCartStore();

  const subtotal = totalPrice();
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  return (
    <div className="pt-28 pb-20">
      <div className="container-main">
        <h1 className="font-display text-5xl md:text-6xl font-bold mb-12">
          Your <span className="text-text-muted">Cart</span>
        </h1>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <div className="w-24 h-24 rounded-full bg-bg-tertiary flex items-center justify-center mx-auto mb-8">
              <HiOutlineShoppingBag size={40} className="text-text-muted" />
            </div>
            <p className="font-display text-2xl font-bold mb-3">
              Nothing here yet
            </p>
            <p className="text-text-muted mb-8">
              Your future masterpieces await.
            </p>
            <Link href="/shop" className="btn-primary">
              <span>Explore Posters</span>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Items */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <CartItem
                    key={`${item.product._id}-${item.selectedSize.label}`}
                    item={item}
                  />
                ))}
              </AnimatePresence>

              <div className="flex justify-between items-center mt-8">
                <Link
                  href="/shop"
                  className="flex items-center gap-2 text-sm text-text-muted hover:text-accent transition-colors"
                >
                  <HiOutlineArrowLeft size={16} /> Continue shopping
                </Link>
                <button
                  onClick={clearCart}
                  className="text-sm text-accent/60 hover:text-accent transition-colors"
                >
                  Clear cart
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-bg-secondary border border-white/5 rounded-2xl p-8 h-fit lg:sticky lg:top-28">
              <h2 className="font-display text-xl font-bold mb-6">
                Order Summary
              </h2>
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between text-text-secondary">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-green-400">Free</span>
                    ) : (
                      `₹${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                {subtotal < 50 && (
                  <p className="text-xs text-text-muted">
                    Add{" "}
                    <span className="text-accent font-medium">
                      ₹{(50 - subtotal).toFixed(2)}
                    </span>{" "}
                    more for free shipping
                  </p>
                )}
                <div className="border-t border-white/5 pt-3">
                  <div className="flex justify-between font-display text-xl font-bold">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <Link href="/checkout" className="btn-primary w-full text-center">
                <span>Proceed to Checkout</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
