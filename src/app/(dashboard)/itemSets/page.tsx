"use client";

import Link from "next/link";
import ItemSetDetailPage  from "@/features/itemSets/ui/ItemSetDetailPage";

export default function ItemsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-serif text-[#292520]">Item Sets</h1>
          <p className="text-sm text-[#776d5e] mt-1">Manage your itemSets and metadata</p>
        </div>
        <Link
          href="/itemSets/new"
          className="px-4 py-2 bg-[#2c2822] text-[#f4f1eb] rounded hover:bg-[#1a1815] transition-colors"
        >
          + New Item Set
        </Link>
      </div>

      <ItemSetDetailPage />
    </div>
  );
}
