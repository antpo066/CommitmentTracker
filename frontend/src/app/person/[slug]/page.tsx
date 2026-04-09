"use client";

import { useState, useMemo, useEffect, use } from "react";
import { api, type PersonSummary, type StatementRecord, type StatementsResponse } from "@/lib/api";
import { getMockPerson, getMockStatements } from "@/data/mock-api";
import { TopNav } from "@/components/layout/TopNav";
import { ProfileHeader } from "@/components/layout/ProfileHeader";
import { StatsSummary } from "@/components/layout/StatsSummary";
import { FilterSidebar, type FilterState } from "@/components/filters/FilterSidebar";
import { TimelineCard } from "@/components/statements/TimelineCard";
import { EvidencePanel } from "@/components/evidence/EvidencePanel";
import { EvidenceDrawer } from "@/components/evidence/EvidenceDrawer";
import { Filter } from "lucide-react";

export default function PersonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [person, setPerson] = useState<PersonSummary | null>(null);
  const [statements, setStatements] = useState<StatementRecord[]>([]);
  const [selectedStatement, setSelectedStatement] = useState<StatementRecord | null>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    statuses: [],
    types: [],
    resolved: "all",
    confidence: [],
    dateFrom: "",
    dateTo: "",
  });

  // Fetch person and statements
  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get<PersonSummary>(`/api/persons/${slug}`),
      api.get<StatementsResponse>(`/api/statements?personSlug=${slug}&limit=100`),
    ])
      .then(([p, s]) => {
        setPerson(p);
        setStatements(s.statements);
      })
      .catch(() => {
        // Fallback to mock data if backend is unavailable
        const mp = getMockPerson(slug);
        if (mp) {
          setPerson(mp);
          setStatements(getMockStatements(slug).statements);
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  // Apply client-side filters
  const filteredStatements = useMemo(() => {
    return statements.filter((s) => {
      if (filters.statuses.length > 0 && !filters.statuses.includes(s.status.toLowerCase() as any))
        return false;
      if (filters.types.length > 0 && !filters.types.includes(s.statementType.toLowerCase() as any))
        return false;
      if (filters.resolved === "resolved" && s.status === "UNRESOLVED") return false;
      if (filters.resolved === "unresolved" && s.status !== "UNRESOLVED") return false;
      if (filters.dateFrom && s.sourceDate < filters.dateFrom) return false;
      if (filters.dateTo && s.sourceDate > filters.dateTo) return false;
      return true;
    });
  }, [statements, filters]);

  // Auto-select first statement on desktop
  useEffect(() => {
    if (
      filteredStatements.length > 0 &&
      !selectedStatement &&
      typeof window !== "undefined" &&
      window.innerWidth >= 1024
    ) {
      setSelectedStatement(filteredStatements[0]);
    }
  }, [filteredStatements, selectedStatement]);

  const handleViewEvidence = (statement: StatementRecord) => {
    setSelectedStatement(statement);
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setMobileDrawerOpen(true);
    }
  };

  if (loading) {
    return (
      <>
        <TopNav />
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-stone-400">Loading profile...</p>
        </div>
      </>
    );
  }

  if (!person) {
    return (
      <>
        <TopNav />
        <div className="flex items-center justify-center py-20">
          <p className="text-sm text-stone-500">Person not found.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <TopNav />
      <ProfileHeader person={person} />
      <StatsSummary person={person} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4">
        {/* Mobile filter toggle */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
            className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-stone-600"
          >
            <Filter className="h-3.5 w-3.5" />
            Filters
            {(filters.statuses.length > 0 || filters.types.length > 0) && (
              <span className="ml-1 rounded-full bg-stone-800 text-white text-xs px-1.5 py-0.5">
                {filters.statuses.length + filters.types.length}
              </span>
            )}
          </button>
          {mobileFiltersOpen && (
            <div className="mt-3 rounded-lg border border-[var(--color-border)] bg-white p-4">
              <FilterSidebar
                filters={filters}
                onChange={setFilters}
                totalResults={filteredStatements.length}
              />
            </div>
          )}
        </div>

        {/* 3-column layout */}
        <div className="flex gap-6">
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-20">
              <FilterSidebar
                filters={filters}
                onChange={setFilters}
                totalResults={filteredStatements.length}
              />
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <div className="space-y-3">
              {filteredStatements.length === 0 ? (
                <div className="rounded-lg border border-[var(--color-border)] bg-white p-8 text-center">
                  <p className="text-sm text-stone-500">
                    No statements match your current filters.
                  </p>
                </div>
              ) : (
                filteredStatements.map((s) => (
                  <TimelineCard
                    key={s.id}
                    statement={s}
                    onViewEvidence={handleViewEvidence}
                    isSelected={selectedStatement?.id === s.id}
                  />
                ))
              )}
            </div>
          </main>

          <aside className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-20">
              <div className="rounded-lg border border-[var(--color-border)] bg-white p-4 max-h-[calc(100vh-6rem)] overflow-y-auto">
                <EvidencePanel
                  statement={selectedStatement}
                  onClose={() => setSelectedStatement(null)}
                />
              </div>
            </div>
          </aside>
        </div>
      </div>

      {mobileDrawerOpen && (
        <EvidenceDrawer
          statement={selectedStatement}
          onClose={() => setMobileDrawerOpen(false)}
        />
      )}
    </>
  );
}
