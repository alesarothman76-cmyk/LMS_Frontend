// features/auth/api/authApi.ts
import { apiClient } from "@/shared/api/apiclient";
import { ApiEndpoints } from "@/shared/api/ApiEndpoints";
import type { LoginRequest, RegisterRequest, AuthResponse, LogoutResponse } from "../types";

export const authApi = {
  /**
   * POST /auth/login
   * Returns a JWT token + user metadata from the backend.
   */
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      ApiEndpoints.auth.login,
      credentials
    );
    return response.data;
  },

  /**
   * POST /auth/register
   * Creates a new user account (default role: Member).
   */
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      ApiEndpoints.auth.register,
      data
    );
    return response.data;
  },
  logout: async (): Promise<LogoutResponse> => {
    const response = await apiClient.post<LogoutResponse>(
      ApiEndpoints.auth.logout,
      {} // POST request bodies require a fallback parameter configuration wrapper
    );
    return response.data;
  },
};
