// API client for the Express backend
// In development, Next.js proxies /api to localhost:3001

// In dev, Next.js rewrites /api/* to localhost:3001/api/* via next.config.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

function getHeaders(): HeadersInit {
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: getHeaders(),
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};

// ── Types matching the backend ──────────────────────────

export interface PersonSummary {
  id: string;
  name: string;
  slug: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  trackedSources: string[];
  coverageFrom?: string;
  coverageTo?: string;
  totalStatements: number;
  stats: {
    kept: number;
    delayed: number;
    contradicted: number;
    unresolved: number;
    tooVague: number;
    partiallyFulfilled: number;
  };
}

export interface StatementRecord {
  id: string;
  personId: string;
  exactQuote: string;
  context?: string;
  interpretation?: string;
  statementType: string;
  sourceTitle: string;
  sourceUrl?: string;
  sourceDate: string;
  impliedDeadline?: string;
  measurableOutcome?: string;
  confidenceScore: number;
  status: string;
  adminNotes?: string;
  approved: boolean;
  aiExtracted: boolean;
  aiConfidence?: number;
  person: { id: string; name: string; slug: string; title?: string };
  sourceDocument?: { id: string; title: string; sourceType: string };
  evidence?: EvidenceRecord[];
  notes?: NoteRecord[];
  _count?: { notes: number; disputes: number };
}

export interface EvidenceRecord {
  id: string;
  excerpt: string;
  evidenceDate: string;
  evidenceType: string;
  sourceUrl?: string;
  sourceTitle?: string;
  notes?: string;
  statusChange?: string;
}

export interface NoteRecord {
  id: string;
  content: string;
  noteType: string;
  createdAt: string;
  author: { name: string };
}

export interface StatementsResponse {
  statements: StatementRecord[];
  total: number;
  page: number;
  totalPages: number;
}

export interface SourceDocument {
  id: string;
  personId: string;
  title: string;
  url?: string;
  sourceType: string;
  sourceDate: string;
  rawText: string;
  excerpt?: string;
  ingested: boolean;
  person: { name: string; slug: string };
  statements?: StatementRecord[];
}
