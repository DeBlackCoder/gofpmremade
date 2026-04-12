/**
 * Middleware configuration for Next.js
 * Protects admin routes and handles authentication
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_TOKEN_NAME } from "@/lib/constants/config";

type JwtPayload = {
  exp?: number;
  role?: string;
  user?: {
    role?: string;
  };
};

const ADMIN_ROLES = new Set(["ADMIN", "PASTOR"]);

function decodeJwtPayload(token: string): JwtPayload | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );
    const decoded = atob(padded);
    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return null;
  }
}

function isTokenExpired(payload: JwtPayload | null): boolean {
  if (!payload?.exp) return false;
  const now = Math.floor(Date.now() / 1000);
  return payload.exp <= now;
}

function hasAdminRole(payload: JwtPayload | null): boolean {
  const role = payload?.role ?? payload?.user?.role;
  return typeof role === "string" && ADMIN_ROLES.has(role);
}

export function proxy(request: NextRequest) {
  const token = request.cookies.get(COOKIE_TOKEN_NAME)?.value;
  const { pathname } = request.nextUrl;
  const isAdminLogin = pathname === "/admin-login";
  const isAdminArea = pathname.startsWith("/admin-") && !isAdminLogin;
  const payload = token ? decodeJwtPayload(token) : null;
  const tokenExpired = token ? isTokenExpired(payload) : false;
  const isAdmin = token ? hasAdminRole(payload) : false;

  // Protect admin routes
  if (isAdminArea) {
    if (!token || tokenExpired || !isAdmin) {
      const response = NextResponse.redirect(
        new URL("/admin-login", request.url),
      );
      response.cookies.delete(COOKIE_TOKEN_NAME);
      return response;
    }
  }

  // Redirect authenticated admin users away from login page
  if (isAdminLogin && token && !tokenExpired && isAdmin) {
    return NextResponse.redirect(new URL("/admin-dashboard", request.url));
  }

  return NextResponse.next();
}

// Configure matcher for routes to protect
export const config = {
  matcher: ["/admin-login", "/admin-:path*"],
};
