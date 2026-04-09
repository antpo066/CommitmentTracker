import type { Person, Statement } from "@/lib/types";

export const mockPerson: Person = {
  id: "p1",
  name: "Jane Whitfield",
  slug: "jane-whitfield",
  handle: "@jwhitfield",
  descriptor: "Secretary of Transportation, United States",
  avatarUrl: undefined,
  trackedSources: [
    "Congressional hearings",
    "Press conferences",
    "Official interviews",
    "Social media posts",
    "Published reports",
  ],
  coverageDates: { from: "2023-01-20", to: "2026-04-09" },
  lastUpdated: "2026-04-07",
  totalStatements: 14,
  stats: {
    kept: 3,
    delayed: 3,
    contradicted: 2,
    unresolved: 4,
    tooVague: 2,
    avgResolutionDays: 187,
  },
};

export const mockStatements: Statement[] = [
  {
    id: "s1",
    personId: "p1",
    exactQuote:
      "We will have the new federal rail corridor fully operational by the end of 2025.",
    context:
      "Made during a Senate Transportation Committee hearing on infrastructure funding. The statement was part of a broader presentation on the administration's rail modernization plan.",
    interpretation:
      "A specific commitment to complete and open the Northeast Federal Rail Corridor by December 31, 2025.",
    statementType: "promise",
    status: "delayed",
    source: "Senate Transportation Committee Hearing",
    sourceType: "speech",
    sourceUrl: "https://example.com/senate-hearing-2024",
    dateMade: "2024-03-15",
    impliedDeadline: "2025-12-31",
    measurableOutcome: "Federal rail corridor open to passenger service",
    confidenceScore: 4,
    resolutionSummary:
      "Construction reached 68% completion by the deadline. The revised timeline targets Q3 2026.",
    resolutionEvidence:
      "Federal Rail Authority quarterly report (January 2026) confirmed project delays due to supply chain issues and environmental review extensions.",
    resolutionDate: "2026-01-15",
    notes: [
      {
        id: "n1",
        type: "context",
        content:
          "The original timeline assumed congressional funding would be approved in Q2 2024. Funding was not approved until Q4 2024.",
        author: "Editorial Team",
        date: "2026-01-20",
      },
      {
        id: "n2",
        type: "evidence",
        content:
          "DOT Inspector General report cited labor shortages as a contributing factor to the delay.",
        author: "Research Team",
        date: "2026-02-10",
        sourceUrl: "https://example.com/ig-report",
      },
    ],
    relatedStatementIds: ["s4"],
  },
  {
    id: "s2",
    personId: "p1",
    exactQuote:
      "Every state will have access to electric vehicle charging infrastructure within two years.",
    context:
      "Remarks at the National Clean Transportation Summit, addressing EV adoption goals.",
    interpretation:
      "All 50 states would have federally funded EV charging stations accessible to the public by April 2026.",
    statementType: "commitment",
    status: "kept",
    source: "National Clean Transportation Summit",
    sourceType: "speech",
    sourceUrl: "https://example.com/ev-summit",
    dateMade: "2024-04-10",
    impliedDeadline: "2026-04-10",
    measurableOutcome:
      "EV charging stations operational in all 50 states",
    confidenceScore: 5,
    resolutionSummary:
      "All 50 states confirmed to have federally funded EV charging stations as of March 2026.",
    resolutionEvidence:
      "Department of Energy dashboard shows at least one operational station in every state. Independent verification by the EV Infrastructure Council.",
    resolutionDate: "2026-03-28",
    notes: [
      {
        id: "n3",
        type: "dispute",
        content:
          "Some critics note that several states have only 1-2 stations, which may not constitute meaningful 'access' for rural areas.",
        author: "Public Submission",
        date: "2026-04-02",
      },
    ],
  },
  {
    id: "s3",
    personId: "p1",
    exactQuote:
      "There will be no toll increases on federal highways during this administration.",
    context:
      "Stated during a press conference following the release of the annual transportation budget.",
    interpretation:
      "Federal highway toll rates would remain unchanged for the duration of the current administration's term.",
    statementType: "promise",
    status: "contradicted",
    source: "DOT Press Conference",
    sourceType: "press_release",
    sourceUrl: "https://example.com/dot-presser",
    dateMade: "2023-06-12",
    impliedDeadline: "2027-01-20",
    measurableOutcome: "No federal highway toll increases enacted",
    confidenceScore: 5,
    resolutionSummary:
      "A 12% toll increase on three federal highway corridors was approved in September 2025.",
    resolutionEvidence:
      "Federal Highway Administration Notice FR-2025-1847 authorized toll adjustments effective November 2025. The increase was characterized as an 'inflation adjustment' rather than a policy change.",
    resolutionDate: "2025-09-20",
    notes: [
      {
        id: "n4",
        type: "context",
        content:
          "The administration argued that inflation adjustments are distinct from policy-driven toll increases. The original statement did not specify this distinction.",
        author: "Editorial Team",
        date: "2025-10-01",
      },
    ],
    relatedStatementIds: ["s7"],
  },
  {
    id: "s4",
    personId: "p1",
    exactQuote:
      "The revised rail project will be completed by the third quarter of 2026.",
    context:
      "Follow-up statement at a press briefing after acknowledging the original 2025 deadline would not be met.",
    interpretation:
      "The federal rail corridor project completion date has been moved to September 30, 2026.",
    statementType: "promise",
    status: "unresolved",
    source: "DOT Press Briefing",
    sourceType: "press_release",
    dateMade: "2026-01-22",
    impliedDeadline: "2026-09-30",
    measurableOutcome: "Rail corridor construction complete",
    confidenceScore: 3,
    relatedStatementIds: ["s1"],
  },
  {
    id: "s5",
    personId: "p1",
    exactQuote:
      "I predict we will see a 40% reduction in traffic fatalities within five years.",
    context:
      "Interview with National Transportation Safety magazine discussing autonomous vehicle policy.",
    interpretation:
      "U.S. traffic fatalities would decline by 40% from 2024 levels by 2029.",
    statementType: "prediction",
    status: "unresolved",
    source: "NTS Magazine Interview",
    sourceType: "interview",
    sourceUrl: "https://example.com/nts-interview",
    dateMade: "2024-08-05",
    impliedDeadline: "2029-08-05",
    measurableOutcome:
      "NHTSA annual fatality count at or below 60% of 2024 baseline",
    confidenceScore: 2,
    notes: [
      {
        id: "n5",
        type: "context",
        content:
          "2024 baseline: approximately 40,100 fatalities. A 40% reduction would mean ~24,060 or fewer by 2029. Current 2025 figures show a 3% decline.",
        author: "Research Team",
        date: "2026-03-15",
      },
    ],
  },
  {
    id: "s6",
    personId: "p1",
    exactQuote:
      "We are committed to making air travel more affordable for every American family.",
    context:
      "State of Transportation address, in a section about aviation policy reform.",
    interpretation:
      "A general commitment to reduce average air travel costs. No specific metric or deadline was stated.",
    statementType: "commitment",
    status: "too_vague",
    source: "State of Transportation Address",
    sourceType: "speech",
    dateMade: "2024-02-20",
    confidenceScore: 1,
    resolutionSummary:
      "Statement lacks specific, measurable criteria. Average domestic airfare increased 4% in 2025 according to BTS data.",
    notes: [
      {
        id: "n6",
        type: "context",
        content:
          "Without a defined metric for 'affordable' or a timeline, this statement cannot be conclusively resolved.",
        author: "Editorial Team",
        date: "2025-06-01",
      },
    ],
  },
  {
    id: "s7",
    personId: "p1",
    exactQuote:
      "The toll adjustment was an inflation correction, not a toll increase. Our commitment stands.",
    context:
      "Response to press questions about the apparent contradiction with the earlier no-toll-increase pledge.",
    interpretation:
      "The administration maintains that the September 2025 toll changes do not violate the original promise because they classify the adjustment differently.",
    statementType: "claim",
    status: "contradicted",
    source: "Press Conference Q&A",
    sourceType: "speech",
    dateMade: "2025-10-05",
    confidenceScore: 4,
    resolutionSummary:
      "Independent analysis confirmed the toll rates paid by drivers increased by 12%, regardless of the administrative classification.",
    resolutionEvidence:
      "Congressional Budget Office analysis (November 2025) concluded that the practical effect on drivers was indistinguishable from a standard toll increase.",
    resolutionDate: "2025-11-15",
    relatedStatementIds: ["s3"],
  },
  {
    id: "s8",
    personId: "p1",
    exactQuote:
      "By next summer, 200 new bridges will be under construction or completed.",
    context:
      "Announcement at the American Society of Civil Engineers annual conference.",
    interpretation:
      "200 bridges would be in active construction or completed by summer 2025 (approximately June-August 2025).",
    statementType: "promise",
    status: "kept",
    source: "ASCE Annual Conference",
    sourceType: "speech",
    sourceUrl: "https://example.com/asce-conf",
    dateMade: "2024-09-18",
    impliedDeadline: "2025-08-31",
    measurableOutcome:
      "200 bridges in construction or completed",
    confidenceScore: 5,
    resolutionSummary:
      "DOT reported 214 bridge projects either under construction or completed as of July 2025.",
    resolutionEvidence:
      "Federal Highway Administration Bridge Project Tracker, verified by Government Accountability Office review.",
    resolutionDate: "2025-07-30",
  },
  {
    id: "s9",
    personId: "p1",
    exactQuote:
      "Public transit ridership will recover to pre-pandemic levels within 18 months.",
    context:
      "Interview on Morning Policy Roundtable, discussing urban transit recovery strategies.",
    interpretation:
      "National public transit ridership would return to 2019 levels by approximately June 2026.",
    statementType: "prediction",
    status: "delayed",
    source: "Morning Policy Roundtable",
    sourceType: "interview",
    dateMade: "2025-01-10",
    impliedDeadline: "2026-07-10",
    measurableOutcome:
      "Monthly transit ridership matching 2019 monthly averages",
    confidenceScore: 3,
    resolutionSummary:
      "As of March 2026, ridership is at 82% of 2019 levels nationally. Recovery is progressing but the 18-month target appears unlikely to be met.",
    notes: [
      {
        id: "n7",
        type: "evidence",
        content:
          "American Public Transportation Association monthly report shows steady but slow recovery. Major cities range from 65% to 95% of pre-pandemic ridership.",
        author: "Research Team",
        date: "2026-04-01",
      },
    ],
  },
  {
    id: "s10",
    personId: "p1",
    exactQuote:
      "We will launch a comprehensive cybersecurity framework for transportation infrastructure by Q1 2026.",
    context:
      "Testimony before the House Homeland Security Committee on critical infrastructure protection.",
    interpretation:
      "A formal cybersecurity framework document would be published and implementation begun by March 31, 2026.",
    statementType: "commitment",
    status: "kept",
    source: "House Homeland Security Committee",
    sourceType: "speech",
    dateMade: "2024-11-08",
    impliedDeadline: "2026-03-31",
    measurableOutcome:
      "Published cybersecurity framework for transportation sector",
    confidenceScore: 4,
    resolutionSummary:
      "The Transportation Cybersecurity Framework (TCF-1) was published on March 15, 2026.",
    resolutionEvidence:
      "DOT publication TCF-2026-001, available on the Federal Register. Implementation guidance issued simultaneously.",
    resolutionDate: "2026-03-15",
  },
  {
    id: "s11",
    personId: "p1",
    exactQuote:
      "This department will create 500,000 jobs in the transportation sector over the next three years.",
    context:
      "Keynote speech at the National Transportation Workforce Summit.",
    interpretation:
      "500,000 net new jobs in the transportation sector by November 2027.",
    statementType: "promise",
    status: "unresolved",
    source: "Transportation Workforce Summit",
    sourceType: "speech",
    dateMade: "2024-11-15",
    impliedDeadline: "2027-11-15",
    measurableOutcome:
      "BLS data showing 500,000 net new transportation sector jobs",
    confidenceScore: 3,
    resolutionSummary:
      "As of Q1 2026, approximately 180,000 net new jobs have been added according to BLS data. The pace would need to accelerate significantly to meet the target.",
    notes: [
      {
        id: "n8",
        type: "context",
        content:
          "Current job creation rate of ~10,000/month would yield approximately 360,000 by the deadline, short of the 500,000 target.",
        author: "Research Team",
        date: "2026-03-20",
      },
    ],
  },
  {
    id: "s12",
    personId: "p1",
    exactQuote:
      "We're going to fundamentally transform how Americans think about public transportation.",
    context:
      "Informal remarks at a transit innovation showcase event.",
    interpretation:
      "A general aspirational statement about changing public perception of transit. No specific metric or deadline.",
    statementType: "claim",
    status: "too_vague",
    source: "Transit Innovation Showcase",
    sourceType: "speech",
    dateMade: "2024-06-22",
    confidenceScore: 1,
    resolutionSummary:
      "Statement is aspirational and lacks measurable criteria for resolution.",
  },
  {
    id: "s13",
    personId: "p1",
    exactQuote:
      "The FAA will finalize drone delivery regulations before the end of this year.",
    context:
      "Tweet posted in response to industry questions about drone delivery policy timeline.",
    interpretation:
      "Final FAA regulations governing commercial drone delivery operations would be published by December 31, 2025.",
    statementType: "promise",
    status: "delayed",
    source: "Official Social Media Post",
    sourceType: "tweet",
    sourceUrl: "https://example.com/tweet-drone",
    dateMade: "2025-03-28",
    impliedDeadline: "2025-12-31",
    measurableOutcome:
      "Published final rule in Federal Register",
    confidenceScore: 4,
    resolutionSummary:
      "The proposed rule was published for public comment in November 2025 but the final rule has not been issued. Currently in the review period.",
    resolutionDate: "2026-01-05",
    notes: [
      {
        id: "n9",
        type: "evidence",
        content:
          "FAA issued NPRM-2025-0847 on November 12, 2025. The public comment period closed January 15, 2026. Final rule expected Q2 2026.",
        author: "Research Team",
        date: "2026-02-01",
      },
    ],
  },
  {
    id: "s14",
    personId: "p1",
    exactQuote:
      "Rural communities will see a 25% increase in transit service options by 2026.",
    context:
      "Prepared remarks at the Rural Transportation Access Forum.",
    interpretation:
      "Rural areas nationally would have 25% more transit routes or service hours by end of 2026.",
    statementType: "commitment",
    status: "unresolved",
    source: "Rural Transportation Access Forum",
    sourceType: "speech",
    dateMade: "2024-05-30",
    impliedDeadline: "2026-12-31",
    measurableOutcome:
      "25% increase in rural transit service metrics (routes or service hours)",
    confidenceScore: 3,
  },
];
