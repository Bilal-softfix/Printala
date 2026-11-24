"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { useCartRefresh } from "@/store/useCartRefresh";
import toast from "react-hot-toast";
import { createOrder } from "@/lib/api";
import { getErrorMessage } from "@/lib/utils";
import { saveOrder } from "@/lib/orders";
import { cartTotals, rupees } from "@/lib/cart";
import { EASE } from "@/lib/motion";
import SectionHeading from "@/components/ui/SectionHeading";

const STATES = [
  "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar",
  "Chandigarh", "Chhattisgarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir", "Jharkhand", "Karnataka",
  "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

const EMPTY = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
};

const FIELDS: {
  name: keyof typeof EMPTY;
  label: string;
  type?: string;
  span?: 2;
  autoComplete?: string;
  inputMode?: "numeric" | "tel" | "email";
  pattern?: string;
  maxLength?: number;
  hint?: string;
}[] = [
  { name: "fullName", label: "Full name", span: 2, autoComplete: "name" },
  {
    name: "phone",
    label: "Mobile number",
    type: "tel",
    autoComplete: "tel-national",
    inputMode: "numeric",
    pattern: "[6-9][0-9]{9}",
    maxLength: 10,
    hint: "10-digit mobile number, used for delivery updates",
  },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "address", label: "Address (house no., street, area)", span: 2, autoComplete: "street-address" },
  { name: "city", label: "City", autoComplete: "address-level2" },
  { name: "state", label: "State", autoComplete: "address-level1" },
  {
    name: "pincode",
    label: "PIN code",
    autoComplete: "postal-code",
    inputMode: "numeric",
    pattern: "[1-9][0-9]{5}",
    maxLength: 6,
    hint: "6 digits",
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart, refreshItems } = useCartStore();
  useCartRefresh();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState(EMPTY);

  const update = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const { subtotal, shipping, total } = cartTotals(totalPrice());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!items.length) return toast.error("Your cart is empty.");

    setLoading(true);
    try {
      // Re-validate against the API right before ordering: drops deleted,
      // sold-out or invalid (fallback) products and refreshes prices.
      const removed = await refreshItems();
      if (removed.length) {
        toast.error(
          `Removed (no longer available): ${removed.join(", ")}. Please review your order.`,
          { duration: 7000 },
        );
        return;
      }
      const cart = useCartStore.getState();
      const fresh = cartTotals(cart.totalPrice());
      if (!cart.items.length) return toast.error("Your cart is empty.");

      const orderData = {
        items: cart.items.map((item) => ({
          product: item.product._id,
          size: item.selectedSize.label,
          quantity: item.quantity,
        })),
        shipping: {
          fullName: form.fullName,
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
        },
        paymentMethod: "cod",
      };

      const result = await createOrder(orderData);

      if (result.success) {
        const orderNumber: string = result.data.orderNumber;
        // Snapshot for the confirmation page in case the tracking API is slow.
        try {
          sessionStorage.setItem(
            `order:${orderNumber}`,
            JSON.stringify({
              orderNumber,
              items: cart.items.map((i) => ({
                name: i.product.name,
                size: i.selectedSize.label,
                quantity: i.quantity,
                price: i.product.price + i.selectedSize.priceModifier,
              })),
              shippingCost: fresh.shipping,
              total: fresh.total,
            }),
          );
        } catch {}
        saveOrder({ orderNumber, total: fresh.total, placedAt: new Date().toISOString() });
        router.push(`/order/${encodeURIComponent(orderNumber)}`);
        clearCart();
      }
    } catch (err) {
      const message = getErrorMessage(err, "Couldn't place your order. Please try again.");
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper pt-28 pb-24 text-ink-text md:pt-36">
      <div className="container-main">
        <SectionHeading as="h1" index="—" eyebrow="Secure checkout" lines={["Checkout."]} />

        <form onSubmit={handleSubmit} className="mt-14 grid gap-14 lg:grid-cols-[1fr_26rem] lg:gap-20">
          <motion.fieldset
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="border-t border-black/10 pt-10"
          >
            <legend className="sr-only">Shipping information</legend>
            <p className="font-display text-2xl font-bold tracking-[-0.03em]">Where should it go?</p>
            <div className="mt-8 grid gap-x-8 gap-y-7 md:grid-cols-2">
              {FIELDS.map((f) => (
                <div key={f.name} className={f.span === 2 ? "md:col-span-2" : ""}>
                  <label htmlFor={f.name} className="field-label">
                    {f.label}
                  </label>
                  {f.name === "state" ? (
                    <select
                      id={f.name}
                      name={f.name}
                      value={form.state}
                      onChange={update}
                      autoComplete={f.autoComplete}
                      required
                      className="field"
                    >
                      <option value="" disabled>
                        Select state
                      </option>
                      {STATES.map((st) => (
                        <option key={st}>{st}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={f.name}
                      name={f.name}
                      type={f.type || "text"}
                      value={form[f.name]}
                      onChange={update}
                      autoComplete={f.autoComplete}
                      inputMode={f.inputMode}
                      pattern={f.pattern}
                      maxLength={f.maxLength}
                      title={f.hint}
                      aria-describedby={f.hint ? `${f.name}-hint` : undefined}
                      required
                      className="field"
                    />
                  )}
                  {f.hint && (
                    <p id={`${f.name}-hint`} className="mt-1.5 text-xs text-ink-text/70">
                      {f.hint}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.fieldset>

          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
            aria-label="Your order"
            className="h-fit bg-paper-2 p-8 lg:sticky lg:top-28"
          >
            <h2 className="text-xs uppercase tracking-[0.3em] text-ink-text/70">Your order</h2>

            {items.length === 0 ? (
              <p className="mt-6 text-sm text-ink-text/65">
                Your bag is empty.{" "}
                <Link href="/shop" className="underline underline-offset-4 hover:text-accent">
                  Browse posters
                </Link>
              </p>
            ) : (
              <ul className="mt-6 space-y-4">
                {items.map((item) => (
                  <li key={`${item.product._id}-${item.selectedSize.label}`} className="flex items-center gap-3 text-sm">
                    <span className="relative h-14 w-10 shrink-0 overflow-hidden bg-paper">
                      <Image src={item.product.image} alt="" fill sizes="40px" className="object-cover" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate">{item.product.name}</span>
                      <span className="text-xs text-ink-text/70">
                        {item.selectedSize.label} × {item.quantity}
                      </span>
                    </span>
                    <span className="shrink-0">
                      {rupees((item.product.price + item.selectedSize.priceModifier) * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {items.length > 0 && (
            <dl className="mt-6 space-y-2 border-t border-black/10 pt-5 text-sm">
              <div className="flex justify-between text-ink-text/70">
                <dt>Subtotal</dt>
                <dd>{rupees(subtotal)}</dd>
              </div>
              <div className="flex justify-between text-ink-text/70">
                <dt>Shipping</dt>
                <dd>{shipping === 0 ? "Free" : rupees(shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-black/10 pt-4 font-display text-2xl font-bold tracking-[-0.03em]">
                <dt>Total</dt>
                <dd>{rupees(total)}</dd>
              </div>
            </dl>
            )}

            <button type="submit" disabled={loading || !items.length} className="btn-ink mt-8 w-full">
              {loading ? "Placing order…" : items.length ? `Place order — ${rupees(total)}` : "Place order"}
            </button>
            <p className="mt-4 text-center text-xs text-ink-text/70">
              Payment: Cash on Delivery
            </p>
          </motion.aside>
        </form>
      </div>
    </div>
  );
}
