"use client";

import { useState } from "react";
import { mockStatements } from "@/data/mock";
import { TopNav } from "@/components/layout/TopNav";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TypeBadge } from "@/components/ui/TypeBadge";
import { ConfidenceIndicator } from "@/components/ui/ConfidenceIndicator";
import { formatDate } from "@/lib/utils";
import type { Statement, StatementStatus } from "@/lib/types";
import {
  Check,
  X,
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";

// Simulate a review queue with some pending items
const pendingStatements = mockStatements.slice(0, 5).map((s) => ({
  ...s,
  status: "unresolved" as StatementStatus,
  reviewStatus: "pending" as const,
}));

export default function AdminReviewPage() {
  const [queue, setQueue] = useState(pendingStatements);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleApprove = (id: string, status: StatementStatus) => {
    setQueue((q) => q.filter((s) => s.id !== id));
    // In real app: POST to API
  };

  const handleReject = (id: string) => {
    setQueue((q) => q.filter((s) => s.id !== id));
    // In real app: POST to API
  };

  return (
    <>
      <TopNav />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-stone-800 tracking-tight">
              Review Queue
            </h1>
            <p className="text-sm text-stone-500 mt-1">
              {queue.length} statement{queue.length !== 1 ? "s" : ""} awaiting
              review
            </p>
          </div>
        </div>

        {queue.length === 0 ? (
          <div className="rounded-lg border border-[var(--color-border)] bg-white p-12 text-center">
            <Check className="h-8 w-8 text-emerald-400 mx-auto mb-3" />
            <p className="text-sm text-stone-500">
              All caught up. No statements pending review.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {queue.map((statement) => (
              <ReviewCard
                key={statement.id}
                statement={statement}
                expanded={expandedId === statement.id}
                onToggle={() =>
                  setExpandedId(
                    expandedId === statement.id ? null : statement.id
                  )
                }
                onApprove={(status) => handleApprove(statement.id, status)}
                onReject={() => handleReject(statement.id)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function ReviewCard({
  statement,
  expanded,
  onToggle,
  onApprove,
  onReject,
}: {
  statement: Statement;
  expanded: boolean;
  onToggle: () => void;
  onApprove: (status: StatementStatus) => void;
  onReject: () => void;
}) {
  const [selectedStatus, setSelectedStatus] =
    useState<StatementStatus>("unresolved");

  return (
    <div className="rounded-lg border border-[var(--color-border)] bg-white">
      {/* Collapsed view */}
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <TypeBadge type={statement.statementType} />
              <span className="text-xs text-stone-400">
                {statement.source}
              </span>
              <span className="text-xs text-stone-400">
                {formatDate(statement.dateMade)}
              </span>
            </div>
            <p className="text-sm text-stone-800 font-medium leading-relaxed">
              &ldquo;{statement.exactQuote}&rdquo;
            </p>
          </div>
          <button
            onClick={onToggle}
            className="p-1 rounded text-stone-400 hover:text-stone-600 hover:bg-stone-50 shrink-0"
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Expanded details */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-stone-100 space-y-4">
            {statement.context && (
              <div>
                <h4 className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-1">
                  Context
                </h4>
                <p className="text-sm text-stone-600 leading-relaxed">
                  {statement.context}
                </p>
              </div>
            )}
            {statement.interpretation && (
              <div>
                <h4 className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-1">
                  Interpretation
                </h4>
                <p className="text-sm text-stone-600 leading-relaxed">
                  {statement.interpretation}
                </p>
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              {statement.impliedDeadline && (
                <div>
                  <h4 className="text-xs text-stone-400 uppercase tracking-wide mb-1">
                    Deadline
                  </h4>
                  <p className="text-sm text-stone-700">
                    {formatDate(statement.impliedDeadline)}
                  </p>
                </div>
              )}
              {statement.measurableOutcome && (
                <div>
                  <h4 className="text-xs text-stone-400 uppercase tracking-wide mb-1">
                    Outcome
                  </h4>
                  <p className="text-sm text-stone-700">
                    {statement.measurableOutcome}
                  </p>
                </div>
              )}
            </div>
            <div>
              <h4 className="text-xs text-stone-400 uppercase tracking-wide mb-1">
                Confidence
              </h4>
              <ConfidenceIndicator score={statement.confidenceScore} />
            </div>
            {statement.sourceUrl && (
              <a
                href={statement.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-stone-700"
              >
                <ExternalLink className="h-3 w-3" />
                View source
              </a>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center gap-2">
          <select
            value={selectedStatus}
            onChange={(e) =>
              setSelectedStatus(e.target.value as StatementStatus)
            }
            className="rounded-md border border-stone-200 px-2.5 py-1.5 text-xs text-stone-600 focus:outline-none focus:ring-1 focus:ring-stone-300"
          >
            <option value="unresolved">Unresolved</option>
            <option value="kept">Kept</option>
            <option value="delayed">Delayed</option>
            <option value="contradicted">Contradicted</option>
            <option value="too_vague">Too Vague</option>
          </select>
          <button
            onClick={() => onApprove(selectedStatus)}
            className="flex items-center gap-1.5 rounded-md bg-emerald-600 text-white px-3 py-1.5 text-xs font-medium hover:bg-emerald-700 transition-colors"
          >
            <Check className="h-3 w-3" />
            Approve
          </button>
          <button
            onClick={onReject}
            className="flex items-center gap-1.5 rounded-md border border-red-200 text-red-600 px-3 py-1.5 text-xs font-medium hover:bg-red-50 transition-colors"
          >
            <X className="h-3 w-3" />
            Reject
          </button>
          <button className="flex items-center gap-1.5 rounded-md border border-stone-200 text-stone-500 px-3 py-1.5 text-xs hover:bg-stone-50 transition-colors ml-auto">
            <Clock className="h-3 w-3" />
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}
