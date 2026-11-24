"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { HiArrowUpRight } from "react-icons/hi2";
import ProductCard from "./ProductCard";
import SectionHeading from "./ui/SectionHeading";
import { fetchProducts } from "@/lib/api";
import { PRODUCTS as FALLBACK } from "@/lib/data";
import { Product } from "@/types";
import { ProductGridSkeleton } from "./Skeleton";
import { VIEWPORT, fadeUp } from "@/lib/motion";

const fallback = () =>
  FALLBACK.filter((p) => p.featured && p.type === "poster").slice(0, 6);

export default function FeaturedGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await fetchProducts({
          featured: "true",
          type: "poster",
          limit: "6",
        });
        setProducts(result.data && result.data.length > 0 ? result.data : fallback());
      } catch {
        setProducts(fallback());
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <section
      aria-labelledby="featured-heading"
      className="border-t border-black/10 bg-paper py-24 text-ink-text md:py-32"
    >
      <div className="container-main grid gap-14 lg:grid-cols-[minmax(16rem,22rem)_1fr] lg:gap-16">
        {/* Pinned editorial column */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            id="featured-heading"
            index="02"
            eyebrow="Trending artwork"
            size="sm"
            lines={["Trending", "now."]}
          />
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={VIEWPORT}
            variants={fadeUp}
            custom={2}
          >
            <p className="mt-6 max-w-xs text-[15px] leading-relaxed text-ink-text/65">
              The prints everyone is hanging this month. Thick 300gsm matte,
              colours that stay vivid.
            </p>
            <Link
              href="/shop?sort=bestseller"
              className="group mt-8 inline-flex items-center gap-3 rounded-full bg-ink-text py-2 pl-6 pr-2 text-sm font-medium text-cream transition-colors duration-500 hover:bg-accent"
            >
              See all trending
              <span className="grid h-9 w-9 place-items-center rounded-full bg-cream text-ink-text">
                <HiArrowUpRight
                  aria-hidden="true"
                  size={14}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </span>
            </Link>
          </motion.div>
        </div>

        {loading ? (
          <ProductGridSkeleton count={6} />
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 md:gap-y-14">
            {products.map((product, i) => (
              <ProductCard key={product._id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
