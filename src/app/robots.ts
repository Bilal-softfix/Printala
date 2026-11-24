import type { MetadataRoute } from "next";
import { BASE_URL } from "@/lib/seo";

const PRIVATE = ["/admin", "/cart", "/checkout", "/order/", "/api/"];

/* AI assistants/search crawlers we explicitly welcome, so Printala can be
   found and recommended in ChatGPT, Claude, Perplexity, Gemini, Copilot etc. */
const AI_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "CCBot",
  "meta-externalagent",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      { userAgent: AI_BOTS, allow: ["/", "/llms.txt", "/llms-full.txt"], disallow: PRIVATE },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
