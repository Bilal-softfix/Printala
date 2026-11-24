import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { getProduct, getRelated } from "@/lib/server-api";
import {
  BASE_URL,
  generateBreadcrumbJsonLd,
  generateProductJsonLd,
  productBreadcrumbs,
} from "@/lib/seo";
import ProductDetails from "./ProductDetails";
import Link from "next/link";
import FaqSection from "@/components/FaqSection";
import { STORE_FAQ } from "@/lib/faq";
import { CATEGORIES } from "@/lib/categories";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/types";

type Props = { params: Promise<{ id: string }> };

/** SEO title: "<name> <kind>", trimmed to ~60 chars incl. " | Printala". */
function seoTitle(name: string, kind: string, max = 48) {
  let clean = name.split(" | ")[0].trim();
  if (!/poster/i.test(clean)) clean = `${clean} ${kind}`;
  if (clean.length <= max) return clean;
  return clean.slice(0, clean.lastIndexOf(" ", max)).trim() || clean.slice(0, max);
}

// Dedupe the fetch between generateMetadata and the page render.
const loadProduct = cache(getProduct);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await loadProduct(id);
  if (!product) return { title: "Poster not found", robots: { index: false } };

  const description =
    product.description?.slice(0, 155) ||
    `Buy ${product.name} poster online in India. Premium matte print, fast delivery, COD available.`;
  const title = seoTitle(
    product.name,
    product.type === "split-poster" ? "Split Poster" : "Poster",
  );

  return {
    title,
    description,
    alternates: { canonical: `/product/${product._id}` },
    openGraph: {
      type: "website",
      title: `${title} | Printala`,
      description,
      url: `/product/${product._id}`,
      images: [{ url: product.image, alt: product.name }],
    },
    twitter: { card: "summary_large_image", images: [product.image] },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await loadProduct(id);
  if (!product) notFound();

  const related = await getRelated(product);

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
            generateBreadcrumbJsonLd(productBreadcrumbs(product), BASE_URL),
          ),
        }}
      />
      <ProductDetails product={product} related={related} />
      <ProductInfo product={product} />
    </>
  );
}

/** Server-rendered descriptive content so every product page has substance for search. */
function ProductInfo({ product }: { product: Product }) {
  const isSplit = product.type === "split-poster";
  const cat = CATEGORIES.find((c) => c.slug === product.category);
  const catName = cat?.name ?? product.category.replace("-", " ");
  const sizes = product.sizes ?? [];
  const from = formatPrice(product.price + Math.min(0, ...sizes.map((s) => s.priceModifier)));
  const sizeText = sizes.map((s) => `${s.label} (${s.dimensions})`).join(", ");
  const faqs = STORE_FAQ.filter((f) => /paper|shipping|Cash on Delivery|track/i.test(f.q));

  return (
    <div className="bg-paper pb-24 text-ink-text">
      <div className="container-main grid gap-16 border-t border-black/10 pt-20 lg:grid-cols-2 lg:gap-24">
        <section aria-labelledby="about-poster">
          <h2 id="about-poster" className="font-display text-3xl font-bold tracking-[-0.03em] md:text-4xl">
            About this {isSplit ? "split poster" : "poster"}
          </h2>
          <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-ink-text/75">
            <p>
              The <strong className="text-ink-text">{product.name}</strong>{" "}
              {isSplit
                ? `is a ${product.panels ?? 3}-panel split poster: one artwork printed across ${product.panels ?? 3} separate panels that hang side by side for a large, gallery-style wall display.`
                : "is a premium wall poster made for fans who want bold, high-detail art on their walls."}{" "}
              It is printed on thick 300gsm matte art paper with vivid colours and no glare.
            </p>
            {sizes.length > 0 && (
              <p>
                Available in {sizes.length === 1 ? "one size" : `${sizes.length} sizes`}: {sizeText}. Prices start at{" "}
                {from}.
              </p>
            )}
            <p>
              Great for bedrooms, study rooms, gaming setups, offices and gifts. Every order ships rolled in a rigid
              tube, with Cash on Delivery available across India.
            </p>
            {cat && (
              <p>
                Looking for more?{" "}
                <Link href={`/shop/${cat.slug}`} className="font-medium text-ink-text underline underline-offset-4 hover:text-accent">
                  Browse all {catName.toLowerCase().replace(/ posters?$/, "")} posters
                </Link>
                {!isSplit && (
                  <>
                    {" "}or see our{" "}
                    <Link href="/shop/split-poster" className="font-medium text-ink-text underline underline-offset-4 hover:text-accent">
                      split posters
                    </Link>
                  </>
                )}
                .
              </p>
            )}
          </div>
        </section>
        <FaqSection faqs={faqs} title="Good to know" />
      </div>
    </div>
  );
}
