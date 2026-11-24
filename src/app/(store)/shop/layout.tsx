import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All Posters",
  description:
    "Browse anime, gaming, cricket, cars, movie and multi-panel split posters. 300gsm matte prints, fast delivery across India, COD available.",
  alternates: { canonical: "/shop" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
