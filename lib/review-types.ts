export const STATUSES = ["new", "reviewing", "shortlisted", "interview", "accepted", "declined", "withdrawn"] as const;
export type Status = (typeof STATUSES)[number];

export const STATUS_LABEL: Record<Status, string> = {
  new: "New",
  reviewing: "Reviewing",
  shortlisted: "Shortlisted",
  interview: "Interview",
  accepted: "Accepted",
  declined: "Declined",
  withdrawn: "Withdrawn",
};

/** The nine "What we look for" criteria from the Who We're Looking For page, each scored 1–5. */
export const CRITERIA = [
  { key: "capability", label: "Capability" },
  { key: "curiosity", label: "Curiosity" },
  { key: "problem_solving", label: "Problem-solving ability" },
  { key: "domain", label: "Domain understanding" },
  { key: "commercial", label: "Commercial thinking" },
  { key: "execution", label: "Execution ability" },
  { key: "adaptability", label: "Adaptability" },
  { key: "commitment", label: "Commitment" },
  { key: "learning", label: "Willingness to learn" },
] as const;
export const MAX_SCORE = CRITERIA.length * 5;

export type Application = {
  id: string;
  created_at: string;
  cohort: string;
  status: Status;
  full_name: string;
  email: string;
  phone: string | null;
  country: string | null;
  city: string | null;
  current_role: string | null;
  organisation: string | null;
  experience: string | null;
  expertise: string | null;
  motivation: string | null;
  problem: string | null;
  has_idea: string | null;
  idea: string | null;
  skills_bring: string | null;
  skills_seek: string | null;
  why_forge: string | null;
  ambition: string | null;
  commitment: string | null;
  linkedin: string | null;
  portfolio: string | null;
  github: string | null;
  website: string | null;
  final_message: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  first_utm_source: string | null;
  first_utm_medium: string | null;
  first_utm_campaign: string | null;
  referrer: string | null;
  landing_page: string | null;
  scores: Record<string, number>;
  score_total: number;
  notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
};

export type Enquiry = {
  id: string;
  created_at: string;
  status: "new" | "in_progress" | "closed";
  name: string;
  organisation: string | null;
  email: string;
  phone: string | null;
  role: string | null;
  topic: string | null;
  message: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  referrer: string | null;
  notes: string | null;
  handled_by: string | null;
};

export type AppEvent = { id: number; created_at: string; actor: string; action: string; from_status: string | null; to_status: string | null; detail: string | null };

/** Where an applicant came from, in plain words. */
export function sourceOf(r: { utm_source: string | null; utm_medium: string | null; referrer: string | null }) {
  if (r.utm_source) return r.utm_medium ? `${r.utm_source} / ${r.utm_medium}` : r.utm_source;
  if (r.referrer) {
    try {
      return new URL(r.referrer).hostname.replace(/^www\./, "");
    } catch {
      return r.referrer;
    }
  }
  return "Direct";
}
