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
    </>
  );
}
