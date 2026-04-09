"use client";

import type { Statement } from "@/lib/types";
import { formatDateLong } from "@/lib/utils";
import { CONFIDENCE_LABELS } from "@/lib/constants";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TypeBadge } from "@/components/ui/TypeBadge";
import { X, ExternalLink, Flag, MessageSquare, FileText } from "lucide-react";
import Link from "next/link";

interface EvidencePanelProps {
  statement: Statement | null;
  onClose: () => void;
}

export function EvidencePanel({ statement, onClose }: EvidencePanelProps) {
  if (!statement) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="h-10 w-10 rounded-full bg-stone-100 flex items-center justify-center mb-3">
          <FileText className="h-4 w-4 text-stone-300" />
        </div>
        <p className="text-sm font-medium text-stone-400 mb-1">No statement selected</p>
        <p className="text-xs text-stone-400/80 max-w-[200px] leading-relaxed">
          Click on any statement in the timeline to view its full evidence and context here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          <StatusBadge status={statement.status} size="md" />
          <TypeBadge type={statement.statementType} />
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded text-stone-300 hover:text-stone-500 hover:bg-stone-100 transition-colors lg:hidden"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Exact quote */}
      <div>
        <h4 className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-1">
          Exact Quote
        </h4>
        <blockquote className="text-sm text-stone-800 leading-relaxed border-l-2 border-stone-300 pl-3 italic">
          &ldquo;{statement.exactQuote}&rdquo;
        </blockquote>
      </div>

      {/* Source & date in one row */}
      <div className="flex gap-4">
        <div className="flex-1">
          <h4 className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-0.5">
            Source
          </h4>
          <p className="text-xs text-stone-700">{statement.source}</p>
          {statement.sourceUrl && (
            <a
              href={statement.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-stone-400 hover:text-stone-600 mt-0.5"
            >
              <ExternalLink className="h-2.5 w-2.5" />
              View
            </a>
          )}
        </div>
        <div>
          <h4 className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-0.5">
            Date
          </h4>
          <p className="text-xs text-stone-700">
            {formatDateLong(statement.dateMade)}
          </p>
        </div>
      </div>

      {/* Context */}
      <div>
        <h4 className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-1">
          Original Context
        </h4>
        <p className="text-xs text-stone-600 leading-relaxed">
          {statement.context}
        </p>
      </div>

      {/* Interpretation */}
      <div>
        <h4 className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-1">
          Interpretation
        </h4>
        <p className="text-xs text-stone-600 leading-relaxed">
          {statement.interpretation}
        </p>
      </div>

      {/* Compact details */}
      <div className="grid grid-cols-2 gap-2">
        {statement.impliedDeadline && (
          <div>
            <h4 className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-0.5">
              Deadline
            </h4>
            <p className="text-xs text-stone-700">
              {formatDateLong(statement.impliedDeadline)}
            </p>
          </div>
        )}
        {statement.measurableOutcome && (
          <div className={statement.impliedDeadline ? "" : "col-span-2"}>
            <h4 className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-0.5">
              Outcome
            </h4>
            <p className="text-xs text-stone-700">
              {statement.measurableOutcome}
            </p>
          </div>
        )}
        <div>
          <h4 className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-0.5">
            Confidence
          </h4>
          <div className="flex items-center gap-1">
            <div className="flex gap-px">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`h-1 w-2.5 rounded-full ${
                    i <= statement.confidenceScore ? "bg-stone-400" : "bg-stone-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] text-stone-500">
              {CONFIDENCE_LABELS[statement.confidenceScore]}
            </span>
          </div>
        </div>
      </div>

      {/* Resolution evidence */}
      {statement.resolutionEvidence && (
        <div className="rounded-md bg-stone-50 border border-stone-200 p-3 border-l-2 border-l-stone-300">
          <h4 className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
            Resolution Evidence
          </h4>
          <p className="text-xs text-stone-600 leading-relaxed">
            {statement.resolutionEvidence}
          </p>
          {statement.resolutionDate && (
            <p className="text-[11px] text-stone-400 mt-1.5">
              Resolved: {formatDateLong(statement.resolutionDate)}
            </p>
          )}
        </div>
      )}

      {/* Notes */}
      {statement.notes && statement.notes.length > 0 && (
        <div>
          <h4 className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-2">
            Notes ({statement.notes.length})
          </h4>
          <div className="space-y-1.5">
            {statement.notes.map((note) => (
              <div
                key={note.id}
                className="rounded border border-stone-100 bg-stone-50/50 p-2.5"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <MessageSquare className="h-2.5 w-2.5 text-stone-400" />
                  <span className="text-[10px] font-medium text-stone-500 capitalize">
                    {note.type}
                  </span>
                  <span className="text-[10px] text-stone-400">
                    · {note.author}
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {note.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-1.5 pt-2 border-t border-stone-100">
        <Link
          href={`/statement/${statement.id}`}
          className="flex-1 text-center rounded border border-stone-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-stone-600 hover:bg-stone-50 transition-colors"
        >
          Full Page
        </Link>
        <button className="flex items-center justify-center gap-1 rounded border border-stone-200 bg-white px-2.5 py-1.5 text-[11px] text-stone-400 hover:bg-stone-50 transition-colors">
          <Flag className="h-2.5 w-2.5" />
          Report
        </button>
      </div>
    </div>
  );
}
