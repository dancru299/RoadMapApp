"use client";

import { useRef, useEffect, useMemo, type RefObject } from "react";
import { useGalaxyMap } from "@/hooks/useGalaxyMap";
import { NodeConnector } from "./NodeConnector";
import { NebulaCluster } from "./NebulaCluster";
import { StarNode } from "./StarNode";
import { computeStatusMap } from "@/lib/status";
import type { ChapterData, NodeData, NodeWithStatus, GuestProgress } from "@/types";

const WORLD_W = 1500;
const WORLD_H = 1150;

interface Props {
  chapters: ChapterData[];
  progress: GuestProgress["progress"];
  onNodeClick: (node: NodeWithStatus) => void;
  parallaxRef?: RefObject<HTMLDivElement | null>;
}

export function GalaxyMap({ chapters, progress, onNodeClick, parallaxRef }: Props) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const { onMouseDown, onMouseMove, onMouseUp, onMouseLeave, onWheel, centerOn } =
    useGalaxyMap(worldRef, parallaxRef);

  const allNodes = useMemo<NodeData[]>(
    () => chapters.flatMap((c) => c.nodes),
    [chapters]
  );

  const statusMap = useMemo(
    () => computeStatusMap(chapters, progress),
    [chapters, progress]
  );

  // Center on first active node once on mount
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp) return;
    const sorted = [...allNodes].sort((a, b) => a.orderIndex - b.orderIndex);
    const firstActive = sorted.find((n) => statusMap.get(n.id) === "active");
    if (!firstActive) return;
    const { width, height } = vp.getBoundingClientRect();
    centerOn(firstActive.posX, firstActive.posY, width, height);
    // Only run once on mount — statusMap changes are intentionally ignored here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const connections = useMemo(
    () =>
      allNodes
        .filter((n) => n.prerequisiteNodeId)
        .flatMap((n) => {
          const prereq = allNodes.find((p) => p.id === n.prerequisiteNodeId);
          return prereq ? [{ from: prereq, to: n }] : [];
        }),
    [allNodes]
  );

  return (
    <div
      ref={viewportRef}
      className="relative w-full h-full overflow-hidden select-none cursor-grab active:cursor-grabbing"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseLeave}
      onWheel={onWheel}
    >
      {/* World container — transform is driven imperatively by useGalaxyMap */}
      <div
        ref={worldRef}
        className="absolute top-0 left-0 origin-top-left"
        style={{
          width: WORLD_W,
          height: WORLD_H,
          transform: "translate3d(0px, 0px, 0) scale(1)",
          willChange: "transform",
        }}
      >
        {/* Nebula cluster backgrounds */}
        {chapters.map((ch) => (
          <NebulaCluster key={ch.id} chapter={ch} />
        ))}

        {/* SVG connection lines */}
        <svg
          className="absolute inset-0 pointer-events-none"
          width={WORLD_W}
          height={WORLD_H}
        >
          <defs>
            <filter id="connector-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {connections.map(({ from, to }) => (
            <NodeConnector
              key={`${from.id}-${to.id}`}
              from={from}
              to={to}
              toStatus={statusMap.get(to.id) ?? "locked"}
            />
          ))}
        </svg>

        {/* Star nodes */}
        {allNodes.map((node) => {
          const status = statusMap.get(node.id) ?? "locked";
          return (
            <StarNode
              key={node.id}
              node={node}
              status={status}
              selfConfidence={progress[node.id]?.selfConfidence ?? null}
              onClick={() =>
                onNodeClick({
                  ...node,
                  status,
                  selfConfidence: progress[node.id]?.selfConfidence ?? null,
                })
              }
            />
          );
        })}
      </div>
    </div>
  );
}
