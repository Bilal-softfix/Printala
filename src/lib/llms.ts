import { CATEGORIES } from "./categories";
import { POSTS } from "./blog";
import { STORE_FAQ } from "./faq";
import { FREE_SHIPPING_MIN, SHIPPING_FEE } from "./cart";
import { BASE_URL } from "./seo";
import { SITE } from "./site";
import { getProducts } from "./server-api";
import { Product } from "@/types";

/* Plain-Markdown descriptions of the store for AI assistants (llms.txt standard).
   Built from live data so prices and products stay current. */

const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const ABOUT = `# Printala

> Printala (${BASE_URL}) is an Indian online store for premium wall posters: anime, gaming, cricket, cars & bikes, movies, football and multi-panel split posters. Posters are printed on 300gsm matte art paper, ship rolled in a rigid tube across India, and support Cash on Delivery.

## Key facts
- Country: India (ships across India), prices in INR
- Paper: 300gsm matte art paper, no glare
- Single poster sizes: A4 (21×29.7 cm), A3 (29.7×42 cm), A2 (42×59.4 cm), A1 (59.4×84.1 cm)
- Split posters: one artwork across 2–5 panels
- Shipping: free on orders of ${inr(FREE_SHIPPING_MIN)}+, otherwise ${inr(SHIPPING_FEE)}
- Payment: Cash on Delivery (COD)
- Order tracking: ${BASE_URL}/track (with order number)
- Contact: phone/WhatsApp ${SITE.phone}, ${SITE.hours}`;

const productUrl = (p: Product) => `${BASE_URL}/product/${p._id}`;

const priceRange = (p: Product) => {
  const prices = (p.sizes?.length ? p.sizes : [{ priceModifier: 0 }]).map((s) => p.price + s.priceModifier);
  const lo = Math.min(...prices);
  const hi = Math.max(...prices);
  return lo === hi ? inr(lo) : `${inr(lo)}–${inr(hi)}`;
};

async function catalog() {
  return ((await getProducts({ limit: "1000" })) ?? []).filter((p) => p.inStock);
}

/** Short index: what the store is + where to find things. */
export async function llmsTxt() {
  const products = await catalog();
  return `${ABOUT}

## Collections
${CATEGORIES.map((c) => `- [${c.name.replace(/ posters?$/i, "")} posters](${BASE_URL}/shop/${c.slug}): ${c.description}`).join("\n")}
- [All posters](${BASE_URL}/shop)

## Products (in stock)
${products.map((p) => `- [${p.name}](${productUrl(p)}): ${p.type === "split-poster" ? `${p.panels ?? 3}-panel split poster` : "poster"}, ${p.category}, ${priceRange(p)}`).join("\n")}

## Guides
${POSTS.map((p) => `- [${p.title}](${BASE_URL}/blog/${p.slug}): ${p.description}`).join("\n")}

## Help
- [Track your order](${BASE_URL}/track)
- [Contact](${BASE_URL}/contact)
- [About Printala](${BASE_URL}/about)

## Optional
- [Full catalog with sizes and prices](${BASE_URL}/llms-full.txt)
- [Product feed (XML)](${BASE_URL}/feed.xml)
- [Sitemap](${BASE_URL}/sitemap.xml)
`;
}

/** Full detail: every product with sizes/prices, plus FAQ. */
export async function llmsFullTxt() {
  const products = await catalog();
  const byCat = new Map<string, Product[]>();
  for (const p of products) byCat.set(p.category, [...(byCat.get(p.category) ?? []), p]);

  const sections = [...byCat.entries()].map(([cat, list]) => {
    const name = (CATEGORIES.find((c) => c.slug === cat)?.name ?? cat).replace(/ posters?$/i, "");
    return `## ${name} posters

${list
  .map(
    (p) => `### ${p.name}
- URL: ${productUrl(p)}
- Type: ${p.type === "split-poster" ? `Split poster, ${p.panels ?? 3} panels` : "Single poster"}
- Price: ${priceRange(p)}${p.comparePrice && p.comparePrice > p.price ? ` (was ${inr(p.comparePrice)})` : ""}
- Sizes: ${(p.sizes ?? []).map((s) => `${s.label} ${s.dimensions} — ${inr(p.price + s.priceModifier)}`).join("; ") || "see product page"}
${p.tags?.length ? `- Tags: ${p.tags.join(", ")}\n` : ""}${p.description && p.description.trim() !== p.name.trim() ? `- Description: ${p.description.trim()}\n` : ""}`,
  )
  .join("\n")}`;
  });

  return `${ABOUT}

${sections.join("\n\n")}

## Frequently asked questions
${STORE_FAQ.map((f) => `### ${f.q}\n${f.a}`).join("\n\n")}
`;
}
