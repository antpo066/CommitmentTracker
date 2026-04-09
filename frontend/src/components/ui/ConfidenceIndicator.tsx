import { CONFIDENCE_LABELS } from "@/lib/constants";
import type { ConfidenceLevel } from "@/lib/types";

export function ConfidenceIndicator({ score }: { score: ConfidenceLevel }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`h-1.5 w-3 rounded-full ${
              i <= score ? "bg-stone-400" : "bg-stone-200"
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-[var(--color-muted)]">
        {CONFIDENCE_LABELS[score]}
      </span>
    </div>
  );
}
