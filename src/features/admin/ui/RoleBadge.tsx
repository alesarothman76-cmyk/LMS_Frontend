import { Badge } from "@/shared/ui/badge";
import { cn } from "@/lib/utils";

const ROLE_STYLES: Record<string, string> = {
  Admin: "bg-[#ecdcc5] text-[#29241e] border-[#eedfcb] font-bold",
  Librarian: "bg-[#3e3830] text-[#e2dacb] border-[#564e43]",
  Member: "bg-transparent text-[#b2a899] border-[#524a3e]",
};

export function RoleBadge({ role }: { role: string }) {
  const style = ROLE_STYLES[role] ?? ROLE_STYLES.Member;

  return (
    <Badge
      variant="outline"
      className={cn("font-mono text-xxs uppercase tracking-wide rounded px-2 py-0.5", style)}
    >
      {role}
    </Badge>
  );
}
