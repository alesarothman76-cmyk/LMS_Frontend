"use client";

import { useParams, notFound } from "next/navigation";
import { useAuth } from "@/features/auth/context/AuthContext";
import { ItemDetail } from "@/features/items/ui/ItemDetail";
import "@/features/items/ui/items.css";

export default function ItemDetailPage() {
  const params = useParams<{ id: string }>();
  const { hasRole } = useAuth();
  const parsedId = Number(params.id);

  if (!Number.isInteger(parsedId)) {
    notFound();
  }

  return (
    <div className="catalog-page">
      <ItemDetail id={parsedId} canManage={hasRole(["Librarian", "Admin"])} />
    </div>
  );
}
