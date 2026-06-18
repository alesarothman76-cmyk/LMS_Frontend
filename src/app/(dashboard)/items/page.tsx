"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/features/auth/context/AuthContext";
import { useResourceTemplates } from "@/features/items/hooks/useResourceTemplates";
import { ItemList } from "@/features/items/ui/ItemList";
import "@/features/items/ui/items.css";

function TemplatePicker({ onPick }: { onPick: (templateId: number) => void }) {
  const { data: templates, isLoading, isError } = useResourceTemplates();

  if (isLoading) {
    return (
      <div className="catalog-list">
        {[1, 2, 3].map((i) => (
          <div key={i} className="catalog-row catalog-row--skeleton" />
        ))}
      </div>
    );
  }

  if (isError || !templates || templates.length === 0) {
    return (
      <div className="catalog-empty catalog-empty--error">
        No templates are available to browse right now.
      </div>
    );
  }

  return (
    <div className="catalog-list">
      {templates.map((template) => (
        <button
          key={template.id}
          type="button"
          className="catalog-row catalog-row--clickable"
          onClick={() => onPick(template.id)}
        >
          <div className="catalog-row__main">
            <span className="catalog-row__template">{template.label}</span>
          </div>
        </button>
      ))}
    </div>
  );
}

export default function ItemsPage() {
  const { hasRole } = useAuth();
  const canManage = hasRole(["Librarian", "Admin"]);

  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);

  // Members must choose a template before seeing any items.
  if (!canManage) {
    if (selectedTemplateId === null) {
      return (
        <div className="catalog-page">
          <div className="catalog-page__header">
            <h1>Browse items</h1>
            <p>Choose a template to see items of that type.</p>
          </div>
          <TemplatePicker onPick={setSelectedTemplateId} />
        </div>
      );
    }

    return (
      <div className="catalog-page">
        <div className="catalog-page__header">
          <button
            type="button"
            className="catalog-btn catalog-btn--ghost"
            onClick={() => setSelectedTemplateId(null)}
          >
            ← Choose a different template
          </button>
        </div>
        <ItemList templateId={selectedTemplateId} canManage={false} />
      </div>
    );
  }

  // Librarian / Admin: full list, no gate, full management actions.
  return (
    <div className="catalog-page">
      <div
        className="catalog-page__header"
        style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}
      >
        <div>
          <h1>Items</h1>
          <p>Browse and manage every catalog item, organized by template.</p>
        </div>
        <Link href="/items/new" className="catalog-btn catalog-btn--primary">
          New item
        </Link>
      </div>

      <ItemList canManage />
    </div>
  );
}
