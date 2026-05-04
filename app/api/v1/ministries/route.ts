import { NextRequest } from "next/server";
import { readData, writeData, successResponse, paginatedResponse } from "@/lib/api/local-db";
import type { MinistryGroup } from "@/lib/types/resources";

export async function GET(req: NextRequest) {
  const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "20", 10);
  const groups = readData<MinistryGroup[]>("community.json");
  const normalized = groups.map((g, i) => ({
    ...g,
    id: g.id || `grp-${i}`,
    createdAt: g.createdAt || new Date().toISOString(),
    updatedAt: g.updatedAt || new Date().toISOString(),
  }));
  return paginatedResponse(normalized, page, limit);
}

export async function POST(req: NextRequest) {
  const body = await req.json() as Partial<MinistryGroup>;
  const groups = readData<MinistryGroup[]>("community.json");
  const newGroup: MinistryGroup = {
    id: `grp-${Date.now()}`,
    name: body.name || "",
    tag: body.tag || "ALL_AGES",
    meets: body.meets || "",
    leader: body.leader || "",
    bio: body.bio || "",
    spots: body.spots ?? null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  groups.push(newGroup);
  writeData("community.json", groups);
  return successResponse(newGroup, 201);
}
