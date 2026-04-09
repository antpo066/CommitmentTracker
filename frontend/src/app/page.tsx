"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TopNav } from "@/components/layout/TopNav";
import { api, type PersonSummary } from "@/lib/api";
import { Scale, ChevronRight } from "lucide-react";

export default function Home() {
  const [persons, setPersons] = useState<PersonSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get<PersonSummary[]>("/api/persons")
      .then(setPersons)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <TopNav />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2.5 mb-3">
            <Scale className="h-6 w-6 text-stone-400" />
            <h1 className="text-2xl font-semibold text-stone-800 tracking-tight">
              Commitment Tracker
            </h1>
          </div>
          <p className="text-sm text-stone-500 max-w-lg mx-auto leading-relaxed">
            Evidence-based tracking of public promises, predictions, and
            commitments. Every statement is sourced, reviewed, and classified
            using a{" "}
            <Link
              href="/methodology"
              className="underline underline-offset-2 hover:text-stone-700"
            >
              documented methodology
            </Link>
            .
          </p>
        </div>

        {loading ? (
          <p className="text-center text-sm text-stone-400 py-8">
            Loading tracked profiles...
          </p>
        ) : (
          <div className="space-y-3">
            {persons.map((p) => (
              <Link
                key={p.id}
                href={`/person/${p.slug}`}
                className="flex items-center gap-4 rounded-lg border border-[var(--color-border)] bg-white px-5 py-4 hover:border-stone-300 hover:shadow-sm transition-all group"
              >
                <div className="h-11 w-11 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center shrink-0">
                  <span className="text-sm font-semibold text-stone-400">
                    {p.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="font-medium text-stone-800">
                      {p.name}
                    </span>
                    {p.title && (
                      <span className="text-xs text-stone-400 truncate">
                        {p.title}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-3 mt-1 text-[11px] text-stone-400">
                    <span>{p.totalStatements} statements</span>
                    {p.stats.kept > 0 && (
                      <span className="text-emerald-600">
                        {p.stats.kept} kept
                      </span>
                    )}
                    {p.stats.contradicted > 0 && (
                      <span className="text-red-600">
                        {p.stats.contradicted} contradicted
                      </span>
                    )}
                    {p.stats.unresolved > 0 && (
                      <span>{p.stats.unresolved} unresolved</span>
                    )}
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-stone-300 group-hover:text-stone-500 transition-colors" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
