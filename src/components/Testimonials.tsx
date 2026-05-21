"use client";

import { motion } from "framer-motion";
import { HiStar } from "react-icons/hi";
import AnimateIn from "./AnimateIn";
import { TESTIMONIALS } from "@/lib/data";

export default function Testimonials() {
  return (
    <section
      className="py-24 bg-bg-secondary"
      aria-labelledby="testimonials-heading"
    >
      <div className="container-main">
        <AnimateIn className="text-center mb-14">
          <div className="speech-bubble text-sm text-charcoal mb-6 inline-block">
            💬 Real Reviews
          </div>
          <h2
            id="testimonials-heading"
            className="font-display text-4xl md:text-6xl font-bold text-charcoal"
          >
            Loved by{" "}
            <span
              className="font-comic text-magenta"
              style={{ textShadow: "2px 2px 0 #2F3542", color: "white" }}
            >
              Thousands
            </span>
          </h2>
        </AnimateIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TESTIMONIALS.slice(0, 6).map((t, i) => (
            <motion.blockquote
              key={t.id}
              initial={{ opacity: 0, y: 20, rotate: i % 2 === 0 ? -1 : 1 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="comic-card p-6 group"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <HiStar key={j} className="text-yellow" size={18} />
                ))}
              </div>

              <p className="text-text-secondary text-sm leading-relaxed mb-5 font-medium">
                &ldquo;{t.text}&rdquo;
              </p>

              <footer className="flex items-center gap-3 pt-4 border-t-2 border-charcoal/10">
                <div
                  className="w-10 h-10 rounded-xl bg-magenta/10 border-2 border-charcoal
                                flex items-center justify-center text-xs font-black text-magenta
                                group-hover:bg-magenta group-hover:text-white transition-colors"
                >
                  {t.avatar}
                </div>
                <div>
                  <cite className="text-sm font-bold not-italic text-charcoal">
                    {t.name}
                  </cite>
                  <p className="text-xs text-text-muted">{t.location}</p>
                </div>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
