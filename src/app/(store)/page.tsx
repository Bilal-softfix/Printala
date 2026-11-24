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
import Link from "next/link";
import FaqSection from "@/components/FaqSection";
import { STORE_FAQ } from "@/lib/faq";

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
      <section className="border-t border-black/10 bg-paper py-24 text-ink-text md:py-32">
        <div className="container-main grid gap-16 lg:grid-cols-[1fr_1.4fr] lg:gap-24">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-[-0.03em] md:text-4xl">
              Buy posters online in India
            </h2>
            <p className="mt-6 text-[15px] leading-relaxed text-ink-text/75">
              Printala makes premium wall posters for fans — from{" "}
              <Link href="/shop/anime" className="underline underline-offset-4 hover:text-accent">anime posters</Link>{" "}
              like Naruto, One Piece and Demon Slayer to{" "}
              <Link href="/shop/gaming" className="underline underline-offset-4 hover:text-accent">gaming posters</Link>,{" "}
              <Link href="/shop/cricket" className="underline underline-offset-4 hover:text-accent">cricket posters</Link>,{" "}
              <Link href="/shop/cars" className="underline underline-offset-4 hover:text-accent">car &amp; bike posters</Link>,{" "}
              <Link href="/shop/football" className="underline underline-offset-4 hover:text-accent">football posters</Link> and{" "}
              <Link href="/shop/bollywood" className="underline underline-offset-4 hover:text-accent">movie posters</Link>.
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-text/75">
              Want a bigger statement? Our{" "}
              <Link href="/shop/split-poster" className="underline underline-offset-4 hover:text-accent">split posters</Link>{" "}
              spread one artwork across multiple panels for a full-wall look. Every print is on thick 300gsm matte
              paper, ships in a rigid tube, and can be paid for with Cash on Delivery.
            </p>
          </div>
          <FaqSection faqs={STORE_FAQ} />
        </div>
      </section>
      <ClosingStatement />
    </>
  );
}
