import { NextRequest } from "next/server";
import { readData, successResponse } from "@/lib/api/local-db";
import type { Sermon, ChurchEvent, ContactSubmission } from "@/lib/types/resources";

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") || "").toLowerCase().trim();

  if (!q) return successResponse({ query: q, types: [], results: { sermons: [], events: [], posts: [] } });

  const sermons = readData<Sermon[]>("sermons.json").filter(
    (s) => s.title.toLowerCase().includes(q) || s.excerpt?.toLowerCase().includes(q),
  );
  const events = readData<ChurchEvent[]>("events.json").filter(
    (e) => e.title.toLowerCase().includes(q) || e.description?.toLowerCase().includes(q),
  );
  const posts = readData<ContactSubmission[]>("contacts.json").filter(
    (c) => c.message.toLowerCase().includes(q),
  );

  return successResponse({ query: q, types: ["sermons", "events", "posts"], results: { sermons, events, posts } });
}
