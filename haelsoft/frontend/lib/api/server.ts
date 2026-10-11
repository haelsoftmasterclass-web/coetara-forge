/**
 * The single server-side gateway to the Django API. Pages and components call
 * these functions; nothing else in the app calls fetch() for content.
 */
import { cache } from "react";
import { apiBaseUrl, REVALIDATE_SECONDS } from "./config";
import type {
  ApiResult,
  ContentBlock,
  ExpertiseArea,
  ImpactMetric,
  InstructorDetail,
  InstructorSummary,
  Paginated,
  Partner,
  SiteSettings,
  TeamMember,
  Testimonial,
} from "./types";

const TIMEOUT_MS = 8000;

export async function apiGet<T>(path: string, params?: Record<string, string | number | undefined>): Promise<ApiResult<T>> {
  const url = new URL(`${apiBaseUrl()}/api/v1${path}`);
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  }
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (res.status === 404) return { ok: false, kind: "not_found", status: 404 };
    if (!res.ok) return { ok: false, kind: "server", status: res.status };
    return { ok: true, data: (await res.json()) as T };
  } catch {
    return { ok: false, kind: "network", status: 0 };
  }
}

/** Safe defaults used when site settings cannot be loaded: every optional detail stays hidden. */
export const FALLBACK_SETTINGS: SiteSettings = {
  site_name: "Haelsoft EdTech",
  tagline: "",
  contact_email: "",
  contact_phone: "",
  contact_address: "",
  contact_response_note: "",
  linkedin_url: "",
  x_url: "",
  instagram_url: "",
  facebook_url: "",
  youtube_url: "",
  course_catalogue_status: "coming_soon",
  course_catalogue_url: "",
  scholarship_status: "not_announced",
  scholarship_headline: "",
  scholarship_summary: "",
  scholarship_url: "",
  markets: [],
};

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const result = await apiGet<SiteSettings>("/site-settings/");
  return result.ok ? result.data : FALLBACK_SETTINGS;
});

export const getInstructors = cache(
  (opts: { search?: string; expertise?: string; page?: number; featured?: boolean; pageSize?: number } = {}) =>
    apiGet<Paginated<InstructorSummary>>("/instructors/", {
      search: opts.search,
      expertise: opts.expertise,
      page: opts.page && opts.page > 1 ? opts.page : undefined,
      featured: opts.featured ? "true" : undefined,
      page_size: opts.pageSize,
    }),
);

export const getInstructor = cache((slug: string) =>
  apiGet<InstructorDetail>(`/instructors/${encodeURIComponent(slug)}/`),
);

export const getExpertiseAreas = cache(() => apiGet<ExpertiseArea[]>("/expertise-areas/"));

export const getTeam = cache(() => apiGet<Paginated<TeamMember>>("/team/", { page_size: 50 }));

export const getPartners = cache(() => apiGet<Paginated<Partner>>("/partners/", { page_size: 50 }));

export const getTestimonials = cache((opts: { featured?: boolean } = {}) =>
  apiGet<Paginated<Testimonial>>("/testimonials/", { page_size: 50, featured: opts.featured ? "true" : undefined }),
);

export const getImpactMetrics = cache(() => apiGet<ImpactMetric[]>("/impact-metrics/"));

export const getContentBlocks = cache((page: "home" | "about" | "our-story" | "our-impact") =>
  apiGet<ContentBlock[]>(`/content/${page}/`),
);
