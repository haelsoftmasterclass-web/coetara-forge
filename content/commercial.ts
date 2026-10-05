import type { Step } from "@/components/Steps";

export const commercialProcess: Step[] = [
  {
    name: "Scout",
    body: "Identify promising technologies, research, IP and innovation opportunities.",
    listLabel: "Sources may include",
    list: ["Universities", "Research institutions", "Corporate R&D", "Innovation teams", "Technology networks"],
  },
  {
    name: "DownSelect",
    body: "Evaluate which opportunities are worth pursuing.",
    listLabel: "We evaluate",
    list: ["Technology readiness", "Problem relevance", "Market opportunity", "Commercial potential", "Route to market"],
  },
  {
    name: "Structure",
    body: "Determine the appropriate commercialisation structure. Specific legal or financial terms are agreed separately for each opportunity.",
    listLabel: "Potential structures",
    list: ["Partnership", "Venture creation", "Licensing", "Strategic collaboration"],
  },
  {
    name: "Build",
    body: "Assemble the operating capability required to turn technology into a venture.",
    listLabel: "This may involve",
    list: ["Founders", "Operators", "Product capability", "Commercial capability", "Technical expertise"],
  },
  {
    name: "Scale & Spin Out",
    body: "Where the opportunity demonstrates sufficient commercial potential, develop the venture toward scale or spin-out.",
  },
];
