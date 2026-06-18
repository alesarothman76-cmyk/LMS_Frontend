"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Checkbox } from "@/shared/ui/checkbox";

import { useCreateItemSet } from "../hooks/useCreateItemSet";

export default function CreateItemSetPage() {
  const router = useRouter();
  const createItemSet = useCreateItemSet();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  const titleError =
    title.trim().length === 0 ? "Title is required." : undefined;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (titleError) return;

    createItemSet.mutate(
      {
        title: title.trim(),
        description: description.trim() || null,
        isPublic,
        values: null,
      },
      {
        onSuccess: (id) => {
          router.push(`/itemSets/${id}`);
        },
      }
    );
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/itemSets">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to item sets</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            New item set
          </h1>
          <p className="text-sm text-muted-foreground">
            Give your item set a title and choose who can see it.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex max-w-lg flex-col gap-5"
        noValidate
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="title" className="text-sm font-medium">
            Title
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. 19th century manuscripts"
            aria-invalid={Boolean(titleError)}
          />
          {titleError && (
            <p className="text-sm text-destructive">{titleError}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
          />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="isPublic"
            checked={isPublic}
            onCheckedChange={(checked) => setIsPublic(checked === true)}
          />
          <label htmlFor="isPublic" className="text-sm font-medium leading-none">
            Make this item set public
          </label>
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={createItemSet.isPending}>
            {createItemSet.isPending ? "Creating…" : "Create item set"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/itemSets">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
