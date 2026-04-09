import type { PersonSummary } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Calendar, Radio, Clock, FileText } from "lucide-react";

export function ProfileHeader({ person }: { person: PersonSummary }) {
  return (
    <div className="border-b border-[var(--color-border)] bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="h-11 w-11 sm:h-13 sm:w-13 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center shrink-0">
            <span className="text-base sm:text-lg font-semibold text-stone-400">
              {person.name.split(" ").map((n) => n[0]).join("")}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <h1 className="text-lg sm:text-xl font-semibold text-[var(--color-foreground)] tracking-tight leading-tight">
                {person.name}
              </h1>
              {person.title && (
                <>
                  <span className="text-xs text-stone-400">·</span>
                  <span className="text-xs text-stone-500">{person.title}</span>
                </>
              )}
            </div>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-stone-400">
              {person.trackedSources.length > 0 && (
                <span className="flex items-center gap-1">
                  <Radio className="h-2.5 w-2.5" />
                  {person.trackedSources.length} sources
                </span>
              )}
              {person.coverageFrom && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-2.5 w-2.5" />
                  {formatDate(person.coverageFrom)}
                  {person.coverageTo && ` – ${formatDate(person.coverageTo)}`}
                </span>
              )}
              <span className="flex items-center gap-1">
                <FileText className="h-2.5 w-2.5" />
                {person.totalStatements} statements
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
