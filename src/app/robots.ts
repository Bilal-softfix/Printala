import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/checkout", "/api/"],
      },
    ],
    sitemap: "https://printala.in/sitemap.xml",
  };
}