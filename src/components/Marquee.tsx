"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from "framer-motion";

/* Typographic statement strip. Drifts slowly; scroll speed nudges it. */
const PHRASES = [
  { text: "Art that moves you", outline: false },
  { text: "Make space for what you love", outline: true },
  { text: "Printala", outline: false, accent: true },
];

export default function Marquee() {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 300 });
  const boost = useTransform(velocity, [-2000, 0, 2000], [-3, 0, 3], { clamp: true });
  const pos = useTransform(x, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    // Base drift ~1.2%/s, scroll adds speed but never reverses direction.
    x.set(x.get() - 1.2 * (delta / 1000) * (1 + Math.abs(boost.get())));
  });

  const row = (
    <div className="flex shrink-0 items-center">
      {PHRASES.map((p) => (
        <span key={p.text} className="flex items-center">
          <span
            className={`whitespace-nowrap px-8 font-display text-[clamp(2.5rem,7vw,6.5rem)] font-bold uppercase leading-none tracking-[-0.04em] ${
              p.outline ? "text-outline" : p.accent ? "text-accent" : "text-cream"
            }`}
          >
            {p.text}
          </span>
          <span className="h-3 w-3 shrink-0 rotate-45 bg-accent md:h-4 md:w-4" />
        </span>
      ))}
    </div>
  );

  return (
    <section
      aria-label="Art that moves you. Make space for what you love. Printala."
      data-nav-theme="dark"
      className="relative overflow-hidden border-y border-white/10 bg-ink-2 py-10 md:py-14"
    >
      <motion.div style={{ x: pos }} aria-hidden="true" className="flex w-max">
        {row}
        {row}
      </motion.div>
    </section>
  );
}
