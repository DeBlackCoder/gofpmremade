import { NextRequest, NextResponse } from "next/server";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/admin-login", req.url));
  }

  // Full JWT verification happens in the server component (admin-dashboard/page.tsx)
  // Here we just check the cookie exists as a fast gate
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin-dashboard/:path*",
    "/admin-events/:path*",
    "/admin-live/:path*",
    "/admin-sermons/:path*",
    "/admin-contacts/:path*",
  ],
};
