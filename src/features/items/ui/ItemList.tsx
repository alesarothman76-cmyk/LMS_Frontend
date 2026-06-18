"use client";

import { useState } from "react";
import Link from "next/link";
import { useItems } from "../hooks/useItems";
import { useResourceTemplates } from "../hooks/useResourceTemplates";
import { useDeleteItem } from "../hooks/useDeleteItem";

export function ItemList({
  templateId,
  canManage = false,
}: {
  templateId?: number;
  canManage?: boolean;
}) {
  const { data: items, isLoading, isError } = useItems(templateId);
  const { data: templates } = useResourceTemplates();
  const deleteItem = useDeleteItem();
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const templateLabel = (id: number) =>
    templates?.find((t) => t.id === id)?.label ?? `Template #${id}`;

  if (isLoading) {
    return (
      <div className="catalog-list">
        {[1, 2, 3].map((i) => (
          <div key={i} className="catalog-row catalog-row--skeleton" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="catalog-empty catalog-empty--error">
        Couldn&apos;t load items. Check your connection and try again.
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="catalog-empty">
        <p>No items here yet.</p>
        {canManage && (
          <Link href="/items/new" className="catalog-btn catalog-btn--primary">
            Add the first item
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="catalog-list">
      {items.map((item) => (
        <div key={item.id} className="catalog-row">
          <div className="catalog-row__main">
            <span className="catalog-row__id">#{item.id}</span>
            <span className="catalog-row__template">{templateLabel(item.templateId)}</span>
            <span className="catalog-row__count">{item.values.length} fields</span>
          </div>

          <div className="catalog-row__actions">
            <Link href={`/items/${item.id}`} className="catalog-btn catalog-btn--ghost">
              View
            </Link>

            {canManage && (
              <>
                <Link href={`/items/${item.id}/edit`} className="catalog-btn catalog-btn--ghost">
                  Edit
                </Link>

                {pendingDeleteId === item.id ? (
                  <span className="catalog-confirm">
                    <span>Delete for good?</span>
                    <button
                      type="button"
                      className="catalog-btn catalog-btn--danger"
                      disabled={deleteItem.isPending}
                      onClick={() => deleteItem.mutate(item.id, { onSettled: () => setPendingDeleteId(null) })}
                    >
                      {deleteItem.isPending ? "Deleting…" : "Confirm"}
                    </button>
                    <button
                      type="button"
                      className="catalog-btn catalog-btn--ghost"
                      onClick={() => setPendingDeleteId(null)}
                    >
                      Cancel
                    </button>
                  </span>
                ) : (
                  <button
                    type="button"
                    className="catalog-btn catalog-btn--danger-ghost"
                    onClick={() => setPendingDeleteId(item.id)}
                  >
                    Delete
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
