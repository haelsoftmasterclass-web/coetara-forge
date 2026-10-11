/** Payload types for the Django API (see the serializers in backend/apps). Keep in step with the backend. */

export type LaunchStatus = "not_announced" | "coming_soon" | "open" | "closed";

export type Market = {
  country_code: string;
  name: string;
  status: "planned" | "active" | "paused";
  is_home_market: boolean;
};

export type SiteSettings = {
  site_name: string;
  tagline: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  contact_response_note: string;
  linkedin_url: string;
  x_url: string;
  instagram_url: string;
  facebook_url: string;
  youtube_url: string;
  course_catalogue_status: LaunchStatus;
  course_catalogue_url: string;
  scholarship_status: LaunchStatus;
  scholarship_headline: string;
  scholarship_summary: string;
  scholarship_url: string;
  markets: Market[];
};

export type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type ExpertiseArea = { name: string; slug: string };

export type InstructorSummary = {
  slug: string;
  name: string;
  headline: string;
  short_bio: string;
  expertise: ExpertiseArea[];
  photo: string | null;
  photo_alt: string;
  is_featured: boolean;
};

export type InstructorDetail = InstructorSummary & {
  biography: string;
  qualifications: string[];
  linkedin_url: string;
  website_url: string;
  courses: { title: string; slug: string }[];
};

export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  is_leadership: boolean;
  bio: string;
  photo: string | null;
  photo_alt: string;
  linkedin_url: string;
  website_url: string;
};

export type Partner = {
  slug: string;
  name: string;
  category: string;
  category_label: string;
  description: string;
  website_url: string;
  logo: string | null;
  logo_alt: string;
};

export type Testimonial = {
  id: number;
  learner_name: string;
  quote: string;
  programme: string;
  role: string;
  location: string;
  photo: string | null;
  photo_alt: string;
  is_featured: boolean;
};

export type ImpactMetric = {
  id: number;
  area: "access" | "skills" | "engagement" | "completion" | "scholarships" | "careers";
  label: string;
  value: string;
  description: string;
  period_start: string | null;
  period_end: string | null;
  as_of: string;
  source: string;
  methodology: string;
};

export type ContentBlock = { id: number; page: string; eyebrow: string; heading: string; body: string };

export type EnquiryPayload = {
  enquiry_type: "general" | "learning" | "instructor" | "partnership" | "corporate";
  name: string;
  email: string;
  phone: string;
  country: string;
  subject: string;
  message: string;
  consent: boolean;
  source_page: string;
  company_website: string;
};

/** Result of any API call: data, or a typed failure the page can render honestly. */
export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; kind: "not_found" | "network" | "server"; status: number };
