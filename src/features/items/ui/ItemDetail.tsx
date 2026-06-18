"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useItem } from "../hooks/useItem";
import { useResourceTemplate } from "../hooks/useResourceTemplate";
import { useDeleteItem } from "../hooks/useDeleteItem";

export function ItemDetail({
  id,
  canManage = false,
}: {
  id: number;
  canManage?: boolean;
}) {
  const router = useRouter();
  const { data: item, isLoading, isError } = useItem(id);
  const { data: template } = useResourceTemplate(item?.templateId);
  const deleteItem = useDeleteItem();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  if (isLoading) {
    return <div className="catalog-row catalog-row--skeleton" />;
  }

  if (isError || !item) {
    return (
      <div className="catalog-empty catalog-empty--error">
        Couldn&apos;t find that item. It may have been deleted.
      </div>
    );
  }

  const propertyLabel = (propertyId: number) => {
    const prop = template?.properties.find((p) => p.propertyId === propertyId);
    return prop ? (prop.alternateLabel ?? prop.label) : `Property #${propertyId}`;
  };

  return (
    <article className="catalog-card">
      <header className="catalog-card__header">
        <span className="catalog-row__id">#{item.id}</span>
        <h1 className="catalog-card__title">{template?.label ?? `Template #${item.templateId}`}</h1>
      </header>

      <dl className="catalog-card__fields">
        {item.values.map((value) => (
          <div key={value.id} className="catalog-card__field">
            <dt>{propertyLabel(value.propertyId)}</dt>
            <dd>
              {value.valueText ?? value.valueUri ?? (
                value.valueResourceId != null ? `→ #${value.valueResourceId}` : "—"
              )}
              {value.language && <span className="catalog-card__lang">{value.language}</span>}
            </dd>
          </div>
        ))}
      </dl>

      <footer className="catalog-card__footer">
        {canManage && (
          <>
            <Link href={`/items/${item.id}/edit`} className="catalog-btn catalog-btn--primary">
              Edit item
            </Link>

            {confirmingDelete ? (
              <span className="catalog-confirm">
                <span>Delete for good?</span>
                <button
                  type="button"
                  className="catalog-btn catalog-btn--danger"
                  disabled={deleteItem.isPending}
                  onClick={() =>
                    deleteItem.mutate(item.id, {
                      onSuccess: () => router.push("/items"),
                      onSettled: () => setConfirmingDelete(false),
                    })
                  }
                >
                  {deleteItem.isPending ? "Deleting…" : "Confirm"}
                </button>
                <button
                  type="button"
                  className="catalog-btn catalog-btn--ghost"
                  onClick={() => setConfirmingDelete(false)}
                >
                  Cancel
                </button>
              </span>
            ) : (
              <button
                type="button"
                className="catalog-btn catalog-btn--danger-ghost"
                onClick={() => setConfirmingDelete(true)}
              >
                Delete
              </button>
            )}
          </>
        )}
        <Link href="/items" className="catalog-btn catalog-btn--ghost">
          Back to list
        </Link>
      </footer>
    </article>
  );
}
