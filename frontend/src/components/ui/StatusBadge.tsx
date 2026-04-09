import { getStatusConfig } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function StatusBadge({
  status,
  size = "sm",
}: {
  status: string;
  size?: "sm" | "md";
}) {
  const config = getStatusConfig(status);
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
