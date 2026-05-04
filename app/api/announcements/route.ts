import { NextRequest, NextResponse } from "next/server";
import {
  readAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  type Announcement,
} from "@/lib/db/announcements-storage";

// GET — returns all active announcements (public)
export async function GET() {
  const all = await readAnnouncements();
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

  const newItem: Announcement = {
    id: Date.now().toString(),
    title: title.trim(),
    message: message.trim(),
    date: date?.trim() ?? "",
    venue: venue?.trim() ?? "",
    active: active ?? true,
    createdAt: new Date().toISOString(),
  };

  await createAnnouncement(newItem);

  return NextResponse.json(newItem, { status: 201 });
}

// PUT — update announcement by id
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, title, message, date, venue, active } = body as Partial<Announcement>;

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const all = await readAnnouncements();
  const existing = all.find((a) => a.id === id);

  if (!existing) {
    return NextResponse.json({ error: "Announcement not found" }, { status: 404 });
  }

  const updated: Announcement = {
    ...existing,
    ...(title !== undefined && { title: title.trim() }),
    ...(message !== undefined && { message: message.trim() }),
    ...(date !== undefined && { date: date.trim() }),
    ...(venue !== undefined && { venue: venue.trim() }),
    ...(active !== undefined && { active }),
  };

  await updateAnnouncement(id, updated);
  return NextResponse.json(updated);
}

// DELETE — delete announcement by id (pass id in body)
export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { id } = body as { id: string };

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const deleted = await deleteAnnouncement(id);

  if (!deleted) {
    return NextResponse.json({ error: "Announcement not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
