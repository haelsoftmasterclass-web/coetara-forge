import type { SiteSettings } from "./api/types";
import { comingSoonAnchors } from "./site";

export type Cta = { label: string; href: string; live: boolean };

/** "Explore Courses" and "Apply for a Scholarship" point at real destinations only once Django marks them open. */
export function primaryCtas(settings: SiteSettings): { courses: Cta; scholarships: Cta } {
  const coursesLive = settings.course_catalogue_status === "open" && Boolean(settings.course_catalogue_url);
  const scholarshipsLive = settings.scholarship_status === "open" && Boolean(settings.scholarship_url);
  return {
    courses: {
      label: "Explore Courses",
      href: coursesLive ? settings.course_catalogue_url : comingSoonAnchors.courses,
      live: coursesLive,
    },
    scholarships: {
      label: "Apply for a Scholarship",
      href: scholarshipsLive ? settings.scholarship_url : comingSoonAnchors.scholarships,
      live: scholarshipsLive,
    },
  };
}
