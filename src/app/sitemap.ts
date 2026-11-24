import type { MetadataRoute } from "next";
import { PRODUCTS } from "@/lib/data";
import { CATEGORIES } from "@/lib/categories";
import { POSTS } from "@/lib/blog";
import { BASE_URL } from "@/lib/seo";
import { getProducts } from "@/lib/server-api";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = (await getProducts({ limit: "1000" })) || PRODUCTS;

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/shop`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/contact`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${BASE_URL}/shop/${c.slug}`,
    changeFrequency: "daily",
    priority: 0.85,
  }));

  const blogPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/blog`, changeFrequency: "weekly", priority: 0.7 },
    ...POSTS.map((p) => ({
      url: `${BASE_URL}/blog/${p.slug}`,
      lastModified: new Date(p.updated ?? p.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE_URL}/product/${p._id}`,
    lastModified: p.createdAt ? new Date(p.createdAt) : undefined,
    changeFrequency: "weekly",
    priority: 0.8,
    images: [p.image],
  }));

  return [...staticPages, ...categoryPages, ...blogPages, ...productPages];
}
