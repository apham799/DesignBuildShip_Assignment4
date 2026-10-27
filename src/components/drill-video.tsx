"use client";

import { useRef, useState } from "react";
import type { DrillVideo } from "@/data/drill-videos";

// A drill's how-to video. Nothing is loaded from YouTube until the golfer taps
// "Watch how" (no thumbnail either), so the plan stays fast and private; then it
// plays in YouTube's privacy-enhanced player, right inside the card.
export function DrillVideoPlayer({ video }: { video: DrillVideo }) {
  const [playing, setPlaying] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);
  const watchUrl = `https://www.youtube.com/watch?v=${video.id}`;

  if (!playing) {
    return (
      <button
        type="button"
        onClick={() => {
          setPlaying(true);
          // The button is replaced by the player; keep keyboard focus with it.
          requestAnimationFrame(() => frame.current?.focus());
        }}
        className="flex w-full items-center gap-3 rounded-md border border-rule bg-surface p-3 text-left transition-colors hover:border-ink"
      >
        <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-full bg-green text-on-green">
          <svg viewBox="0 0 16 16" className="ml-0.5 size-4" fill="currentColor">
            <path d="M4 2.5 L13 8 L4 13.5 Z" />
          </svg>
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="text-body font-semibold text-green">Watch how · {video.minutes} min</span>
          <span className="truncate text-body text-muted">
            {video.title} · {video.channel}
          </span>
        </span>
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="aspect-video w-full overflow-hidden rounded-md bg-ink">
        <iframe
          ref={frame}
          src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
          title={`${video.title} (${video.channel})`}
          className="size-full"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      <a href={watchUrl} target="_blank" rel="noreferrer" className="w-fit text-label text-green underline underline-offset-[3px]">
        Open on YouTube
      </a>
    </div>
  );
}
