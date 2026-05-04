import { readData, successResponse } from "@/lib/api/local-db";

interface LiveData {
  isLive: boolean;
  streamUrl?: string;
  title: string;
  description: string;
  previousStreams?: unknown[];
}

export async function GET() {
  const live = readData<LiveData>("live.json");
  return successResponse({ data: { ...live, id: "live-1", updatedAt: new Date().toISOString() } });
}
