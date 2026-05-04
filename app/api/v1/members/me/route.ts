import { successResponse } from "@/lib/api/local-db";

export async function GET() {
  // No user auth in local mode — return null profile
  return successResponse(null);
}

export async function PUT() {
  return successResponse(null);
}
