import { Product } from "@/types";

export function generateProductJsonLd(product: Product, baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    url: `${baseUrl}/product/${product._id}`,
    brand: {
      "@type": "Brand",
      name: "Printala",
    },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "USD",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: "Printala" },
    },
    category: product.category,
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
    logo: `${baseUrl}/logo.svg`,
    sameAs: [
      "https://instagram.com/printala",
      "https://twitter.com/printala",
      "https://pinterest.com/printala",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "hello@printala.com",
      contactType: "customer service",
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

export const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://printala.com";