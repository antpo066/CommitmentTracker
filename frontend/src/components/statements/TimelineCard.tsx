"use client";

import type { Statement } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TypeBadge } from "@/components/ui/TypeBadge";
import { ConfidenceIndicator } from "@/components/ui/ConfidenceIndicator";
import {
  ExternalLink,
  FileText,
  Eye,
  Target,
  Calendar,
} from "lucide-react";
import Link from "next/link";

interface TimelineCardProps {
  statement: Statement;
  onViewEvidence: (statement: Statement) => void;
  isSelected: boolean;
}

export function TimelineCard({
  statement,
  onViewEvidence,
  isSelected,
}: TimelineCardProps) {
  return (
    <article
      className={`rounded-lg border bg-white p-4 sm:p-5 transition-all ${
        isSelected
          ? "border-stone-400 ring-1 ring-stone-200"
          : "border-[var(--color-border)] hover:border-stone-300"
      }`}
    >
      {/* Top row: badges + source + date */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <StatusBadge status={statement.status} />
        <TypeBadge type={statement.statementType} />
        <span className="text-xs text-stone-400 ml-auto">
          {statement.source}
        </span>
        <span className="text-xs text-stone-400">
          {formatDate(statement.dateMade)}
        </span>
      </div>

      {/* Quote — the visual centerpiece */}
      <blockquote className="text-base sm:text-lg leading-relaxed text-stone-800 font-medium mb-4">
        &ldquo;{statement.exactQuote}&rdquo;
      </blockquote>

      {/* Metadata lines */}
      <div className="space-y-1.5 mb-4">
        {statement.measurableOutcome && (
          <div className="flex items-start gap-2 text-xs text-stone-500">
            <Target className="h-3 w-3 mt-0.5 shrink-0 text-stone-400" />
            <span>{statement.measurableOutcome}</span>
          </div>
        )}
        {statement.impliedDeadline && (
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <Calendar className="h-3 w-3 shrink-0 text-stone-400" />
            <span>Deadline: {formatDate(statement.impliedDeadline)}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <ConfidenceIndicator score={statement.confidenceScore} />
        </div>
      </div>

      {/* Resolution summary */}
      {statement.resolutionSummary && (
        <div className="rounded-md bg-stone-50 border border-stone-100 px-3 py-2 mb-4">
          <p className="text-xs text-stone-600 leading-relaxed">
            <span className="font-medium text-stone-700">Resolution: </span>
            {statement.resolutionSummary}
          </p>
        </div>
      )}

      {/* Footer actions */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100">
        <button
          onClick={() => onViewEvidence(statement)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs text-stone-500 hover:text-stone-700 hover:bg-stone-50 transition-colors"
        >
          <Eye className="h-3 w-3" />
          View evidence
        </button>
        <Link
          href={`/statement/${statement.id}`}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs text-stone-500 hover:text-stone-700 hover:bg-stone-50 transition-colors"
        >
          <FileText className="h-3 w-3" />
          Full statement
        </Link>
        {statement.sourceUrl && (
          <a
            href={statement.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs text-stone-500 hover:text-stone-700 hover:bg-stone-50 transition-colors ml-auto"
          >
            <ExternalLink className="h-3 w-3" />
            Source
          </a>
        )}
      </div>
    </article>
  );
}
