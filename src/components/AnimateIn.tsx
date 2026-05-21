"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
}

const directionOffset = {
  up: { y: 60 },
  down: { y: -60 },
  left: { x: 60 },
  right: { x: -60 },
  none: {},
};

export default function AnimateIn({
  children,
  className = "",
  delay = 0,
  direction = "up",
  duration = 0.7,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, ...directionOffset[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
