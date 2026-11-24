import { FREE_SHIPPING_MIN, SHIPPING_FEE, rupees } from "./cart";
import { SITE } from "./site";

export type Faq = { q: string; a: string };

/* Only facts already stated elsewhere on the site — keep it that way. */
export const STORE_FAQ: Faq[] = [
  {
    q: "What paper are Printala posters printed on?",
    a: "Every poster is printed on thick 300gsm matte art paper with vivid colours and no glare, so it looks great on any wall.",
  },
  {
    q: "Which poster sizes are available?",
    a: "Single posters come in A4 (21 × 29.7 cm), A3 (29.7 × 42 cm), A2 (42 × 59.4 cm) and A1 (59.4 × 84.1 cm). Split posters come as multi-panel sets — the sizes are listed on each product page.",
  },
  {
    q: "What is a split poster?",
    a: "A split poster is one artwork printed across 2–5 separate panels. Hung side by side with small gaps, it creates a large gallery-style wall piece without a frame.",
  },
  {
    q: "How much is shipping?",
    a: `Shipping is free on orders of ${rupees(FREE_SHIPPING_MIN)} and above. Orders below that have a flat ${rupees(SHIPPING_FEE)} shipping charge. Posters ship rolled in a rigid cardboard tube.`,
  },
  {
    q: "Is Cash on Delivery available?",
    a: "Yes. You can pay with Cash on Delivery (COD) when your posters arrive.",
  },
  {
    q: "How do I track my order?",
    a: "After checkout you get an order number. Enter it on the Track Order page (printala.in/track) to see your order status anytime.",
  },
  {
    q: "How can I contact Printala?",
    a: `Call or WhatsApp us at ${SITE.phone} (${SITE.hours}), or use the contact form on our website.`,
  },
];

export const faqJsonLd = (faqs: Faq[]) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
});
