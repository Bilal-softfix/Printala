import { getProducts } from "@/lib/server-api";
import { BASE_URL } from "@/lib/seo";

/* Google Merchant Center product feed (free listings + Shopping).
   Submit https://printala.in/feed.xml as a scheduled fetch in Merchant Center. */
export const revalidate = 3600;

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function GET() {
  // Real catalog only — never list fallback items (their ids can't be ordered).
  const products = (await getProducts({ limit: "1000" })) ?? [];

  const items = products
    .map((p) => {
      const isSplit = p.type === "split-poster";
      const title = /poster/i.test(p.name) ? p.name : `${p.name} ${isSplit ? "Split Poster" : "Poster"}`;
      const desc =
        p.description && p.description.trim().length > 40
          ? p.description
          : `${title} — premium wall art printed on 300gsm matte paper. ${
              isSplit ? `${p.panels ?? 3}-panel split set.` : "Available in multiple sizes."
            } Cash on Delivery available across India.`;
      const extra = (p.images ?? []).filter((i) => i && i !== p.image).slice(0, 10);
      return `    <item>
      <g:id>${esc(p._id)}</g:id>
      <g:title>${esc(title.slice(0, 150))}</g:title>
      <g:description>${esc(desc.slice(0, 5000))}</g:description>
      <g:link>${BASE_URL}/product/${p._id}</g:link>
      <g:image_link>${esc(p.image)}</g:image_link>${extra.map((i) => `\n      <g:additional_image_link>${esc(i)}</g:additional_image_link>`).join("")}
      <g:availability>${p.inStock ? "in_stock" : "out_of_stock"}</g:availability>
      <g:price>${(p.comparePrice && p.comparePrice > p.price ? p.comparePrice : p.price).toFixed(2)} INR</g:price>${
        p.comparePrice && p.comparePrice > p.price ? `\n      <g:sale_price>${p.price.toFixed(2)} INR</g:sale_price>` : ""
      }
      <g:brand>Printala</g:brand>
      <g:condition>new</g:condition>
      <g:identifier_exists>no</g:identifier_exists>
      <g:google_product_category>500044</g:google_product_category>
      <g:product_type>Posters &gt; ${esc(p.category)}</g:product_type>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
  <channel>
    <title>Printala — Premium Posters</title>
    <link>${BASE_URL}</link>
    <description>Anime, gaming, cricket, car and split posters from Printala.</description>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
