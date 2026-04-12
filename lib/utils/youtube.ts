export function toYouTubeEmbedUrl(url: string): string {
  const raw = url.trim();
  if (!raw) return "";

  if (raw.includes("/embed/")) {
    return raw;
  }

  try {
    const parsed = new URL(raw);
    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();

    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id
        ? `https://www.youtube.com/embed/${id}?autoplay=1&mute=0&rel=0`
        : raw;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      const liveId = parsed.pathname.split("/").filter(Boolean)[1];
      if (parsed.pathname.startsWith("/watch")) {
        const id = parsed.searchParams.get("v");
        return id
          ? `https://www.youtube.com/embed/${id}?autoplay=1&mute=0&rel=0`
          : raw;
      }

      if (parsed.pathname.startsWith("/live/")) {
        return liveId
          ? `https://www.youtube.com/embed/${liveId}?autoplay=1&mute=0&rel=0`
          : raw;
      }

      if (parsed.pathname.startsWith("/shorts/")) {
        return liveId
          ? `https://www.youtube.com/embed/${liveId}?autoplay=1&mute=0&rel=0`
          : raw;
      }
    }
  } catch {
    return raw;
  }

  return raw;
}

export function toYouTubeWatchUrl(url: string): string {
  const raw = url.trim();
  if (!raw) return "";

  try {
    const parsed = new URL(raw);
    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();

    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id ? `https://www.youtube.com/watch?v=${id}` : raw;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (parsed.pathname.startsWith("/embed/")) {
        const id = parsed.pathname.split("/").filter(Boolean)[1];
        return id ? `https://www.youtube.com/watch?v=${id}` : raw;
      }

      if (parsed.pathname.startsWith("/live/")) {
        const id = parsed.pathname.split("/").filter(Boolean)[1];
        return id ? `https://www.youtube.com/watch?v=${id}` : raw;
      }
    }
  } catch {
    return raw;
  }

  return raw;
}
