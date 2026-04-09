import type { PersonSummary } from "@/lib/api";

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-[var(--color-border)] bg-white px-3 py-1.5">
      <span className={`text-lg font-semibold tabular-nums leading-none ${color}`}>{value}</span>
      <span className="text-[11px] text-stone-400 leading-tight">{label}</span>
    </div>
  );
}

export function StatsSummary({ person }: { person: PersonSummary }) {
  return (
    <div className="border-b border-[var(--color-border)] bg-stone-50/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-2.5">
        <div className="flex items-center gap-2 overflow-x-auto">
          <StatCard label="Kept" value={person.stats.kept} color="text-emerald-600" />
          <StatCard label="Delayed" value={person.stats.delayed} color="text-amber-600" />
          <StatCard label="Contradicted" value={person.stats.contradicted} color="text-red-600" />
          <StatCard label="Unresolved" value={person.stats.unresolved} color="text-slate-500" />
          <StatCard label="Too Vague" value={person.stats.tooVague} color="text-slate-400" />
          {person.stats.partiallyFulfilled > 0 && (
            <StatCard label="Partial" value={person.stats.partiallyFulfilled} color="text-blue-600" />
          )}
          <span className="hidden sm:inline text-[11px] text-stone-400 ml-auto shrink-0">
            Classified using{" "}
            <a href="/methodology" className="underline underline-offset-2 hover:text-stone-600 transition-colors">
              documented methodology
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}
