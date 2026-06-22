"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useAuth } from "@/features/auth/context/AuthContext";
import { ItemForm, type ItemFormValues } from "@/features/items/ui/ItemForm";
import { useCreateItem } from "@/features/items/hooks/useCreateItem";
import "@/features/items/ui/items.css";

function NewItemPageContent() {
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

  if (authLoading || !canManage) {
    return null;
  }

  const handleSubmit = (values: ItemFormValues) => {
    // Process values to evaluate their type as requested
        const processedValues = values.values
  .filter((v) => v.valueText !== null && v.valueText.trim() !== "")
  .map(({ propertyId, valueText, language }) => {
    const text = valueText!.trim();

    let type = "text"; // backend only accepts 'text' | 'uri' | 'resource'
    let outText: string | null = null;
    let outUri: string | null = null;
    const outResourceId: number | null = null;

    if (/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(text)) {
      type = "uri";
      outUri = text;
    } else {
      type = "text";
      outText = text;
    }

    return {
      propertyId,
      valueText: outText,
      valueUri: outUri,
      valueResourceId: outResourceId,
      type,
      language,
    };
  });

        // Note: We don't try to guess "ResourceLink" just because a string is numeric.
        // A book title can be "1984".


    createItem.mutate(
      {
        templateId: values.templateId,
        values: processedValues,
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

// 💡 Fix: Force the page to only load on the client. 
// This kills hydration errors completely without using cascading state effects.
export default dynamic(() => Promise.resolve(NewItemPageContent), {
  ssr: false,
});