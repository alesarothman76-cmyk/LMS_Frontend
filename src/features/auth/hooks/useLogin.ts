// features/auth/hooks/useLogin.ts
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import type { LoginRequest } from "../types";

/**
 * Wraps the login action in a TanStack Query mutation so the UI
 * gets isPending, isError, error, and reset for free.
 */
export function useLogin() {
  const { login } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => login(credentials),
    onSuccess: () => {
      // Redirect to dashboard after a successful login
      router.push("/");
    },
  });
}
