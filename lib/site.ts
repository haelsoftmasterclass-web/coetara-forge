import type { Metadata } from "next";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://forge.coetara.com").replace(/\/$/, "");

export const site = {
  name: "Coetara Forge",
  parent: "Coetara Technologies Limited",
  tagline: "Build What Comes Next.",
  positioning: "Where exceptional African talent becomes investable companies.",
  description:
    "Coetara Forge is the venture-building and commercialisation platform of Coetara Technologies Limited, turning promising African people, ideas and technologies into companies built for real markets.",
};

export const routes = {
  home: "/",
  about: "/about/",
  incubator: "/incubator/",
  howItWorks: "/how-it-works/",
  whoWeLookFor: "/who-were-looking-for/",
  ventureBuilding: "/venture-building/",
  launch: "/forge-launch/",
  commercial: "/forge-commercial/",
  partners: "/partners/",
  portfolio: "/portfolio/",
  insights: "/insights/",
  faq: "/faq/",
  apply: "/apply/",
  contact: "/contact/",
  privacy: "/legal/privacy/",
  terms: "/legal/terms/",
  disclaimer: "/legal/disclaimer/",
} as const;

/** Global CTA hierarchy: one primary, one secondary, everything else supporting. */
export const cta = {
  primary: { label: "Apply for Cohort 01", href: routes.apply, track: "apply_cta" },
  secondary: { label: "Partner With Forge", href: `${routes.contact}?type=partner`, track: "partner_cta" },
} as const;

export type NavItem = { label: string; href: string; note?: string };
export type NavGroup = { label: string; href?: string; items?: NavItem[] };

/** Desktop navigation groups the nine primary destinations so the bar stays calm. */
export const nav: NavGroup[] = [
  {
    label: "Forge",
    items: [
      { label: "About Forge", href: routes.about, note: "Why the execution layer matters" },
      { label: "How It Works", href: routes.howItWorks, note: "The journey and the five gates" },
      { label: "Venture Building", href: routes.ventureBuilding, note: "Two engines, one discipline" },
      { label: "Forge Launch", href: routes.launch, note: "From individual talent to new companies" },
      { label: "Forge Commercial", href: routes.commercial, note: "From under-used technology to ventures" },
    ],
  },
  {
    label: "Incubator",
    items: [
      { label: "10-Week Incubator", href: routes.incubator, note: "10 weeks. From potential to venture." },
      { label: "Who We're Looking For", href: routes.whoWeLookFor, note: "Builders, experts, researchers, operators" },
      { label: "FAQ", href: routes.faq, note: "Questions before you build" },
    ],
  },
  { label: "For Partners", href: routes.partners },
  { label: "Portfolio", href: routes.portfolio },
  { label: "Insights", href: routes.insights },
];

/** Flat list in the brief's order, used by the mobile drawer. */
export const primaryNav: NavItem[] = [
  { label: "Home", href: routes.home },
  { label: "About Forge", href: routes.about },
  { label: "10-Week Incubator", href: routes.incubator },
  { label: "How It Works", href: routes.howItWorks },
  { label: "Who We're Looking For", href: routes.whoWeLookFor },
  { label: "Venture Building", href: routes.ventureBuilding },
  { label: "For Partners", href: routes.partners },
  { label: "Portfolio", href: routes.portfolio },
  { label: "Insights", href: routes.insights },
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
      images: [{ url: "/og.png", width: 1200, height: 630, alt: "Coetara Forge" }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
  };
}
