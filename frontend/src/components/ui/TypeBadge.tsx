import { getTypeConfig } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function TypeBadge({ type }: { type: string }) {
  const config = getTypeConfig(type);
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
