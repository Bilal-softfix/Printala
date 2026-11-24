"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { ProductGridSkeleton } from "@/components/Skeleton";
import { fetchProducts } from "@/lib/api";
import { PRODUCTS as FALLBACK_PRODUCTS, CATEGORIES } from "@/lib/data";
import { Product } from "@/types";

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const searchQuery = searchParams.get("search");
  const typeParam = searchParams.get("type");
  const sortParam = searchParams.get("sort");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(categoryParam || "all");
  const [activeType, setActiveType] = useState(typeParam || "all");
  const [sortBy, setSortBy] = useState(sortParam || "newest");

  // Fetch products from API
  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { limit: "50" };

      if (activeCategory !== "all") params.category = activeCategory;
      if (activeType === "poster") params.type = "poster";
      if (activeType === "split-poster") params.type = "split-poster";
      if (searchQuery) params.search = searchQuery;
      if (sortBy === "price-asc") params.sort = "price-asc";
      if (sortBy === "price-desc") params.sort = "price-desc";
      if (sortBy === "name") params.sort = "name";
      if (sortBy === "bestseller") params.sort = "bestseller";

      const result = await fetchProducts(params);

      if (result.data && result.data.length > 0) {
        setProducts(result.data);
      } else {
        setProducts([]);
      }
    } catch {
      // Fallback to static data
      setProducts(FALLBACK_PRODUCTS);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, activeType, sortBy, searchQuery]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Sync URL params with state
  useEffect(() => {
    if (categoryParam) setActiveCategory(categoryParam);
    if (typeParam) setActiveType(typeParam);
    if (sortParam) setSortBy(sortParam);
  }, [categoryParam, typeParam, sortParam]);

  const handleCategoryClick = (slug: string) => {
    setActiveCategory(slug);
    if (slug === "split-poster") {
      setActiveType("split-poster");
    } else if (activeType === "split-poster" && slug !== "all") {
      setActiveType("all");
    }
  };

  const handleTypeClick = (type: string) => {
    setActiveType(type);
    if (type === "split-poster") {
      setActiveCategory("split-poster");
    } else if (activeCategory === "split-poster") {
      setActiveCategory("all");
    }
  };

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
          <p className="text-sm text-ink-text/55 md:pb-3" aria-live="polite">
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
            {[{ slug: "all", name: "All" }, ...CATEGORIES].map((cat) => (
              <button
                key={cat.slug}
                aria-pressed={activeCategory === cat.slug}
                onClick={() => handleCategoryClick(cat.slug)}
                className="chip shrink-0"
              >
                {cat.name}
              </button>
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
            {products.length === 0 ? (
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
                <p className="mt-4 text-[15px] text-ink-text/65">Try a different category or search.</p>
                <button
                  onClick={() => {
                    setActiveCategory("all");
                    setActiveType("all");
                  }}
                  className="btn-ink mt-8"
                >
                  Reset filters
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={activeCategory + activeType + sortBy + searchQuery}
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
