const statusConfig: Record<string, { label: string; className: string }> = {
  UNRESOLVED: { label: 'Unresolved', className: 'bg-gray-100 text-gray-700' },
  KEPT: { label: 'Kept', className: 'bg-green-100 text-green-800' },
  DELAYED: { label: 'Delayed', className: 'bg-yellow-100 text-yellow-800' },
  CONTRADICTED: { label: 'Contradicted', className: 'bg-red-100 text-red-800' },
  PARTIALLY_FULFILLED: { label: 'Partially Fulfilled', className: 'bg-blue-100 text-blue-800' },
};

const typeConfig: Record<string, { label: string; className: string }> = {
  PROMISE: { label: 'Promise', className: 'bg-purple-100 text-purple-800' },
  PREDICTION: { label: 'Prediction', className: 'bg-indigo-100 text-indigo-800' },
  COMMITMENT: { label: 'Commitment', className: 'bg-teal-100 text-teal-800' },
  CLAIM: { label: 'Claim', className: 'bg-orange-100 text-orange-800' },
};

export function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-700' };
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}

export function TypeBadge({ type }: { type: string }) {
  const config = typeConfig[type] || { label: type, className: 'bg-gray-100 text-gray-700' };
  return (
    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
}
