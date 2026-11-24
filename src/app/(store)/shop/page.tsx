"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { ProductGridSkeleton } from "@/components/Skeleton";
import { fetchProducts } from "@/lib/api";
import { CATEGORIES } from "@/lib/categories";
import { Product } from "@/types";

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchQuery = searchParams.get("search");
  const activeType = searchParams.get("type") || "all";
  const sortBy = searchParams.get("sort") || "newest";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  // URL is the single source of truth for filters (shareable, Back works).
  const setParam = (key: string, value: string, fallback: string) => {
    const next = new URLSearchParams(searchParams.toString());
    if (value === fallback) next.delete(key);
    else next.set(key, value);
    const qs = next.toString();
    router.replace(qs ? `/shop?${qs}` : "/shop", { scroll: false });
  };

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setFailed(false);
    try {
      const params: Record<string, string> = { limit: "50" };
      if (activeType !== "all") params.type = activeType;
      if (searchQuery) params.search = searchQuery;
      if (sortBy !== "newest") params.sort = sortBy;

      const result = await fetchProducts(params);
      setProducts(result.data ?? []);
    } catch {
      setProducts([]);
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, [activeType, sortBy, searchQuery]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleTypeClick = (type: string) => setParam("type", type, "all");
  const setSortBy = (sort: string) => setParam("sort", sort, "newest");

  const TYPES = [
    { value: "all", label: "All" },
    { value: "poster", label: "Single posters" },
    { value: "split-poster", label: "Split posters" },
  ];

  return (
    <div className="min-h-screen bg-paper pt-28 pb-24 text-ink-text md:pt-36">
      <div className="container-main">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            as="h1"
            index="—"
            eyebrow={searchQuery ? "Search results" : "Full collection"}
            lines={searchQuery ? [<>&ldquo;{searchQuery}&rdquo;</>] : ["All posters."]}
          />
          <p className="text-sm text-ink-text/70 md:pb-3" aria-live="polite">
            {loading
              ? "Loading…"
              : `${products.length} ${products.length === 1 ? "poster" : "posters"}`}
          </p>
        </div>
      </div>

      {/* Filter bar — stays under the nav while browsing */}
      <div className="sticky top-20 z-30 mt-10 border-y border-black/10 bg-paper/90 backdrop-blur-xl">
        <div className="container-main flex flex-col gap-3 py-3 lg:flex-row lg:items-center lg:gap-6">
          <div className="flex shrink-0 items-center justify-between gap-3">
            <div className="flex gap-1.5" role="group" aria-label="Poster type">
              {TYPES.map((t) => (
                <button
                  key={t.value}
                  aria-pressed={activeType === t.value}
                  onClick={() => handleTypeClick(t.value)}
                  className="chip"
                >
                  {t.label}
                </button>
              ))}
            </div>
            <label className="lg:hidden">
              <span className="sr-only">Sort by</span>
              <SortSelect value={sortBy} onChange={setSortBy} />
            </label>
          </div>

          <span className="hidden h-6 w-px bg-black/15 lg:block" />

          <div className="-mx-5 flex min-w-0 flex-1 gap-1.5 overflow-x-auto px-5 scrollbar-hide lg:mx-0 lg:px-0" role="group" aria-label="Category">
            <span aria-current="page" className="chip shrink-0">
              All
            </span>
            {CATEGORIES.map((cat) => (
              <Link key={cat.slug} href={`/shop/${cat.slug}`} className="chip shrink-0">
                {cat.name}
              </Link>
            ))}
          </div>

          <label className="hidden shrink-0 lg:block">
            <span className="sr-only">Sort by</span>
            <SortSelect value={sortBy} onChange={setSortBy} />
          </label>
        </div>
      </div>

      <div className="container-main mt-12">
        {loading ? (
          <ProductGridSkeleton count={8} />
        ) : (
          <AnimatePresence mode="wait">
            {failed ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-28"
              >
                <p className="font-display text-4xl font-bold uppercase tracking-[-0.04em] md:text-6xl">
                  Couldn&apos;t load posters.
                </p>
                <p className="mt-4 text-[15px] text-ink-text/70">
                  Our catalog is taking too long to respond. Please try again.
                </p>
                <button onClick={loadProducts} className="btn-ink mt-8">
                  Try again
                </button>
              </motion.div>
            ) : products.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-28"
              >
                <p className="font-display text-4xl font-bold uppercase tracking-[-0.04em] md:text-6xl">
                  Nothing on this wall.
                </p>
                <p className="mt-4 text-[15px] text-ink-text/70">
                  {searchQuery
                    ? `No posters match “${searchQuery}”. Try another word or browse a collection.`
                    : "Try a different filter or browse a collection."}
                </p>
                <button onClick={() => router.replace("/shop")} className="btn-ink mt-8">
                  Clear filters
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={activeType + sortBy + searchQuery}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 md:gap-y-14 xl:grid-cols-4"
              >
                {products.map((product, i) => (
                  <ProductCard key={product._id} product={product} index={i} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

function SortSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="cursor-pointer rounded-full border border-black/15 bg-transparent px-4 py-2 text-[13px] text-ink-text/80 transition-colors hover:border-ink-text focus:border-accent focus:outline-none"
    >
      <option value="newest">Newest</option>
      <option value="bestseller">Bestsellers</option>
      <option value="price-asc">Price: Low → High</option>
      <option value="price-desc">Price: High → Low</option>
      <option value="name">Name: A → Z</option>
    </select>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-paper pt-36 pb-20"><div className="container-main">
          <ProductGridSkeleton />
        </div></div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
