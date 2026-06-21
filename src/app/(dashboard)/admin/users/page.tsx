"use client";

import { UsersTable } from "@/features/admin/ui/UsersTable";

export default function AdminUsersPage() {
  return (
    <div className="flex flex-col gap-6">
      <header>
        <p className="text-xxs tracking-widest font-mono text-[#9c8465] uppercase mb-1">
          Admin
        </p>
        <h1 className="text-2xl font-bold text-[#fdfbf7] font-serif">Users</h1>
        <p className="text-xs text-[#9c8465] mt-1">
          Manage roles and account status across the system.
        </p>
      </header>

      <UsersTable />
    </div>
  );
}
