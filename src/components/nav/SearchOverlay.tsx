"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { HiOutlineSearch } from "react-icons/hi";
import { HiXMark } from "react-icons/hi2";
import { CATEGORIES } from "@/lib/categories";

import { EASE } from "@/lib/motion";

/** Full-screen search. Submits to the existing /shop?search= flow. */
export default function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    router.push(`/shop?search=${encodeURIComponent(term)}`);
    onClose();
  };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Search posters"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[60] overflow-y-auto bg-ink/95 text-cream backdrop-blur-xl"
    >
      <div className="container-main flex min-h-full flex-col pt-6 pb-16">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            aria-label="Close search"
            className="grid h-11 w-11 place-items-center rounded-full border border-white/15 text-cream transition-colors hover:border-cream"
          >
            <HiXMark size={20} />
          </button>
        </div>

        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.6, ease: EASE }}
          className="mx-auto mt-[12vh] w-full max-w-4xl"
        >
          <label
            htmlFor="site-search"
            className="text-[10.5px] uppercase tracking-[0.3em] text-mute"
          >
            Search the collection
          </label>
          <div className="mt-5 flex items-center gap-4 border-b border-white/20 pb-4 focus-within:border-accent transition-colors">
            <HiOutlineSearch aria-hidden="true" size={26} className="shrink-0 text-mute" />
            <input
              id="site-search"
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              autoFocus
              placeholder="Anime, supercars, Dhoni…"
              className="w-full bg-transparent font-display text-3xl font-bold tracking-tight text-cream placeholder:text-white/25 focus:outline-none sm:text-5xl"
            />
          </div>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.6, ease: EASE }}
          className="mx-auto mt-12 w-full max-w-4xl"
        >
          <p className="text-[10.5px] uppercase tracking-[0.3em] text-mute">
            Browse collections
          </p>
          <ul className="mt-5 flex flex-wrap gap-2.5">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/shop?category=${c.slug}`}
                  onClick={onClose}
                  className="inline-flex rounded-full border border-white/15 px-4 py-2 text-sm text-cream/80 transition-colors hover:border-accent hover:text-cream"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </motion.div>
  );
}
