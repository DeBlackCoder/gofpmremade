import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminCredentials } from "@/lib/db/admin-storage";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json() as { email: string; password: string };
  
  let creds;
  try {
    creds = await getAdminCredentials();
  } catch {
    return NextResponse.json({ success: false, error: { code: "ERROR", message: "Credentials not configured." } }, { status: 500 });
  }

  if (!creds) {
    return NextResponse.json({ success: false, error: { code: "ERROR", message: "Credentials not configured." } }, { status: 500 });
  }

  if (email !== creds.email || password !== creds.password) {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Invalid email or password." } }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set("admin_session", "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return NextResponse.json({
    success: true,
    data: {
      user: { id: "admin-1", email: creds.email, fullName: "Admin", role: "ADMIN", isActive: true, createdAt: new Date().toISOString() },
      accessToken: "local-token",
      refreshToken: "local-refresh",
    },
  });
}
