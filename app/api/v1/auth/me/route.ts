import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminCredentials } from "@/lib/db/admin-storage";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  if (session?.value !== "authenticated") {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } }, { status: 401 });
  }

  let email = "admin@church.local";
  try {
    const creds = await getAdminCredentials();
    if (creds) {
      email = creds.email;
    }
  } catch { /* use default */ }

  return NextResponse.json({
    success: true,
    data: { id: "admin-1", email, fullName: "Admin", role: "ADMIN", isActive: true, createdAt: new Date().toISOString() },
  });
}
