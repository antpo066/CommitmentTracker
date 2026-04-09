import type { Person } from "@/lib/types";

interface StatCardProps {
  label: string;
  value: number;
  color: string;
}

function StatCard({ label, value, color }: StatCardProps) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-[var(--color-border)] bg-white px-4 py-3 min-w-[100px]">
      <span className={`text-2xl font-semibold tabular-nums ${color}`}>
        {value}
      </span>
      <span className="text-xs text-[var(--color-muted)] mt-0.5">{label}</span>
    </div>
  );
}

export function StatsSummary({ person }: { person: Person }) {
  return (
    <div className="border-b border-[var(--color-border)] bg-stone-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4">
        <div className="flex gap-3 overflow-x-auto pb-1 sm:justify-center">
          <StatCard
            label="Kept"
            value={person.stats.kept}
            color="text-emerald-600"
          />
          <StatCard
            label="Delayed"
            value={person.stats.delayed}
            color="text-amber-600"
          />
          <StatCard
            label="Contradicted"
            value={person.stats.contradicted}
            color="text-red-600"
          />
          <StatCard
            label="Unresolved"
            value={person.stats.unresolved}
            color="text-slate-600"
          />
          <StatCard
            label="Too Vague"
            value={person.stats.tooVague}
            color="text-slate-400"
          />
          {person.stats.avgResolutionDays && (
            <div className="flex flex-col items-center rounded-lg border border-[var(--color-border)] bg-white px-4 py-3 min-w-[100px]">
              <span className="text-2xl font-semibold tabular-nums text-stone-600">
                {person.stats.avgResolutionDays}
              </span>
              <span className="text-xs text-[var(--color-muted)] mt-0.5">
                Avg. days
              </span>
            </div>
          )}
        </div>

        {/* Methodology banner */}
        <p className="mt-3 text-center text-xs text-stone-400 max-w-2xl mx-auto">
          Statements are documented from public sources and classified using a{" "}
          <a
            href="/methodology"
            className="underline underline-offset-2 hover:text-stone-600 transition-colors"
          >
            consistent methodology
          </a>
          . Resolutions are based on verifiable evidence. This is a factual
          record, not an editorial assessment.
        </p>
      </div>
    </div>
  );
}
