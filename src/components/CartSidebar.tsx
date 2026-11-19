"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { HiXMark, HiArrowRight } from "react-icons/hi2";
import { useCartStore } from "@/store/cartStore";
import { cartTotals, rupees, FREE_SHIPPING_MIN } from "@/lib/cart";
import { EASE } from "@/lib/motion";
import CartItem from "./CartItem";

export default function CartSidebar() {
  const { items, isOpen, closeCart, totalPrice, totalItems } = useCartStore();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCart();
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, closeCart]);

  const { subtotal, shipping, total } = cartTotals(totalPrice());
  const progress = Math.min(1, subtotal / FREE_SHIPPING_MIN);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[60] bg-ink/60 backdrop-blur-sm"
          />

          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.6, ease: EASE }}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping bag"
            className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-md flex-col bg-paper text-ink-text"
          >
            <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">
              <h2 className="font-display text-xl font-bold uppercase tracking-[-0.03em]">
                Your bag
                <span className="ml-2 align-middle font-sans text-xs font-normal normal-case tracking-normal text-ink-text/55">
                  {totalItems()} {totalItems() === 1 ? "item" : "items"}
                </span>
              </h2>
              <button
                onClick={closeCart}
                aria-label="Close bag"
                className="grid h-10 w-10 place-items-center rounded-full border border-black/15 transition-colors hover:border-ink-text hover:bg-ink-text hover:text-cream"
              >
                <HiXMark size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-start justify-center py-20">
                  <p className="text-[10.5px] uppercase tracking-[0.3em] text-ink-text/55">Empty bag</p>
                  <p className="mt-4 font-display text-4xl font-bold uppercase leading-[0.95] tracking-[-0.04em]">
                    Your wall
                    <br />
                    is waiting<span className="text-accent">.</span>
                  </p>
                  <Link href="/shop" onClick={closeCart} className="btn-ink mt-8">
                    Browse posters <HiArrowRight size={14} aria-hidden="true" />
                  </Link>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <CartItem key={`${item.product._id}-${item.selectedSize.label}`} item={item} />
                  ))}
                </AnimatePresence>
              )}
            </div>

            {items.length > 0 && (
              <div className="space-y-4 border-t border-black/10 px-6 py-6">
                {/* Free-shipping progress */}
                <div>
                  <p className="text-xs text-ink-text/65">
                    {shipping === 0
                      ? "You've unlocked free shipping."
                      : `Add ${rupees(FREE_SHIPPING_MIN - subtotal)} more for free shipping.`}
                  </p>
                  <span className="mt-2 block h-px w-full bg-black/10">
                    <motion.span
                      initial={false}
                      animate={{ scaleX: progress }}
                      transition={{ duration: 0.6, ease: EASE }}
                      className="block h-full origin-left bg-accent"
                    />
                  </span>
                </div>

                <dl className="space-y-1.5 text-sm">
                  <div className="flex justify-between text-ink-text/65">
                    <dt>Subtotal</dt>
                    <dd>{rupees(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between text-ink-text/65">
                    <dt>Shipping</dt>
                    <dd>{shipping === 0 ? "Free" : rupees(shipping)}</dd>
                  </div>
                  <div className="flex justify-between pt-2 font-display text-xl font-bold tracking-[-0.02em]">
                    <dt>Total</dt>
                    <dd>{rupees(total)}</dd>
                  </div>
                </dl>

                <Link href="/checkout" onClick={closeCart} className="btn-ink w-full">
                  Checkout — {rupees(total)}
                </Link>
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="block text-center text-xs uppercase tracking-[0.22em] text-ink-text/55 transition-colors hover:text-ink-text"
                >
                  View full bag
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
