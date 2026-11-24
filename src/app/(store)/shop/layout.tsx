import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Shop All Posters | Printala", template: "%s | Printala" },
  description:
    "Browse anime, gaming, cricket, cars, movie and multi-panel split posters. 300gsm matte prints, fast delivery across India, COD available.",
  alternates: { canonical: "/shop" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
