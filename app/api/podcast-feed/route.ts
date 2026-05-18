import { NextResponse } from "next/server";

export interface PodcastEpisode {
  guid: string;
  title: string;
  description: string;
  pubDate: string;
  audioUrl: string;
  duration: string;
  image: string;
  episodeNumber: number | null;
}

export interface PodcastFeed {
  title: string;
  description: string;
  image: string;
  link: string;
  episodes: PodcastEpisode[];
}

function getTagText(xml: string, tag: string): string {
  const escaped = tag.replace(":", "\\:");
  const re = new RegExp(`<${escaped}[^>]*>([\\s\\S]*?)<\\/${escaped}>`, "i");
  const m = xml.match(re);
  return m ? m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").trim() : "";
}

function getAttr(xml: string, tag: string, attr: string): string {
  const escaped = tag.replace(":", "\\:");
  const re = new RegExp(`<${escaped}[^>]*\\s${attr}="([^"]*)"`, "i");
  const m = xml.match(re);
  return m ? m[1].trim() : "";
}

function parseItems(xml: string): PodcastEpisode[] {
  const items: PodcastEpisode[] = [];
  const itemRe = /<item>([\s\S]*?)<\/item>/gi;
  let match: RegExpExecArray | null;
  let index = 0;

  while ((match = itemRe.exec(xml)) !== null) {
    const item = match[1];

    const enclosureRe = /<enclosure[^>]*url="([^"]*)"[^>]*type="audio[^"]*"/i;
    const enclosureMatch = item.match(enclosureRe);
    const audioUrl = enclosureMatch ? enclosureMatch[1] : "";

    const itunesImageRe = /<itunes:image[^>]*href="([^"]*)"/i;
    const itunesImageMatch = item.match(itunesImageRe);
    const image = itunesImageMatch ? itunesImageMatch[1] : "";

    const epNumStr = getTagText(item, "itunes:episode");
    const episodeNumber = epNumStr ? parseInt(epNumStr, 10) : null;

    const duration = getTagText(item, "itunes:duration");
    const guid = getTagText(item, "guid") || `ep-${index}`;

    const description =
      getTagText(item, "itunes:summary") ||
      getTagText(item, "description") ||
      "";

    const cleanDescription = description.replace(/<[^>]+>/g, "").trim();

    items.push({
      guid,
      title: getTagText(item, "title"),
      description: cleanDescription,
      pubDate: getTagText(item, "pubDate"),
      audioUrl,
      duration,
      image,
      episodeNumber,
    });

    index++;
  }

  return items;
}

const RSS_URL = "https://anchor.fm/s/112be7b58/podcast/rss";

export async function GET() {
  try {
    const res = await fetch(RSS_URL, {
      next: { revalidate: 3600 },
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ChurchSite/1.0)",
        Accept: "application/rss+xml, application/xml, text/xml, */*",
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Failed to fetch RSS feed: ${res.status} ${res.statusText}` },
        { status: 502 },
      );
    }

    const xml = await res.text();

    const channelMatch = xml.match(/<channel>([\s\S]*?)<item>/i);
    const channelXml = channelMatch ? channelMatch[1] : xml;

    const itunesImgRe = /<itunes:image[^>]*href="([^"]*)"/i;
    const itunesImgMatch = channelXml.match(itunesImgRe);
    const imageUrlRe = /<image>[\s\S]*?<url>([\s\S]*?)<\/url>/i;
    const imageUrlMatch = channelXml.match(imageUrlRe);
    const channelImage =
      (itunesImgMatch ? itunesImgMatch[1] : "") ||
      (imageUrlMatch ? imageUrlMatch[1].trim() : "");

    const feed: PodcastFeed = {
      title: getTagText(channelXml, "title")
        .replace(/^good options:\s*/i, "")
        .trim(),
      description:
        getTagText(channelXml, "itunes:summary") ||
        getTagText(channelXml, "description"),
      image: channelImage,
      link: getTagText(channelXml, "link"),
      episodes: parseItems(xml),
    };

    return NextResponse.json(feed, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `RSS parse error: ${message}` },
      { status: 500 },
    );
  }
}