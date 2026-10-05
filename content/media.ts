/**
 * Photography slots. Each slot carries its art direction so the right image can be
 * sourced (commissioned or licensed). Set `src` to a path in /public/images or a full
 * URL; until then the site renders a branded placeholder with the brief as caption.
 *
 * Direction for every image: editorial and authentic. African founders, builders,
 * researchers and engineers in real work settings. No handshakes, no classrooms,
 * no flags.
 */
export type MediaSlot = { src?: string; alt: string; brief: string };

export const media = {
  homeBuilders: {
    alt: "A founding team working through a product decision around a laptop",
    brief: "Two or three young African builders mid-discussion over a product screen, natural light, modern workspace in Lagos or Nairobi",
  },
  aboutCity: {
    alt: "An African city skyline at dusk",
    brief: "Wide editorial shot of a commercial district (Lagos Island, Nairobi Upper Hill or Kigali) at golden hour",
  },
  whoHero: {
    alt: "A builder sketching a system on a whiteboard",
    brief: "Portrait of an engineer or product builder at a whiteboard covered in a system diagram, candid, shallow depth of field",
  },
  partnersHero: {
    alt: "Researchers working with hardware in a laboratory",
    brief: "University or research lab in West or East Africa, researchers testing a device or prototype, documentary style",
  },
  commercialLab: {
    alt: "A prototype on a workbench",
    brief: "Close-up of a working hardware or software prototype on a bench, hands in frame, warm practical light",
  },
  incubatorSprint: {
    alt: "A founder speaking with a market trader about a product",
    brief: "Founder in a real customer conversation: a market trader, shop owner or logistics operator, phone or tablet in hand",
  },
} satisfies Record<string, MediaSlot>;
