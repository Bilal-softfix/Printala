"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import AnimateIn from "./AnimateIn";
import { subscribeNewsletter } from "@/lib/api";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await subscribeNewsletter(email);
      toast.success(result.message || "Welcome to the Printala family! 🎉");
      setEmail("");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Subscribe nahi ho paya, try again!";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="py-24 relative overflow-hidden halftone-magenta"
      style={{ background: "linear-gradient(135deg, #E10F80, #5FAAC6)" }}
      aria-labelledby="newsletter-heading"
    >
      {/* Decorative */}
      <div className="absolute top-10 right-10 w-40 h-40 bg-yellow/20 rounded-full blur-3xl pointer-events-none" />

      <div className="container-main relative z-10">
        <AnimateIn className="max-w-2xl mx-auto text-center">
          <div className="comic-burst w-20 h-20 text-charcoal mx-auto mb-6">
            NEW!
          </div>

          <h2
            id="newsletter-heading"
            className="font-display text-4xl md:text-5xl font-bold mb-4 text-white"
          >
            Don&apos;t Miss{" "}
            <span
              className="font-comic text-yellow"
              style={{ textShadow: "3px 3px 0 #2F3542" }}
            >
              New Drops!
            </span>
          </h2>
          <p className="text-white/80 mb-10 max-w-md mx-auto">
            Get early access to new designs, exclusive deals, and poster drops
            before anyone else. No spam, we promise.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 px-6 py-4 border-3 border-charcoal rounded-xl
                         font-bold focus:outline-none focus:shadow-[4px_4px_0_#2F3542]
                         transition-all"
            />
            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-yellow text-charcoal font-black uppercase tracking-wider
                         rounded-xl border-3 border-charcoal shadow-[4px_4px_0_#2F3542]
                         hover:translate-x-[-2px] hover:translate-y-[-2px]
                         hover:shadow-[6px_6px_0_#2F3542] transition-all
                         disabled:opacity-50"
            >
              {loading ? "..." : "Subscribe!"}
            </motion.button>
          </form>

          <p className="text-[11px] text-white/50 mt-4">
            No spam ever. Unsubscribe anytime.
          </p>
        </AnimateIn>
      </div>
    </section>
  );
}
