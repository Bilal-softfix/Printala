import type { NextConfig } from "next";

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
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
     remotePatterns: [
      
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      
      {
        protocol: "https",
        hostname: "printala-api.onrender.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        // pathname: "/uploads/**",
      },
       {
        protocol: 'http',
        hostname: 'printala-api.onrender.com',
        pathname: '/uploads/**',
      },
      
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "5000",
        pathname: "/uploads/**",
      },
    ],
  },
};

export default nextConfig;