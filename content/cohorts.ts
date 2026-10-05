import data from "./cohorts.json";

export type Cohort = { id: string; name: string; programme: string; status: string; dates: string; format: string; fee: string };

/** Add a new cohort in the CMS (or cohorts.json); the incubator page shows the first one listed. */
export const cohorts = data.cohorts as Cohort[];
export const currentCohort = cohorts[0];
