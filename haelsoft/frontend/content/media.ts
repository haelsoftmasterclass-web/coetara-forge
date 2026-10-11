/**
 * Photography slots. No licensed Haelsoft photography has been supplied yet, so each
 * slot renders a branded placeholder showing its brief. To use a real photo, add the
 * licensed file to public/images/ and set `src` (see README > Photography).
 */
export type MediaSlot = { label: string; brief: string; src?: string; width?: number; height?: number };

export const media = {
  homeHero: {
    label: "A learner working through an online lesson on a laptop",
    brief: "A young African professional learning online at a laptop in a real home or co-working space. Natural light, candid, not staged.",
  },
  aboutLearners: {
    label: "Adult learners collaborating on a practical task",
    brief: "Two or three adult learners working through a practical task together. Mixed ages and genders, authentic setting.",
  },
  storyWorkshop: {
    label: "An instructor guiding a learner through an exercise",
    brief: "An instructor guiding a learner through a hands-on exercise. Focus on the interaction, not posed smiles.",
  },
} satisfies Record<string, MediaSlot>;
