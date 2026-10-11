import type { Metadata } from "next";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
export const NOINDEX = process.env.NEXT_PUBLIC_NOINDEX === "true";

export const site = {
  name: "Haelsoft EdTech",
  legacyName: "Haelsoft Masterclass",
  description:
    "Haelsoft EdTech is building a practical, career-focused learning platform for people across Africa, starting in Nigeria.",
};

export const routes = {
  home: "/",
  about: "/about",
  story: "/our-story",
  impact: "/our-impact",
  team: "/team",
  instructors: "/instructors",
  instructor: (slug: string) => `/instructors/${encodeURIComponent(slug)}`,
  partners: "/partners",
  testimonials: "/testimonials",
  contact: "/contact",
  privacy: "/privacy",
} as const;

export type EnquiryType = "general" | "learning" | "instructor" | "partnership" | "corporate";

/** Contact page link with the enquiry type (and optionally the subject) pre-selected. */
export function contactHref(type: EnquiryType, subject?: string) {
  const params = new URLSearchParams({ type });
  if (subject) params.set("subject", subject);
  return `${routes.contact}?${params.toString()}#enquiry`;
}

/**
 * Future destinations. The course catalogue and scholarship applications belong to
 * later phases, so until Django marks them open these CTAs lead to the homepage
 * sections that say so honestly, never to a fake page.
 */
export const comingSoonAnchors = {
  courses: "/#learning-areas",
  scholarships: "/#scholarships",
} as const;

export type NavItem = { label: string; href: string; note?: string };
export type NavGroup = { label: string; href?: string; items?: NavItem[] };

export const nav: NavGroup[] = [
  {
    label: "About",
    items: [
      { label: "About Haelsoft EdTech", href: routes.about, note: "What we are building and for whom" },
      { label: "Our Story", href: routes.story, note: "From Haelsoft Masterclass to Haelsoft EdTech" },
      { label: "Our Impact", href: routes.impact, note: "How we will measure and report outcomes" },
      { label: "Our Team", href: routes.team, note: "The people behind the platform" },
    ],
  },
  { label: "Instructors", href: routes.instructors },
  { label: "Partners", href: routes.partners },
  { label: "Testimonials", href: routes.testimonials },
  { label: "Contact", href: routes.contact },
];

/** Flat list for the mobile menu, in reading order. */
export const mobileNav: NavItem[] = [
  { label: "Home", href: routes.home },
  { label: "About Haelsoft EdTech", href: routes.about },
  { label: "Our Story", href: routes.story },
  { label: "Our Impact", href: routes.impact },
  { label: "Our Team", href: routes.team },
  { label: "Instructors", href: routes.instructors },
  { label: "Partners", href: routes.partners },
  { label: "Testimonials", href: routes.testimonials },
  { label: "Contact Us", href: routes.contact },
];

export function pageMeta({
  title,
  description,
  path,
  absoluteTitle = false,
}: {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
}): Metadata {
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: site.name,
      type: "website",
      locale: "en_GB",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: site.name }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
  };
}
