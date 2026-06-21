"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useUsers } from "../hooks/useUsers";
import { Input } from "@/shared/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { RoleBadge } from "./RoleBadge";
import { StatusBadge } from "./StatusBadge";
import { UserRowActions } from "./UserRowActions";

const ROLE_FILTERS = ["All", "Admin", "Librarian", "Member"] as const;

function initials(fullName: string): string {
  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function UsersTable() {
  const { data: users, isLoading, isError } = useUsers();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<(typeof ROLE_FILTERS)[number]>("All");

  const filtered = useMemo(() => {
    if (!users) return [];
    const query = search.trim().toLowerCase();
    return users.filter((u) => {
      const matchesRole = roleFilter === "All" || u.role === roleFilter;
      const matchesQuery =
        query.length === 0 ||
        u.fullName.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query);
      return matchesRole && matchesQuery;
    });
  }, [users, search, roleFilter]);

  if (isError) {
    return (
      <div className="catalog-empty catalog-empty--error rounded border border-red-900/40 bg-red-950/10 text-red-400 text-sm p-4">
        Couldn&apos;t load users. Please try again.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#776d5e]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email…"
            className="pl-9 text-xs h-8 bg-[#1c1916] border-[#524a3e] text-[#f4f1eb] placeholder-[#776d5e] focus-visible:ring-1 focus-visible:ring-[#9c8465]"
          />
        </div>

        <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as typeof roleFilter)}>
          <SelectTrigger className="w-40 h-8 text-xs bg-[#1c1916] border-[#524a3e] text-[#f4f1eb]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent className="bg-[#2c2822] border-[#524a3e] text-[#f4f1eb]">
            {ROLE_FILTERS.map((role) => (
              <SelectItem key={role} value={role} className="text-xs focus:bg-[#3e3830] focus:text-[#fdfbf7]">
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded border border-[#413b32] overflow-hidden">
        <Table>
          <TableHeader className="bg-[#24211c]">
            <TableRow className="border-[#413b32] hover:bg-transparent">
              <TableHead className="text-[#9c8465] font-mono text-xxs uppercase">User</TableHead>
              <TableHead className="text-[#9c8465] font-mono text-xxs uppercase">Role</TableHead>
              <TableHead className="text-[#9c8465] font-mono text-xxs uppercase">Status</TableHead>
              <TableHead className="text-[#9c8465] font-mono text-xxs uppercase">Joined</TableHead>
              <TableHead className="text-[#9c8465] font-mono text-xxs uppercase w-10" />
            </TableRow>
          </TableHeader>
          <TableBody className="bg-[#1c1916]">
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-[#2c2822] hover:bg-transparent">
                  <TableCell colSpan={5}>
                    <div className="h-8 rounded bg-[#26221e] animate-pulse" />
                  </TableCell>
                </TableRow>
              ))}

            {!isLoading && filtered.length === 0 && (
              <TableRow className="border-[#2c2822] hover:bg-transparent">
                <TableCell colSpan={5} className="text-center text-[#776d5e] text-xs py-8">
                  No users match your search.
                </TableCell>
              </TableRow>
            )}

            {!isLoading &&
              filtered.map((user) => (
                <TableRow key={user.id} className="border-[#2c2822] hover:bg-[#211e1a]">
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-7 w-7 rounded-full">
                        <AvatarFallback className="bg-[#3e3830] text-[#9c8465] text-[10px] font-mono">
                          {initials(user.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#fdfbf7]">{user.fullName}</span>
                        <span className="text-xxs font-mono text-[#9c8465] lowercase">{user.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <RoleBadge role={user.role} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge isActive={user.isActive} />
                  </TableCell>
                  <TableCell className="text-xs text-[#b2a899] font-mono">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <UserRowActions user={user} />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
