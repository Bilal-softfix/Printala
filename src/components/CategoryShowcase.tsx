"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import AnimateIn from "./AnimateIn";
import { fetchCategories } from "@/lib/api";
import { CATEGORIES as FALLBACK_CATEGORIES } from "@/lib/data";
import { Category } from "@/types";

export default function CategoryShowcase() {
  const [categories, setCategories] = useState<Category[]>(FALLBACK_CATEGORIES);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await fetchCategories();
        if (result.data && result.data.length > 0) {
          const merged = FALLBACK_CATEGORIES.map((fallbackCat) => {
            const apiCat = result.data.find(
              (c: { name: string; count: number }) =>
                c.name === fallbackCat.slug,
            );
            return {
              ...fallbackCat,
              count: apiCat ? apiCat.count : fallbackCat.count,
            };
          });
          setCategories(merged);
        }
      } catch (err) {
        console.log("CategoryShowcase: Using fallback", err);
      }
    };
    load();
  }, []);

  return (
    <section
      className="py-24 bg-bg-primary halftone"
      aria-labelledby="category-heading"
    >
      <div className="container-main">
        <AnimateIn className="text-center mb-14">
          <div className="speech-bubble text-sm text-charcoal mb-6 inline-block">
            🎯 Pick Your Obsession
          </div>
          <h2
            id="category-heading"
            className="font-display text-4xl md:text-6xl font-bold text-charcoal"
          >
            Shop by{" "}
            <span
              className="font-comic text-gradient"
              style={{ fontSize: "110%" }}
            >
              Category
            </span>
          </h2>
        </AnimateIn>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {categories.slice(0, 8).map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.4, type: "spring" }}
              className={i < 2 ? "md:col-span-2" : "col-span-1"}
            >
              <Link
                href={`/shop?category=${cat.slug}`}
                className="group block comic-card overflow-hidden"
                aria-label={`Shop ${cat.name} — ${cat.count} designs`}
              >
                <div
                  className={`relative w-full overflow-hidden rounded-t-[calc(1.25rem-3px)] ${i < 2 ? "aspect-[16/9]" : "aspect-square"}`}
                >
                  <Image
                    src={cat.image}
                    alt={`${cat.name} posters`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes={
                      i < 2
                        ? "(max-width: 768px) 100vw, 50vw"
                        : "(max-width: 768px) 50vw, 25vw"
                    }
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3
                      className="font-comic text-xl md:text-2xl text-white"
                      style={{ textShadow: "2px 2px 0 #2F3542" }}
                    >
                      {cat.name}
                    </h3>
                  </div>
                </div>
                <div
                  className="p-3 border-t-3 border-charcoal bg-white rounded-b-[calc(1.25rem-3px)]
                              flex items-center justify-between"
                >
                  <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                    {cat.count} designs
                  </span>
                  <span
                    className="text-magenta font-bold text-sm opacity-0 -translate-x-2
                                 group-hover:opacity-100 group-hover:translate-x-0
                                 transition-all duration-300"
                  >
                    Shop →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
