import { TYPE_CONFIG } from "@/lib/constants";
import type { StatementType } from "@/lib/types";
import { cn } from "@/lib/utils";

export function TypeBadge({ type }: { type: StatementType }) {
  const config = TYPE_CONFIG[type];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-1.5 py-0.5 text-xs font-medium",
        config.bg,
        config.color
      )}
    >
      {config.label}
    </span>
  );
}
