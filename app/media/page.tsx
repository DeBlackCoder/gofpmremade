// Server component — fetches RSS feed at request time (ISR, revalidates every hour)
import type { Metadata } from "next";
import { getDailyPhoto } from "@/lib/church-photos";
import type { PodcastFeed } from "@/app/api/podcast-feed/route";
import MediaClient from "./MediaClient";

export const revalidate = 3600; // ISR: rebuild this page every hour

export const metadata: Metadata = {
  title: "Media",
  description:
    "Listen to audio messages and watch recorded services from Assemblies Of God Church, Choba 2.",
};

async function getPodcastFeed(): Promise<PodcastFeed | null> {
  const RSS_URL = process.env.PODCAST_RSS_URL ?? "https://anchor.fm/s/111293d28/podcast/rss";
  if (!RSS_URL) return null;

  try {
    // Fetch via our own API route so the XML parsing logic is centralised
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

    const res = await fetch(`${baseUrl}/api/podcast-feed`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;
    return (await res.json()) as PodcastFeed;
  } catch {
    return null;
  }
}

export default async function MediaPage() {
  const bgUrl = getDailyPhoto(3);
  const feed = await getPodcastFeed();

  return <MediaClient bgUrl={bgUrl} feed={feed} />;
}
