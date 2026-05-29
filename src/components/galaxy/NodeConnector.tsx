import type { NodeData, NodeStatus } from "@/types";

interface Props {
  from: NodeData;
  to: NodeData;
  toStatus: NodeStatus;
}

export function NodeConnector({ from, to, toStatus }: Props) {
  const isUnlocked = toStatus !== "locked";

  return (
    <line
      x1={from.posX}
      y1={from.posY}
      x2={to.posX}
      y2={to.posY}
      stroke={isUnlocked ? "#334155" : "#1e293b"}
      strokeWidth={isUnlocked ? 2 : 1.5}
      strokeDasharray={isUnlocked ? undefined : "6 4"}
      strokeLinecap="round"
      opacity={isUnlocked ? 0.7 : 0.3}
    />
  );
}
