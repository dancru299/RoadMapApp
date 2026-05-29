"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRoadmap } from "@/hooks/useRoadmap";
import { useGuestProgress } from "@/hooks/useGuestProgress";
import { GalaxyMap } from "@/components/galaxy/GalaxyMap";
import { HUD } from "@/components/hud/HUD";
import { LogbookOverlay } from "@/components/logbook/LogbookOverlay";
import type { NodeWithStatus } from "@/types";

export default function GalaxyPage() {
  const router = useRouter();
  const { roadmap, loading, error } = useRoadmap();
  const { hydrated, progress } = useGuestProgress();
  const [logbookOpen, setLogbookOpen] = useState(false);

  const handleNodeClick = (node: NodeWithStatus) => {
    if (node.status === "locked") return;
    router.push(`/mission/${node.id}`);
  };

  if (loading || !hydrated) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-950">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-500">Loading galaxy...</p>
        </div>
      </div>
    );
  }

  if (error || !roadmap) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-950">
        <div className="text-center">
          <p className="text-red-400 text-sm mb-2">Không thể tải dữ liệu.</p>
          <p className="text-slate-600 text-xs">{error ?? "Roadmap not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden">
      {/* Static starfield background */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: Array.from({ length: 80 }, () => {
            const x = (Math.random() * 100).toFixed(2);
            const y = (Math.random() * 100).toFixed(2);
            const r = Math.random() > 0.85 ? 2 : 1;
            const o = (0.2 + Math.random() * 0.6).toFixed(2);
            return `radial-gradient(${r}px ${r}px at ${x}% ${y}%, rgba(255,255,255,${o}), transparent)`;
          }).join(", "),
        }}
      />

      {/* HUD overlay */}
      <HUD
        roadmapTitle={roadmap.title}
        chapters={roadmap.chapters}
        progress={progress}
        onLogbookOpen={() => setLogbookOpen(true)}
      />

      {/* Galaxy Map */}
      <GalaxyMap
        chapters={roadmap.chapters}
        progress={progress}
        onNodeClick={handleNodeClick}
      />

      {/* Logbook Overlay */}
      <LogbookOverlay
        isOpen={logbookOpen}
        chapters={roadmap.chapters}
        progress={progress}
        onClose={() => setLogbookOpen(false)}
      />
    </div>
  );
}
