import { Badge } from "@/shared/ui/badge";
import { cn } from "@/lib/utils";

export function StatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-mono text-xxs uppercase tracking-wide rounded px-2 py-0.5",
        isActive
          ? "bg-emerald-950/30 text-emerald-400 border-emerald-800/60"
          : "bg-red-950/20 text-red-400 border-red-900/50"
      )}
    >
      {isActive ? "Active" : "Inactive"}
    </Badge>
  );
}
