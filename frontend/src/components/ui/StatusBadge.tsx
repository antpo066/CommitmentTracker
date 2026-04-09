import { STATUS_CONFIG } from "@/lib/constants";
import type { StatementStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

export function StatusBadge({
  status,
  size = "sm",
}: {
  status: StatementStatus;
  size?: "sm" | "md";
}) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium",
        config.bg,
        config.color,
        config.border,
        size === "sm" && "px-2 py-0.5 text-xs",
        size === "md" && "px-2.5 py-0.5 text-sm"
      )}
    >
      {config.label}
    </span>
  );
}
