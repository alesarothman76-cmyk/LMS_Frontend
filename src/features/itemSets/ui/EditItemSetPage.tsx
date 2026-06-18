"use client";

import { useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Checkbox } from "@/shared/ui/checkbox";

import { useUpdateItemSet } from "../hooks/useUpdateItemSet";
import { useItemSet } from "../hooks";
import { ResourceValueDto } from "@/features/items/types";

// 1. Create a dedicated Form component that receives the initial data
interface EditFormProps {
  id: number;
  initialData: {
    title: string;
    description: string | null;
    isPublic: boolean;
    values: ResourceValueDto[] | null; // Replace 'any' with your actual type if available
  };
}

function EditItemSetForm({ id, initialData }: EditFormProps) {
  const router = useRouter();
  const updateItemSet = useUpdateItemSet();

  // Initialize state directly from props—no useEffect needed!
  const [title, setTitle] = useState(initialData.title);
  const [description, setDescription] = useState(initialData.description ?? "");
  const [isPublic, setIsPublic] = useState(initialData.isPublic);

  const titleError = title.trim().length === 0 ? "Title is required." : undefined;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (titleError) return;

    updateItemSet.mutate(
      {
        id,
        dto: {
          id,
          title: title.trim(),
          description: description.trim() || null,
          isPublic,
          values: initialData.values,
        },
      },
      {
        onSuccess: () => {
          router.push(`/item-sets/${id}`);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex max-w-lg flex-col gap-5" noValidate>
      <div className="flex flex-col gap-2">
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          aria-invalid={Boolean(titleError)}
        />
        {titleError && <p className="text-sm text-destructive">{titleError}</p>}
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
        <Button type="submit" disabled={updateItemSet.isPending}>
          {updateItemSet.isPending ? "Saving…" : "Save changes"}
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link href={`/item-sets/${id}`}>Cancel</Link>
        </Button>
      </div>
    </form>
  );
}

// 2. The main page component handles routing, data fetching, and loading states
export default function EditItemSetPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const { data, isLoading, isError } = useItemSet(id);

  if (isLoading) {
    return <div className="p-6 text-sm text-muted-foreground">Loading item set…</div>;
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col gap-4 p-6">
        <p className="text-sm text-destructive">Couldn&apos;t load this item set.</p>
        <Button variant="outline" asChild className="w-fit">
          <Link href="/item-sets">Back to item sets</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/item-sets/${id}`}>
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to item set</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Edit item set</h1>
          <p className="text-sm text-muted-foreground">
            Update the title, description, or visibility.
          </p>
        </div>
      </div>

      {/* Only render the form when data is ready */}
      <EditItemSetForm id={id} initialData={data.setInfo} />
    </div>
  );
}