import { Testimonial } from "@/types";
import { TESTIMONIALS } from "./data";

/* ── Real customer reviews ───────────────────────────────────────────────
   Paste genuine reviews from your Flipkart / Amazon / Meesho listings here.
   Rules (consumer law + Google guidelines):
   - Only real reviews of YOUR products, copied word-for-word (trim, don't edit meaning).
   - Always keep the source; first name + last initial or city is enough.
   - Don't add star-rating structured data for these — Google ignores/penalises
     reviews copied from other sites. They're for shoppers' trust only.
   As soon as REVIEWS has entries, the homepage shows them instead of the
   placeholder testimonials. */

export type Marketplace = {
  name: "Flipkart" | "Amazon" | "Meesho" | string;
  url: string; // your store / brand page
  rating?: number; // e.g. 4.3 — copy exactly as shown on the marketplace
  ratingCount?: number;
};

export type Review = {
  name: string; // "Rahul S."
  city?: string;
  rating: number; // 1–5
  text: string;
  source: Marketplace["name"];
  date?: string; // ISO
};

export const MARKETPLACES: Marketplace[] = [
  // { name: "Flipkart", url: "https://www.flipkart.com/...", rating: 4.3, ratingCount: 120 },
  // { name: "Amazon", url: "https://www.amazon.in/stores/...", rating: 4.2, ratingCount: 80 },
];

export const REVIEWS: Review[] = [
  // { name: "Rahul S.", city: "Pune", rating: 5, text: "Print quality is amazing…", source: "Flipkart", date: "2026-10-02" },
];

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

/** Reviews for the homepage: real ones when available, else placeholders. */
export function homepageReviews(): (Testimonial & { source?: string })[] {
  if (!REVIEWS.length) return TESTIMONIALS;
  return REVIEWS.map((r, i) => ({
    id: `r${i}`,
    name: r.name,
    location: [r.city, `Review on ${r.source}`].filter(Boolean).join(" · "),
    text: r.text,
    rating: r.rating,
    avatar: initials(r.name),
    source: r.source,
  }));
}
