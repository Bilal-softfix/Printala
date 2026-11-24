"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HiOutlineSearch } from "react-icons/hi";
import { CATEGORIES } from "@/lib/categories";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Full-screen mobile navigation, sits under the (always-dark) bar. */
export default function MobileMenu({
  links,
  onClose,
  onSearch,
}: {
  links: { href: string; label: string }[];
  onClose: () => void;
  onSearch: () => void;
}) {
  return (
    <motion.div
      id="mobile-menu"
      initial={{ clipPath: "inset(0 0 100% 0)" }}
      animate={{ clipPath: "inset(0 0 0% 0)" }}
      exit={{ clipPath: "inset(0 0 100% 0)" }}
      transition={{ duration: 0.6, ease: EASE }}
      className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-ink pt-24 pb-10 text-cream"
    >
      <nav aria-label="Mobile" className="container-main flex-1">
        <ul>
          {links.map((l, i) => (
            <li key={l.href} className="overflow-hidden border-b border-white/10">
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ delay: 0.15 + i * 0.06, duration: 0.6, ease: EASE }}
              >
                <Link
                  href={l.href}
                  onClick={onClose}
                  className="flex items-baseline justify-between py-4 font-display text-4xl font-extrabold uppercase tracking-tight transition-colors active:text-accent"
                >
                  {l.label}
                  <span className="text-xs font-normal text-mute">0{i + 1}</span>
                </Link>
              </motion.div>
            </li>
          ))}
        </ul>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-10"
        >
          <button
            onClick={onSearch}
            className="flex w-full items-center gap-3 rounded-full border border-white/15 px-5 py-3.5 text-left text-sm text-mute"
          >
            <HiOutlineSearch aria-hidden="true" size={18} />
            Search posters
          </button>

          <p className="mt-10 text-[10.5px] uppercase tracking-[0.3em] text-mute">
            Collections
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/shop?category=${c.slug}`}
                  onClick={onClose}
                  className="inline-flex rounded-full border border-white/15 px-3.5 py-2 text-sm text-cream/85"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>
      </nav>
    </motion.div>
  );
}
