import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { CATEGORIES } from "@/lib/categories";
import { PRODUCTS } from "@/lib/data";
import { BASE_URL, generateBreadcrumbJsonLd } from "@/lib/seo";
import { getProducts } from "@/lib/server-api";

export const revalidate = 300;
export const dynamicParams = false;

type Props = { params: Promise<{ category: string }> };

/* SEO copy per category: H1 keyword phrase + short unique intro. */
const COPY: Record<string, { h1: string; title: string; intro: string }> = {
  anime: {
    h1: "Anime posters",
    title: "Anime Posters Online in India",
    intro:
      "Naruto, Demon Slayer, Jujutsu Kaisen, One Piece, Dragon Ball and more — printed on thick matte paper with deep blacks and vivid colour. Pick a size from A4 for a desk wall to A1 for a full statement piece.",
  },
  gaming: {
    h1: "Gaming posters",
    title: "Gaming Posters for Your Setup",
    intro:
      "Level up your setup with posters from GTA, Valorant, God of War, BGMI, Minecraft and more. Sharp, glare-free matte prints that look great behind a monitor or across a bedroom wall.",
  },
  cricket: {
    h1: "Cricket posters",
    title: "Cricket Posters — Dhoni, Kohli & More",
    intro:
      "Celebrate the legends of Indian cricket — Dhoni, Kohli, Sachin, IPL nights and World Cup moments. Premium matte prints made for fans, delivered across India with Cash on Delivery.",
  },
  cars: {
    h1: "Car & bike posters",
    title: "Car & Bike Posters — Supercars, JDM, F1",
    intro:
      "Supercars, JDM icons, F1, Thar and Royal Enfield — wall art for everyone who loves machines. Rich colour on 300gsm matte paper, in sizes from A4 to A1.",
  },
  bollywood: {
    h1: "Movie posters",
    title: "Movie & Bollywood Posters",
    intro:
      "Iconic dialogues, retro Bollywood, KGF, Pushpa and more cinema favourites. Bring the big screen home with bold, high-detail matte prints.",
  },
  football: {
    h1: "Football posters",
    title: "Football Posters — Messi, Ronaldo & More",
    intro:
      "Messi, Ronaldo, Mbappé and Champions League nights — football wall art for every fan. Printed on thick matte paper and shipped in a rigid tube.",
  },
  "anime-girls": {
    h1: "Anime girl posters",
    title: "Anime Girl & Aesthetic Anime Posters",
    intro:
      "Aesthetic anime art and fan-favourite characters like Zero Two, printed with soft gradients and crisp line work on premium matte paper.",
  },
  "split-poster": {
    h1: "Split posters",
    title: "Split Posters — 3 & 5 Panel Wall Art",
    intro:
      "Multi-panel split posters turn one artwork into a full-wall installation. Choose 3- or 5-panel sets that line up perfectly for a gallery look without a frame.",
  },
};

async function loadProducts(category: string) {
  const isSplit = category === "split-poster";
  const query: Record<string, string> = isSplit
    ? { type: "split-poster", limit: "50" }
    : { category, limit: "50" };
  return (
    (await getProducts(query)) ??
    PRODUCTS.filter((p) => (isSplit ? p.type === "split-poster" : p.category === category))
  );
}

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = CATEGORIES.find((c) => c.slug === category);
  if (!cat) return {};
  const copy = COPY[category];
  const products = await loadProducts(category);
  return {
    // Keep empty collections out of the index until they have products.
    ...(products.length === 0 && { robots: { index: false, follow: true } }),
    title: copy?.title ?? `${cat.name} Posters`,
    description: copy?.intro.slice(0, 155) ?? cat.description,
    alternates: { canonical: `/shop/${category}` },
    openGraph: { images: [{ url: cat.image, alt: `${cat.name} posters` }] },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = CATEGORIES.find((c) => c.slug === category);
  if (!cat) notFound();

  const products = await loadProducts(category);

  const copy = COPY[category];
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Shop", url: "/shop" },
    { name: cat.name, url: `/shop/${category}` },
  ];

  return (
    <div className="min-h-screen bg-paper pt-28 pb-24 text-ink-text md:pt-36">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbJsonLd(breadcrumbs, BASE_URL)),
        }}
      />
      <div className="container-main">
        <nav aria-label="Breadcrumb" className="mb-8 text-xs text-ink-text/70">
          <Link href="/" className="hover:text-ink-text">Home</Link>
          <span aria-hidden="true"> / </span>
          <Link href="/shop" className="hover:text-ink-text">Shop</Link>
          <span aria-hidden="true"> / </span>
          <span aria-current="page" className="text-ink-text">{cat.name}</span>
        </nav>

        <SectionHeading
          as="h1"
          index="—"
          eyebrow={`${products.length} ${products.length === 1 ? "poster" : "posters"}`}
          lines={[`${copy?.h1 ?? cat.name}.`]}
        />
        <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-ink-text/75">
          {copy?.intro ?? cat.description}
        </p>

        <ul className="mt-8 flex flex-wrap gap-2" aria-label="Other collections">
          {CATEGORIES.filter((c) => c.slug !== category).map((c) => (
            <li key={c.slug}>
              <Link href={`/shop/${c.slug}`} className="chip">
                {c.name}
              </Link>
            </li>
          ))}
        </ul>

        {products.length === 0 ? (
          <div className="py-24">
            <p className="font-display text-3xl font-bold uppercase tracking-[-0.04em]">
              New designs coming soon.
            </p>
            <Link href="/shop" className="btn-ink mt-8">
              Browse all posters
            </Link>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 md:gap-y-14 xl:grid-cols-4">
            {products.map((product, i) => (
              <ProductCard key={product._id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
