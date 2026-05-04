import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";

interface AdminCredentials { email: string; }

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  if (session?.value !== "authenticated") {
    return NextResponse.json({ success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } }, { status: 401 });
  }
  let email = "admin@church.local";
  try {
    const creds = JSON.parse(fs.readFileSync(path.join(process.cwd(), "data/admin-credentials.json"), "utf-8")) as AdminCredentials;
    email = creds.email;
  } catch { /* use default */ }
  return NextResponse.json({
    success: true,
    data: { id: "admin-1", email, fullName: "Admin", role: "ADMIN", isActive: true, createdAt: new Date().toISOString() },
  });
}
