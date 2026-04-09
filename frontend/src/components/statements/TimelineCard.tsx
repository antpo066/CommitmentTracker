"use client";

import type { Statement } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { CONFIDENCE_LABELS } from "@/lib/constants";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TypeBadge } from "@/components/ui/TypeBadge";
import { ExternalLink, FileText, Eye } from "lucide-react";
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
      onClick={() => onViewEvidence(statement)}
      className={`group rounded-lg border bg-white transition-all cursor-pointer ${
        isSelected
          ? "border-stone-400 shadow-sm ring-1 ring-stone-100"
          : "border-[var(--color-border)] hover:border-stone-300 hover:shadow-sm"
      }`}
    >
      <div className="px-4 pt-3.5 pb-3">
        {/* Top row: badges + source + date */}
        <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
          <StatusBadge status={statement.status} />
          <TypeBadge type={statement.statementType} />
          <div className="flex items-center gap-1.5 ml-auto text-[11px] text-stone-400">
            <span>{statement.source}</span>
            <span className="text-stone-300">·</span>
            <span>{formatDate(statement.dateMade)}</span>
          </div>
        </div>

        {/* Quote — dominant */}
        <blockquote className="text-[15px] leading-relaxed text-stone-800 font-medium mb-2.5">
          &ldquo;{statement.exactQuote}&rdquo;
        </blockquote>

        {/* Combined metadata row */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-stone-400 mb-2.5">
          {statement.measurableOutcome && (
            <span>
              <span className="text-stone-500 font-medium">Target:</span>{" "}
              {statement.measurableOutcome.length > 60
                ? statement.measurableOutcome.slice(0, 60) + "…"
                : statement.measurableOutcome}
            </span>
          )}
          {statement.impliedDeadline && (
            <span>
              <span className="text-stone-500 font-medium">Deadline:</span>{" "}
              {formatDate(statement.impliedDeadline)}
            </span>
          )}
          <span>
            <span className="text-stone-500 font-medium">Confidence:</span>{" "}
            {CONFIDENCE_LABELS[statement.confidenceScore]}
          </span>
        </div>

        {/* Resolution summary — visually distinct */}
        {statement.resolutionSummary && (
          <div className="rounded-md bg-stone-50 border border-stone-150 px-3 py-2 mb-2.5 border-l-2 border-l-stone-300">
            <p className="text-xs text-stone-600 leading-relaxed">
              <span className="font-semibold text-stone-700 uppercase tracking-wide text-[10px]">
                Resolution:{" "}
              </span>
              {statement.resolutionSummary}
            </p>
          </div>
        )}
      </div>

      {/* Footer actions — separated */}
      <div className="flex items-center gap-1 px-4 py-2 border-t border-stone-100 bg-stone-50/40 rounded-b-lg">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewEvidence(statement);
          }}
          className="flex items-center gap-1 px-2 py-1 rounded text-[11px] text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <Eye className="h-3 w-3" />
          Evidence
        </button>
        <Link
          href={`/statement/${statement.id}`}
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-1 px-2 py-1 rounded text-[11px] text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <FileText className="h-3 w-3" />
          Detail
        </Link>
        {statement.sourceUrl && (
          <a
            href={statement.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 px-2 py-1 rounded text-[11px] text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors ml-auto"
          >
            <ExternalLink className="h-3 w-3" />
            Source
          </a>
        )}
      </div>
    </article>
  );
}
