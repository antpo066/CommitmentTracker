"use client";

import { use } from "react";
import { mockStatements, mockPerson } from "@/data/mock";
import { TopNav } from "@/components/layout/TopNav";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TypeBadge } from "@/components/ui/TypeBadge";
import { ConfidenceIndicator } from "@/components/ui/ConfidenceIndicator";
import { formatDateLong } from "@/lib/utils";
import {
  ArrowLeft,
  ExternalLink,
  MessageSquare,
  Flag,
  LinkIcon,
} from "lucide-react";
import Link from "next/link";

export default function StatementDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const statement = mockStatements.find((s) => s.id === id);
  const relatedStatements = statement?.relatedStatementIds
    ? mockStatements.filter((s) =>
        statement.relatedStatementIds!.includes(s.id)
      )
    : [];

  if (!statement) {
    return (
      <>
        <TopNav />
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <p className="text-stone-500">Statement not found.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <TopNav />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
        <Link
          href={`/person/${mockPerson.slug}`}
          className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700 mb-6 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to {mockPerson.name}
        </Link>

        <div className="flex gap-6">
          {/* Main content */}
          <main className="flex-1 min-w-0 space-y-6">
            {/* Quote header */}
            <div className="rounded-lg border border-[var(--color-border)] bg-white p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <StatusBadge status={statement.status} size="md" />
                <TypeBadge type={statement.statementType} />
                <span className="text-sm text-stone-400 ml-auto">
                  {formatDateLong(statement.dateMade)}
                </span>
              </div>

              <blockquote className="text-xl sm:text-2xl leading-relaxed text-stone-800 font-medium mb-6">
                &ldquo;{statement.exactQuote}&rdquo;
              </blockquote>

              <div className="flex flex-wrap gap-4 text-sm text-stone-500">
                <span>{statement.source}</span>
                {statement.sourceUrl && (
                  <a
                    href={statement.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-stone-500 hover:text-stone-700"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    View source
                  </a>
                )}
              </div>
            </div>

            {/* Context section */}
            <section className="rounded-lg border border-[var(--color-border)] bg-white p-6">
              <h2 className="text-sm font-medium text-stone-700 mb-3">
                Original Context
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                {statement.context}
              </p>
            </section>

            {/* Interpretation */}
            <section className="rounded-lg border border-[var(--color-border)] bg-white p-6">
              <h2 className="text-sm font-medium text-stone-700 mb-3">
                Interpretation
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                {statement.interpretation}
              </p>
            </section>

            {/* Details grid */}
            <section className="rounded-lg border border-[var(--color-border)] bg-white p-6">
              <h2 className="text-sm font-medium text-stone-700 mb-4">
                Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {statement.impliedDeadline && (
                  <div>
                    <h4 className="text-xs text-stone-400 uppercase tracking-wide mb-1">
                      Implied Deadline
                    </h4>
                    <p className="text-sm text-stone-700">
                      {formatDateLong(statement.impliedDeadline)}
                    </p>
                  </div>
                )}
                {statement.measurableOutcome && (
                  <div>
                    <h4 className="text-xs text-stone-400 uppercase tracking-wide mb-1">
                      Measurable Outcome
                    </h4>
                    <p className="text-sm text-stone-700">
                      {statement.measurableOutcome}
                    </p>
                  </div>
                )}
                <div>
                  <h4 className="text-xs text-stone-400 uppercase tracking-wide mb-1">
                    Confidence
                  </h4>
                  <ConfidenceIndicator score={statement.confidenceScore} />
                </div>
                {statement.resolutionDate && (
                  <div>
                    <h4 className="text-xs text-stone-400 uppercase tracking-wide mb-1">
                      Resolution Date
                    </h4>
                    <p className="text-sm text-stone-700">
                      {formatDateLong(statement.resolutionDate)}
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Evidence trail */}
            {statement.resolutionEvidence && (
              <section className="rounded-lg border border-[var(--color-border)] bg-white p-6">
                <h2 className="text-sm font-medium text-stone-700 mb-3">
                  Evidence Trail
                </h2>
                {statement.resolutionSummary && (
                  <div className="rounded-md bg-stone-50 border border-stone-100 p-4 mb-4">
                    <h4 className="text-xs font-medium text-stone-500 mb-1">
                      Resolution Summary
                    </h4>
                    <p className="text-sm text-stone-600 leading-relaxed">
                      {statement.resolutionSummary}
                    </p>
                  </div>
                )}
                <div>
                  <h4 className="text-xs font-medium text-stone-500 mb-1">
                    Supporting Evidence
                  </h4>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    {statement.resolutionEvidence}
                  </p>
                </div>
              </section>
            )}

            {/* Notes */}
            {statement.notes && statement.notes.length > 0 && (
              <section className="rounded-lg border border-[var(--color-border)] bg-white p-6">
                <h2 className="text-sm font-medium text-stone-700 mb-4">
                  Notes &amp; Context
                </h2>
                <div className="space-y-3">
                  {statement.notes.map((note) => (
                    <div
                      key={note.id}
                      className="rounded-md border border-stone-100 bg-stone-50/50 p-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="h-3.5 w-3.5 text-stone-400" />
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
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button className="flex items-center gap-1.5 rounded-md border border-stone-200 bg-white px-4 py-2 text-sm text-stone-600 hover:bg-stone-50 transition-colors">
                <Flag className="h-3.5 w-3.5" />
                Report correction
              </button>
            </div>
          </main>

          {/* Sidebar: Related statements */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-20 space-y-4">
              {relatedStatements.length > 0 && (
                <div className="rounded-lg border border-[var(--color-border)] bg-white p-4">
                  <h3 className="text-sm font-medium text-stone-700 mb-3 flex items-center gap-1.5">
                    <LinkIcon className="h-3.5 w-3.5" />
                    Related Statements
                  </h3>
                  <div className="space-y-3">
                    {relatedStatements.map((rs) => (
                      <Link
                        key={rs.id}
                        href={`/statement/${rs.id}`}
                        className="block rounded-md border border-stone-100 p-3 hover:bg-stone-50 transition-colors"
                      >
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <StatusBadge status={rs.status} />
                        </div>
                        <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                          &ldquo;{rs.exactQuote}&rdquo;
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
