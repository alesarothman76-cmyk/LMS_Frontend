// src/providers.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { AuthProvider } from "@/features/auth/context/AuthContext"; // 🔐 Import your AuthProvider

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {/* 🚀 FIXED: Wrapped children inside AuthProvider so useAuth works across all pages */}
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryClientProvider>
  );
}