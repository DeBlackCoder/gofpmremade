/**
 * Middleware configuration for Next.js
 * Protects admin routes and handles authentication
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminLogin = pathname === "/admin-login";
  const isAdminArea = pathname.startsWith("/admin-") && !isAdminLogin;

  const session = request.cookies.get("admin_session")?.value;
  const isAuthenticated = session === "authenticated";

  // Protect admin routes
  if (isAdminArea && !isAuthenticated) {
    return NextResponse.redirect(new URL("/admin-login", request.url));
  }

  // Redirect authenticated users away from login page
  if (isAdminLogin && isAuthenticated) {
    return NextResponse.redirect(new URL("/admin-dashboard", request.url));
  }

  return NextResponse.next();
}

// Configure matcher for routes to protect
export const config = {
  matcher: ["/admin-login", "/admin-:path*"],
};
