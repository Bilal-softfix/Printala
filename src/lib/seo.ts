import { SITE } from "./site";
import { CATEGORIES } from "./categories";
import { Product } from "@/types";

const abs = (url: string, baseUrl: string) =>
  url.startsWith("http") ? url : `${baseUrl}${url}`;

export function generateProductJsonLd(product: Product, baseUrl: string) {
  const prices = product.sizes.map((s) => product.price + s.priceModifier);
  const url = `${baseUrl}/product/${product._id}`;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product._id,
    image: Array.from(new Set([product.image, ...(product.images ?? [])]))
      .filter(Boolean)
      .map((i) => abs(i, baseUrl)),
    url,
    brand: { "@type": "Brand", name: "Printala" },
    category: product.category,
    offers: {
      "@type": "AggregateOffer",
      url,
      priceCurrency: "INR",
      lowPrice: Math.min(...prices, product.price),
      highPrice: Math.max(...prices, product.price),
      offerCount: product.sizes.length || 1,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: "Printala" },
    },
  };
}

export function generateWebsiteJsonLd(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Printala",
    url: baseUrl,
    description: "Premium art posters for design lovers. Museum-quality prints on archival paper.",
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${baseUrl}/shop?search={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateOrganizationJsonLd(baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Printala",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    ...(SITE.socials.length && { sameAs: SITE.socials.map((s) => s.href) }),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: SITE.phone,
      contactType: "customer service",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi"],
    },
  };
}

export function generateBreadcrumbJsonLd(
  items: { name: string; url: string }[],
  baseUrl: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${baseUrl}${item.url}`,
    })),
  };
}

export const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://printala.in";
export function productBreadcrumbs(product: Product) {
  return [
    { name: "Home", url: "/" },
    { name: "Shop", url: "/shop" },
    (() => {
      const cat = CATEGORIES.find((c) => c.slug === product.category);
      return cat
        ? { name: cat.name, url: `/shop/${cat.slug}` }
        : {
            name: product.category.charAt(0).toUpperCase() + product.category.slice(1),
            url: `/shop?category=${product.category}`,
          };
    })(),
    { name: product.name, url: `/product/${product._id}` },
  ];
}
