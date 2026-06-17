// app/(auth)/login/page.tsx
import type { Metadata } from "next";
import { Bookmark } from "lucide-react";
import { LoginForm } from "@/features/auth/ui/LoginForm";

export const metadata: Metadata = {
  title: "Sign In — LMS",
  description: "Sign in to access the Digital Library Management System",
};

export default function LoginPage() {
  return (
    <>
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded bg-[#2c2822] border border-[#524a3e] mb-4">
          <Bookmark className="h-5 w-5 text-[#9c8465]" />
        </div>
        <h1 className="font-serif text-2xl font-bold tracking-wide text-[#fdfbf7]">
          Digital Library System
        </h1>
        <p className="mt-1.5 font-mono text-xs uppercase tracking-widest text-[#9c8465]">
          Authenticated Access Portal
        </p>
        <div className="mt-4 h-px w-full bg-linear-to-r from-transparent via-[#3a342c] to-transparent" />
      </div>

      <LoginForm />
    </>
  );
}
