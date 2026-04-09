import type { PersonSummary, StatementRecord, StatementsResponse } from "@/lib/api";

// ── Mock Persons ────────────────────────────────────────

const mockPersons: PersonSummary[] = [
  {
    id: "p1",
    name: "Pete Buttigieg",
    slug: "pete-buttigieg",
    title: "U.S. Secretary of Transportation (2021–2025)",
    description: "Served as the 19th United States Secretary of Transportation under President Biden.",
    trackedSources: ["Congressional testimony", "Press conferences", "Interviews"],
    coverageFrom: "2021-02-03",
    coverageTo: "2025-01-20",
    totalStatements: 2,
    stats: { kept: 1, delayed: 0, contradicted: 1, unresolved: 0, tooVague: 0, partiallyFulfilled: 0 },
  },
  {
    id: "p2",
    name: "Elon Musk",
    slug: "elon-musk",
    title: "CEO of Tesla and SpaceX",
    description: "Chief Executive Officer of Tesla, SpaceX, and owner of X. Known for public predictions about technology timelines.",
    trackedSources: ["Earnings calls", "Social media posts", "Interviews", "Product events"],
    coverageFrom: "2019-01-01",
    coverageTo: "2026-04-09",
    totalStatements: 4,
    stats: { kept: 0, delayed: 1, contradicted: 1, unresolved: 2, tooVague: 0, partiallyFulfilled: 0 },
  },
  {
    id: "p3",
    name: "Sam Altman",
    slug: "sam-altman",
    title: "CEO of OpenAI",
    description: "Chief Executive Officer of OpenAI. Frequently makes public statements about AI development timelines.",
    trackedSources: ["Interviews", "Blog posts", "Congressional testimony", "Conference talks"],
    coverageFrom: "2023-01-01",
    coverageTo: "2026-04-09",
    totalStatements: 3,
    stats: { kept: 0, delayed: 0, contradicted: 1, unresolved: 1, tooVague: 0, partiallyFulfilled: 1 },
  },
];

// ── Mock Statements ─────────────────────────────────────

const mockStatements: StatementRecord[] = [
  // Pete Buttigieg
  {
    id: "s1",
    personId: "p1",
    exactQuote: "We will see shovels in the ground on major projects within the first year of the infrastructure bill's passage.",
    context: "Testimony before the Senate Commerce Committee during a hearing on the proposed infrastructure plan.",
    interpretation: "Major infrastructure construction projects funded by the bill would begin within 12 months of the legislation being signed.",
    statementType: "PROMISE",
    sourceTitle: "Senate Commerce Committee Hearing",
    sourceUrl: "https://www.commerce.senate.gov/2021/6/22/hearing",
    sourceDate: "2021-06-22",
    impliedDeadline: "2022-11-15",
    measurableOutcome: "Major infrastructure construction projects visibly underway",
    confidenceScore: 4,
    status: "KEPT",
    adminNotes: "The Bipartisan Infrastructure Law was signed November 15, 2021. Multiple projects broke ground within the first year.",
    approved: true,
    aiExtracted: false,
    person: { id: "p1", name: "Pete Buttigieg", slug: "pete-buttigieg" },
    evidence: [{
      id: "e1", excerpt: "The Federal Highway Administration reported over 7,000 infrastructure projects broke ground within the first 12 months.",
      evidenceDate: "2022-11-15", evidenceType: "GOVERNMENT_DATA",
      sourceUrl: "https://www.fhwa.dot.gov/bipartisan-infrastructure-law/",
      sourceTitle: "FHWA Infrastructure Dashboard",
    }],
  },
  {
    id: "s2",
    personId: "p1",
    exactQuote: "By the end of 2024, we will have 500,000 EV chargers installed across the country.",
    context: "Press conference announcing the National Electric Vehicle Infrastructure Formula Program.",
    interpretation: "500,000 public EV charging stations would be operational in the United States by December 31, 2024.",
    statementType: "PROMISE",
    sourceTitle: "DOT Press Conference on EV Charging",
    sourceUrl: "https://www.transportation.gov/briefing-room/2022-ev-charging",
    sourceDate: "2022-02-10",
    impliedDeadline: "2024-12-31",
    measurableOutcome: "500,000 EV chargers installed and operational nationwide",
    confidenceScore: 5,
    status: "CONTRADICTED",
    adminNotes: "As of late 2024, approximately 192,000 public EV charging ports existed, far below the 500,000 target.",
    approved: true,
    aiExtracted: false,
    person: { id: "p1", name: "Pete Buttigieg", slug: "pete-buttigieg" },
    evidence: [{
      id: "e2", excerpt: "As of Q3 2024, approximately 192,000 public EV charging ports existed according to DOE data.",
      evidenceDate: "2024-10-01", evidenceType: "GOVERNMENT_DATA",
      sourceUrl: "https://afdc.energy.gov/stations",
      sourceTitle: "DOE Alternative Fuels Station Locator",
    }],
  },
  // Elon Musk
  {
    id: "s3",
    personId: "p2",
    exactQuote: "I feel very confident predicting that there will be autonomous robotaxis from Tesla next year.",
    context: "Tesla Autonomy Day event in April 2019, presenting the company's self-driving roadmap.",
    interpretation: "Tesla would launch a commercial autonomous robotaxi service by the end of 2020.",
    statementType: "PREDICTION",
    sourceTitle: "Tesla Autonomy Day 2019",
    sourceUrl: "https://www.tesla.com/autonomy-day-2019",
    sourceDate: "2019-04-22",
    impliedDeadline: "2020-12-31",
    measurableOutcome: "Commercial autonomous robotaxi service operating without safety drivers",
    confidenceScore: 5,
    status: "DELAYED",
    adminNotes: "As of 2026, Tesla has launched limited robotaxi testing but no commercial service matching the 2020 prediction.",
    approved: true,
    aiExtracted: false,
    person: { id: "p2", name: "Elon Musk", slug: "elon-musk" },
  },
  {
    id: "s4",
    personId: "p2",
    exactQuote: "We expect to deliver 250,000 Cybertrucks per year by 2025.",
    context: "Tesla Q4 2023 earnings call, discussing production targets.",
    interpretation: "Tesla's Cybertruck annual production rate would reach 250,000 units during 2025.",
    statementType: "PREDICTION",
    sourceTitle: "Tesla Q4 2023 Earnings Call",
    sourceDate: "2024-01-24",
    impliedDeadline: "2025-12-31",
    measurableOutcome: "Cybertruck production rate at 250,000 units per year",
    confidenceScore: 4,
    status: "UNRESOLVED",
    approved: true,
    aiExtracted: false,
    person: { id: "p2", name: "Elon Musk", slug: "elon-musk" },
  },
  {
    id: "s5",
    personId: "p2",
    exactQuote: "Full Self-Driving will be solved this year.",
    context: "Tesla Q4 2023 earnings call, referring to calendar year 2024.",
    interpretation: "Tesla's FSD software would achieve full autonomy by end of 2024.",
    statementType: "PREDICTION",
    sourceTitle: "Tesla Q4 2023 Earnings Call",
    sourceDate: "2024-01-24",
    impliedDeadline: "2024-12-31",
    measurableOutcome: "FSD operating without human supervision",
    confidenceScore: 5,
    status: "CONTRADICTED",
    adminNotes: "Tesla FSD remained Level 2 through 2024, requiring constant driver supervision.",
    approved: true,
    aiExtracted: false,
    person: { id: "p2", name: "Elon Musk", slug: "elon-musk" },
  },
  {
    id: "s6",
    personId: "p2",
    exactQuote: "Starship will be ready for an uncrewed Mars mission in 2026.",
    context: "Post on X discussing SpaceX Mars mission timeline.",
    interpretation: "A SpaceX Starship would launch on a Mars trajectory during 2026.",
    statementType: "PREDICTION",
    sourceTitle: "Post on X",
    sourceUrl: "https://x.com/elonmusk/status/example",
    sourceDate: "2024-03-15",
    impliedDeadline: "2026-12-31",
    measurableOutcome: "Starship launches on Mars trajectory",
    confidenceScore: 3,
    status: "UNRESOLVED",
    approved: true,
    aiExtracted: false,
    person: { id: "p2", name: "Elon Musk", slug: "elon-musk" },
  },
  // Sam Altman
  {
    id: "s7",
    personId: "p3",
    exactQuote: "We think that regulatory intervention by governments will be critical to mitigate the risks of increasingly powerful AI systems.",
    context: "Testimony before the Senate Judiciary Subcommittee on Privacy, Technology, and the Law.",
    interpretation: "OpenAI's CEO publicly advocates for government regulation of AI systems.",
    statementType: "COMMITMENT",
    sourceTitle: "Senate Judiciary Subcommittee Hearing",
    sourceUrl: "https://www.judiciary.senate.gov/committee-activity/hearings/2023/05/16/oversight-of-ai",
    sourceDate: "2023-05-16",
    measurableOutcome: "OpenAI actively supports and cooperates with AI regulatory efforts",
    confidenceScore: 3,
    status: "UNRESOLVED",
    adminNotes: "OpenAI has engaged with regulatory discussions but has also lobbied against certain provisions.",
    approved: true,
    aiExtracted: false,
    person: { id: "p3", name: "Sam Altman", slug: "sam-altman" },
  },
  {
    id: "s8",
    personId: "p3",
    exactQuote: "OpenAI will remain a capped-profit company — we are not going to become a traditional for-profit.",
    context: "Interview at the World Economic Forum in Davos, January 2024.",
    interpretation: "OpenAI would maintain its capped-profit structure and not convert to a standard for-profit corporation.",
    statementType: "COMMITMENT",
    sourceTitle: "WEF Davos Interview",
    sourceDate: "2024-01-18",
    measurableOutcome: "OpenAI retains capped-profit structure",
    confidenceScore: 5,
    status: "CONTRADICTED",
    adminNotes: "In December 2024, OpenAI announced plans to restructure as a for-profit public benefit corporation.",
    approved: true,
    aiExtracted: false,
    person: { id: "p3", name: "Sam Altman", slug: "sam-altman" },
  },
  {
    id: "s9",
    personId: "p3",
    exactQuote: "We will have systems that can reason and plan and execute complex tasks by the end of this year.",
    context: "Davos 2024 interview, referring to AI capabilities expected by end of 2024.",
    interpretation: "OpenAI would release AI systems capable of autonomous multi-step reasoning by December 2024.",
    statementType: "PREDICTION",
    sourceTitle: "WEF Davos Interview",
    sourceDate: "2024-01-18",
    impliedDeadline: "2024-12-31",
    measurableOutcome: "AI system that autonomously reasons, plans, and executes complex tasks",
    confidenceScore: 3,
    status: "PARTIALLY_FULFILLED",
    adminNotes: "OpenAI released o1/o3 models with improved reasoning, but they still require human oversight for complex tasks.",
    approved: true,
    aiExtracted: false,
    person: { id: "p3", name: "Sam Altman", slug: "sam-altman" },
  },
];

// ── Fallback data access ────────────────────────────────

export function getMockPersons(): PersonSummary[] {
  return mockPersons;
}

export function getMockPerson(slug: string): PersonSummary | undefined {
  return mockPersons.find((p) => p.slug === slug);
}

export function getMockStatements(personSlug?: string): StatementsResponse {
  const filtered = personSlug
    ? mockStatements.filter((s) => s.person.slug === personSlug)
    : mockStatements;
  return {
    statements: filtered,
    total: filtered.length,
    page: 1,
    totalPages: 1,
  };
}

export function getMockStatement(id: string): StatementRecord | undefined {
  return mockStatements.find((s) => s.id === id);
}
