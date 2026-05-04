import { NextRequest } from "next/server";
import { readData, paginatedResponse } from "@/lib/api/local-db";
import type { PublicUser } from "@/lib/types/resources";

export async function GET(req: NextRequest) {
  const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
  const members = readData<PublicUser[]>("members.json");
  return paginatedResponse(members, page);
}
