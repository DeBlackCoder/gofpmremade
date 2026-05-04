"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  useCreateLivestreamMutation,
  useEndLivestream,
  useLivestreamActive,
  useLivestreamSchedule,
  useStartLivestream,
} from "@/lib/hooks/queries";
import { toYouTubeEmbedUrl, toYouTubeWatchUrl } from "@/lib/utils/youtube";

interface LiveSettingsForm {
  isLive: boolean;
  streamUrl: string;
  title: string;
  description: string;
}

const defaultLiveSettings: LiveSettingsForm = {
  isLive: false,
  streamUrl: "",
  title: "Sunday Service",
  description: "Join us live for worship and the Word.",
};

export default function AdminLivePage() {
  const activeQuery = useLivestreamActive();
  const scheduleQuery = useLivestreamSchedule();
  const createLivestreamMutation = useCreateLivestreamMutation();
  const startLivestreamMutation = useStartLivestream();
  const endLivestreamMutation = useEndLivestream();

  const [settings, setSettings] =
    useState<LiveSettingsForm>(defaultLiveSettings);
  const [saving, setSaving] = useState(false);
  const [liveAction, setLiveAction] = useState<"idle" | "starting" | "ending">(
    "idle",
  );
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const active = activeQuery.data;
    if (!active) return;

    setSettings({
      isLive: !!active.isLive,
      streamUrl: active.streamUrl || "",
      title: active.title || defaultLiveSettings.title,
      description: active.description || defaultLiveSettings.description,
    });
  }, [activeQuery.data]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value, type } = e.target;
    setSettings((p) => ({
      ...p,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const updated = await createLivestreamMutation.mutateAsync({
        streamUrl: settings.streamUrl,
        title: settings.title,
        description: settings.description,
      });

      setSettings((p) => ({
        ...p,
        isLive: !!updated.isLive,
        streamUrl: updated.streamUrl || p.streamUrl,
        title: updated.title || p.title,
        description: updated.description || p.description,
      }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  async function handleGoLive() {
    setLiveAction("starting");
    try {
      const live = await startLivestreamMutation.mutateAsync();
      setSettings((p) => ({
        ...p,
        isLive: !!live.isLive,
        streamUrl: live.streamUrl || p.streamUrl,
        title: live.title || p.title,
        description: live.description || p.description,
      }));
    } finally {
      setLiveAction("idle");
    }
  }

  async function handleEndLive() {
    setLiveAction("ending");
    try {
      const live = await endLivestreamMutation.mutateAsync();
      setSettings((p) => ({
        ...p,
        isLive: !!live.isLive,
        streamUrl: live.streamUrl || p.streamUrl,
        title: live.title || p.title,
        description: live.description || p.description,
      }));
    } finally {
      setLiveAction("idle");
    }
  }

  const inputClass =
    "bg-white/5 border border-white/15 px-3 py-2.5 font-body text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-white/40 transition-colors w-full";
  const prevStreams = scheduleQuery.data ?? [];
  const activeEmbedUrl = settings.streamUrl
    ? toYouTubeEmbedUrl(settings.streamUrl)
    : "";

  return (
    <div className="flex flex-col min-h-screen px-6 py-8 sm:px-10 sm:py-10 max-w-3xl mx-auto">
      <div className="mb-10">
        <span className="font-body text-white/30 text-[10px] tracking-widest uppercase">
          Admin
        </span>
        <h1 className="font-heading text-white font-black text-3xl sm:text-4xl leading-none tracking-tight mt-0.5">
          Live Service
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 border border-white/10 p-6 backdrop-blur-sm bg-white/3"
      >
        <p className="font-body text-white/30 text-[10px] tracking-widest uppercase">
          Stream settings
        </p>

        <div className="flex items-center justify-between gap-4 border border-white/10 bg-white/5 px-4 py-3">
          <div className="flex flex-col gap-0.5">
            <span className="font-body text-white font-semibold text-sm">
              {settings.isLive ? (
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  Live now
                </span>
              ) : (
                "Offline"
              )}
            </span>
            <span className="font-body text-white/35 text-xs">
              Use the buttons below to start or end the live stream.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={liveAction !== "idle" || settings.isLive}
              onClick={handleGoLive}
              className="border-white/30 text-white bg-transparent hover:bg-white hover:text-black font-body tracking-wide rounded-none text-xs px-4"
            >
              {liveAction === "starting" ? "Starting…" : "Go live"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={liveAction !== "idle" || !settings.isLive}
              onClick={handleEndLive}
              className="border-white/30 text-white bg-transparent hover:bg-white hover:text-black font-body tracking-wide rounded-none text-xs px-4"
            >
              {liveAction === "ending" ? "Ending…" : "End live"}
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">
            YouTube stream URL
          </label>
          <input
            name="streamUrl"
            value={settings.streamUrl}
            onChange={handleChange}
            placeholder="https://www.youtube.com/watch?v=..."
            className={inputClass}
          />
          <p className="font-body text-white/25 text-xs">
            We will turn this into an embedded player for the public live page.
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">
            Service title
          </label>
          <input
            name="title"
            value={settings.title}
            onChange={handleChange}
            placeholder="Sunday Service"
            className={inputClass}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-body text-white/35 text-[10px] tracking-widest uppercase">
            Description
          </label>
          <textarea
            name="description"
            value={settings.description}
            onChange={handleChange}
            rows={3}
            placeholder="Join us live…"
            className={`${inputClass} resize-none`}
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="self-start border border-white/30 px-6 py-2.5 font-body font-semibold text-sm text-white hover:bg-white hover:text-black transition-colors disabled:opacity-40 cursor-pointer"
          >
            {saving ? "Saving…" : "Save settings"}
          </button>
          {saved && (
            <span className="font-body text-white/50 text-xs">Saved ✓</span>
          )}
        </div>
      </form>

      {activeEmbedUrl && (
        <div className="mt-8 border border-white/10 bg-white/5 p-4">
          <p className="font-body text-white/30 text-[10px] tracking-widest uppercase mb-3">
            Preview
          </p>
          <div className="aspect-video w-full overflow-hidden border border-white/10 bg-black">
            <iframe
              className="h-full w-full"
              src={activeEmbedUrl}
              title="Livestream preview"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          <p className="font-body text-white/30 text-xs mt-2 break-all">
            {toYouTubeWatchUrl(settings.streamUrl)}
          </p>
        </div>
      )}

      {/* Previous streams */}
      <div className="mt-10">
        <p className="font-body text-white/30 text-[10px] tracking-widest uppercase mb-3">
          Previous streams — {prevStreams.length}
        </p>

        {prevStreams.length === 0 && (
          <p className="font-body text-white/25 text-sm">
            No previous streams yet. End a live session to archive it here.
          </p>
        )}

        {prevStreams.map((stream) => (
          <div
            key={stream.id}
            className="flex items-start justify-between gap-4 py-4 border-t border-white/10 hover:border-white/20 transition-colors"
          >
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="font-body text-white font-semibold text-sm truncate">
                {stream.title}
              </span>
              <span className="font-body text-white/35 text-xs">
                {stream.date}
              </span>
              {stream.description && (
                <span className="font-body text-white/30 text-xs mt-0.5 line-clamp-1">
                  {stream.description}
                </span>
              )}
              <a
                href={toYouTubeWatchUrl(stream.streamUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-white/30 text-[10px] underline underline-offset-2 hover:text-white transition-colors truncate mt-0.5"
              >
                {stream.streamUrl}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
