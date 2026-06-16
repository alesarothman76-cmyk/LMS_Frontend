"use client";

// features/auth/ui/LoginForm.tsx

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail, AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { loginSchema, type LoginFormValues } from "../schemas";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending, isError, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormValues) => {
    login(data);
  };

  // Extract a human-readable error message from Axios error
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const serverError = isError ? ((error as any)?.response?.data?.message ?? "Invalid credentials. Please try again.") : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>

      {/* Server-level error banner */}
      {serverError && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded border border-red-800/50 bg-red-950/30 px-4 py-3 text-sm text-red-300"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Email */}
      <div className="space-y-1.5">
        <label
          htmlFor="login-email"
          className="block text-xs font-semibold uppercase tracking-wider text-[#c0b7a8]"
        >
          Email Address
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#776d5e]" />
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="librarian@institution.org"
            {...register("email")}
            className={cn(
              "pl-10 bg-[#1c1916] border-[#524a3e] text-[#f4f1eb] placeholder-[#55503e] focus-visible:ring-1 focus-visible:ring-[#9c8465] focus:border-[#9c8465] h-10",
              errors.email && "border-red-700 focus-visible:ring-red-700"
            )}
          />
        </div>
        {errors.email && (
          <p className="flex items-center gap-1.5 text-xs text-red-400">
            <AlertCircle className="h-3 w-3" />
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label
          htmlFor="login-password"
          className="block text-xs font-semibold uppercase tracking-wider text-[#c0b7a8]"
        >
          Password
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#776d5e]" />
          <Input
            id="login-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            {...register("password")}
            className={cn(
              "pl-10 pr-10 bg-[#1c1916] border-[#524a3e] text-[#f4f1eb] placeholder-[#55503e] focus-visible:ring-1 focus-visible:ring-[#9c8465] focus:border-[#9c8465] h-10",
              errors.password && "border-red-700 focus-visible:ring-red-700"
            )}
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#776d5e] hover:text-[#c0b7a8] transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="flex items-center gap-1.5 text-xs text-red-400">
            <AlertCircle className="h-3 w-3" />
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isPending}
        className="w-full h-10 bg-[#9c8465] hover:bg-[#b09070] text-[#1c1916] font-bold tracking-wider text-sm border-0 transition-all duration-200"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Authenticating…
          </>
        ) : (
          "Sign In"
        )}
      </Button>

      {/* Register link */}
      <p className="text-center text-xs text-[#9c8465]">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-[#c0b7a8] underline-offset-2 hover:underline"
        >
          Request access
        </Link>
      </p>
    </form>
  );
}
