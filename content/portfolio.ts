import data from "./portfolio.json";

export type Company = {
  name: string;
  sector: string;
  description: string;
  pathway: "Forge Launch" | "Forge Commercial";
  stage: "Incubation" | "Pre-Seed" | "Seed" | "Growth";
  website?: string;
  logo?: string;
  image?: string;
};

/** Managed through the CMS (/admin) or by editing portfolio.json. Never add placeholder companies. */
export const portfolio = data.companies as Company[];
