"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HiArrowRight, HiCheck } from "react-icons/hi2";
import toast from "react-hot-toast";
import { subscribeNewsletter } from "@/lib/api";

/** Newsletter sign-up (lives in the footer). Uses the existing subscribe API. */
export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await subscribeNewsletter(email);
      toast.success(result.message || "Welcome to the Printala family!");
      setEmail("");
      setDone(true);
      setTimeout(() => setDone(false), 2500);
    } catch (err) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Subscribe nahi ho paya, try again!";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 id="newsletter-heading" className="font-display text-3xl font-bold tracking-[-0.03em] md:text-4xl">
        New drops, first.
      </h2>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-mute">
        Early access to new designs and poster drops. No spam — unsubscribe anytime.
      </p>
      <form
        onSubmit={handleSubmit}
        aria-labelledby="newsletter-heading"
        className="mt-7 flex max-w-md items-center border-b border-white/25 pb-2 transition-colors focus-within:border-accent"
      >
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="w-full bg-transparent py-2 text-base text-cream placeholder:text-white/30 focus:outline-none"
        />
        <motion.button
          type="submit"
          disabled={loading}
          whileTap={{ scale: 0.92 }}
          aria-label="Subscribe"
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-cream text-ink-text transition-colors duration-300 hover:bg-accent hover:text-white disabled:opacity-50"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={done ? "done" : "go"}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.2 }}
              className="flex"
            >
              {done ? <HiCheck size={18} /> : <HiArrowRight size={16} />}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </form>
    </div>
  );
}
