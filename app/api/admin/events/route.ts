import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { readJSON, writeJSON } from "@/lib/data-store";
import type { ChurchEvent } from "@/lib/events-data";
import { randomUUID } from "crypto";

const FILE = "events.json";

export async function GET() {
  const events = readJSON<ChurchEvent[]>(FILE, []);
  return NextResponse.json(events);
}

export async function POST(req: NextRequest) {
  if (!(await verifyAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const events = readJSON<ChurchEvent[]>(FILE, []);
  const newEvent: ChurchEvent = { ...body, id: randomUUID() };
  writeJSON(FILE, [newEvent, ...events]);
  return NextResponse.json(newEvent, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  if (!(await verifyAdminSession())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  const events = readJSON<ChurchEvent[]>(FILE, []);
  writeJSON(FILE, events.filter((e) => e.id !== id));
  return NextResponse.json({ ok: true });
}
