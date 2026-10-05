import type { MetadataRoute } from "next";
import { SITE_URL, routes } from "@/lib/site";
import { getInsights } from "@/lib/insights";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = Object.values(routes).map((p) => ({
    url: `${SITE_URL}${p}`,
    changeFrequency: "monthly" as const,
    priority: p === "/" ? 1 : p.startsWith("/legal") ? 0.2 : 0.8,
  }));
  const articles = getInsights()
    .filter((i) => i.status === "published")
    .map((i) => ({ url: `${SITE_URL}${routes.insights}${i.slug}/`, changeFrequency: "yearly" as const, priority: 0.6 }));
  return [...pages, ...articles];
}
