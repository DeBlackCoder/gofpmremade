import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAdminCredentials, updateAdminCredentials } from "@/lib/db/admin-storage";

export async function POST(req: NextRequest) {
  // Check session
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");
  if (session?.value !== "authenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { currentPassword, newPassword } = await req.json() as {
    currentPassword: string;
    newPassword: string;
  };

  let credentials;
  try {
    credentials = await getAdminCredentials();
  } catch {
    return NextResponse.json({ error: "Could not read credentials." }, { status: 500 });
  }

  if (!credentials) {
    return NextResponse.json({ error: "Could not read credentials." }, { status: 500 });
  }

  if (currentPassword !== credentials.password) {
    return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
  }

  if (!newPassword || newPassword.length < 8) {
    return NextResponse.json({ error: "New password must be at least 8 characters." }, { status: 400 });
  }

  try {
    await updateAdminCredentials({ ...credentials, password: newPassword });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Could not save new password." }, { status: 500 });
  }
}
