import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { readJSON, writeJSON } from "@/lib/data-store";
import { defaultLiveSettings, type LiveSettings } from "@/lib/live-data";

const FILE = "live.json";

export async function GET() {
  const settings = readJSON<LiveSettings>(FILE, defaultLiveSettings);
  return NextResponse.json(settings);
}

export async function POST(req: NextRequest) {
  if (!(await verifyAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  writeJSON(FILE, body);
  return NextResponse.json({ ok: true });
}
