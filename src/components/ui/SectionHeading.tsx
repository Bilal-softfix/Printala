"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { VIEWPORT, fadeUp, lineReveal } from "@/lib/motion";

/** Editorial section heading: indexed eyebrow + masked line-by-line title. */
export default function SectionHeading({
  id,
  index,
  eyebrow,
  lines,
  tone = "light",
  size = "lg",
  as: Tag = "h2",
  className = "",
}: {
  id?: string;
  index: string;
  eyebrow: string;
  lines: ReactNode[];
  tone?: "light" | "dark";
  size?: "lg" | "sm";
  as?: "h1" | "h2";
  className?: string;
}) {
  const muted = tone === "dark" ? "text-mute" : "text-ink-text/70";
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      className={className}
    >
      <motion.p
        variants={fadeUp}
        className={`flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] ${muted}`}
      >
        {index !== "—" && <span className="text-accent">{index}</span>}
        <span className={`h-px w-8 ${index === "—" ? "bg-accent" : tone === "dark" ? "bg-white/20" : "bg-black/20"}`} />
        {eyebrow}
      </motion.p>
      <Tag
        id={id}
        className={`mt-5 font-display ${size === "sm" ? "text-[clamp(2.4rem,3.6vw,3.4rem)]" : "text-[clamp(2.4rem,7vw,5.5rem)]"} font-bold uppercase leading-[0.92] tracking-[-0.04em] ${
          tone === "dark" ? "text-cream" : "text-ink-text"
        }`}
      >
        {lines.map((line, i) => (
          <span key={i} className="block overflow-hidden pb-[0.04em]">
            <motion.span variants={lineReveal} custom={i} className="block">
              {line}
            </motion.span>
          </span>
        ))}
      </Tag>
    </motion.div>
  );
}
