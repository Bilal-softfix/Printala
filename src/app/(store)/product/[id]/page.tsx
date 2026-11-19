"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { HiMinus, HiPlus } from "react-icons/hi";
import { HiCheck, HiOutlineShoppingBag } from "react-icons/hi2";
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
import ProductGallery from "@/components/product/ProductGallery";
import SectionHeading from "@/components/ui/SectionHeading";
import { EASE } from "@/lib/motion";
import toast from "react-hot-toast";

/* Store-wide terms already shown on this page before the redesign. */
const TRUST = [
  { title: "Free shipping", text: "On orders of ₹499 and above" },
  { title: "Easy returns", text: "7-day return policy" },
  { title: "Cash on Delivery", text: "Pay when your poster arrives" },
];

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const result = await fetchProductById(id as string);
        if (result.data) {
          setProduct(result.data);
          setSelectedSize(result.data.sizes[1] || result.data.sizes[0]);
          try {
            const relatedResult = await fetchRelatedProducts(id as string);
            if (relatedResult.data) setRelated(relatedResult.data);
          } catch {
            // Related products failed — not critical
          }
        }
      } catch (err) {
        console.log("ProductPage: Using fallback", err);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-paper pt-28 pb-20">
        <div className="container-main grid animate-pulse gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <div className="aspect-[4/5] bg-paper-2" />
          <div className="space-y-5 pt-6">
            <div className="h-3 w-28 bg-paper-2" />
            <div className="h-14 w-4/5 bg-paper-2" />
            <div className="h-8 w-32 bg-paper-2" />
            <div className="h-24 w-full bg-paper-2" />
            <div className="h-14 w-full bg-paper-2" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-5 pt-28 pb-20 text-center text-ink-text">
        <p className="text-[10.5px] uppercase tracking-[0.3em] text-ink-text/55">404</p>
        <h1 className="mt-4 font-display text-4xl font-bold uppercase tracking-[-0.04em] md:text-6xl">
          Product nahi mila
        </h1>
        <Link
          href="/shop"
          className="mt-8 inline-flex rounded-full bg-ink-text px-7 py-3.5 text-sm font-medium text-cream transition-colors hover:bg-accent"
        >
          Shop pe jao →
        </Link>
      </div>
    );
  }

  const modifier = selectedSize?.priceModifier || 0;
  const unitPrice = product.price + modifier;
  const isSplit = product.type === "split-poster";
  const categoryLabel = isSplit
    ? "Split poster"
    : product.category.replace("-", " ");

  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Shop", url: "/shop" },
    {
      name: product.category.charAt(0).toUpperCase() + product.category.slice(1),
      url: `/shop?category=${product.category}`,
    },
    { name: product.name, url: `/product/${product._id}` },
  ];

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addItem(product, selectedSize, quantity);
    toast.success(`"${product.name}" (${selectedSize.label}) added to cart!`);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
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
          __html: JSON.stringify(generateBreadcrumbJsonLd(breadcrumbs, BASE_URL)),
        }}
      />

      <article className="min-h-screen bg-paper pt-24 pb-24 text-ink-text md:pt-28">
        <div className="container-main">
          <nav aria-label="Breadcrumb" className="mb-8 md:mb-10">
            <ol className="flex flex-wrap items-center gap-2 text-xs text-ink-text/55">
              {breadcrumbs.map((bc, i) => (
                <li key={bc.url} className="flex items-center gap-2">
                  {i > 0 && <span aria-hidden="true">/</span>}
                  {i < breadcrumbs.length - 1 ? (
                    <Link href={bc.url} className="capitalize transition-colors hover:text-ink-text">
                      {bc.name}
                    </Link>
                  ) : (
                    <span aria-current="page" className="max-w-[16rem] truncate text-ink-text">
                      {bc.name}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>

          <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16 xl:gap-24">
            <ProductGallery product={product} />

            {/* Details — pinned beside the artwork on desktop */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
              className="lg:sticky lg:top-28 lg:self-start"
            >
              <p className="flex flex-wrap items-center gap-3 text-[10.5px] font-medium uppercase tracking-[0.3em] text-ink-text/55">
                <span className="capitalize text-accent">{categoryLabel}</span>
                {isSplit && (
                  <>
                    <span className="h-px w-6 bg-black/20" />
                    {product.panels || 3} panels
                  </>
                )}
                {product.bestseller && (
                  <>
                    <span className="h-px w-6 bg-black/20" />
                    Bestseller
                  </>
                )}
              </p>

              <h1 className="mt-4 font-display text-[clamp(2rem,4vw,3.4rem)] font-bold leading-[1] tracking-[-0.04em]">
                {product.name}
              </h1>

              <div className="mt-6 flex flex-wrap items-baseline gap-3">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={unitPrice}
                    initial={{ y: 12, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -12, opacity: 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className="font-display text-3xl font-bold tracking-[-0.03em]"
                  >
                    {formatPrice(unitPrice)}
                  </motion.span>
                </AnimatePresence>
                {product.comparePrice && (
                  <>
                    <span className="text-lg text-ink-text/45 line-through">
                      {formatPrice(product.comparePrice + modifier)}
                    </span>
                    <span className="bg-accent px-2 py-1 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-white">
                      Save {formatPrice(product.comparePrice - product.price)}
                    </span>
                  </>
                )}
              </div>

              <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-ink-text/70">
                {product.description}
              </p>

              {/* Size */}
              <fieldset className="mt-9">
                <legend className="text-[10.5px] uppercase tracking-[0.26em] text-ink-text/55">
                  {isSplit ? "Set size" : "Size"}
                  {selectedSize && (
                    <span className="ml-2 normal-case tracking-normal text-ink-text">
                      — {selectedSize.label} · {selectedSize.dimensions}
                    </span>
                  )}
                </legend>
                <div role="radiogroup" className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {product.sizes.map((size) => {
                    const on = selectedSize?.label === size.label;
                    return (
                      <button
                        key={size.label}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        onClick={() => setSelectedSize(size)}
                        className={`relative border px-3 py-3 text-left transition-colors duration-300 ${
                          on
                            ? "border-ink-text bg-ink-text text-cream"
                            : "border-black/15 hover:border-ink-text"
                        }`}
                      >
                        <span className="block text-sm font-semibold">{size.label}</span>
                        <span className={`mt-0.5 block text-[11px] ${on ? "text-cream/70" : "text-ink-text/55"}`}>
                          {size.dimensions}
                        </span>
                        {size.priceModifier > 0 && (
                          <span className={`mt-1 block text-[11px] font-medium ${on ? "text-cream" : "text-accent"}`}>
                            +{formatPrice(size.priceModifier)}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              {/* Quantity + add to cart */}
              <div className="mt-8 flex gap-3">
                <div className="flex items-center border border-black/15">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    aria-label="Decrease quantity"
                    className="grid h-14 w-11 place-items-center transition-colors hover:bg-paper-2"
                  >
                    <HiMinus size={14} />
                  </button>
                  <span aria-live="polite" aria-label={`Quantity ${quantity}`} className="w-8 text-center text-sm font-semibold tabular-nums">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    aria-label="Increase quantity"
                    className="grid h-14 w-11 place-items-center transition-colors hover:bg-paper-2"
                  >
                    <HiPlus size={14} />
                  </button>
                </div>

                <motion.button
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`relative flex h-14 flex-1 items-center justify-center gap-3 overflow-hidden text-sm font-medium text-cream transition-colors duration-500 disabled:cursor-not-allowed disabled:bg-ink-text/40 ${
                    added ? "bg-accent" : "bg-ink-text hover:bg-accent"
                  }`}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={added ? "added" : "add"}
                      initial={{ y: 18, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -18, opacity: 0 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      className="flex items-center gap-2.5"
                    >
                      {!product.inStock ? (
                        "Sold out"
                      ) : added ? (
                        <>
                          <HiCheck size={18} aria-hidden="true" /> Added to bag
                        </>
                      ) : (
                        <>
                          <HiOutlineShoppingBag size={18} aria-hidden="true" />
                          Add to bag — {formatPrice(unitPrice * quantity)}
                        </>
                      )}
                    </motion.span>
                  </AnimatePresence>
                </motion.button>
              </div>

              {/* Trust */}
              <ul className="mt-8 grid grid-cols-3 border-y border-black/10">
                {TRUST.map((t, i) => (
                  <li key={t.title} className={`py-4 pr-3 ${i ? "border-l border-black/10 pl-4" : ""}`}>
                    <p className="text-xs font-semibold">{t.title}</p>
                    <p className="mt-1 text-[11px] leading-snug text-ink-text/55">{t.text}</p>
                  </li>
                ))}
              </ul>

              {/* Specifications */}
              <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 text-sm">
                {[
                  ["Paper", "300gsm matte art paper"],
                  ["Format", isSplit ? `${product.panels || 3}-panel split set` : "Single poster"],
                  ["Sizes", `${product.sizes.length} options`],
                  ["Ships in", "Rigid cardboard tube"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-[10.5px] uppercase tracking-[0.26em] text-ink-text/55">{k}</dt>
                    <dd className="mt-1.5">{v}</dd>
                  </div>
                ))}
              </dl>

              {product.tags && product.tags.length > 0 && (
                <ul className="mt-8 flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <li key={tag}>
                      <Link
                        href={`/shop?search=${tag}`}
                        className="inline-flex rounded-full border border-black/15 px-3 py-1.5 text-xs text-ink-text/70 transition-colors hover:border-ink-text hover:text-ink-text"
                      >
                        #{tag}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          </div>

          {related.length > 0 && (
            <section aria-labelledby="related-heading" className="mt-28 border-t border-black/10 pt-20 md:mt-36">
              <SectionHeading
                id="related-heading"
                index="—"
                eyebrow="Keep exploring"
                size="sm"
                lines={["You may", "also like."]}
              />
              <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-4">
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
