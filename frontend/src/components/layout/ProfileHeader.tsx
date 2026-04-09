import type { Person } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Calendar, Radio, Clock, FileText } from "lucide-react";

export function ProfileHeader({ person }: { person: Person }) {
  return (
    <div className="border-b border-[var(--color-border)] bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-start gap-4 sm:gap-6">
          {/* Avatar */}
          <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-stone-200 flex items-center justify-center shrink-0">
            <span className="text-xl sm:text-2xl font-semibold text-stone-500">
              {person.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </span>
          </div>

          <div className="min-w-0 flex-1">
            {/* Name and handle */}
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h1 className="text-xl sm:text-2xl font-semibold text-[var(--color-foreground)] tracking-tight">
                {person.name}
              </h1>
              {person.handle && (
                <span className="text-sm text-[var(--color-muted)]">
                  {person.handle}
                </span>
              )}
            </div>

            {/* Descriptor */}
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              {person.descriptor}
            </p>

            {/* Meta row */}
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-stone-500">
              <span className="flex items-center gap-1.5">
                <Radio className="h-3 w-3" />
                {person.trackedSources.length} tracked sources
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3 w-3" />
                {formatDate(person.coverageDates.from)} –{" "}
                {formatDate(person.coverageDates.to)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3 w-3" />
                Updated {formatDate(person.lastUpdated)}
              </span>
              <span className="flex items-center gap-1.5">
                <FileText className="h-3 w-3" />
                {person.totalStatements} statements tracked
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
