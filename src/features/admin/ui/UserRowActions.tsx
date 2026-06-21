"use client";

import { useState } from "react";
import { MoreHorizontal, ShieldCheck, ShieldOff, UserX, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";
import { usePromoteToLibrarian } from "../hooks/usePromoteToLibrarian";
import { useDemoteToMember } from "../hooks/useDemoteToMember";
import { useDeactivateUser } from "../hooks/useDeactivateUser";
import { useReactivateUser } from "../hooks/useReactivateUser";
import { UserSummaryDto } from "../types";

type PendingAction = "promote" | "demote" | "deactivate" | null;

const CONFIRM_COPY: Record<Exclude<PendingAction, null>, { title: string; description: string }> = {
  promote: {
    title: "Promote to Librarian?",
    description: "This replaces the user's current role. They'll gain access to manage items, item sets, media, and resource templates.",
  },
  demote: {
    title: "Demote to Member?",
    description: "This replaces the user's current role. They'll lose Librarian access to management routes.",
  },
  deactivate: {
    title: "Deactivate this user?",
    description: "They won't be able to sign in until an admin reactivates the account.",
  },
};

export function UserRowActions({ user }: { user: UserSummaryDto }) {
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);

  const promote = usePromoteToLibrarian();
  const demote = useDemoteToMember();
  const deactivate = useDeactivateUser();
  const reactivate = useReactivateUser();

  const isAdmin = user.role === "Admin";
  const isBusy = promote.isPending || demote.isPending || deactivate.isPending || reactivate.isPending;

  const runAction = (
    mutate: (id: string, opts: { onSuccess: (r: { message?: string; errors?: string[] }) => void; onError: () => void }) => void
  ) => {
    mutate(user.id, {
      onSuccess: (result) => {
        if (result.errors?.length) {
          toast.error(result.errors.join(" "));
        } else {
          toast.success(result.message ?? "Done.");
        }
      },
      onError: () => {
        toast.error("Something went wrong. Please try again.");
      },
    });
    setPendingAction(null);
  };

  const handleReactivate = () => {
    reactivate.mutate(user.id, {
      onSuccess: (result) => {
        if (result.errors?.length) {
          toast.error(result.errors.join(" "));
        } else {
          toast.success(result.message ?? "Done.");
        }
      },
      onError: () => {
        toast.error("Something went wrong. Please try again.");
      },
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            disabled={isAdmin || isBusy}
            className="h-7 w-7 p-0 text-[#b2a899] hover:text-[#fdfbf7] hover:bg-[#322d26] disabled:opacity-30"
            aria-label="User actions"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-48 bg-[#2c2822] border-[#524a3e] text-[#f4f1eb] font-serif"
        >
          {user.role === "Member" && (
            <DropdownMenuItem
              className="focus:bg-[#3e3830] focus:text-[#fdfbf7] cursor-pointer text-xs"
              onClick={() => setPendingAction("promote")}
            >
              <ShieldCheck className="h-3.5 w-3.5 mr-2 text-[#9c8465]" />
              Promote to Librarian
            </DropdownMenuItem>
          )}
          {user.role === "Librarian" && (
            <DropdownMenuItem
              className="focus:bg-[#3e3830] focus:text-[#fdfbf7] cursor-pointer text-xs"
              onClick={() => setPendingAction("demote")}
            >
              <ShieldOff className="h-3.5 w-3.5 mr-2 text-[#9c8465]" />
              Demote to Member
            </DropdownMenuItem>
          )}
          {user.isActive ? (
            <DropdownMenuItem
              className="focus:bg-red-950/20 text-red-400 focus:text-red-300 cursor-pointer text-xs"
              onClick={() => setPendingAction("deactivate")}
            >
              <UserX className="h-3.5 w-3.5 mr-2" />
              Deactivate
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              className="focus:bg-[#3e3830] focus:text-[#fdfbf7] cursor-pointer text-xs"
              onClick={handleReactivate}
            >
              <UserCheck className="h-3.5 w-3.5 mr-2 text-[#9c8465]" />
              Reactivate
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={pendingAction !== null} onOpenChange={(open) => !open && setPendingAction(null)}>
        <AlertDialogContent className="bg-[#2c2822] border-[#524a3e] text-[#f4f1eb] font-serif">
          {pendingAction && (
            <>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-[#fdfbf7]">
                  {CONFIRM_COPY[pendingAction].title}
                </AlertDialogTitle>
                <AlertDialogDescription className="text-[#b2a899]">
                  {CONFIRM_COPY[pendingAction].description}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-transparent border-[#524a3e] text-[#e2dacb] hover:bg-[#322d26] hover:text-[#fdfbf7]">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-[#ecdcc5] text-[#29241e] hover:bg-[#e2cfae]"
                  onClick={() => {
                    if (pendingAction === "promote") runAction(promote.mutate);
                    if (pendingAction === "demote") runAction(demote.mutate);
                    if (pendingAction === "deactivate") runAction(deactivate.mutate);
                  }}
                >
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
