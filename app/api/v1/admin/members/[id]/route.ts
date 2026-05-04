import { NextRequest } from "next/server";
import { readData, successResponse, errorResponse } from "@/lib/api/local-db";
import type { PublicUser } from "@/lib/types/resources";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const members = readData<PublicUser[]>("members.json");
  const member = members.find((m) => m.id === id);
  if (!member) return errorResponse("Member not found", 404);
  return successResponse(member);
}
