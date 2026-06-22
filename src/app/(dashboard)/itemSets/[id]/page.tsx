"use client";

import { useState, FormEvent } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Globe, Lock, Plus, X } from "lucide-react";

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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui/tooltip";
import { Checkbox } from "@/shared/ui/checkbox";
import { ScrollArea } from "@/shared/ui/scroll-area";

import { useAuth } from "../../../../features/auth/context/AuthContext"
import { useAddItemToSet } from "../../../../features/itemSets/hooks/useAddItemToSet";
import { useRemoveItemFromSet } from "../../../../features/itemSets/hooks/useRemoveItemFromSet";
import { useItemSet } from "../../../../features/itemSets/hooks/useItemSet";
import { useItems } from "@/features/items/hooks/useItems";

export default function ItemSetDetailPage() {
  const params = useParams<{ id: string }>();
  const setId = Number(params.id);

  const { hasRole } = useAuth();
  const canRemoveItems = hasRole(["Admin", "Librarian"]);

  const { data, isLoading, isError } = useItemSet(setId);
  const { data: allItems, isLoading: itemsLoading } = useItems();
  
  const addItemToSet = useAddItemToSet();
  const removeItemFromSet = useRemoveItemFromSet();

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);

  const handleAddItem = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (selectedItemIds.length === 0) return;

    try {
      // Use mutateAsync if available or wrap in Promise to wait for all
      await Promise.all(
        selectedItemIds.map(itemId => addItemToSet.mutateAsync({ setId, itemId }))
      );
      setSelectedItemIds([]);
      setAddDialogOpen(false);
    } catch (error) {
      console.error("Failed to add some items", error);
    }
  };

  const handleRemoveItem = (itemId: number) => {
    removeItemFromSet.mutate({ setId, itemId });
  };

  const toggleSelection = (itemId: number) => {
    setSelectedItemIds(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  if (isLoading) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Loading item set…
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <p className="text-sm text-destructive">
          Couldn&apos;t load this item set.
        </p>
        <Button variant="outline" asChild className="w-fit">
          <Link href="/itemSets">Back to item sets</Link>
        </Button>
      </div>
    );
  }

  const { setInfo, members } = data;

  // Filter out items that are already in this set
  const availableItems = allItems?.filter(
    (item) => !members.some((m) => m.id === item.id)
  ) || [];

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/itemSets">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to item sets</span>
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                {setInfo.title}
              </h1>
              {setInfo.isPublic ? (
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
            </div>
            <p className="text-sm text-muted-foreground">
              {setInfo.description || "No description."}
            </p>
          </div>
        </div>

        {canRemoveItems && (
          <Button variant="outline" asChild>
            <Link href={`/itemSets/${setId}/edit`}>Edit</Link>
          </Button>
        )}
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Members</h2>

        {canRemoveItems && (
          <Dialog open={addDialogOpen} onOpenChange={(open) => {
            setAddDialogOpen(open);
            if (!open) setSelectedItemIds([]);
          }}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add items
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
              <form onSubmit={handleAddItem} className="flex flex-col h-full overflow-hidden">
                <DialogHeader className="pb-4">
                  <DialogTitle>Add items to set</DialogTitle>
                  <DialogDescription>
                    Browse and select existing items to add to this set.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="flex-1 overflow-hidden min-h-0 border rounded-md mb-4">
                  <ScrollArea className="h-[40vh] w-full">
                    {itemsLoading ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">Loading items...</div>
                    ) : availableItems.length === 0 ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">No additional items available to add.</div>
                    ) : (
                      <Table>
                        <TableHeader className="sticky top-0 bg-background z-10">
                          <TableRow>
                            <TableHead className="w-12 text-center"></TableHead>
                            <TableHead>Item ID</TableHead>
                            <TableHead>Template ID</TableHead>
                            <TableHead>Values</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {availableItems.map((item) => (
                            <TableRow 
                              key={item.id} 
                              className="cursor-pointer"
                              onClick={() => toggleSelection(item.id)}
                            >
                              <TableCell className="text-center">
                                <Checkbox 
                                  checked={selectedItemIds.includes(item.id)} 
                                  onCheckedChange={() => toggleSelection(item.id)}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </TableCell>
                              <TableCell className="font-medium">{item.id}</TableCell>
                              <TableCell>{item.templateId}</TableCell>
                              <TableCell className="text-muted-foreground">
                                {item.values.length} value{item.values.length === 1 ? "" : "s"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </ScrollArea>
                </div>

                <DialogFooter className="pt-2">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm text-muted-foreground">
                      {selectedItemIds.length} item(s) selected
                    </span>
                    <Button
                      type="submit"
                      disabled={addItemToSet.isPending || selectedItemIds.length === 0}
                    >
                      {addItemToSet.isPending ? "Adding…" : "Add selected items"}
                    </Button>
                  </div>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item ID</TableHead>
            <TableHead>Template ID</TableHead>
            <TableHead>Values</TableHead>
            {canRemoveItems && <TableHead className="w-15" />}
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={canRemoveItems ? 4 : 3}
                className="h-24 text-center text-muted-foreground"
              >
                This item set has no members yet.
              </TableCell>
            </TableRow>
          )}

          {members.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">{item.id}</TableCell>
              <TableCell>{item.templateId}</TableCell>
              <TableCell className="text-muted-foreground">
                {item.values.length} value{item.values.length === 1 ? "" : "s"}
              </TableCell>
              {canRemoveItems && (
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={removeItemFromSet.isPending}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Delete from item set</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete from item set</TooltipContent>
                  </Tooltip>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
