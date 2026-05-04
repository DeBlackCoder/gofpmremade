import { NextResponse } from "next/server";
import { readAnnouncements } from "@/lib/db/announcements-storage";

// GET — returns ALL announcements (admin use)
export async function GET() {
  const all = await readAnnouncements();
  return NextResponse.json(all, {
    headers: { "Cache-Control": "no-store" },
  });
}
