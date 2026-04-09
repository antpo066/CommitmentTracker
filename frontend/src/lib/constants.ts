// Status and type configs keyed by both lowercase and uppercase for API compatibility

interface StatusStyle {
  label: string;
  color: string;
  bg: string;
  border: string;
}

interface TypeStyle {
  label: string;
  color: string;
  bg: string;
}

const _STATUS: Record<string, StatusStyle> = {
  KEPT: { label: "Kept", color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  DELAYED: { label: "Delayed", color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
  CONTRADICTED: { label: "Contradicted", color: "text-red-700", bg: "bg-red-50", border: "border-red-200" },
  UNRESOLVED: { label: "Unresolved", color: "text-slate-600", bg: "bg-slate-50", border: "border-slate-200" },
  PARTIALLY_FULFILLED: { label: "Partially Fulfilled", color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" },
  TOO_VAGUE: { label: "Too Vague", color: "text-slate-500", bg: "bg-slate-50", border: "border-slate-200" },
};

// Add lowercase aliases
for (const [k, v] of Object.entries(_STATUS)) {
  _STATUS[k.toLowerCase()] = v;
}

export const STATUS_CONFIG = _STATUS;

const _TYPES: Record<string, TypeStyle> = {
  PROMISE: { label: "Promise", color: "text-violet-700", bg: "bg-violet-50" },
  PREDICTION: { label: "Prediction", color: "text-indigo-700", bg: "bg-indigo-50" },
  COMMITMENT: { label: "Commitment", color: "text-teal-700", bg: "bg-teal-50" },
  CLAIM: { label: "Claim", color: "text-stone-700", bg: "bg-stone-100" },
};

for (const [k, v] of Object.entries(_TYPES)) {
  _TYPES[k.toLowerCase()] = v;
}

export const TYPE_CONFIG = _TYPES;

export const CONFIDENCE_LABELS: Record<number, string> = {
  1: "Very Low",
  2: "Low",
  3: "Medium",
  4: "High",
  5: "Very High",
};

const DEFAULT_STATUS: StatusStyle = { label: "Unknown", color: "text-slate-500", bg: "bg-slate-50", border: "border-slate-200" };
const DEFAULT_TYPE: TypeStyle = { label: "Unknown", color: "text-stone-500", bg: "bg-stone-100" };

export function getStatusConfig(status: string): StatusStyle {
  return STATUS_CONFIG[status] || STATUS_CONFIG[status.toUpperCase()] || DEFAULT_STATUS;
}

export function getTypeConfig(type: string): TypeStyle {
  return TYPE_CONFIG[type] || TYPE_CONFIG[type.toUpperCase()] || DEFAULT_TYPE;
}
