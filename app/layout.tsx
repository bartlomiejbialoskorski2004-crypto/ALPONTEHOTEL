import type { Metadata } from "next";
import { siteUrl } from "@/lib/site";
import "./globals.css";

// Locale-invariant, site-wide metadata. metadataBase lives here as the single
// source of truth; the [locale] layout adds per-language title/description/OG.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Al Ponte",
  authors: [{ name: "Al Ponte Albergo SAGL" }],
  formatDetection: { telephone: true, email: true, address: true },
  icons: { icon: "/icon.png", apple: "/icon.png" },
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
