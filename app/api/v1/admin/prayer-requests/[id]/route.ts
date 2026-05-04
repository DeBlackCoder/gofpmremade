import { NextRequest } from "next/server";
import { readData, writeData, successResponse, errorResponse } from "@/lib/api/local-db";
import type { ContactSubmission } from "@/lib/types/resources";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json() as { status?: string };
  const contacts = readData<ContactSubmission[]>("contacts.json");
  const idx = contacts.findIndex((c) => c.id === id);
  if (idx === -1) return errorResponse("Not found", 404);
  contacts[idx] = { ...contacts[idx], read: body.status === "READ" };
  writeData("contacts.json", contacts);
  return successResponse(contacts[idx]);
}
