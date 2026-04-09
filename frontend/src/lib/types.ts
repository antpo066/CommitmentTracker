export type StatementStatus =
  | "kept"
  | "delayed"
  | "contradicted"
  | "unresolved"
  | "too_vague";

export type StatementType =
  | "promise"
  | "prediction"
  | "commitment"
  | "claim";

export type SourceType =
  | "speech"
  | "interview"
  | "tweet"
  | "press_release"
  | "article"
  | "youtube"
  | "other";

export type ConfidenceLevel = 1 | 2 | 3 | 4 | 5;

export interface Person {
  id: string;
  name: string;
  slug: string;
  handle?: string;
  descriptor: string;
  avatarUrl?: string;
  trackedSources: string[];
  coverageDates: { from: string; to: string };
  lastUpdated: string;
  totalStatements: number;
  stats: {
    kept: number;
    delayed: number;
    contradicted: number;
    unresolved: number;
    tooVague: number;
    avgResolutionDays?: number;
  };
}

export interface Statement {
  id: string;
  personId: string;
  exactQuote: string;
  context: string;
  interpretation: string;
  statementType: StatementType;
  status: StatementStatus;
  source: string;
  sourceType: SourceType;
  sourceUrl?: string;
  dateMade: string;
  impliedDeadline?: string;
  measurableOutcome?: string;
  confidenceScore: ConfidenceLevel;
  resolutionSummary?: string;
  resolutionEvidence?: string;
  resolutionDate?: string;
  notes?: Note[];
  relatedStatementIds?: string[];
}

export interface Note {
  id: string;
  type: "context" | "dispute" | "evidence" | "correction";
  content: string;
  author: string;
  date: string;
  sourceUrl?: string;
}

// For future backend connection
export interface ApiConfig {
  baseUrl: string;
  headers?: Record<string, string>;
}
