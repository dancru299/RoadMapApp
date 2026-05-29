"use client";

import { useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useRoadmap } from "@/hooks/useRoadmap";
import { useGuestProgress } from "@/hooks/useGuestProgress";
import { GalaxyMap } from "@/components/galaxy/GalaxyMap";
import { CosmicBackground } from "@/components/cosmic/CosmicBackground";
import { HUD } from "@/components/hud/HUD";
import { LogbookOverlay } from "@/components/logbook/LogbookOverlay";
import type { NodeWithStatus } from "@/types";

export default function GalaxyPage() {
  const router = useRouter();
  const { roadmap, loading, error } = useRoadmap();
  const { hydrated, progress } = useGuestProgress();
  const [logbookOpen, setLogbookOpen] = useState(false);
  const parallaxRef = useRef<HTMLDivElement>(null);

  // Generate the starfield once — not on every render
  const starfield = useMemo(() => {
    const make = (count: number, maxR: number) =>
      Array.from({ length: count }, () => {
        const x = (Math.random() * 100).toFixed(2);
        const y = (Math.random() * 100).toFixed(2);
        const r = Math.random() > 0.85 ? maxR : 1;
        const o = (0.2 + Math.random() * 0.6).toFixed(2);
        return `radial-gradient(${r}px ${r}px at ${x}% ${y}%, rgba(255,255,255,${o}), transparent)`;
      }).join(", ");
    return { dense: make(90, 2), sparse: make(36, 2.5) };
  }, []);

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
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 120% 90% at 50% 0%, #0b1430 0%, #060a1c 45%, #030711 100%)",
      }}
    >
      {/* Deep starfield layer */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: starfield.dense }}
      />
      {/* Brighter twinkling layer */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none twinkle"
        style={{ backgroundImage: starfield.sparse }}
      />
      {/* Animated solar system (parallax-driven by the map) */}
      <CosmicBackground parallaxRef={parallaxRef} />
      {/* Vignette to focus the center */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 50%, transparent 55%, rgba(3,7,17,0.7) 100%)",
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
        parallaxRef={parallaxRef}
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
