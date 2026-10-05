export type Faq = { q: string; a: string[]; topic: "Forge" | "Incubator" | "Partners"; tbc?: boolean };

export const faqs: Faq[] = [
  { topic: "Forge", q: "What is Coetara Forge?", a: ["Coetara Forge is the venture-building and commercialisation platform of Coetara Technologies Limited."] },
  { topic: "Forge", q: "Is Forge an accelerator?", a: ["Forge is broader than a conventional accelerator. It combines venture building, founder development, commercial validation and commercialisation."] },
  { topic: "Incubator", q: "Do I need an existing startup?", a: ["No.", "The 10-week programme is designed for exceptional individuals who may not yet have a company."] },
  { topic: "Incubator", q: "Do I need a business idea?", a: ["Not necessarily.", "The programme can begin with a person's capabilities, interests, domain expertise and opportunity areas."] },
  { topic: "Incubator", q: "Who can apply?", a: ["Technical builders, product builders, business builders, domain experts, researchers, creatives and operators."] },
  { topic: "Incubator", q: "Is investment guaranteed?", a: ["No.", "Participation does not guarantee investment.", "Strong ventures may progress toward investment, further venture building or portfolio support."] },
  { topic: "Incubator", q: "How are applicants selected?", a: ["Through application, assessment and selection."] },
  { topic: "Incubator", q: "What happens after the 10 weeks?", a: ["The strongest ventures may progress toward next-stage venture building, investment and portfolio support."] },
  { topic: "Incubator", q: "Will I receive a certificate?", a: ["A certificate may be provided, but the primary objective is venture creation rather than certification."] },
  { topic: "Partners", q: "Can universities work with Forge?", a: ["Yes.", "Universities and research institutions can explore technology scouting, IP commercialisation, venture creation and founder development partnerships."] },
  { topic: "Partners", q: "Can companies partner with Forge?", a: ["Yes.", "Corporate organisations can explore innovation programmes, technology scouting, venture challenges, R&D commercialisation and strategic partnerships."] },
  { topic: "Incubator", q: "Is the programme online or physical?", a: ["To be confirmed. The operating model is being finalised and will be published before Cohort 01 begins."], tbc: true },
  { topic: "Incubator", q: "How much does the programme cost?", a: ["To be confirmed. The programme fee has not yet been formally established."], tbc: true },
];

export const disclaimer =
  "Information about Forge, its programmes and venture opportunities is provided for general informational purposes. Participation in a Forge programme does not guarantee investment. Any investment, equity, licensing or partnership arrangement is subject to separate documentation, diligence, approvals and applicable law.";
