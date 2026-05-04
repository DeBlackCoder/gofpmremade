import { readData, writeData, successResponse } from "@/lib/api/local-db";

interface PreviousStream {
  id: string;
  title: string;
  description: string;
  streamUrl: string;
  date: string;
  createdAt: string;
}

interface LiveData {
  isLive: boolean;
  streamUrl?: string;
  title: string;
  description: string;
  previousStreams?: PreviousStream[];
}

export async function PUT() {
  const live = readData<LiveData>("live.json");
  const previousStreams = live.previousStreams || [];

  // Archive current stream if it has a URL
  if (live.streamUrl) {
    previousStreams.unshift({
      id: `prev-${Date.now()}`,
      title: live.title,
      description: live.description,
      streamUrl: live.streamUrl,
      date: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
    });
  }

  const updated: LiveData = { ...live, isLive: false, previousStreams };
  writeData("live.json", updated);
  return successResponse({ ...updated, id: "live-1", updatedAt: new Date().toISOString() });
}
