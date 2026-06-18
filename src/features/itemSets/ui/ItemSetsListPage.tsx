"use client";

import { useState } from "react";
import Link from "next/link";
import { MoreHorizontal, Plus, Globe, Lock } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
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
import { ScrollArea } from "@/shared/ui/scroll-area";

import { useDeleteItemSet } from "../hooks/useDeleteItemSet";
import { useItemSets } from "../hooks/useItemSets";
import { ItemSetDto } from "../types/itemSetTypes";

export default function ItemSetsListPage() {
  const { data: itemSets, isLoading, isError } = useItemSets();
  const deleteItemSet = useDeleteItemSet();

  const [pendingDelete, setPendingDelete] = useState<ItemSetDto | null>(null);

  const handleConfirmDelete = () => {
    if (!pendingDelete) return;

    deleteItemSet.mutate(pendingDelete.id, {
      onSettled: () => setPendingDelete(null),
    });
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Item sets</h1>
          <p className="text-sm text-muted-foreground">
            Group related items together and control who can see them.
          </p>
        </div>
        <Button asChild>
          <Link href="/item-sets/new">
            <Plus className="mr-2 h-4 w-4" />
            New item set
          </Link>
        </Button>
      </div>

      <ScrollArea className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead className="w-15" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  Loading item sets…
                </TableCell>
              </TableRow>
            )}

            {isError && !isLoading && (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-destructive">
                  Couldn&apos;t load item sets. Try refreshing the page.
                </TableCell>
              </TableRow>
            )}

            {!isLoading && !isError && itemSets?.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  No item sets yet. Create one to get started.
                </TableCell>
              </TableRow>
            )}

            {itemSets?.map((itemSet) => (
              <TableRow key={itemSet.id}>
                <TableCell className="font-medium">
                  <Link
                    href={`/item-sets/${itemSet.id}`}
                    className="hover:underline"
                  >
                    {itemSet.title}
                  </Link>
                </TableCell>
                <TableCell className="max-w-105 truncate text-muted-foreground">
                  {itemSet.description || "—"}
                </TableCell>
                <TableCell>
                  {itemSet.isPublic ? (
                    <Badge variant="secondary" className="gap-1">
                      <Globe className="h-3 w-3" />
                      Public
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="gap-1">
                      <Lock className="h-3 w-3" />
                      Private
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/item-sets/${itemSet.id}`}>View</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/item-sets/${itemSet.id}/edit`}>Edit</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onSelect={() => setPendingDelete(itemSet)}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => !open && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete &ldquo;{pendingDelete?.title}&rdquo;?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the item set and its membership links. Items inside
              it are not deleted. This can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleteItemSet.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteItemSet.isPending ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
