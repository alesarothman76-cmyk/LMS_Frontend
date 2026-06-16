// features/auth/hooks/useRegister.ts
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import type { RegisterRequest } from "../types";

/**
 * Wraps the register action in a TanStack Query mutation.
 * On success the new user is automatically logged in (backend returns a token).
 */
export function useRegister() {
  const { register } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterRequest) => register(data),
    onSuccess: () => {
      router.push("/");
    },
  });
}
