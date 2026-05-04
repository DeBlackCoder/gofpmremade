import { NextRequest } from "next/server";
import { readData, writeData, successResponse, errorResponse } from "@/lib/api/local-db";
import type { MinistryGroup } from "@/lib/types/resources";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const groups = readData<MinistryGroup[]>("community.json");
  const group = groups.find((g) => g.id === id);
  if (!group) return errorResponse("Group not found", 404);
  return successResponse(group);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json() as Partial<MinistryGroup>;
  const groups = readData<MinistryGroup[]>("community.json");
  const idx = groups.findIndex((g) => g.id === id);
  if (idx === -1) return errorResponse("Group not found", 404);
  groups[idx] = { ...groups[idx], ...body, updatedAt: new Date().toISOString() };
  writeData("community.json", groups);
  return successResponse(groups[idx]);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const groups = readData<MinistryGroup[]>("community.json");
  const filtered = groups.filter((g) => g.id !== id);
  if (filtered.length === groups.length) return errorResponse("Group not found", 404);
  writeData("community.json", filtered);
  return successResponse({ success: true });
}
