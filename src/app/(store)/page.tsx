import { Metadata } from "next";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import FeaturedGrid from "@/components/FeaturedGrid";
import SplitPosterShowcase from "@/components/SplitPosterShowcase";
import CategoryShowcase from "@/components/CategoryShowcase";
import Testimonials from "@/components/Testimonials";
import ClosingStatement from "@/components/ClosingStatement";
import WhyPrintala from "./WhyPrintala";
import { getCategories, getProducts } from "@/lib/server-api";
import { CATEGORIES, PRODUCTS } from "@/lib/data";
import { Category, Product } from "@/types";

export const revalidate = 300;
export const metadata: Metadata = {
  title: {
    absolute: "Printala — Anime, Gaming, Cars & Split Posters | Premium Wall Art",
  },
  description:
    "Shop premium posters — anime, gaming, supercars, cricket, movies, sports & multi-panel split posters. Thick matte paper, vibrant colors, fast delivery. Starting at ₹149. COD available.",
  alternates: { canonical: "/" },
};

const orFallback = (list: Product[] | null, fallback: () => Product[]) =>
  list && list.length > 0 ? list : fallback();

export default async function HomePage() {
  const [featured, splits, apiCategories] = await Promise.all([
    getProducts({ featured: "true", type: "poster", limit: "6" }),
    getProducts({ type: "split-poster", limit: "3" }),
    getCategories<{ name: string; count: number }[]>(),
  ]);

  const categories: Category[] = CATEGORIES.map((c) => ({
    ...c,
    count: apiCategories?.find((a) => a.name === c.slug)?.count ?? c.count,
  }));

  return (
    <>
      <Hero />
      <Marquee />
      <CategoryShowcase categories={categories} />
      <FeaturedGrid
        products={orFallback(featured, () =>
          PRODUCTS.filter((p) => p.featured && p.type === "poster").slice(0, 6),
        )}
      />
      <SplitPosterShowcase
        sets={orFallback(splits, () =>
          PRODUCTS.filter((p) => p.type === "split-poster").slice(0, 3),
        )}
      />
      <WhyPrintala />
      <Testimonials />
      <ClosingStatement />
    </>
  );
}
