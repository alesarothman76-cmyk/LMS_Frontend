// src/app/(dashboard)/page.tsx
"use client";

import React, { useSyncExternalStore } from "react";
import { useAuth } from "@/features/auth/context/AuthContext";

// Empty subscription function since the window/client status doesn't change after mounting
const emptySubscribe = () => () => {};

export default function DashboardHomePage() {
  const { user } = useAuth();

  // Returns true on client browser, false on Next.js server
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  return (
    <div className="space-y-6">
      <div className="bg-[#2c2822] border border-[#524a3e] p-6 rounded shadow-sm text-[#f4f1eb]">
        <h2 className="text-xl font-bold font-serif mb-2 text-[#fdfbf7]">
          Welcome Back, {isClient ? (user?.fullName || "Scholar") : "Scholar"}
        </h2>
        <p className="text-xs text-[#b2a899] font-mono">
          Role:{" "}
          <span className="text-[#ecdcc5] uppercase">
            {isClient ? (user?.role || "Guest") : "Guest"}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-[#413b32] bg-white/50 p-4 rounded backdrop-blur-sm">
          <h3 className="font-bold text-sm font-serif text-[#292520]">System Node Status</h3>
          <p className="text-xs text-emerald-700 mt-1 font-mono">● Operational</p>
        </div>
        <div className="border border-[#413b32] bg-white/50 p-4 rounded backdrop-blur-sm">
          <h3 className="font-bold text-sm font-serif text-[#292520]">Active Vocabularies</h3>
          <p className="text-xs text-[#776d5e] mt-1 font-mono">Ready for Indexing</p>
        </div>
        <div className="border border-[#413b32] bg-white/50 p-4 rounded backdrop-blur-sm">
          <h3 className="font-bold text-sm font-serif text-[#292520]">Media Repository</h3>
          <p className="text-xs text-[#776d5e] mt-1 font-mono">Federated checks ok</p>
        </div>
      </div>
    </div>
  );
}