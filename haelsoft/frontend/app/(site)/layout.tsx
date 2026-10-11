import JsonLd from "@/components/JsonLd";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { getSiteSettings } from "@/lib/api/server";
import { SITE_URL, site } from "@/lib/site";

/** Shared chrome for every public page. Contact details and social links come from Django and are omitted when blank. */
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();
  const sameAs = [settings.linkedin_url, settings.x_url, settings.instagram_url, settings.facebook_url, settings.youtube_url].filter(Boolean);
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <SiteHeader settings={settings} />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <SiteFooter settings={settings} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          name: site.name,
          alternateName: site.legacyName,
          url: SITE_URL,
          logo: `${SITE_URL}/brand/haelsoft-logo.png`,
          description: site.description,
          ...(settings.contact_email ? { email: settings.contact_email } : {}),
          ...(sameAs.length ? { sameAs } : {}),
        }}
      />
    </>
  );
}
