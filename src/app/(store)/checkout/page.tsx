"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";
import { createOrder } from "@/lib/api";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    pincode: "",
  });

  const update = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const subtotal = totalPrice();
  const shipping = subtotal >= 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!items.length) return toast.error("Cart khali hai!");

    setLoading(true);
    try {
      const orderData = {
        items: items.map((item) => ({
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
        clearCart();
        toast.success(`Order placed! ${result.data.orderNumber} 🎉`);
        router.push("/");
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Order place nahi ho paya. Try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const fields: {
    name: string;
    label: string;
    type?: string;
    span?: number;
  }[] = [
    { name: "fullName", label: "Full Name", span: 2 },
    { name: "email", label: "Email", type: "email" },
    { name: "phone", label: "Phone", type: "tel" },
    { name: "address", label: "Address", span: 2 },
    { name: "city", label: "City" },
    { name: "state", label: "State / Province" },
    { name: "zipCode", label: "ZIP / Postal Code" },
    { name: "country", label: "Country" },
  ];

  return (
    <div className="pt-28 pb-20">
      <div className="container-main">
        <h1 className="font-display text-5xl md:text-6xl font-bold mb-12">
          Check<span className="text-gradient">out</span>
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-12"
        >
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-bg-secondary border border-white/5 rounded-2xl p-8"
          >
            <h2 className="font-display text-xl font-bold mb-8">
              Shipping Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {fields.map((f) => (
                <div
                  key={f.name}
                  className={f.span === 2 ? "md:col-span-2" : ""}
                >
                  <label
                    htmlFor={f.name}
                    className="block text-xs uppercase tracking-wider text-text-muted font-bold mb-2"
                  >
                    {f.label}
                  </label>
                  <input
                    id={f.name}
                    name={f.name}
                    type={f.type || "text"}
                    value={form[f.name as keyof typeof form]}
                    onChange={update}
                    required
                    className="input-dark"
                  />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-bg-secondary border border-white/5 rounded-2xl p-8 h-fit lg:sticky lg:top-28"
          >
            <h2 className="font-display text-xl font-bold mb-6">Your Order</h2>
            <div className="space-y-3 mb-6">
              {items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-text-secondary truncate mr-2">
                    {item.product.name} ({item.selectedSize.label}) ×
                    {item.quantity}
                  </span>
                  <span className="flex-shrink-0">
                    $
                    {(
                      (item.product.price + item.selectedSize.priceModifier) *
                      item.quantity
                    ).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/5 pt-4 space-y-2 text-sm mb-6">
              <div className="flex justify-between text-text-secondary">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-green-400">Free</span>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between font-display text-xl font-bold pt-3 border-t border-white/5">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || !items.length}
              className="btn-primary w-full disabled:opacity-50"
            >
              <span>
                {loading ? "Processing..." : `Pay $${total.toFixed(2)}`}
              </span>
            </button>
          </motion.div>
        </form>
      </div>
    </div>
  );
}
