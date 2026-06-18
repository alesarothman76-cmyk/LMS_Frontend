"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/context/AuthContext";
import { ItemForm, type ItemFormValues } from "@/features/items/ui/ItemForm";
import { useCreateItem } from "@/features/items/hooks/useCreateItem";
import "@/features/items/ui/items.css";

export default function NewItemPage() {
  const router = useRouter();
  const { hasRole, isLoading: authLoading } = useAuth();
  const canManage = hasRole(["Librarian", "Admin"]);
  const createItem = useCreateItem();

  // Defense-in-depth only — the real boundary is middleware.ts, which
  // blocks /items/new for non-Librarian/Admin roles at the edge.
  useEffect(() => {
    if (!authLoading && !canManage) {
      router.replace("/items");
    }
  }, [authLoading, canManage, router]);

  if (!authLoading && !canManage) {
    return null;
  }

  const handleSubmit = (values: ItemFormValues) => {
    createItem.mutate(
      {
        templateId: values.templateId,
        values: values.values.map(({ propertyId, valueText, valueUri, valueResourceId, type, language }) => ({
          propertyId,
          valueText,
          valueUri,
          valueResourceId,
          type,
          language,
        })),
      },
      {
        onSuccess: (newId) => {
          router.push(`/items/${newId}`);
        },
      }
    );
  };

  return (
    <div className="catalog-page">
      <div className="catalog-page__header">
        <h1>New item</h1>
        <p>Pick a template, then fill in its fields.</p>
      </div>

      <ItemForm
        onSubmit={handleSubmit}
        isSubmitting={createItem.isPending}
        submitLabel="Create item"
      />

      {createItem.isError && (
        <p className="catalog-field__error">Couldn&apos;t create the item. Please try again.</p>
      )}
    </div>
  );
}
