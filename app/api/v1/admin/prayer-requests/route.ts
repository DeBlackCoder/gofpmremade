import { NextRequest } from "next/server";
import { readData, paginatedResponse } from "@/lib/api/local-db";
import type { ContactSubmission } from "@/lib/types/resources";

export async function GET(req: NextRequest) {
  const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
  const limit = parseInt(req.nextUrl.searchParams.get("limit") || "25", 10);
  const contacts = readData<ContactSubmission[]>("contacts.json");
  const prayers = contacts.filter((c) => c.subject === "Prayer Request");
  return paginatedResponse(prayers, page, limit);
}
