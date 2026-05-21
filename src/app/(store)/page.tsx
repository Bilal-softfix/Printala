import { Metadata } from "next";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import FeaturedGrid from "@/components/FeaturedGrid";
import SplitPosterShowcase from "@/components/SplitPosterShowcase";
import CategoryShowcase from "@/components/CategoryShowcase";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import WhyPrintala from "./WhyPrintala";

export const metadata: Metadata = {
  title: "Printala — Anime, Gaming, Cars & Split Posters | Premium Wall Art",
  description:
    "Shop premium posters — anime, gaming, supercars, cricket, movies, sports & multi-panel split posters. Thick matte paper, vibrant colors, fast delivery. Starting at $12.99.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <FeaturedGrid />
      <SplitPosterShowcase />
      <WhyPrintala />
      <CategoryShowcase />
      <Testimonials />
      <Newsletter />
    </>
  );
}
