import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data/announcements.json");

interface Announcement {
  id: string;
  title: string;
  message: string;
  date?: string;
  venue?: string;
  active: boolean;
  createdAt: string;
}

function readAnnouncements(): Announcement[] {
  try {
    const raw = fs.readFileSync(DATA_PATH, "utf-8");
    return JSON.parse(raw) as Announcement[];
  } catch {
    return [];
  }
}

// GET — returns ALL announcements (admin use)
export async function GET() {
  const all = readAnnouncements();
  return NextResponse.json(all, {
    headers: { "Cache-Control": "no-store" },
  });
}
