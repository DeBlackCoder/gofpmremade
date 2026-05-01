import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data/announcements.json");

export interface Announcement {
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

function writeAnnouncements(data: Announcement[]): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

// GET — returns all active announcements (public)
export async function GET() {
  const all = readAnnouncements();
  const active = all.filter((a) => a.active);
  return NextResponse.json(active, {
    headers: { "Cache-Control": "no-store" },
  });
}

// POST — create new announcement
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, message, date, venue, active } = body as Partial<Announcement>;

  if (!title || !message) {
    return NextResponse.json({ error: "title and message are required" }, { status: 400 });
  }

  const all = readAnnouncements();
  const newItem: Announcement = {
    id: Date.now().toString(),
    title: title.trim(),
    message: message.trim(),
    date: date?.trim() ?? "",
    venue: venue?.trim() ?? "",
    active: active ?? true,
    createdAt: new Date().toISOString(),
  };

  all.unshift(newItem);
  writeAnnouncements(all);

  return NextResponse.json(newItem, { status: 201 });
}

// PUT — update announcement by id
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, title, message, date, venue, active } = body as Partial<Announcement>;

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const all = readAnnouncements();
  const idx = all.findIndex((a) => a.id === id);

  if (idx === -1) {
    return NextResponse.json({ error: "Announcement not found" }, { status: 404 });
  }

  all[idx] = {
    ...all[idx],
    ...(title !== undefined && { title: title.trim() }),
    ...(message !== undefined && { message: message.trim() }),
    ...(date !== undefined && { date: date.trim() }),
    ...(venue !== undefined && { venue: venue.trim() }),
    ...(active !== undefined && { active }),
  };

  writeAnnouncements(all);
  return NextResponse.json(all[idx]);
}

// DELETE — delete announcement by id (pass id in body)
export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { id } = body as { id: string };

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const all = readAnnouncements();
  const filtered = all.filter((a) => a.id !== id);

  if (filtered.length === all.length) {
    return NextResponse.json({ error: "Announcement not found" }, { status: 404 });
  }

  writeAnnouncements(filtered);
  return NextResponse.json({ success: true });
}
