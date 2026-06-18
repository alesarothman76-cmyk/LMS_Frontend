"use client";

import { useState, FormEvent } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Globe, Lock, Plus, X } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";
import { Input } from "@/shared/ui/input";
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

import {useAddItemToSet} from "../hooks/useAddItemToSet";

import {
  useItemSet,
  useRemoveItemFromSet,
} from "../hooks";

export default function ItemSetDetailPage() {
  const params = useParams<{ id: string }>();
  const setId = Number(params.id);

  const { data, isLoading, isError } = useItemSet(setId);
  const addItemToSet = useAddItemToSet();
  const removeItemFromSet = useRemoveItemFromSet();

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [itemIdInput, setItemIdInput] = useState("");

  const handleAddItem = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const itemId = Number(itemIdInput);
    if (!itemId || Number.isNaN(itemId)) return;

    addItemToSet.mutate(
      { setId, itemId },
      {
        onSuccess: () => {
          setItemIdInput("");
          setAddDialogOpen(false);
        },
      }
    );
  };

  const handleRemoveItem = (itemId: number) => {
    removeItemFromSet.mutate({ setId, itemId });
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
          <Link href="/item-sets">Back to item sets</Link>
        </Button>
      </div>
    );
  }

  const { setInfo, members } = data;

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/item-sets">
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

        <Button variant="outline" asChild>
          <Link href={`/item-sets/${setId}/edit`}>Edit</Link>
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Members</h2>

        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleAddItem}>
              <DialogHeader>
                <DialogTitle>Add item to set</DialogTitle>
                <DialogDescription>
                  Enter the ID of an existing item to add it to this set.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <label htmlFor="itemId" className="text-sm font-medium">
                  Item ID
                </label>
                <Input
                  id="itemId"
                  type="number"
                  value={itemIdInput}
                  onChange={(e) => setItemIdInput(e.target.value)}
                  placeholder="e.g. 42"
                  className="mt-2"
                  autoFocus
                />
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  disabled={addItemToSet.isPending || !itemIdInput}
                >
                  {addItemToSet.isPending ? "Adding…" : "Add item"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item ID</TableHead>
            <TableHead>Template ID</TableHead>
            <TableHead>Values</TableHead>
            <TableHead className="w-15" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
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
                      <span className="sr-only">Remove from set</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Remove from set</TooltipContent>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
