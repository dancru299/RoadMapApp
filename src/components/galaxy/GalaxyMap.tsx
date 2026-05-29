"use client";

import { useRef, useEffect, useMemo } from "react";
import { useGalaxyMap } from "@/hooks/useGalaxyMap";
import { NodeConnector } from "./NodeConnector";
import { NebulaCluster } from "./NebulaCluster";
import { StarNode } from "./StarNode";
import type { ChapterData, NodeData, NodeStatus, NodeWithStatus, GuestProgress } from "@/types";

const WORLD_W = 1500;
const WORLD_H = 1150;

function computeStatusMap(
  chapters: ChapterData[],
  progress: GuestProgress["progress"]
): Map<string, NodeStatus> {
  const all = chapters
    .flatMap((c) => c.nodes)
    .sort((a, b) => a.orderIndex - b.orderIndex);

  const map = new Map<string, NodeStatus>();

  for (const node of all) {
    if (progress[node.id]?.status === "completed") {
      map.set(node.id, "completed");
    } else if (!node.prerequisiteNodeId) {
      map.set(node.id, "active");
    } else {
      const prereqStatus = map.get(node.prerequisiteNodeId);
      map.set(node.id, prereqStatus === "completed" ? "active" : "locked");
    }
  }

  return map;
}

interface Props {
  chapters: ChapterData[];
  progress: GuestProgress["progress"];
  onNodeClick: (node: NodeWithStatus) => void;
}

export function GalaxyMap({ chapters, progress, onNodeClick }: Props) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const { offset, scale, setOffset, onMouseDown, onMouseMove, onMouseUp, onMouseLeave, onWheel } =
    useGalaxyMap();

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
    setOffset({ x: width / 2 - firstActive.posX, y: height / 2 - firstActive.posY });
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
      {/* World container */}
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{
          width: WORLD_W,
          height: WORLD_H,
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
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
