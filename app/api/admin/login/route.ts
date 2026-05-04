import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";

interface AdminCredentials {
  email: string;
  password: string;
}

function readCredentials(): AdminCredentials {
  const filePath = path.join(process.cwd(), "data/admin-credentials.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as AdminCredentials;
}

export async function POST(req: NextRequest) {
  const { email, password } = await req.json() as { email: string; password: string };

  let credentials: AdminCredentials;
  try {
    credentials = readCredentials();
  } catch {
    return NextResponse.json({ error: "Admin credentials not configured." }, { status: 500 });
  }

  if (email !== credentials.email || password !== credentials.password) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set("admin_session", "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return NextResponse.json({ success: true });
}
