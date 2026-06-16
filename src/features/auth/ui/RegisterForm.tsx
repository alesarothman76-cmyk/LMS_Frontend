"use client";

// features/auth/ui/RegisterForm.tsx

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail, User, AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRegister } from "../hooks/useRegister";
import { registerSchema, type RegisterFormValues } from "../schemas";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { mutate: register, isPending, isError, error } = useRegister();

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormValues) => {
    register(data);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const serverError = isError ? ((error as any)?.response?.data?.message ?? "Registration failed. Please try again.") : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>

      {serverError && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded border border-red-800/50 bg-red-950/30 px-4 py-3 text-sm text-red-300"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Name row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label
            htmlFor="reg-firstName"
            className="block text-xs font-semibold uppercase tracking-wider text-[#c0b7a8]"
          >
            First Name
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#776d5e]" />
            <Input
              id="reg-firstName"
              placeholder="Jane"
              {...formRegister("firstName")}
              className={cn(
                "pl-10 bg-[#1c1916] border-[#524a3e] text-[#f4f1eb] placeholder-[#55503e] focus-visible:ring-1 focus-visible:ring-[#9c8465] h-10",
                errors.firstName && "border-red-700"
              )}
            />
          </div>
          {errors.firstName && (
            <p className="text-xs text-red-400">{errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="reg-lastName"
            className="block text-xs font-semibold uppercase tracking-wider text-[#c0b7a8]"
          >
            Last Name
          </label>
          <Input
            id="reg-lastName"
            placeholder="Doe"
            {...formRegister("lastName")}
            className={cn(
              "bg-[#1c1916] border-[#524a3e] text-[#f4f1eb] placeholder-[#55503e] focus-visible:ring-1 focus-visible:ring-[#9c8465] h-10",
              errors.lastName && "border-red-700"
            )}
          />
          {errors.lastName && (
            <p className="text-xs text-red-400">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label
          htmlFor="reg-email"
          className="block text-xs font-semibold uppercase tracking-wider text-[#c0b7a8]"
        >
          Email Address
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#776d5e]" />
          <Input
            id="reg-email"
            type="email"
            autoComplete="email"
            placeholder="you@institution.org"
            {...formRegister("email")}
            className={cn(
              "pl-10 bg-[#1c1916] border-[#524a3e] text-[#f4f1eb] placeholder-[#55503e] focus-visible:ring-1 focus-visible:ring-[#9c8465] h-10",
              errors.email && "border-red-700"
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
          htmlFor="reg-password"
          className="block text-xs font-semibold uppercase tracking-wider text-[#c0b7a8]"
        >
          Password
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#776d5e]" />
          <Input
            id="reg-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Min. 8 chars, 1 upper, 1 number, 1 symbol"
            {...formRegister("password")}
            className={cn(
              "pl-10 pr-10 bg-[#1c1916] border-[#524a3e] text-[#f4f1eb] placeholder-[#55503e] focus-visible:ring-1 focus-visible:ring-[#9c8465] h-10",
              errors.password && "border-red-700"
            )}
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#776d5e] hover:text-[#c0b7a8] transition-colors"
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

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <label
          htmlFor="reg-confirm"
          className="block text-xs font-semibold uppercase tracking-wider text-[#c0b7a8]"
        >
          Confirm Password
        </label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#776d5e]" />
          <Input
            id="reg-confirm"
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••"
            {...formRegister("confirmPassword")}
            className={cn(
              "pl-10 pr-10 bg-[#1c1916] border-[#524a3e] text-[#f4f1eb] placeholder-[#55503e] focus-visible:ring-1 focus-visible:ring-[#9c8465] h-10",
              errors.confirmPassword && "border-red-700"
            )}
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowConfirm((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#776d5e] hover:text-[#c0b7a8] transition-colors"
          >
            {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="flex items-center gap-1.5 text-xs text-red-400">
            <AlertCircle className="h-3 w-3" />
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Submit */}
      <Button
        type="submit"
        disabled={isPending}
        className="w-full h-10 bg-[#9c8465] hover:bg-[#b09070] text-[#1c1916] font-bold tracking-wider text-sm border-0 mt-2"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account…
          </>
        ) : (
          "Create Account"
        )}
      </Button>

      <p className="text-center text-xs text-[#9c8465]">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-[#c0b7a8] underline-offset-2 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
