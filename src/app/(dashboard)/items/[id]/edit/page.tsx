"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { useParams } from "next/navigation";
import { useAuth } from "@/features/auth/context/AuthContext";
import { ItemForm, type ItemFormValues } from "@/features/items/ui/ItemForm";
import { useItem } from "@/features/items/hooks/useItem";
import { useUpdateItem } from "@/features/items/hooks/useUpdateItem";
import "@/features/items/items.css";

export default function EditItemPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  const { hasRole, isLoading: authLoading } = useAuth();
  const canManage = hasRole(["Librarian", "Admin"]);

  const { data: item, isLoading, isError } = useItem(id);
  const updateItem = useUpdateItem();

  // Defense-in-depth only — the real boundary is middleware.ts, which
  // blocks /items/:id/edit for non-Librarian/Admin roles at the edge.
  useEffect(() => {
    if (!authLoading && !canManage) {
      router.replace(`/items/${id}`);
    }
  }, [authLoading, canManage, router, id]);

  if (!Number.isInteger(id)) {
    notFound();
  }

  if (!authLoading && !canManage) {
    return null;
  }

  if (!Number.isInteger(id)) {
    notFound();
  }

  if (isLoading) {
    return (
      <div className="catalog-page">
        <div className="catalog-row catalog-row--skeleton" />
      </div>
    );
  }

  if (isError || !item) {
    return (
      <div className="catalog-page">
        <div className="catalog-empty catalog-empty--error">
          Couldn&apos;t find that item. It may have been deleted.
        </div>
      </div>
    );
  }

  const handleSubmit = (values: ItemFormValues) => {
    // Only rows that already carry a real id can be sent to UpdateItemDto —
    // any value added because the template grew new properties since this
    // item was created has no id yet and can't be represented by this DTO.
    const valuesWithId = values.values.filter(
      (v): v is ItemFormValues["values"][number] & { id: number } => typeof v.id === "number"
    );

    updateItem.mutate(
      {
        id: item.id,
        dto: {
          id: item.id,
          templateId: values.templateId,
          values: valuesWithId,
        },
      },
      {
        onSuccess: () => {
          router.push(`/items/${item.id}`);
        },
      }
    );
  };

  return (
    <div className="catalog-page">
      <div className="catalog-page__header">
        <h1>Edit item</h1>
        <p>Update the fields below, then save your changes.</p>
      </div>

      <ItemForm
        initialItem={item}
        onSubmit={handleSubmit}
        isSubmitting={updateItem.isPending}
        submitLabel="Save changes"
      />

      {updateItem.isError && (
        <p className="catalog-field__error">Couldn&apos;t save changes. Please try again.</p>
      )}
    </div>
  );
}
