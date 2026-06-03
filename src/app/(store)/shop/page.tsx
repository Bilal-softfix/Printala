"use client";

import { useState, useEffect, useMemo, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import AnimateIn from "@/components/AnimateIn";
import { ProductGridSkeleton } from "@/components/Skeleton";
import { fetchProducts } from "@/lib/api";
import { PRODUCTS as FALLBACK_PRODUCTS, CATEGORIES } from "@/lib/data";
import { Product } from "@/types";

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const searchQuery = searchParams.get("search");
  const typeParam = searchParams.get("type");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(categoryParam || "all");
  const [activeType, setActiveType] = useState(typeParam || "all");
  const [sortBy, setSortBy] = useState("newest");

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
    } catch (err) {
      console.log("Shop: Using fallback data", err);
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
  }, [categoryParam, typeParam]);

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

  return (
    <div className="pt-28 pb-20 bg-bg-primary min-h-screen">
      <div className="container-main">
        {/* Header */}
        <AnimateIn className="mb-12">
          <p className="text-xs uppercase tracking-[0.3em] text-magenta font-medium mb-3">
            {searchQuery ? "Search Results" : "Full Collection"}
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-bold leading-none text-charcoal">
            {searchQuery ? (
              <>
                Results for &ldquo;
                <span className="text-gradient">{searchQuery}</span>&rdquo;
              </>
            ) : (
              <>
                All <span className="text-text-muted">Posters</span>
              </>
            )}
          </h1>
        </AnimateIn>

        {/* Type Toggle */}
        <div className="flex gap-2 mb-6">
          {[
            { value: "all", label: "All" },
            { value: "poster", label: "🖼️ Single Posters" },
            { value: "split-poster", label: "🖼️🖼️🖼️ Split Posters" },
          ].map((t) => (
            <button
              key={t.value}
              onClick={() => handleTypeClick(t.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeType === t.value
                  ? "bg-charcoal text-white border-3 border-charcoal shadow-[3px_3px_0_#E10F80]"
                  : "bg-white text-text-secondary border-2 border-charcoal/20 hover:border-charcoal"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Category Chips */}
        <div
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-8"
          role="tablist"
        >
          <button
            onClick={() => handleCategoryClick("all")}
            className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap
                        transition-all duration-300 shrink-0 border-2 ${
                          activeCategory === "all"
                            ? "bg-magenta text-white border-charcoal shadow-[3px_3px_0_#2F3542]"
                            : "bg-white text-text-secondary border-charcoal/20 hover:border-charcoal"
                        }`}
          >
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => handleCategoryClick(cat.slug)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap
                          transition-all duration-300 shrink-0 border-2 ${
                            activeCategory === cat.slug
                              ? "bg-magenta text-white border-charcoal shadow-[3px_3px_0_#2F3542]"
                              : "bg-white text-text-secondary border-charcoal/20 hover:border-charcoal"
                          }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Sort + Count */}
        <div className="flex items-center justify-between mb-8">
          <span className="text-sm text-text-muted font-bold">
            {loading
              ? "Loading..."
              : `${products.length} poster${products.length !== 1 ? "s" : ""} found`}
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white text-text-secondary text-sm rounded-xl px-4 py-2.5
                       border-2 border-charcoal/20 focus:outline-none focus:border-magenta transition-colors font-bold"
          >
            <option value="newest">Newest</option>
            <option value="bestseller">Bestsellers</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="name">Name: A → Z</option>
          </select>
        </div>

        {/* Grid */}
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
                className="text-center py-32"
              >
                <p className="text-5xl mb-4">😔</p>
                <p className="font-display text-3xl font-bold text-text-muted mb-3">
                  No result found
                </p>
                <p className="text-text-secondary text-sm mb-6">
                  Try a different category or search
                </p>
                <button
                  onClick={() => {
                    setActiveCategory("all");
                    setActiveType("all");
                  }}
                  className="btn-outline text-sm"
                >
                  Reset Filters
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={activeCategory + activeType + sortBy + searchQuery}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
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

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="container-main pt-28 pb-20">
          <ProductGridSkeleton />
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
