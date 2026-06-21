// src/app/unauthorized/page.tsx
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Badge } from "@/shared/ui/badge";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#090805] px-4 py-12">
      <div className="w-full max-w-2xl rounded-[2rem] border border-[#3a342c] bg-[#161310]/95 p-10 shadow-2xl shadow-black/40 ring-1 ring-white/5 backdrop-blur-xl">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#2c2822] border border-[#524a3e] text-[#9c8465]">
          <ShieldAlert className="h-10 w-10" />
        </div>

        <div className="mt-8 text-center">
          <Badge variant="destructive" className="mx-auto mb-4">401</Badge>
          <h1 className="text-4xl font-serif font-bold tracking-tight text-[#fdfbf7]">
            Unauthorized
          </h1>
          <p className="mt-4 text-base leading-7 text-[#d7c9b7]">
            Sorry, You don&apos;t have access to this page. Please log in with an account that has the necessary permissions.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild className="w-full sm:w-auto">
            <Link href="/login">Go to the login page</Link>
          </Button>
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/">Go back to the main page</Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 