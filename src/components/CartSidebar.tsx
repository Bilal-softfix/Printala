"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { HiXMark } from "react-icons/hi2";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { useCartStore } from "@/store/cartStore";
import CartItem from "./CartItem";

export default function CartSidebar() {
  const { items, isOpen, closeCart, totalPrice, totalItems } = useCartStore();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const subtotal = totalPrice();
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[60] bg-charcoal/50 backdrop-blur-sm"
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-[70] w-full max-w-md
                       bg-bg-primary border-l-3 border-charcoal flex flex-col"
            role="dialog"
            aria-label="Shopping cart"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b-3 border-charcoal bg-white">
              <div className="flex items-center gap-3">
                <HiOutlineShoppingBag size={22} className="text-magenta" />
                <h2 className="font-display text-lg font-bold text-charcoal">
                  Cart
                  <span className="font-sans text-sm font-normal text-text-muted ml-2">
                    ({totalItems()} items)
                  </span>
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="w-10 h-10 rounded-xl bg-bg-tertiary border-2 border-charcoal
                           flex items-center justify-center
                           hover:bg-magenta hover:text-white hover:border-magenta transition-all"
                aria-label="Close cart"
              >
                <HiXMark size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-20">
                  <div
                    className="w-20 h-20 rounded-2xl bg-bg-tertiary border-3 border-charcoal
                                  shadow-[4px_4px_0_#2F3542]
                                  flex items-center justify-center mb-6"
                  >
                    <HiOutlineShoppingBag
                      size={32}
                      className="text-text-muted"
                    />
                  </div>
                  <p className="font-display text-xl font-bold text-charcoal mb-2">
                    Cart is empty
                  </p>
                  <p className="text-text-muted text-sm mb-6">
                    Time to find your next banger.
                  </p>
                  <button onClick={closeCart} className="btn-primary text-sm">
                    <span>Browse Posters</span>
                  </button>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <CartItem
                      key={`${item.product._id}-${item.selectedSize.label}`}
                      item={item}
                    />
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t-3 border-charcoal px-6 py-6 bg-white space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-text-secondary">
                    <span>Subtotal</span>
                    <span className="font-bold">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>Shipping</span>
                    <span className="font-bold">
                      {shipping === 0 ? (
                        <span className="text-green-600">Free!</span>
                      ) : (
                        `₹${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  {subtotal < 50 && (
                    <div className="text-xs font-medium px-3 py-2 bg-yellow/20 border-2 border-yellow rounded-lg text-charcoal">
                      Add{" "}
                      <span className="font-black text-magenta">
                        ₹{(50 - subtotal).toFixed(2)}
                      </span>{" "}
                      for free shipping 🚚
                    </div>
                  )}
                  <div className="flex justify-between text-xl font-display font-bold pt-3 border-t-2 border-charcoal/10 text-charcoal">
                    <span>Total</span>
                    <span className="text-magenta">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="btn-primary w-full text-center"
                >
                  <span>Checkout — ₹{total.toFixed(2)}</span>
                </Link>

                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="block text-center text-sm text-text-muted hover:text-magenta transition-colors font-bold"
                >
                  View full cart →
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
