"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { HiArrowUpRight } from "react-icons/hi2";
import SectionHeading from "./ui/SectionHeading";
import { Category } from "@/types";
import { VIEWPORT, clipReveal, fadeUp } from "@/lib/motion";

/* Uneven editorial wall. Desktop places each tile on a 3-column × 8-row grid
   (5fr / 4fr / 3fr); mobile falls back to a 2-column flow with its own
   proportions. Split posters get their own section further down. */
type Slot = {
  slug: string;
  col: number;
  row: string; // grid-row on desktop
  size: "lg" | "md" | "sm";
  mobile: string; // aspect + span on mobile
};

const SLOTS: Slot[] = [
  { slug: "anime", col: 1, row: "1 / span 5", size: "lg", mobile: "col-span-2 aspect-[4/3]" },
  { slug: "gaming", col: 2, row: "1 / span 3", size: "md", mobile: "aspect-[3/4]" },
  { slug: "cars", col: 3, row: "1 / span 4", size: "md", mobile: "aspect-[3/4]" },
  { slug: "cricket", col: 2, row: "4 / span 2", size: "sm", mobile: "aspect-[3/4]" },
  { slug: "bollywood", col: 2, row: "6 / span 3", size: "md", mobile: "aspect-[3/4]" },
  { slug: "anime-girls", col: 3, row: "5 / span 4", size: "md", mobile: "aspect-[3/4]" },
  { slug: "football", col: 1, row: "6 / span 3", size: "md", mobile: "col-span-2 aspect-[16/9]" },
];

const NAME_SIZE = {
  lg: "text-[clamp(2.25rem,5vw,4.5rem)]",
  md: "text-[clamp(1.5rem,2.6vw,2.5rem)]",
  sm: "text-[clamp(1.25rem,2vw,1.875rem)]",
};

export default function CategoryShowcase({ categories }: { categories: Category[] }) {

  const bySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));

  return (
    <section
      id="collections"
      aria-labelledby="category-heading"
      className="scroll-mt-20 bg-paper py-24 text-ink-text md:py-32"
    >
      <div className="container-main">
        <div className="mb-14 flex flex-col gap-8 md:mb-20 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="category-heading"
            index="01"
            eyebrow="Collections"
            lines={["Discover", "your universe."]}
          />
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            variants={fadeUp}
            custom={2}
            className="max-w-sm lg:pb-3"
          >
            <p className="text-[15px] leading-relaxed text-ink-text/65">
              From sage-mode shinobi to midnight-purple JDM legends — find the
              world that belongs on your wall.
            </p>
            <Link
              href="/shop"
              className="group mt-6 inline-flex items-center gap-2 text-sm font-medium"
            >
              <span className="border-b border-ink-text/30 pb-1 transition-colors group-hover:border-accent">
                Browse all posters
              </span>
              <HiArrowUpRight
                aria-hidden="true"
                size={14}
                className="text-accent transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </motion.div>
        </div>

        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="grid grid-cols-2 gap-3 md:gap-4 lg:h-[min(56rem,115vh)] lg:grid-cols-[5fr_4fr_3fr] lg:grid-rows-8"
        >
          {SLOTS.map((s, i) => {
            const cat = bySlug[s.slug];
            return cat ? <Tile key={s.slug} slot={s} cat={cat} index={i} /> : null;
          })}
        </motion.ul>
      </div>
    </section>
  );
}

function Tile({ slot, cat, index }: { slot: Slot; cat: Category; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const reduce = useReducedMotion();
  // Image drifts slightly inside its frame as the tile crosses the viewport.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <motion.li
      ref={ref}
      variants={clipReveal}
      custom={index}
      className={`relative overflow-hidden bg-ink-3 ${slot.mobile} lg:aspect-auto lg:[grid-column:var(--gc)] lg:[grid-row:var(--gr)]`}
      style={{ "--gc": slot.col, "--gr": slot.row } as React.CSSProperties}
    >
      <Link
        href={`/shop?category=${cat.slug}`}
        aria-label={`Shop ${cat.name} — ${cat.count} designs`}
        className="group absolute inset-0 block"
      >
        <motion.div style={reduce ? undefined : { y }} className="absolute -inset-y-[8%] inset-x-0">
          <Image
            src={cat.image}
            alt=""
            fill
            sizes={slot.size === "lg" ? "(min-width: 1024px) 40vw, 100vw" : "(min-width: 1024px) 30vw, 50vw"}
            className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
          />
        </motion.div>
        <span className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-ink/25" />

        <span className="absolute left-4 right-4 top-4 flex items-start justify-between text-[10px] font-medium uppercase tracking-[0.26em] text-cream/75 md:left-5 md:right-5 md:top-5">
          <span>{String(index + 1).padStart(2, "0")}</span>
          <span>{cat.count} {cat.count === 1 ? "design" : "designs"}</span>
        </span>

        <span className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3 md:inset-x-5 md:bottom-5">
          <span
            className={`font-display font-bold uppercase leading-[0.9] tracking-[-0.04em] text-cream transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1 ${NAME_SIZE[slot.size]}`}
          >
            {cat.name}
          </span>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-cream text-ink-text transition-all duration-500 group-hover:bg-accent group-hover:text-white lg:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:group-focus-visible:opacity-100">
            <HiArrowUpRight aria-hidden="true" size={16} />
          </span>
        </span>
      </Link>
    </motion.li>
  );
}
