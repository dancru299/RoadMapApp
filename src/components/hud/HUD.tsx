"use client";

import { ChapterProgress } from "./ChapterProgress";
import { LogbookButton } from "./LogbookButton";
import { SoundToggle } from "./SoundToggle";
import type { ChapterData, GuestProgress } from "@/types";

interface Props {
  roadmapTitle: string;
  chapters: ChapterData[];
  progress: GuestProgress["progress"];
  onLogbookOpen: () => void;
}

export function HUD({ roadmapTitle, chapters, progress, onLogbookOpen }: Props) {
  return (
    <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3 pointer-events-none">
      {/* Left: title */}
      <div className="pointer-events-auto flex items-center gap-3">
        <div
          className="px-3 py-1.5 rounded-lg border border-slate-700/60 bg-slate-950/80 backdrop-blur-sm"
        >
          <span className="text-sm font-semibold text-slate-200">{roadmapTitle}</span>
        </div>
      </div>

      {/* Center: chapter progress */}
      <div className="pointer-events-auto px-3 py-1.5 rounded-lg border border-slate-700/60 bg-slate-950/80 backdrop-blur-sm">
        <ChapterProgress chapters={chapters} progress={progress} />
      </div>

      {/* Right: sound + logbook */}
      <div className="pointer-events-auto flex items-center gap-2">
        <SoundToggle />
        <LogbookButton onClick={onLogbookOpen} />
      </div>
    </div>
  );
}
