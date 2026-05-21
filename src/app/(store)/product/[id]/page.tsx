"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { HiMinus, HiPlus, HiOutlineHeart } from "react-icons/hi";
import {
  HiOutlineTruck,
  HiOutlineArrowUturnLeft,
  HiOutlineShieldCheck,
} from "react-icons/hi2";
import { useCartStore } from "@/store/cartStore";
import { fetchProductById, fetchRelatedProducts } from "@/lib/api";
import { PRODUCTS as FALLBACK } from "@/lib/data";
import { Product, Size } from "@/types";
import { formatPrice } from "@/lib/utils";
import {
  generateProductJsonLd,
  generateBreadcrumbJsonLd,
  BASE_URL,
} from "@/lib/seo";
import ProductCard from "@/components/ProductCard";
import AnimateIn from "@/components/AnimateIn";
import toast from "react-hot-toast";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // Fetch product from API
        const result = await fetchProductById(id as string);

        if (result.data) {
          setProduct(result.data);
          setSelectedSize(result.data.sizes[1] || result.data.sizes[0]);

          // Fetch related products
          try {
            const relatedResult = await fetchRelatedProducts(id as string);
            if (relatedResult.data) {
              setRelated(relatedResult.data);
            }
          } catch {
            // Related products failed — not critical
          }
        }
      } catch (err) {
        console.log("ProductPage: Using fallback", err);
        // Fallback to static data
        const found = FALLBACK.find((p) => p._id === id);
        if (found) {
          setProduct(found);
          setSelectedSize(found.sizes[1] || found.sizes[0]);
          setRelated(
            FALLBACK.filter(
              (p) => p.category === found.category && p._id !== found._id,
            ).slice(0, 4),
          );
        }
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="pt-28 pb-20 container-main bg-bg-primary min-h-screen">
        <div className="animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="aspect-[3/4] bg-bg-tertiary rounded-2xl border-3 border-charcoal/10" />
          <div className="space-y-4 pt-10">
            <div className="h-4 bg-bg-tertiary rounded w-24" />
            <div className="h-12 bg-bg-tertiary rounded w-3/4" />
            <div className="h-8 bg-bg-tertiary rounded w-32" />
            <div className="h-20 bg-bg-tertiary rounded w-full mt-8" />
            <div className="flex gap-3 mt-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 w-20 bg-bg-tertiary rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Product not found
  if (!product) {
    return (
      <div className="pt-28 pb-20 container-main bg-bg-primary min-h-screen text-center">
        <p className="text-6xl mb-4">😢</p>
        <h1 className="font-display text-3xl font-bold text-charcoal mb-4">
          Product nahi mila
        </h1>
        <Link href="/shop" className="btn-primary">
          <span>Shop pe jao →</span>
        </Link>
      </div>
    );
  }

  const unitPrice = product.price + (selectedSize?.priceModifier || 0);
  const isSplit = product.type === "split-poster";

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Shop", url: "/shop" },
    {
      name:
        product.category.charAt(0).toUpperCase() + product.category.slice(1),
      url: `/shop?category=${product.category}`,
    },
    { name: product.name, url: `/product/${product._id}` },
  ];

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addItem(product, selectedSize, quantity);
    toast.success(
      `"${product.name}" (${selectedSize.label}) cart mein add ho gaya! 🔥`,
    );
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateProductJsonLd(product, BASE_URL)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateBreadcrumbJsonLd(breadcrumbs, BASE_URL),
          ),
        }}
      />

      <article className="pt-28 pb-20 bg-bg-primary min-h-screen">
        <div className="container-main">
          {/* Breadcrumb */}
          <nav className="mb-10 text-sm" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-text-muted flex-wrap">
              {breadcrumbs.map((bc, i) => (
                <li key={bc.url} className="flex items-center gap-2">
                  {i > 0 && <span>/</span>}
                  {i < breadcrumbs.length - 1 ? (
                    <Link
                      href={bc.url}
                      className="hover:text-magenta transition-colors font-medium"
                    >
                      {bc.name}
                    </Link>
                  ) : (
                    <span className="text-charcoal font-bold">{bc.name}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              {isSplit ? (
                <div className="relative">
                  <div
                    className="flex gap-2 border-3 border-charcoal rounded-2xl overflow-hidden shadow-[6px_6px_0_#2F3542]"
                    style={{
                      aspectRatio: product.panels === 5 ? "2/1" : "1.8/1",
                    }}
                  >
                    {Array.from({ length: product.panels || 3 }).map((_, i) => (
                      <div
                        key={i}
                        className="relative overflow-hidden bg-bg-tertiary"
                        style={{
                          flex:
                            i === Math.floor((product.panels || 3) / 2)
                              ? 1.3
                              : 1,
                        }}
                      >
                        <Image
                          src={
                            "http://localhost:5000/uploads/products/poster-1776325119148.webp"
                          }
                          alt={`${product.name} panel ${i + 1}`}
                          fill
                          className="object-cover"
                          style={{
                            objectPosition: `${(i / ((product.panels || 3) - 1)) * 100}% center`,
                          }}
                          priority
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                      </div>
                    ))}
                  </div>
                  <span className="absolute top-4 right-4 badge-split text-sm px-4 py-2">
                    {product.panels} Panel Set
                  </span>
                </div>
              ) : (
                <div className="relative aspect-[3/4] poster-frame shadow-[6px_6px_0_#2F3542]">
                  <img
                    src={product.image}
                    alt={`${product.name} — ${product.category} poster by Printala 8520`}
                    // fill
                    className="absolute inset-0 w-full h-full object-cover"
                    // priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  {product.bestseller && (
                    <span className="absolute top-4 left-4 badge-bestseller text-sm px-3 py-1.5">
                      Bestseller
                    </span>
                  )}
                  {product.isNew && (
                    <span className="absolute top-4 left-4 badge-new text-sm px-3 py-1.5">
                      New!
                    </span>
                  )}
                </div>
              )}
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col justify-center"
            >
              <div className="flex items-center gap-2 mb-3">
                <p className="text-xs uppercase tracking-[0.25em] text-magenta font-black">
                  {product.category === "split-poster"
                    ? "Split Poster"
                    : product.category}
                </p>
                {isSplit && (
                  <span className="badge-split">{product.panels} Panels</span>
                )}
              </div>

              <h1 className="font-display text-3xl md:text-5xl font-bold leading-tight mb-4 text-charcoal">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-3 mb-6 flex-wrap">
                <span className="font-comic text-4xl text-magenta">
                  {formatPrice(unitPrice)}
                </span>
                {product.comparePrice && (
                  <span className="text-text-muted line-through text-lg">
                    {formatPrice(
                      product.comparePrice + (selectedSize?.priceModifier || 0),
                    )}
                  </span>
                )}
                {product.comparePrice && (
                  <span className="badge-sale text-sm px-3 py-1">
                    {formatPrice(product.comparePrice - product.price)} OFF!
                  </span>
                )}
              </div>

              <p className="text-text-secondary leading-relaxed mb-8 max-w-lg">
                {product.description}
              </p>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {product.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/shop?search=${tag}`}
                      className="px-3 py-1 bg-bg-tertiary text-text-muted text-xs rounded-full font-bold
                                 hover:text-magenta hover:bg-magenta/10 border-2 border-transparent
                                 hover:border-magenta/30 transition-all"
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}

              {/* Size Selection */}
              <div className="mb-8">
                <h2 className="text-xs uppercase tracking-[0.2em] text-text-muted font-black mb-4">
                  {isSplit ? "Set Size" : "Select Size"}
                </h2>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size.label}
                      onClick={() => setSelectedSize(size)}
                      className={`px-5 py-3 rounded-xl border-2 text-sm font-bold transition-all duration-300
                        ${
                          selectedSize?.label === size.label
                            ? "border-magenta bg-magenta/10 text-magenta shadow-[3px_3px_0_#E10F80]"
                            : "border-charcoal/20 text-text-secondary hover:border-charcoal"
                        }`}
                    >
                      <span className="font-black">{size.label}</span>
                      <span className="block text-xs mt-0.5 opacity-60">
                        {size.dimensions}
                      </span>
                      {size.priceModifier > 0 && (
                        <span className="block text-[10px] mt-0.5 text-magenta font-black">
                          +{formatPrice(size.priceModifier)}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-8">
                <h2 className="text-xs uppercase tracking-[0.2em] text-text-muted font-black mb-4">
                  Quantity
                </h2>
                <div className="inline-flex items-center border-3 border-charcoal rounded-xl overflow-hidden shadow-[3px_3px_0_#2F3542]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 bg-white hover:bg-sky hover:text-white transition-colors"
                  >
                    <HiMinus size={16} />
                  </button>
                  <span className="w-14 text-center font-black text-lg border-x-3 border-charcoal py-2 bg-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 bg-white hover:bg-sky hover:text-white transition-colors"
                  >
                    <HiPlus size={16} />
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <div className="flex gap-3 mb-10">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="btn-primary flex-1 text-base"
                >
                  <span>
                    {product.inStock
                      ? `Cart Mein Daalo — ${formatPrice(unitPrice * quantity)}`
                      : "Sold Out 😭"}
                  </span>
                </motion.button>
                <button
                  className="w-14 h-14 rounded-xl border-3 border-charcoal shadow-[3px_3px_0_#2F3542]
                             flex items-center justify-center bg-white
                             text-text-muted hover:text-magenta hover:border-magenta
                             hover:shadow-[3px_3px_0_#E10F80] transition-all"
                  aria-label="Wishlist mein daalo"
                >
                  <HiOutlineHeart size={22} />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    icon: HiOutlineTruck,
                    label: "Free Shipping",
                    sub: "₹499+ orders",
                  },
                  {
                    icon: HiOutlineArrowUturnLeft,
                    label: "Easy Returns",
                    sub: "7-day policy",
                  },
                  {
                    icon: HiOutlineShieldCheck,
                    label: "COD Available",
                    sub: "Cash on Delivery",
                  },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="text-center p-3 comic-card">
                    <Icon className="mx-auto mb-1 text-magenta" size={20} />
                    <p className="text-[11px] font-bold text-charcoal">
                      {label}
                    </p>
                    <p className="text-[10px] text-text-muted">{sub}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Related Products */}
          {related.length > 0 && (
            <section className="mt-28" aria-labelledby="related-heading">
              <AnimateIn>
                <h2
                  id="related-heading"
                  className="font-display text-3xl md:text-4xl font-bold mb-10 text-charcoal"
                >
                  Ye Bhi <span className="text-gradient">Dekho</span>
                </h2>
              </AnimateIn>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {related.map((p, i) => (
                  <ProductCard key={p._id} product={p} index={i} />
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </>
  );
}
