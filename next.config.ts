import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const nextConfig: NextConfig = {
  // Old filter URLs → category landing pages (S6).
  async redirects() {
    return [
      {
        source: "/shop",
        has: [{ type: "query", key: "category", value: "(?<cat>[a-z-]+)" }],
        destination: "/shop/:cat",
        permanent: true,
      },
      // Common ways people type the tracking URL.
      ...["/track-order", "/order-tracking", "/trackorder", "/orders/track"].map((source) => ({
        source,
        destination: "/track",
        permanent: true,
      })),
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" }, // fallback catalog
      { protocol: "https", hostname: "printala-api.onrender.com", pathname: "/uploads/**" },
      // Local API uploads + insecure hosts only while developing (P3).
      ...(isDev
        ? [
            { protocol: "http" as const, hostname: "printala-api.onrender.com", pathname: "/uploads/**" },
            { protocol: "http" as const, hostname: "localhost", port: "5000", pathname: "/uploads/**" },
            { protocol: "http" as const, hostname: "127.0.0.1", port: "5000", pathname: "/uploads/**" },
          ]
        : []),
    ],
  },
};

export default nextConfig;