// "use client";

// // Cookie names must match middleware.ts
// const AUTH_COOKIE_NAME = "lms_auth_token";
// const ROLE_COOKIE_NAME = "lms_user_roles";

// // features/auth/context/AuthContext.tsx
// //
// // Strategy: JWT is kept in-memory only (React state).
// // On page refresh we check localStorage for a persisted token written at login,
// // validate it has not expired, and rehydrate state — giving us SSR-safety
// // (localStorage is never read on the server) and XSS resilience compared to
// // keeping the raw token purely in localStorage long-term.
// //
// // The flow:
// //   login() → call API → store user in React state + write token to localStorage
// //                        so the apiClient interceptor can attach it to requests
// //                        AND so the user isn't logged out on refresh.
// //   logout() → clear React state + remove localStorage token → redirect to /login
// //   On mount → read token from localStorage, check expiry, if valid rehydrate

// import React, {
//   createContext,
//   useCallback,
//   useContext,
//   useEffect,
//   useState,
// } from "react";
// import { useRouter } from "next/navigation";
// import { authApi } from "../api/authApi";
// import { AUTH_TOKEN_STORAGE_KEY } from "@/shared/api/apiclient";
// import type {
//   AuthState,
//   AuthUser,
//   LoginRequest,
//   RegisterRequest,
//   UserRole,
// } from "../types";

// // ---------------------------------------------------------------------------
// // Context shape
// // ---------------------------------------------------------------------------

// interface AuthContextValue extends AuthState {
//   login: (credentials: LoginRequest) => Promise<void>;
//   register: (data: RegisterRequest) => Promise<void>;
//   logout: () => void;
//   hasRole: (role: UserRole | UserRole[]) => boolean;
// }

// const AuthContext = createContext<AuthContextValue | null>(null);

// // ---------------------------------------------------------------------------
// // Storage helpers
// // ---------------------------------------------------------------------------

// const STORAGE_USER_KEY = "lms_user";

// function readPersistedUser(): AuthUser | null {
//   if (typeof window === "undefined") return null;
//   try {
//     const raw = localStorage.getItem(STORAGE_USER_KEY);
//     if (!raw) return null;
//     const user: AuthUser = JSON.parse(raw);
//     // Convert expiration back to a real Date object (JSON.parse gives a string)
//     user.expiration = new Date(user.expiration);
//     // Reject if token has expired
//     if (user.expiration <= new Date()) {
//       localStorage.removeItem(STORAGE_USER_KEY);
//       localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
//       return null;
//     }
//     return user;
//   } catch {
//     return null;
//   }
// }

// /** Write a JS-accessible (non-httpOnly) cookie so Edge Middleware can read it. */
// function setCookie(name: string, value: string, expiresAt: Date): void {
//   document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expiresAt.toUTCString()}; path=/; SameSite=Lax`;
// }

// function deleteCookie(name: string): void {
//   document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
// }

// function persistUser(user: AuthUser): void {
//   localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
//   localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, user.token);
//   // Write cookies so Edge Middleware can read them (not httpOnly by design)
//   setCookie(AUTH_COOKIE_NAME, user.token, user.expiration);
//   setCookie(ROLE_COOKIE_NAME, user.roles.join(","), user.expiration);
// }

// function clearPersistedUser(): void {
//   localStorage.removeItem(STORAGE_USER_KEY);
//   localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
//   deleteCookie(AUTH_COOKIE_NAME);
//   deleteCookie(ROLE_COOKIE_NAME);
// }

// // ---------------------------------------------------------------------------
// // Provider
// // ---------------------------------------------------------------------------

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const router = useRouter();

//   const [state, setState] = useState<AuthState>({
//     user: null,
//     isAuthenticated: false,
//     isLoading: true, // start as loading so children wait for rehydration
//   });

//   // Rehydrate from localStorage on mount (client-only)
//   useEffect(() => {
//     const user = readPersistedUser();
//     setState({
//       user,
//       isAuthenticated: user !== null,
//       isLoading: false,
//     });
//   }, []);

//   // ----- login -----
//   const login = useCallback(async (credentials: LoginRequest) => {
//     const response = await authApi.login(credentials);

//     const user: AuthUser = {
//       email: response.email,
//       firstName: response.firstName,
//       lastName: response.lastName,
//       roles: response.roles,
//       token: response.token,
//       expiration: new Date(response.expiration),
//     };

//     persistUser(user);
//     setState({ user, isAuthenticated: true, isLoading: false });
//   }, []);

//   // ----- register -----
//   const register = useCallback(async (data: RegisterRequest) => {
//     const response = await authApi.register(data);

//     const user: AuthUser = {
//       email: response.email,
//       firstName: response.firstName,
//       lastName: response.lastName,
//       roles: response.roles,
//       token: response.token,
//       expiration: new Date(response.expiration),
//     };

//     persistUser(user);
//     setState({ user, isAuthenticated: true, isLoading: false });
//   }, []);

//   // ----- logout -----
//   const logout = useCallback(() => {
//     clearPersistedUser();
//     setState({ user: null, isAuthenticated: false, isLoading: false });
//     router.push("/login");
//   }, [router]);

//   // ----- role guard helper -----
//   const hasRole = useCallback(
//     (role: UserRole | UserRole[]): boolean => {
//       if (!state.user) return false;
//       const required = Array.isArray(role) ? role : [role];
//       return required.some((r) => state.user!.roles.includes(r));
//     },
//     [state.user]
//   );

//   return (
//     <AuthContext.Provider value={{ ...state, login, register, logout, hasRole }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// // ---------------------------------------------------------------------------
// // Hook
// // ---------------------------------------------------------------------------

// export function useAuth(): AuthContextValue {
//   const ctx = useContext(AuthContext);
//   if (!ctx) {
//     throw new Error("useAuth must be used inside <AuthProvider>");
//   }
//   return ctx;
// }

"use client";

// Cookie names must match middleware.ts
const AUTH_COOKIE_NAME = "lms_auth_token";
const ROLE_COOKIE_NAME = "lms_user_role";

import React, {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { authApi } from "../api/authApi";
import { AUTH_TOKEN_STORAGE_KEY } from "@/shared/api/apiclient";
import type {
  AuthState,
  AuthUser,
  LoginRequest,
  RegisterRequest,
  UserRole,
} from "../types";

// ---------------------------------------------------------------------------
// Context shape
// ---------------------------------------------------------------------------

interface AuthContextValue extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (role: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ---------------------------------------------------------------------------
// Storage and Cookie helpers
// ---------------------------------------------------------------------------

const STORAGE_USER_KEY = "lms_user";

function readPersistedUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_USER_KEY);
    if (!raw) return null;
    
    // Simply parse and return the saved user object tree.
    // (Without backend expiration timestamps, we skip expiration checking here)
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

/** Write a JS-accessible cookie so Edge Middleware can read it. */
function setCookie(name: string, value: string, maxAgeDays: number): void {
  // Since expiration is omitted, we set a secure max-age duration (e.g., 1 day)
  const maxAgeSeconds = maxAgeDays * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAgeSeconds}; path=/; SameSite=Lax`;
}

function deleteCookie(name: string): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
}

function persistUser(user: AuthUser): void {
  localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
  localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, user.token);
  
  // Write cookies so Next.js Middleware can guard pages immediately at the edge.
  // Using a safe 1-day visibility window as a standard session length rule.
  setCookie(AUTH_COOKIE_NAME, user.token, 1);
  setCookie(ROLE_COOKIE_NAME, user.role, 1); 
}

function clearPersistedUser(): void {
  localStorage.removeItem(STORAGE_USER_KEY);
  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  deleteCookie(AUTH_COOKIE_NAME);
  deleteCookie(ROLE_COOKIE_NAME);
}

// ---------------------------------------------------------------------------
// Provider Component
// ---------------------------------------------------------------------------

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const [state, setState] = useState<AuthState>(() => {
    const user = readPersistedUser();
    return {
      user,
      isAuthenticated: user !== null,
      isLoading: false, // Starts as false immediately because rehydration happens instantly
    };
  });
  
  // ----- login -----
  const login = useCallback(async (credentials: LoginRequest) => {
    const response = await authApi.login(credentials);

    if (!response.success) {
      throw new Error(response.message || "Invalid credentials.");
    }

    const user: AuthUser = {
      email: response.email,
      fullName: response.fullName, // Fixed: Maps to PascalCase AuthResponse.cs payload
      role: response.role,         // Fixed: Maps to singular string Role
      token: response.token,
    };

    persistUser(user);
    setState({ user, isAuthenticated: true, isLoading: false });
  }, []);

  // ----- register -----
  const register = useCallback(async (data: RegisterRequest) => {
    const response = await authApi.register(data);

    if (!response.success) {
      throw new Error(response.message || "Registration failed.");
    }

    const user: AuthUser = {
      email: response.email,
      fullName: response.fullName, // Fixed: Maps to PascalCase AuthResponse.cs payload
      role: response.role,         // Fixed: Maps to singular string Role
      token: response.token,
    };

    persistUser(user);
    setState({ user, isAuthenticated: true, isLoading: false });
  }, []);

  // ----- logout -----
  const logout = useCallback(async () => {
    try {
      // Safely hit the authorized backend MediatR LogoutCommand handler
      await authApi.logout();
    } catch (err) {
      console.warn("Backend authentication session context cleanup skipped:", err);
    } finally {
      // Always flush client states even if the network call fails
      clearPersistedUser();
      setState({ user: null, isAuthenticated: false, isLoading: false });
      router.push("/login");
    }
  }, [router]);

  // ----- role guard helper -----
  const hasRole = useCallback(
    (role: UserRole | UserRole[]): boolean => {
      if (!state.user) return false;
      const required = Array.isArray(role) ? role : [role];
      
      // Fixed: Checked directly against the singular user.role string field
      return required.includes(state.user.role);
    },
    [state.user]
  );

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside an active <AuthProvider>");
  }
  return ctx;
}

