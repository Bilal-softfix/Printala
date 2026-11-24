"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { HiArrowLeft, HiArrowRight } from "react-icons/hi2";
import SectionHeading from "./ui/SectionHeading";
import { TESTIMONIALS } from "@/lib/data";
import { EASE } from "@/lib/motion";

const AUTO_MS = 7000;

/* Section H — one review at a time, set like a pull-quote. */
export default function Testimonials() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const n = TESTIMONIALS.length;

  useEffect(() => {
    if (paused || reduce || n < 2) return;
    const t = setTimeout(() => setI((v) => (v + 1) % n), AUTO_MS);
    return () => clearTimeout(t);
  }, [i, paused, reduce, n]);

  if (!n) return null;
  const t = TESTIMONIALS[i];
  const go = (d: number) => setI((v) => (v + d + n) % n);

  return (
    <section
      aria-labelledby="testimonials-heading"
      className="border-t border-black/10 bg-paper-2 py-24 text-ink-text md:py-32"
    >
      <div
        className="container-main grid gap-12 lg:grid-cols-[minmax(16rem,22rem)_1fr] lg:gap-20"
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <div className="flex flex-col justify-between gap-10">
          <SectionHeading
            id="testimonials-heading"
            index="05"
            eyebrow="From your walls"
            size="sm"
            lines={["Words", "from the wall."]}
          />
          <div className="flex items-center gap-5">
            <button
              onClick={() => go(-1)}
              aria-label="Previous review"
              className="grid h-12 w-12 place-items-center rounded-full border border-black/20 transition-colors hover:border-ink-text hover:bg-ink-text hover:text-cream"
            >
              <HiArrowLeft size={16} />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next review"
              className="grid h-12 w-12 place-items-center rounded-full border border-black/20 transition-colors hover:border-ink-text hover:bg-ink-text hover:text-cream"
            >
              <HiArrowRight size={16} />
            </button>
            <span className="text-sm tabular-nums text-ink-text/70" aria-live="polite">
              {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
            </span>
          </div>
        </div>

        <div className="relative min-h-[22rem] md:min-h-[20rem]">
          <AnimatePresence mode="wait">
            <motion.figure
              key={t.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <span aria-hidden="true" className="block font-display text-7xl font-bold leading-none text-accent">
                &ldquo;
              </span>
              <blockquote className="mt-2 font-display text-[clamp(1.5rem,3vw,2.6rem)] font-semibold leading-[1.15] tracking-[-0.025em]">
                {t.text}
              </blockquote>
              <figcaption className="mt-10 flex items-center gap-4 border-t border-black/15 pt-6">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-ink-text text-xs font-semibold text-cream">
                  {t.avatar}
                </span>
                <span>
                  <span className="block text-sm font-medium">{t.name}</span>
                  <span className="block text-xs text-ink-text/70">{t.location}</span>
                </span>
                <span className="ml-auto text-xs uppercase tracking-[0.22em] text-ink-text/70">
                  {t.rating}/5
                </span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>

          {/* Progress bar for the auto-advance */}
          {!reduce && n > 1 && (
            <span className="absolute -bottom-8 left-0 block h-px w-full bg-black/10">
              <motion.span
                key={`${i}-${paused}`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: paused ? 0 : 1 }}
                transition={{ duration: paused ? 0.2 : AUTO_MS / 1000, ease: "linear" }}
                className="block h-full origin-left bg-accent"
              />
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
