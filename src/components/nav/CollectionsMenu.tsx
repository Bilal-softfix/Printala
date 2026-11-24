"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { HiArrowUpRight } from "react-icons/hi2";
import { CATEGORIES } from "@/lib/categories";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Desktop mega-menu: every real category, shown with its cover art. */
export default function CollectionsMenu({
  id,
  onNavigate,
  onPointerEnter,
  onPointerLeave,
}: {
  id: string;
  onNavigate: () => void;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}) {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: EASE }}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      className="absolute inset-x-0 top-full border-t border-white/10 bg-ink-2/95 text-cream backdrop-blur-xl"
    >
      <div className="container-main grid grid-cols-[14rem_1fr] gap-12 py-10">
        <div className="flex flex-col justify-between">
          <div>
            <p className="text-[10.5px] uppercase tracking-[0.3em] text-mute">
              Collections
            </p>
            <p className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight">
              Find your universe.
            </p>
          </div>
          <div className="mt-8 flex flex-col gap-3 text-sm">
            {[
              { href: "/shop", label: "All posters" },
              { href: "/shop/split-poster", label: "Split posters" },
              { href: "/shop?sort=bestseller", label: "Trending now" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={onNavigate}
                className="group inline-flex items-center gap-2 text-cream/80 transition-colors hover:text-cream"
              >
                {l.label}
                <HiArrowUpRight
                  aria-hidden="true"
                  size={12}
                  className="text-accent transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            ))}
          </div>
        </div>

        <ul className="grid grid-cols-4 gap-x-5 gap-y-6">
          {CATEGORIES.map((c, i) => (
            <motion.li
              key={c.slug}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * i, duration: 0.4, ease: EASE }}
            >
              <Link
                href={`/shop/${c.slug}`}
                onClick={onNavigate}
                className="group flex items-center gap-4"
              >
                <span className="relative block h-20 w-14 shrink-0 overflow-hidden bg-ink-3">
                  <Image
                    src={c.image}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                  />
                </span>
                <span>
                  <span className="block text-sm font-medium text-cream transition-colors group-hover:text-accent">
                    {c.name}
                  </span>
                  <span className="mt-1 block text-xs text-mute">
                    {c.count} {c.count === 1 ? "design" : "designs"}
                  </span>
                </span>
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
