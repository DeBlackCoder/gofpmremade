import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";

interface AdminCredentials {
  email: string;
  password: string;
}

const CREDS_PATH = path.join(process.cwd(), "data/admin-credentials.json");

function readCredentials(): AdminCredentials {
  return JSON.parse(fs.readFileSync(CREDS_PATH, "utf-8")) as AdminCredentials;
}

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

  let credentials: AdminCredentials;
  try {
    credentials = readCredentials();
  } catch {
    return NextResponse.json({ error: "Could not read credentials." }, { status: 500 });
  }

  if (currentPassword !== credentials.password) {
    return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
  }

  if (!newPassword || newPassword.length < 8) {
    return NextResponse.json({ error: "New password must be at least 8 characters." }, { status: 400 });
  }

  try {
    const updated: AdminCredentials = { ...credentials, password: newPassword };
    fs.writeFileSync(CREDS_PATH, JSON.stringify(updated, null, 2), "utf-8");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Could not save new password." }, { status: 500 });
  }
}
