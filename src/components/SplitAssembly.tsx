"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";

const RATIO: Record<number, number> = { 2: 1.5, 3: 1.8, 4: 2, 5: 2.2 };
const GAP = 1.2; // % of set width between panels

/**
 * One image sliced across N panels. Panels start scattered and assemble into
 * the full composition as the set scrolls toward the centre of the viewport.
 */
export default function SplitAssembly({
  src,
  alt,
  panels,
}: {
  src: string;
  alt: string;
  panels?: number | null;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center 55%"],
  });
  const n = Math.min(Math.max(Math.round(panels || 3), 2), 8);
  const w = (100 - GAP * (n - 1)) / n;

  return (
    <div
      ref={ref}
      role="img"
      aria-label={`${alt} — ${n} panel split poster`}
      className="relative w-full"
      style={{ aspectRatio: String(RATIO[n] ?? n * 0.45) }}
    >
      {Array.from({ length: n }, (_, i) => (
        <Panel
          key={i}
          i={i}
          n={n}
          w={w}
          src={src}
          progress={scrollYProgress}
          still={!!reduce}
        />
      ))}
    </div>
  );
}

function Panel({
  i,
  n,
  w,
  src,
  progress,
  still,
}: {
  i: number;
  n: number;
  w: number;
  src: string;
  progress: MotionValue<number>;
  still: boolean;
}) {
  const left = i * (w + GAP);
  const off = i - (n - 1) / 2;
  const spread = useTransform(progress, [0, 1], [1, 0]);
  const x = useTransform(spread, (s) => `${s * off * 18}%`);
  const y = useTransform(spread, (s) => `${s * (i % 2 ? 14 : -10)}%`);
  const rotate = useTransform(spread, (s) => s * off * 4);
  const opacity = useTransform(progress, [0, 0.35], [0, 1]);

  return (
    <motion.div
      style={still ? { left: `${left}%`, width: `${w}%` } : { left: `${left}%`, width: `${w}%`, x, y, rotate, opacity }}
      className="absolute top-0 h-full overflow-hidden bg-ink-3 shadow-[0_2px_4px_rgba(0,0,0,0.4),0_30px_60px_-20px_rgba(0,0,0,0.8)]"
    >
      <div
        className="absolute top-0 h-full"
        style={{ width: `${(100 / w) * 100}%`, left: `${-(left / w) * 100}%` }}
      >
        <Image src={src} alt="" fill sizes="(max-width: 1024px) 100vw, 80vw" className="object-cover" />
      </div>
    </motion.div>
  );
}
