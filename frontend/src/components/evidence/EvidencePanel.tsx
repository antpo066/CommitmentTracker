"use client";

import type { Statement } from "@/lib/types";
import { formatDateLong } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TypeBadge } from "@/components/ui/TypeBadge";
import { ConfidenceIndicator } from "@/components/ui/ConfidenceIndicator";
import { X, ExternalLink, Flag, MessageSquare } from "lucide-react";
import Link from "next/link";

interface EvidencePanelProps {
  statement: Statement | null;
  onClose: () => void;
}

export function EvidencePanel({ statement, onClose }: EvidencePanelProps) {
  if (!statement) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-stone-400">
        Select a statement to view evidence
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          <StatusBadge status={statement.status} size="md" />
          <TypeBadge type={statement.statementType} />
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors lg:hidden"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Exact quote */}
      <div>
        <h4 className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-1.5">
          Exact Quote
        </h4>
        <blockquote className="text-sm text-stone-800 leading-relaxed border-l-2 border-stone-300 pl-3 italic">
          &ldquo;{statement.exactQuote}&rdquo;
        </blockquote>
      </div>

      {/* Speaker & source */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <h4 className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-1">
            Source
          </h4>
          <p className="text-sm text-stone-700">{statement.source}</p>
          {statement.sourceUrl && (
            <a
              href={statement.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-stone-700 mt-0.5"
            >
              <ExternalLink className="h-3 w-3" />
              View source
            </a>
          )}
        </div>
        <div>
          <h4 className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-1">
            Date
          </h4>
          <p className="text-sm text-stone-700">
            {formatDateLong(statement.dateMade)}
          </p>
        </div>
      </div>

      {/* Context */}
      <div>
        <h4 className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-1.5">
          Original Context
        </h4>
        <p className="text-sm text-stone-600 leading-relaxed">
          {statement.context}
        </p>
      </div>

      {/* Interpretation */}
      <div>
        <h4 className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-1.5">
          Interpretation
        </h4>
        <p className="text-sm text-stone-600 leading-relaxed">
          {statement.interpretation}
        </p>
      </div>

      {/* Deadline & outcome */}
      {(statement.impliedDeadline || statement.measurableOutcome) && (
        <div className="grid grid-cols-1 gap-3">
          {statement.impliedDeadline && (
            <div>
              <h4 className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-1">
                Implied Deadline
              </h4>
              <p className="text-sm text-stone-700">
                {formatDateLong(statement.impliedDeadline)}
              </p>
            </div>
          )}
          {statement.measurableOutcome && (
            <div>
              <h4 className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-1">
                Measurable Outcome
              </h4>
              <p className="text-sm text-stone-700">
                {statement.measurableOutcome}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Confidence */}
      <div>
        <h4 className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-1.5">
          Confidence
        </h4>
        <ConfidenceIndicator score={statement.confidenceScore} />
      </div>

      {/* Resolution evidence */}
      {statement.resolutionEvidence && (
        <div className="rounded-md bg-stone-50 border border-stone-100 p-3">
          <h4 className="text-xs font-medium text-stone-500 uppercase tracking-wide mb-1.5">
            Resolution Evidence
          </h4>
          <p className="text-sm text-stone-600 leading-relaxed">
            {statement.resolutionEvidence}
          </p>
          {statement.resolutionDate && (
            <p className="text-xs text-stone-400 mt-2">
              Resolved: {formatDateLong(statement.resolutionDate)}
            </p>
          )}
        </div>
      )}

      {/* Notes */}
      {statement.notes && statement.notes.length > 0 && (
        <div>
          <h4 className="text-xs font-medium text-stone-400 uppercase tracking-wide mb-2">
            Notes &amp; Context
          </h4>
          <div className="space-y-2">
            {statement.notes.map((note) => (
              <div
                key={note.id}
                className="rounded-md border border-stone-100 bg-stone-50/50 p-3"
              >
                <div className="flex items-center gap-2 mb-1">
                  <MessageSquare className="h-3 w-3 text-stone-400" />
                  <span className="text-xs font-medium text-stone-500 capitalize">
                    {note.type}
                  </span>
                  <span className="text-xs text-stone-400">
                    {note.author} · {formatDateLong(note.date)}
                  </span>
                </div>
                <p className="text-sm text-stone-600 leading-relaxed">
                  {note.content}
                </p>
                {note.sourceUrl && (
                  <a
                    href={note.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-stone-700 mt-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Source
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t border-stone-100">
        <Link
          href={`/statement/${statement.id}`}
          className="flex-1 text-center rounded-md border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-stone-600 hover:bg-stone-50 transition-colors"
        >
          Full Statement Page
        </Link>
        <button className="flex items-center justify-center gap-1.5 rounded-md border border-stone-200 bg-white px-3 py-2 text-xs text-stone-500 hover:bg-stone-50 transition-colors">
          <Flag className="h-3 w-3" />
          Report
        </button>
      </div>
    </div>
  );
}
