import { NextResponse } from "next/server";

export interface YouTubeVideo {
  videoId: string;
  title: string;
  published: string;
  updated: string;
  thumbnail: string;
  channelName: string;
  channelUrl: string;
  description: string;
}

export interface YouTubeFeed {
  channelId: string;
  channelName: string;
  channelUrl: string;
  videos: YouTubeVideo[];
}

// ─── XML helpers ──────────────────────────────────────────────────────────────

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\:]/g, (c) => "\\" + c);
}

function getTagText(xml: string, tag: string): string {
  const escaped = escapeRegex(tag);
  const re = new RegExp(`<${escaped}[^>]*>([\\s\\S]*?)<\\/${escaped}>`, "i");
  const m = xml.match(re);
  return m ? m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").trim() : "";
}

function getAttr(xml: string, tag: string, attr: string): string {
  const escaped = escapeRegex(tag);
  const re = new RegExp(`<${escaped}[^>]*\\s${attr}="([^"]*)"`, "i");
  const m = xml.match(re);
  return m ? m[1].trim() : "";
}

function parseEntries(xml: string): YouTubeVideo[] {
  const videos: YouTubeVideo[] = [];
  const entryRe = /<entry>([\s\S]*?)<\/entry>/gi;
  let match: RegExpExecArray | null;

  while ((match = entryRe.exec(xml)) !== null) {
    const entry = match[1];

    // Video ID — <yt:videoId>
    const videoId = getTagText(entry, "yt:videoId");
    if (!videoId) continue;

    // Thumbnail — <media:thumbnail url="...">
    const thumbnail =
      getAttr(entry, "media:thumbnail", "url") ||
      `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    // Description — inside <media:group><media:description>
    const mediaGroupMatch = entry.match(/<media:group>([\s\S]*?)<\/media:group>/i);
    const mediaGroup = mediaGroupMatch ? mediaGroupMatch[1] : "";
    const description = getTagText(mediaGroup, "media:description");

    // Channel info
    const authorMatch = entry.match(/<author>([\s\S]*?)<\/author>/i);
    const authorXml = authorMatch ? authorMatch[1] : "";
    const channelName = getTagText(authorXml, "name");
    const channelUrl = getTagText(authorXml, "uri");

    videos.push({
      videoId,
      title: getTagText(entry, "title"),
      published: getTagText(entry, "published"),
      updated: getTagText(entry, "updated"),
      thumbnail,
      channelName,
      channelUrl,
      description: description.slice(0, 300),
    });
  }

  return videos;
}

// ─── Route handler ────────────────────────────────────────────────────────────

const CHANNEL_ID =
  process.env.YOUTUBE_CHANNEL_ID ?? "UCQshxkbjIwOPDHTtLoM19cQ";

export async function GET() {
  const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

  try {
    const res = await fetch(feedUrl, {
      next: { revalidate: 300 }, // cache 5 min
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ChurchSite/1.0)",
        Accept: "application/atom+xml, application/xml, text/xml, */*",
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `YouTube feed returned ${res.status}` },
        { status: 502 },
      );
    }

    const xml = await res.text();

    // Channel-level metadata
    const channelName = getTagText(xml, "title");
    const channelUrl = `https://www.youtube.com/channel/${CHANNEL_ID}`;

    const feed: YouTubeFeed = {
      channelId: CHANNEL_ID,
      channelName,
      channelUrl,
      videos: parseEntries(xml),
    };

    return NextResponse.json(feed, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `YouTube feed error: ${message}` },
      { status: 500 },
    );
  }
}
