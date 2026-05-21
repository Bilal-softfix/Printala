import type { Metadata, Viewport } from "next";
import { Syne, Inter, Bangers } from "next/font/google";
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

const bangers = Bangers({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bangers",
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
      "Printala — Anime, Gaming, Cars & Split Posters | Premium Wall Art",
    template: "%s | Printala",
  },
  description:
    "India ka apna premium poster shop. Anime, gaming, supercars, cricket, Bollywood & split posters. 300gsm matte paper, ₹149 se start, all India delivery, COD available.",
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
  ],
  authors: [{ name: "Printala" }],
  creator: "Printala",
  publisher: "Printala",
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Printala",
    title: "Printala — Anime, Gaming, Cars & Split Posters",
    description: "Premium posters for anime fans, gamers, car lovers & more.",
    images: [
      { url: "/og-image.jpg", width: 1200, height: 630, alt: "Printala" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Printala — Premium Posters & Split Wall Art",
    description: "Anime, gaming, cars, cricket & split posters.",
    creator: "@printala",
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
    <html
      lang="en"
      className={`${syne.variable} ${inter.variable} ${bangers.variable}`}
    >
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
              background: "#2F3542",
              color: "#FAFAFA",
              border: "3px solid #2F3542",
              borderRadius: "1rem",
              fontWeight: 600,
              boxShadow: "4px 4px 0 #2F3542",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
