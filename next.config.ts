import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
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