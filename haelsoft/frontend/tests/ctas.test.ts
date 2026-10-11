import { FALLBACK_SETTINGS } from "@/lib/api/server";
import { primaryCtas } from "@/lib/ctas";

describe("primaryCtas", () => {
  it("points at honest coming-soon sections while destinations are not open", () => {
    const { courses, scholarships } = primaryCtas(FALLBACK_SETTINGS);
    expect(courses).toEqual({ label: "Explore Courses", href: "/#learning-areas", live: false });
    expect(scholarships).toEqual({ label: "Apply for a Scholarship", href: "/#scholarships", live: false });
  });

  it("uses the real URL only when Django marks the destination open", () => {
    const { scholarships } = primaryCtas({
      ...FALLBACK_SETTINGS,
      scholarship_status: "open",
      scholarship_url: "https://apply.example.org",
    });
    expect(scholarships).toMatchObject({ href: "https://apply.example.org", live: true });
  });

  it("never links to an open status without a URL", () => {
    const { courses } = primaryCtas({ ...FALLBACK_SETTINGS, course_catalogue_status: "open", course_catalogue_url: "" });
    expect(courses.live).toBe(false);
  });
});
