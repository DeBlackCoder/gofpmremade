import { NextRequest } from "next/server";
import { readData, writeData, successResponse } from "@/lib/api/local-db";

interface LiveData {
  isLive: boolean;
  streamUrl?: string;
  title: string;
  description: string;
  previousStreams?: unknown[];
}

export async function POST(req: NextRequest) {
  const body = await req.json() as Partial<LiveData>;
  const live = readData<LiveData>("live.json");
  const updated: LiveData = {
    ...live,
    streamUrl: body.streamUrl ?? live.streamUrl,
    title: body.title ?? live.title,
    description: body.description ?? live.description,
  };
  writeData("live.json", updated);
  return successResponse({ ...updated, id: "live-1", updatedAt: new Date().toISOString() });
}
