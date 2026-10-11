import type { Metadata, Viewport } from "next";
import { Archivo, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NOINDEX, SITE_URL, site } from "@/lib/site";

const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", display: "swap" });
const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Haelsoft EdTech | Practical, career-focused learning for Africa",
    template: "%s | Haelsoft EdTech",
  },
  description: site.description,
  applicationName: site.name,
  openGraph: { siteName: site.name, type: "website", locale: "en_GB", images: ["/og.png"] },
  twitter: { card: "summary_large_image" },
  robots: NOINDEX ? { index: false, follow: false } : undefined,
};

export const viewport: Viewport = { themeColor: "#ffffff", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${archivo.variable} ${geist.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
