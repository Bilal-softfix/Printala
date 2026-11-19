"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Product } from "@/types";
import SplitPosterPreview from "@/components/SplitPosterPreview";
import { EASE } from "@/lib/motion";

/** Product imagery: the print hangs on a paper wall; hover to inspect up close. */
export default function ProductGallery({ product }: { product: Product }) {
  const images = Array.from(new Set([product.image, ...(product.images ?? [])])).filter(Boolean);
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const isSplit = product.type === "split-poster";
  const src = images[Math.min(active, images.length - 1)];

  // Zoom follows the cursor via CSS vars — no React re-render per move.
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const el = e.currentTarget;
    const b = el.getBoundingClientRect();
    el.style.setProperty("--zx", `${((e.clientX - b.left) / b.width) * 100}%`);
    el.style.setProperty("--zy", `${((e.clientY - b.top) / b.height) * 100}%`);
    el.dataset.zoom = "on";
  };
  const onLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    delete e.currentTarget.dataset.zoom;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: EASE }}
    >
      <div className={`relative bg-paper-2 ${isSplit ? "px-[6%] py-[14%]" : "aspect-[4/5] px-[14%] py-[10%]"}`}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={src}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="relative h-full w-full"
          >
            {isSplit ? (
              <SplitPosterPreview
                src={src}
                alt={product.name}
                panels={product.panels}
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
            ) : (
              <div
                onPointerMove={onMove}
                onPointerLeave={onLeave}
                className="group/zoom relative h-full w-full overflow-hidden shadow-[0_2px_4px_rgba(0,0,0,0.12),0_30px_60px_-18px_rgba(0,0,0,0.45)] data-[zoom=on]:cursor-zoom-in"
              >
                <Image
                  src={src}
                  alt={`${product.name} — ${product.category} poster by Printala`}
                  fill
                  priority={active === 0}
                  sizes="(max-width: 1024px) 80vw, 45vw"
                  className="object-cover origin-[var(--zx,50%)_var(--zy,50%)] transition-transform duration-300 ease-out group-data-[zoom=on]/zoom:scale-[1.9]"
                />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        {!isSplit && (
          <span className="pointer-events-none absolute bottom-4 right-4 hidden text-[10px] uppercase tracking-[0.26em] text-ink-text/45 [@media(hover:hover)]:block">
            Hover to inspect
          </span>
        )}
      </div>

      {images.length > 1 && (
        <div role="tablist" aria-label="Product images" className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img}
              role="tab"
              aria-selected={i === active}
              aria-label={`View image ${i + 1}`}
              onClick={() => setActive(i)}
              className={`relative h-24 w-20 shrink-0 overflow-hidden bg-paper-2 transition-opacity ${
                i === active ? "ring-1 ring-ink-text ring-offset-2 ring-offset-paper" : "opacity-55 hover:opacity-100"
              }`}
            >
              <Image src={img} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
