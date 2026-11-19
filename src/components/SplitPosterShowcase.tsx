"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { HiArrowUpRight } from "react-icons/hi2";
import SectionHeading from "./ui/SectionHeading";
import SplitAssembly from "./SplitAssembly";
import { fetchProducts } from "@/lib/api";
import { PRODUCTS as FALLBACK } from "@/lib/data";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { EASE, VIEWPORT, fadeUp } from "@/lib/motion";

const fallback = () => FALLBACK.filter((p) => p.type === "split-poster").slice(0, 3);

export default function SplitPosterShowcase() {
  const [sets, setSets] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await fetchProducts({ type: "split-poster", limit: "3" });
        setSets(result.data && result.data.length > 0 ? result.data : fallback());
      } catch (err) {
        console.log("SplitPosterShowcase: Using fallback", err);
        setSets(fallback());
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading || sets.length === 0) return null;
  const set = sets[Math.min(active, sets.length - 1)];

  return (
    <section
      aria-labelledby="split-heading"
      data-nav-theme="dark"
      className="relative overflow-hidden bg-ink py-24 text-cream md:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[90%] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,rgba(225,15,128,0.1),transparent)]"
      />

      <div className="container-main relative">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            id="split-heading"
            tone="dark"
            index="03"
            eyebrow="Split posters"
            lines={["One artwork.", "Many panels."]}
          />
          <motion.p
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            variants={fadeUp}
            custom={2}
            className="max-w-sm text-[15px] leading-relaxed text-mute lg:pb-3"
          >
            Multi-panel sets printed to line up edge to edge. Hang them with a
            small gap and the picture reads as one — a statement no single
            frame can make.
          </motion.p>
        </div>

        {/* The assembling set */}
        <div className="mx-auto mt-16 max-w-6xl md:mt-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={set._id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.5, ease: EASE }}
            >
              <SplitAssembly src={set.image} alt={set.name} panels={set.panels} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Set picker + real configuration data */}
        <div className="mt-16 grid gap-10 border-t border-white/10 pt-10 md:mt-20 lg:grid-cols-[1fr_1.2fr_auto] lg:items-start lg:gap-14">
          <div role="tablist" aria-label="Split poster sets" className="flex flex-col">
            {sets.map((p, i) => (
              <button
                key={p._id}
                role="tab"
                aria-selected={i === active}
                onClick={() => setActive(i)}
                className={`group flex items-baseline gap-4 border-b border-white/10 py-3.5 text-left transition-colors ${
                  i === active ? "text-cream" : "text-cream/45 hover:text-cream/80"
                }`}
              >
                <span className={`text-[10.5px] tracking-[0.2em] ${i === active ? "text-accent" : ""}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-base font-medium">{p.name}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.dl
              key={set._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="grid grid-cols-2 gap-x-8 gap-y-6 text-sm"
            >
              <div>
                <dt className="text-[10.5px] uppercase tracking-[0.26em] text-mute">Configuration</dt>
                <dd className="mt-2 font-display text-2xl font-bold">{set.panels || 3} panels</dd>
              </div>
              <div>
                <dt className="text-[10.5px] uppercase tracking-[0.26em] text-mute">From</dt>
                <dd className="mt-2 font-display text-2xl font-bold">
                  {formatPrice(set.price)}
                  {set.comparePrice && (
                    <span className="ml-2 text-sm font-normal text-mute line-through">
                      {formatPrice(set.comparePrice)}
                    </span>
                  )}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-[10.5px] uppercase tracking-[0.26em] text-mute">
                  Available sizes
                </dt>
                <dd className="mt-3 flex flex-wrap gap-2">
                  {set.sizes.map((s) => (
                    <span
                      key={s.label}
                      className="rounded-full border border-white/15 px-3.5 py-1.5 text-xs text-cream/85"
                    >
                      {s.label}
                      {s.dimensions && <span className="text-mute"> · {s.dimensions}</span>}
                    </span>
                  ))}
                </dd>
              </div>
            </motion.dl>
          </AnimatePresence>

          <div className="flex flex-col items-start gap-4">
            <Link
              href={`/product/${set._id}`}
              className="group inline-flex items-center gap-3 rounded-full bg-cream py-2 pl-6 pr-2 text-sm font-medium text-ink-text transition-colors duration-500 hover:bg-accent hover:text-white"
            >
              Shop this set
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
              All split posters
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
