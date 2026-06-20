// src/middleware.ts
//
// Next.js Edge Middleware — runs before every matched request.
//
// Strategy (compatible with our in-memory + localStorage JWT approach):
//   - We cannot read localStorage from the Edge runtime.
//   - Instead, at login we also write the token into a SHORT-LIVED cookie
//     (name: "lms_auth_token") via a tiny helper called from AuthContext.
//   - Middleware reads that cookie to decide whether the request is
//     authenticated and which role the user has.
//
// Route protection map:
//   /login, /register          → redirect to / if already authenticated
//   /items/new, /itemSets/new,
//   /media/upload, /resourceTemplate/create
//                              → require Librarian OR Admin
//   /vocabularies/new,
//   /vocabularies/*/edit,
//   /admin/**                  → require Admin only
//   Everything else            → require any authenticated user
//
// The cookie is written by AuthContext (see persistUser) and cleared on logout.
// It is NOT httpOnly so the browser JS can also remove it on logout.
// This is an intentional trade-off: httpOnly would be safer against XSS but
// requires a backend proxy or Next.js route handler to set it.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ---------------------------------------------------------------------------
// Cookie name — must match what AuthContext writes
// ---------------------------------------------------------------------------
export const AUTH_COOKIE_NAME = "lms_auth_token";
export const ROLE_COOKIE_NAME = "lms_user_role"; // comma-separated: "Admin,Librarian"

// ---------------------------------------------------------------------------
// Route rule definitions
// ---------------------------------------------------------------------------

/** Routes that are fully public (no auth needed) */
const PUBLIC_PATHS = ["/login", "/register"];

/**
 * Routes that require Admin OR Librarian role.
 * Matched as prefix.
 */
const LIBRARIAN_PATHS = [
  "/items/new",
  "/itemSets/new",
  "/media/upload",
  "/resourceTemplate/edit",
  "vocabularies/create"  // edit, properties sub-routes
];

/**
 * Matches "/items/<id>/edit" — can't be expressed as a simple prefix because
 * "/items/<id>" (view) must stay open to Members while "/items/<id>/edit"
 * must not.
 */
function isItemEditPath(pathname: string): boolean {
  return /^\/items\/[^/]+\/edit$/.test(pathname);
}

/**
 * Routes that require Admin role only.
 * Matched as prefix.
 */
const ADMIN_PATHS = [
  "/admin",
  "vocabularies/create",
  "/users",
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function matchesAny(pathname: string, patterns: string[]): boolean {
  return patterns.some(
    (p) => pathname === p || pathname.startsWith(p)
  );
}

function getRoles(request: NextRequest): string[] {
  const raw = request.cookies.get(ROLE_COOKIE_NAME)?.value ?? "";
  return raw ? raw.split(",").map((r) => r.trim()).filter(Boolean) : [];
}

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const isAuthenticated = Boolean(token);

  // 1. Public paths: redirect to dashboard if already logged in
  if (matchesAny(pathname, PUBLIC_PATHS)) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // 2. Not authenticated → send to /login, preserving the intended URL
  if (!isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Check role-gated routes
  const roles = getRoles(request);

  // Admin-only paths
  if (matchesAny(pathname, ADMIN_PATHS)) {
    if (!roles.includes("Admin")) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  // Librarian + Admin paths
  if (matchesAny(pathname, LIBRARIAN_PATHS) || isItemEditPath(pathname)) {
    if (!roles.includes("Admin") && !roles.includes("Librarian")) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

// ---------------------------------------------------------------------------
// Matcher — apply middleware to all app routes EXCEPT Next.js internals
// and static files so we don't pay the cost on every asset request.
// ---------------------------------------------------------------------------
export const config = {
  matcher: [
    /*
     * مطابقة جميع المسارات باستثناء:
     * - _next/static (مخرجات البناء لـ Next.js، بما في ذلك الخطوط)
     * - _next/image (تحسين الصور)
     * - favicon.ico, sitemap.xml, robots.txt
     * - الأصول الموجودة في مجلد public
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|otf)).*)",
  ],
};
