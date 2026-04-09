import type { StatementStatus, StatementType, ConfidenceLevel } from "./types";

export const STATUS_CONFIG: Record<
  StatementStatus,
  { label: string; color: string; bg: string; border: string }
> = {
  kept: {
    label: "Kept",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
  },
  delayed: {
    label: "Delayed",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  contradicted: {
    label: "Contradicted",
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
  },
  unresolved: {
    label: "Unresolved",
    color: "text-slate-600",
    bg: "bg-slate-50",
    border: "border-slate-200",
  },
  too_vague: {
    label: "Too Vague",
    color: "text-slate-500",
    bg: "bg-slate-50",
    border: "border-slate-200",
  },
};

export const TYPE_CONFIG: Record<
  StatementType,
  { label: string; color: string; bg: string }
> = {
  promise: { label: "Promise", color: "text-violet-700", bg: "bg-violet-50" },
  prediction: {
    label: "Prediction",
    color: "text-indigo-700",
    bg: "bg-indigo-50",
  },
  commitment: { label: "Commitment", color: "text-teal-700", bg: "bg-teal-50" },
  claim: { label: "Claim", color: "text-stone-700", bg: "bg-stone-100" },
};

export const CONFIDENCE_LABELS: Record<ConfidenceLevel, string> = {
  1: "Very Low",
  2: "Low",
  3: "Medium",
  4: "High",
  5: "Very High",
};
