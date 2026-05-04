import { NextRequest } from "next/server";
import { readData, writeData, successResponse, errorResponse, paginatedResponse } from "@/lib/api/local-db";
import type { ChurchEvent } from "@/lib/types/resources";

export async function GET(req: NextRequest) {
  const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
  const events = readData<ChurchEvent[]>("events.json");
  return paginatedResponse(events, page);
}

export async function POST(req: NextRequest) {
  const body = await req.json() as Partial<ChurchEvent>;
  const events = readData<ChurchEvent[]>("events.json");
  const newEvent: ChurchEvent = {
    id: `evt-${Date.now()}`,
    title: body.title || "",
    description: body.description || "",
    date: body.date || new Date().toISOString(),
    time: body.time || "",
    location: body.location || "",
    category: body.category || "SERVICE",
    featured: body.featured ?? false,
    imageUrl: body.imageUrl,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  events.unshift(newEvent);
  writeData("events.json", events);
  return successResponse(newEvent, 201);
}
