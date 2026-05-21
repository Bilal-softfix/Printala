"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";
import AnimateIn from "./AnimateIn";
import { fetchProducts } from "@/lib/api";
import { PRODUCTS as FALLBACK } from "@/lib/data";
import { Product } from "@/types";
import { ProductGridSkeleton } from "./Skeleton";

export default function FeaturedGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await fetchProducts({
          featured: "true",
          type: "poster",
          limit: "8",
        });
        if (result.data && result.data.length > 0) {
          setProducts(result.data);
        } else {
          // Fallback to static data
          setProducts(
            FALLBACK.filter((p) => p.featured && p.type === "poster").slice(
              0,
              8,
            ),
          );
        }
      } catch (err) {
        console.log("FeaturedGrid: Using fallback data", err);
        setProducts(
          FALLBACK.filter((p) => p.featured && p.type === "poster").slice(0, 8),
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <section
      className="py-24 bg-bg-secondary halftone"
      aria-labelledby="featured-heading"
    >
      <div className="container-main">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <AnimateIn>
            <div className="speech-bubble text-sm text-charcoal mb-4 inline-block">
              🔥 Fan Favorites
            </div>
            <h2
              id="featured-heading"
              className="font-display text-4xl md:text-6xl font-bold leading-tight text-charcoal"
            >
              Trending <span className="text-gradient">Right Now</span>
            </h2>
          </AnimateIn>

          <AnimateIn delay={0.2}>
            <Link href="/shop" className="btn-sky text-sm">
              View All Posters →
            </Link>
          </AnimateIn>
        </div>

        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6">
            {products.map((product, i) => (
              <ProductCard
                key={product._id}
                product={product}
                index={i}
                priority={i < 4}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
