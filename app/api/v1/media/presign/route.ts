import { successResponse } from "@/lib/api/local-db";

export async function POST() {
  // No S3 in local mode — return a stub
  return successResponse({ url: null, key: null, message: "File uploads not available in local mode." });
}
