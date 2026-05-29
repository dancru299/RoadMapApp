import type { NodeData, NodeStatus } from "@/types";

interface Props {
  from: NodeData;
  to: NodeData;
  toStatus: NodeStatus;
}

export function NodeConnector({ from, to, toStatus }: Props) {
  const isUnlocked = toStatus !== "locked";

  if (!isUnlocked) {
    // Dormant path — faint dashed hint
    return (
      <line
        x1={from.posX}
        y1={from.posY}
        x2={to.posX}
        y2={to.posY}
        stroke="#1e293b"
        strokeWidth={1.5}
        strokeDasharray="5 5"
        strokeLinecap="round"
        opacity={0.35}
      />
    );
  }

  // Active path — glowing line with a flowing energy dash on top
  return (
    <g>
      <line
        x1={from.posX}
        y1={from.posY}
        x2={to.posX}
        y2={to.posY}
        stroke="#38bdf8"
        strokeWidth={2}
        strokeLinecap="round"
        opacity={0.55}
        filter="url(#connector-glow)"
      />
      <line
        x1={from.posX}
        y1={from.posY}
        x2={to.posX}
        y2={to.posY}
        stroke="#bae6fd"
        strokeWidth={2}
        strokeLinecap="round"
        strokeDasharray="3 14"
        opacity={0.9}
        className="connector-flow"
      />
    </g>
  );
}
