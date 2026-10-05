import type { Metadata, Viewport } from "next";
import { Archivo, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SITE_URL, site } from "@/lib/site";

const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", display: "swap" });
const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const FORM_ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT || "";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Coetara Forge | Venture Building & Startup Incubation in Africa",
    template: "%s | Coetara Forge",
  },
  description: site.description,
  applicationName: site.name,
  icons: { icon: "/icon.png", apple: "/apple-icon.png" },
  openGraph: { siteName: site.name, type: "website", locale: "en_GB", images: ["/og.png"] },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#ffffff", width: "device-width", initialScale: 1, viewportFit: "cover" };

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Coetara Forge",
  url: SITE_URL,
  logo: `${SITE_URL}/brand/forge-logo.png`,
  slogan: site.tagline,
  description: site.description,
  parentOrganization: { "@type": "Organization", name: site.parent },
  areaServed: { "@type": "Place", name: "Africa" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${archivo.variable} ${geist.variable} ${geistMono.variable}`}>
      <head>
        {GTM_ID ? (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`,
            }}
          />
        ) : null}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </head>
      <body data-form-endpoint={FORM_ENDPOINT}>
        {children}
        <script src="/forge.js" defer />
      </body>
    </html>
  );
}
