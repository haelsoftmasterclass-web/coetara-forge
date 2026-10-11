import type { MetadataRoute } from "next";
import { apiGet } from "@/lib/api/server";
import type { InstructorSummary, Paginated } from "@/lib/api/types";
import { SITE_URL, routes } from "@/lib/site";

export const revalidate = 3600;

const STATIC_PAGES: { path: string; priority: number }[] = [
  { path: routes.home, priority: 1 },
  { path: routes.about, priority: 0.8 },
  { path: routes.story, priority: 0.6 },
  { path: routes.impact, priority: 0.6 },
  { path: routes.team, priority: 0.6 },
  { path: routes.instructors, priority: 0.8 },
  { path: routes.partners, priority: 0.6 },
  { path: routes.testimonials, priority: 0.5 },
  { path: routes.contact, priority: 0.7 },
  { path: routes.privacy, priority: 0.2 },
];

/** Published instructor profiles, following API pagination (capped so a fault can't loop forever). */
async function instructorSlugs(): Promise<string[]> {
  const slugs: string[] = [];
  for (let page = 1; page <= 20; page++) {
    const result = await apiGet<Paginated<InstructorSummary>>("/instructors/", { page, page_size: 50 });
    if (!result.ok) break;
    slugs.push(...result.data.results.map((i) => i.slug));
    if (!result.data.next) break;
  }
  return slugs;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = STATIC_PAGES.map(({ path, priority }) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    changeFrequency: "weekly" as const,
    priority,
  }));
  const profiles = (await instructorSlugs()).map((slug) => ({
    url: `${SITE_URL}${routes.instructor(slug)}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  return [...pages, ...profiles];
}
