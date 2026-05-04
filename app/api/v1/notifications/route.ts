import { successResponse } from "@/lib/api/local-db";

export async function GET() {
  return successResponse({ data: [], total: 0 });
}
