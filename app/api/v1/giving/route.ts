import { NextRequest } from "next/server";
import { readData, paginatedResponse } from "@/lib/api/local-db";
import type { GivingRecord } from "@/lib/types/resources";

export async function GET(req: NextRequest) {
  const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
  const records = readData<GivingRecord[]>("giving.json");
  return paginatedResponse(records, page);
}
