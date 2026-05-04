import { readData, writeData, successResponse } from "@/lib/api/local-db";

interface LiveData {
  isLive: boolean;
  streamUrl?: string;
  title: string;
  description: string;
  previousStreams?: unknown[];
}

export async function PUT() {
  const live = readData<LiveData>("live.json");
  const updated = { ...live, isLive: true };
  writeData("live.json", updated);
  return successResponse({ ...updated, id: "live-1", updatedAt: new Date().toISOString() });
}
