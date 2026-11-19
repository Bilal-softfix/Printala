"use client";

import { ReactNode, useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

/**
 * Wraps content in a mouse-driven 3D tilt with a moving glare,
 * like holding a glossy poster up to the light. Mouse only; touch is untouched.
 */
export default function TiltCard({
  children,
  className = "",
  max = 10,
  glare = true,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
  glare?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const cfg = { stiffness: 220, damping: 20 };
  const rotateY = useSpring(useTransform(x, [0, 1], [-max, max]), cfg);
  const rotateX = useSpring(useTransform(y, [0, 1], [max, -max]), cfg);
  const gx = useTransform(x, (v) => `${v * 100}%`);
  const gy = useTransform(y, (v) => `${v * 100}%`);
  const glow = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.35), transparent 50%)`;
  const glareOpacity = useSpring(0, cfg);

  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const b = ref.current.getBoundingClientRect();
    x.set((e.clientX - b.left) / b.width);
    y.set((e.clientY - b.top) / b.height);
    glareOpacity.set(1);
  };
  const onLeave = () => {
    x.set(0.5);
    y.set(0.5);
    glareOpacity.set(0);
  };

  return (
    <div style={{ perspective: 900 }} className={className}>
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative h-full"
      >
        {children}
        {glare && (
          <motion.div
            aria-hidden="true"
            style={{ background: glow, opacity: glareOpacity }}
            className="absolute inset-0 rounded-[inherit] pointer-events-none z-20 mix-blend-soft-light"
          />
        )}
      </motion.div>
    </div>
  );
}
