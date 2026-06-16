// features/auth/types/index.ts

// --- Request shapes matching the ASP.NET backend ---

export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Matches C# CustomRegisterRequest.cs exactly
 */
export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  middleName?: string;  // Maps directly to string?
  phoneNumber?: string; // Maps directly to string?
}

/**
 * Matches C# AuthResponse.cs exactly
 */
export interface AuthResponse {
  token: string;
  email: string;
  fullName: string;    // ✅ FIXED: Renamed from fullname to match PascalCase serialization
  role: UserRole;      // ✅ FIXED: Renamed from roles to singular role to align with C# property
  success: boolean;    // Maps directly to bool Success
  message: string;     // Maps directly to string Message
}

// --- The three roles seeded in DatabaseInitializer ---
export type UserRole = "Admin" | "Librarian" | "Member";

// --- What we store in the secure in-memory AuthContext ---
export interface AuthUser {
  email: string;
  fullName: string;    // ✅ FIXED: Updated to match correct casing
  role: UserRole;      // ✅ FIXED: Updated to match correct casing
  token: string;
}

// --- Typed auth state for the context ---
export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * Primitive return matching backend IActionResult Ok(bool/string) 
 * for the [Authorize] Logout endpoint
 */
export type LogoutResponse = boolean;