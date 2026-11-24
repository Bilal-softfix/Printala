"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { HiArrowUpRight } from "react-icons/hi2";
import { CATEGORIES } from "@/lib/categories";
import { VIEWPORT, lineReveal } from "@/lib/motion";

/* Section I — the closing statement. Prints rise into view as you arrive. */
const FAN = ["gaming", "bollywood", "anime", "cars", "anime-girls"]
  .map((s) => CATEGORIES.find((c) => c.slug === s))
  .filter(Boolean) as typeof CATEGORIES;
const ROT = [-9, -4, 0, 4, 9];

export default function ClosingStatement() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });

  return (
    <section
      ref={ref}
      aria-labelledby="closing-heading"
      data-nav-theme="dark"
      className="relative overflow-hidden bg-ink pt-24 text-cream md:pt-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-1/2 h-[60%] w-[110%] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(225,15,128,0.16),transparent)]"
      />

      <div className="container-main relative text-center">
        <motion.h2
          id="closing-heading"
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="font-display text-[clamp(2.75rem,10vw,9.5rem)] font-bold uppercase leading-[0.88] tracking-[-0.05em]"
        >
          {["Your wall", "is waiting."].map((l, i) => (
            <span key={l} className="block overflow-hidden pb-[0.05em]">
              <motion.span variants={lineReveal} custom={i} className="block">
                {i === 1 ? (
                  <>
                    <span className="text-outline">is</span> waiting
                    <span className="text-accent">.</span>
                  </>
                ) : (
                  l
                )}
              </motion.span>
            </span>
          ))}
        </motion.h2>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          <Link
            href="/shop"
            className="group inline-flex items-center gap-3 rounded-full bg-cream py-2 pl-7 pr-2 text-sm font-medium text-ink-text transition-colors duration-500 hover:bg-accent hover:text-white"
          >
            Shop all posters
            <span className="grid h-9 w-9 place-items-center rounded-full bg-ink-text text-cream">
              <HiArrowUpRight
                aria-hidden="true"
                size={14}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </span>
          </Link>
          <Link
            href="/shop?category=split-poster"
            className="border-b border-white/25 pb-1 text-sm text-cream/80 transition-colors hover:border-accent hover:text-cream"
          >
            Explore split posters
          </Link>
        </div>
      </div>

      {/* Fan of prints rising from below */}
      <div className="relative mx-auto mt-16 flex h-[clamp(14rem,34vw,26rem)] max-w-5xl items-end justify-center md:mt-20">
        {FAN.map((c, i) => (
          <FanPrint key={c.slug} src={c.image} href={`/shop?category=${c.slug}`} name={c.name} i={i} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  );
}

function FanPrint({
  src,
  href,
  name,
  i,
  progress,
}: {
  src: string;
  href: string;
  name: string;
  i: number;
  progress: MotionValue<number>;
}) {
  const centre = Math.abs(i - 2);
  const y = useTransform(progress, [0.2, 1], [`${60 + centre * 15}%`, `${18 + centre * 12}%`]);
  return (
    <motion.div
      style={{ y, rotate: ROT[i], zIndex: 5 - centre }}
      className={`relative -mx-3 w-[26%] shrink-0 sm:-mx-4 md:w-[19%] ${centre === 2 ? "hidden sm:block" : ""}`}
    >
      <Link
        href={href}
        aria-label={`Shop ${name} posters`}
        className="block bg-paper p-[4%] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-4"
      >
        <span className="relative block aspect-[3/4] overflow-hidden">
          <Image src={src} alt="" fill sizes="(min-width: 768px) 20vw, 30vw" className="object-cover" />
        </span>
      </Link>
    </motion.div>
  );
}
