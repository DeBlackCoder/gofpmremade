import { NextRequest } from "next/server";
import { readData, writeData, successResponse, errorResponse } from "@/lib/api/local-db";
import type { ChurchEvent } from "@/lib/types/resources";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const events = readData<ChurchEvent[]>("events.json");
  const event = events.find((e) => e.id === id);
  if (!event) return errorResponse("Event not found", 404);
  return successResponse(event);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json() as Partial<ChurchEvent>;
  const events = readData<ChurchEvent[]>("events.json");
  const idx = events.findIndex((e) => e.id === id);
  if (idx === -1) return errorResponse("Event not found", 404);
  events[idx] = { ...events[idx], ...body, updatedAt: new Date().toISOString() };
  writeData("events.json", events);
  return successResponse(events[idx]);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const events = readData<ChurchEvent[]>("events.json");
  const filtered = events.filter((e) => e.id !== id);
  if (filtered.length === events.length) return errorResponse("Event not found", 404);
  writeData("events.json", filtered);
  return successResponse({ success: true });
}
