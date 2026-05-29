"use client";

import type { ChapterData, GuestProgress } from "@/types";

interface Props {
  chapters: ChapterData[];
  progress: GuestProgress["progress"];
}

export function ChapterProgress({ chapters, progress }: Props) {
  const allNodes = chapters.flatMap((c) => c.nodes);
  const completedCount = allNodes.filter((n) => progress[n.id]?.status === "completed").length;

  // Determine current chapter (the one with the latest active/incomplete node)
  const currentChapterIdx = chapters.findIndex((ch) =>
    ch.nodes.some((n) => progress[n.id]?.status !== "completed")
  );
  const currentChapter = currentChapterIdx === -1 ? chapters.length : currentChapterIdx + 1;

  const totalNodes = allNodes.length;
  const pct = totalNodes > 0 ? Math.round((completedCount / totalNodes) * 100) : 0;

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-mono text-slate-400 whitespace-nowrap">
        Chapter {currentChapter} / {chapters.length}
      </span>
      <div className="w-24 h-1.5 rounded-full overflow-hidden bg-slate-800">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
          }}
        />
      </div>
      <span className="text-xs font-mono text-slate-500">
        {completedCount}/{totalNodes}
      </span>
    </div>
  );
}
