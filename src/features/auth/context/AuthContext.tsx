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
import { jwtDecode, JwtPayload } from "jwt-decode"; 
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
// JWT Decoder Helper using jwt-decode
// ---------------------------------------------------------------------------

/** Parses a JWT token string using jwt-decode and returns its expiration Date. */
function getJwtExpiration(token: string): Date | null {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    
    // JWT 'exp' claim is recorded in seconds since Unix epoch
    if (decoded && typeof decoded.exp === "number") {
      return new Date(decoded.exp * 1000);
    }
    return null;
  } catch (error) {
    console.error("Failed to parse JWT token with jwt-decode:", error);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Storage and Cookie helpers
// ---------------------------------------------------------------------------

const STORAGE_USER_KEY = "lms_user";

function readPersistedUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_USER_KEY);
    if (!raw) return null;
    
    const user = JSON.parse(raw) as AuthUser;
    
    // Extract expiration date directly from the token
    const expirationDate = getJwtExpiration(user.token);
    
    // If the token has expired, cleanly wipe out client state
    if (expirationDate && expirationDate <= new Date()) {
      clearPersistedUser();
      return null;
    }
    
    return user;
  } catch {
    return null;
  }
}

/** Write a JS-accessible cookie so Edge Middleware can read it with an explicit UTC expiration time. */
function setCookie(name: string, value: string, expiresAt: Date): void {
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expiresAt.toUTCString()}; path=/; SameSite=Lax`;
}

function deleteCookie(name: string): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax`;
}

function persistUser(user: AuthUser): void {
  localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
  localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, user.token);
  
  // Extract expiration dynamically from the newly fetched token
  // Falls back gracefully to 1 day from now if the token format is unreadable
  const expirationDate = getJwtExpiration(user.token) || new Date(Date.now() + 24 * 60 * 60 * 1000);
  
  // Write cookies with the exact expiration date matching the backend token rule
  setCookie(AUTH_COOKIE_NAME, user.token, expirationDate);
  setCookie(ROLE_COOKIE_NAME, user.role, expirationDate); 
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
      fullName: response.fullName, 
      role: response.role,         
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
      fullName: response.fullName, 
      role: response.role,         
      token: response.token,
    };

    persistUser(user);
    setState({ user, isAuthenticated: true, isLoading: false });
  }, []);

  // ----- logout -----
  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.warn("Backend authentication session context cleanup skipped:", err);
    } finally {
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