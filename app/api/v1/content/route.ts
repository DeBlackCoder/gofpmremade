import { NextRequest } from "next/server";
import { readData, successResponse, paginatedResponse } from "@/lib/api/local-db";

interface ContentItem {
  id: string;
  type: string;
  title: string;
  body: string;
  createdAt: string;
}

export async function GET(req: NextRequest) {
  const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
  const type = req.nextUrl.searchParams.get("type");
  const items = readData<ContentItem[]>("announcements.json");
  const filtered = type ? items.filter((i) => i.type === type) : items;
  return paginatedResponse(filtered, page);
}
