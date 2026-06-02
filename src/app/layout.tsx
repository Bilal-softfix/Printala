import type { Metadata, Viewport } from "next";
import { Syne, Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import {
  generateWebsiteJsonLd,
  generateOrganizationJsonLd,
  BASE_URL,
} from "@/lib/seo";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  preload: true,
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

export const viewport: Viewport = {
  themeColor: "#E10F80",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default:
      "Printala — Premium Posters, Split Wall Art & More | Free Shipping in India",
    template: "%s | Printala",
  },
  description:
    "Shop premium posters and split wall art online. Anime, gaming, supercars, cricket, Bollywood & more. 300gsm matte paper, vivid colors, fast delivery across India. Starting at ₹149. COD available.",
  keywords: [
    "anime posters india",
    "gaming posters",
    "cricket posters india",
    "car posters",
    "split posters india",
    "wall art india",
    "printala",
    "premium posters india",
    "buy posters online india",
    "poster shop india",
  ],
  authors: [{ name: "Printala" }],
  creator: "Printala",
  publisher: "Printala",
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: BASE_URL,
    siteName: "Printala",
    title: "Printala — Premium Posters & Split Wall Art",
    description:
      "India's premium poster store. Anime, gaming, supercars, cricket & more.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Printala — Premium Posters",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Printala — Premium Posters & Split Wall Art",
    description:
      "India's premium poster store. Anime, gaming, cars, cricket & split posters.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: { canonical: BASE_URL },
  icons: { icon: "/favicon.ico", apple: "/apple-touch-icon.png" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${syne.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateWebsiteJsonLd(BASE_URL)),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateOrganizationJsonLd(BASE_URL)),
          }}
        />
      </head>
      <body>
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#111827",
              color: "#FAFAFA",
              borderRadius: "0.75rem",
              fontWeight: 600,
              fontSize: "0.875rem",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
