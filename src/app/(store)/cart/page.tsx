"use client";

import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi2";
import { useCartStore } from "@/store/cartStore";
import { useCartRefresh } from "@/store/useCartRefresh";
import CartItem from "@/components/CartItem";
import SectionHeading from "@/components/ui/SectionHeading";
import { cartTotals, rupees, FREE_SHIPPING_MIN } from "@/lib/cart";

export default function CartPage() {
  const { items, totalPrice, clearCart, totalItems } = useCartStore();
  useCartRefresh();
  const { subtotal, shipping, total } = cartTotals(totalPrice());

  return (
    <div className="min-h-screen bg-paper pt-28 pb-24 text-ink-text md:pt-36">
      <div className="container-main">
        <SectionHeading
          as="h1"
          index="—"
          eyebrow={`${totalItems()} ${totalItems() === 1 ? "item" : "items"}`}
          lines={["Your bag."]}
        />

        {items.length === 0 ? (
          <div className="mt-16 border-t border-black/10 pt-16">
            <p className="max-w-md text-[15px] leading-relaxed text-ink-text/65">
              Nothing here yet — your future wall is one click away.
            </p>
            <Link href="/shop" className="btn-ink mt-8">
              Explore posters <HiArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <div className="mt-14 grid gap-14 lg:grid-cols-[1fr_24rem] lg:gap-20">
            <div className="border-t border-black/10">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <CartItem key={`${item.product._id}-${item.selectedSize.label}`} item={item} />
                ))}
              </AnimatePresence>
              <div className="mt-8 flex items-center justify-between text-sm">
                <Link href="/shop" className="inline-flex items-center gap-2 text-ink-text/65 transition-colors hover:text-ink-text">
                  <HiArrowLeft size={14} aria-hidden="true" /> Continue shopping
                </Link>
                <button onClick={clearCart} className="text-ink-text/55 transition-colors hover:text-accent">
                  Clear bag
                </button>
              </div>
            </div>

            <aside className="h-fit bg-paper-2 p-8 lg:sticky lg:top-28" aria-label="Order summary">
              <h2 className="text-[10.5px] uppercase tracking-[0.3em] text-ink-text/55">Order summary</h2>
              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between text-ink-text/70">
                  <dt>Subtotal</dt>
                  <dd>{rupees(subtotal)}</dd>
                </div>
                <div className="flex justify-between text-ink-text/70">
                  <dt>Shipping</dt>
                  <dd>{shipping === 0 ? "Free" : rupees(shipping)}</dd>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-ink-text/55">
                    Add {rupees(FREE_SHIPPING_MIN - subtotal)} more for free shipping.
                  </p>
                )}
                <div className="flex justify-between border-t border-black/10 pt-4 font-display text-2xl font-bold tracking-[-0.03em]">
                  <dt>Total</dt>
                  <dd>{rupees(total)}</dd>
                </div>
              </dl>
              <Link href="/checkout" className="btn-ink mt-8 w-full">
                Proceed to checkout <HiArrowRight size={14} aria-hidden="true" />
              </Link>
              <p className="mt-4 text-center text-xs text-ink-text/55">Cash on Delivery available</p>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
