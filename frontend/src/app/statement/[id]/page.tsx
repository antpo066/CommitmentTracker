"use client";

import { use, useEffect, useState } from "react";
import { api, type StatementRecord } from "@/lib/api";
import { TopNav } from "@/components/layout/TopNav";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { TypeBadge } from "@/components/ui/TypeBadge";
import { CONFIDENCE_LABELS } from "@/lib/constants";
import { formatDateLong } from "@/lib/utils";
import { ArrowLeft, ExternalLink, MessageSquare, Flag, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function StatementDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [statement, setStatement] = useState<StatementRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<StatementRecord>(`/api/statements/${id}`)
      .then(setStatement)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <><TopNav /><div className="flex items-center justify-center py-20"><p className="text-sm text-stone-400">Loading...</p></div></>
    );
  }

  if (!statement) {
    return (
      <><TopNav /><div className="flex items-center justify-center py-20"><p className="text-sm text-stone-500">Statement not found.</p></div></>
    );
  }

  return (
    <>
      <TopNav />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-6">
        <Link
          href={`/person/${statement.person.slug}`}
          className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700 mb-6 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to {statement.person.name}
        </Link>

        <div className="space-y-6">
          {/* Quote header */}
          <div className="rounded-lg border border-[var(--color-border)] bg-white p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <StatusBadge status={statement.status} size="md" />
              <TypeBadge type={statement.statementType} />
              <span className="text-sm text-stone-400 ml-auto">{formatDateLong(statement.sourceDate)}</span>
            </div>
            <blockquote className="text-xl sm:text-2xl leading-relaxed text-stone-800 font-medium mb-6">
              &ldquo;{statement.exactQuote}&rdquo;
            </blockquote>
            <div className="flex flex-wrap gap-4 text-sm text-stone-500">
              <span>{statement.sourceTitle}</span>
              {statement.sourceUrl && (
                <a href={statement.sourceUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-stone-700">
                  <ExternalLink className="h-3.5 w-3.5" /> View source
                </a>
              )}
            </div>
          </div>

          {/* Context */}
          {statement.context && (
            <section className="rounded-lg border border-[var(--color-border)] bg-white p-6">
              <h2 className="text-sm font-medium text-stone-700 mb-3">Original Context</h2>
              <p className="text-sm text-stone-600 leading-relaxed">{statement.context}</p>
            </section>
          )}

          {/* Interpretation */}
          {statement.interpretation && (
            <section className="rounded-lg border border-[var(--color-border)] bg-white p-6">
              <h2 className="text-sm font-medium text-stone-700 mb-3">Interpretation</h2>
              <p className="text-sm text-stone-600 leading-relaxed">{statement.interpretation}</p>
            </section>
          )}

          {/* Details */}
          <section className="rounded-lg border border-[var(--color-border)] bg-white p-6">
            <h2 className="text-sm font-medium text-stone-700 mb-4">Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {statement.impliedDeadline && (
                <div>
                  <h4 className="text-xs text-stone-400 uppercase tracking-wide mb-1">Implied Deadline</h4>
                  <p className="text-sm text-stone-700">{formatDateLong(statement.impliedDeadline)}</p>
                </div>
              )}
              {statement.measurableOutcome && (
                <div>
                  <h4 className="text-xs text-stone-400 uppercase tracking-wide mb-1">Measurable Outcome</h4>
                  <p className="text-sm text-stone-700">{statement.measurableOutcome}</p>
                </div>
              )}
              <div>
                <h4 className="text-xs text-stone-400 uppercase tracking-wide mb-1">Confidence</h4>
                <div className="flex items-center gap-1.5">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className={`h-1.5 w-3 rounded-full ${i <= statement.confidenceScore ? "bg-stone-400" : "bg-stone-200"}`} />
                    ))}
                  </div>
                  <span className="text-sm text-stone-600">{CONFIDENCE_LABELS[statement.confidenceScore]}</span>
                </div>
              </div>
              {statement.sourceDocument && (
                <div>
                  <h4 className="text-xs text-stone-400 uppercase tracking-wide mb-1">Source Document</h4>
                  <p className="text-sm text-stone-700">{statement.sourceDocument.title}</p>
                </div>
              )}
            </div>
          </section>

          {/* Evidence trail */}
          {statement.evidence && statement.evidence.length > 0 && (
            <section className="rounded-lg border border-[var(--color-border)] bg-white p-6">
              <h2 className="text-sm font-medium text-stone-700 mb-4 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-stone-400" />
                Evidence Trail ({statement.evidence.length})
              </h2>
              <div className="space-y-3">
                {statement.evidence.map((ev) => (
                  <div key={ev.id} className="rounded-md bg-stone-50 border border-stone-200 p-4 border-l-2 border-l-stone-300">
                    <p className="text-sm text-stone-600 leading-relaxed">{ev.excerpt}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-stone-400">
                      {ev.sourceTitle && <span className="font-medium text-stone-500">{ev.sourceTitle}</span>}
                      <span>{formatDateLong(ev.evidenceDate)}</span>
                      <span className="capitalize">{ev.evidenceType.replace('_', ' ').toLowerCase()}</span>
                      {ev.sourceUrl && (
                        <a href={ev.sourceUrl} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 hover:text-stone-600">
                          <ExternalLink className="h-3 w-3" /> Source
                        </a>
                      )}
                    </div>
                    {ev.notes && <p className="text-xs text-stone-500 mt-2 italic">{ev.notes}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Admin notes */}
          {statement.adminNotes && (
            <section className="rounded-lg border border-[var(--color-border)] bg-white p-6">
              <h2 className="text-sm font-medium text-stone-700 mb-3">Resolution Notes</h2>
              <p className="text-sm text-stone-600 leading-relaxed">{statement.adminNotes}</p>
            </section>
          )}

          {/* Notes */}
          {statement.notes && statement.notes.length > 0 && (
            <section className="rounded-lg border border-[var(--color-border)] bg-white p-6">
              <h2 className="text-sm font-medium text-stone-700 mb-4">Notes &amp; Context</h2>
              <div className="space-y-3">
                {statement.notes.map((note) => (
                  <div key={note.id} className="rounded-md border border-stone-100 bg-stone-50/50 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="h-3.5 w-3.5 text-stone-400" />
                      <span className="text-xs font-medium text-stone-500 capitalize">{note.noteType.toLowerCase()}</span>
                      <span className="text-xs text-stone-400">{note.author.name} · {formatDateLong(note.createdAt)}</span>
                    </div>
                    <p className="text-sm text-stone-600 leading-relaxed">{note.content}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <div className="flex gap-3">
            <button className="flex items-center gap-1.5 rounded-md border border-stone-200 bg-white px-4 py-2 text-sm text-stone-600 hover:bg-stone-50 transition-colors">
              <Flag className="h-3.5 w-3.5" />
              Report correction
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
