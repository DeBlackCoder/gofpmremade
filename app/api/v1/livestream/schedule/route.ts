import { readData, successResponse } from "@/lib/api/local-db";

interface LiveData {
  previousStreams?: unknown[];
}

export async function GET() {
  const live = readData<LiveData>("live.json");
  return successResponse({ data: live.previousStreams || [] });
}
