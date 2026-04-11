/**
 * Middleware configuration for Next.js
 * Protects admin routes and handles authentication
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_TOKEN_NAME } from "@/lib/constants/config";

export function middleware(request: NextRequest) {
  const token = request.cookies.get(COOKIE_TOKEN_NAME)?.value;
  const { pathname } = request.nextUrl;

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (!token) {
      // Redirect to login
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // In a real app, you'd verify the token and check user role here
    // For now, just check token exists
  }

  // Optionally redirect authenticated users away from login/register
  if ((pathname === "/login" || pathname === "/register") && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Configure matcher for routes to protect
export const config = {
  matcher: ["/admin/:path*", "/login", "/register"],
};
