"use client";

import { memo } from "react";
import { motion } from "motion/react";
import type { NodeData, NodeStatus, SelfConfidence } from "@/types";

interface Props {
  node: NodeData;
  status: NodeStatus;
  selfConfidence: SelfConfidence | null;
  onClick: () => void;
}

interface NodeStyle {
  size: number;
  /** radial-gradient sphere body (light → mid → dark) */
  body: string;
  border: string;
  /** soft outer halo color */
  halo: string;
  glow: string;
  opacity: number;
  cursor: string;
}

const STYLES: Record<"locked" | "active" | "completed" | "unsure", NodeStyle> = {
  locked: {
    size: 44,
    body: "radial-gradient(circle at 32% 28%, #475569 0%, #334155 45%, #1e293b 100%)",
    border: "#3f4d63",
    halo: "transparent",
    glow: "inset 0 2px 6px rgba(255,255,255,0.06)",
    opacity: 0.5,
    cursor: "default",
  },
  active: {
    size: 56,
    body: "radial-gradient(circle at 32% 28%, #bfdbfe 0%, #3b82f6 42%, #1e3a8a 100%)",
    border: "#93c5fd",
    halo: "#3b82f6",
    glow: "inset 0 3px 8px rgba(255,255,255,0.45), inset 0 -4px 10px rgba(0,0,0,0.4), 0 0 22px 6px rgba(59,130,246,0.55)",
    opacity: 1,
    cursor: "pointer",
  },
  completed: {
    size: 50,
    body: "radial-gradient(circle at 32% 28%, #a7f3d0 0%, #10b981 45%, #065f46 100%)",
    border: "#6ee7b7",
    halo: "#10b981",
    glow: "inset 0 3px 8px rgba(255,255,255,0.4), inset 0 -4px 10px rgba(0,0,0,0.4), 0 0 16px 4px rgba(16,185,129,0.4)",
    opacity: 1,
    cursor: "pointer",
  },
  unsure: {
    size: 50,
    body: "radial-gradient(circle at 32% 28%, #fde68a 0%, #f59e0b 45%, #92400e 100%)",
    border: "#fcd34d",
    halo: "#f59e0b",
    glow: "inset 0 3px 8px rgba(255,255,255,0.4), inset 0 -4px 10px rgba(0,0,0,0.4), 0 0 16px 4px rgba(245,158,11,0.4)",
    opacity: 1,
    cursor: "pointer",
  },
};

function StarNodeImpl({ node, status, selfConfidence, onClick }: Props) {
  const isUnsure = status === "completed" && selfConfidence === "unsure";
  const key = isUnsure ? "unsure" : status;
  const cfg = STYLES[key];

  return (
    <div
      className="absolute"
      style={{
        left: node.posX,
        top: node.posY,
        transform: "translate(-50%, -50%)",
        zIndex: status === "locked" ? 1 : 2,
      }}
    >
      {/* Soft ambient halo behind the planet */}
      {cfg.halo !== "transparent" && (
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: cfg.size * 2.1,
            height: cfg.size * 2.1,
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle, ${cfg.halo}40 0%, transparent 70%)`,
          }}
        />
      )}

      {/* Unsure: rotating dashed orbit ring */}
      {isUnsure && (
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: cfg.size + 22,
            height: cfg.size + 22,
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            border: "2px dashed #fbbf24",
            animation: "orbit-spin 7s linear infinite",
            opacity: 0.7,
          }}
        />
      )}

      {/* Active: pulsing ring */}
      {status === "active" && (
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: cfg.size + 14,
            height: cfg.size + 14,
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            border: "2px solid #93c5fd",
            animation: "node-ping 2.4s ease-out infinite",
          }}
        />
      )}

      {/* Planet body */}
      <motion.button
        onClick={status !== "locked" ? onClick : undefined}
        whileHover={status !== "locked" ? { scale: 1.12 } : undefined}
        whileTap={status !== "locked" ? { scale: 0.94 } : undefined}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="relative flex items-center justify-center rounded-full focus:outline-none"
        style={{
          width: cfg.size,
          height: cfg.size,
          background: cfg.body,
          border: `1.5px solid ${cfg.border}`,
          boxShadow: cfg.glow,
          opacity: cfg.opacity,
          cursor: cfg.cursor,
        }}
      >
        {/* Specular highlight */}
        <span
          className="absolute rounded-full pointer-events-none"
          style={{
            width: cfg.size * 0.3,
            height: cfg.size * 0.3,
            top: cfg.size * 0.16,
            left: cfg.size * 0.2,
            background: "radial-gradient(circle, rgba(255,255,255,0.7) 0%, transparent 70%)",
          }}
        />

        {/* Icon */}
        {status === "locked" && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        )}
        {status === "completed" && !isUnsure && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ecfdf5" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
        {isUnsure && (
          <span style={{ color: "#fffbeb", fontSize: 18, fontWeight: 700 }}>?</span>
        )}
        {status === "active" && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#eff6ff" stroke="#eff6ff" strokeWidth="1">
            <polygon points="6 4 20 12 6 20 6 4" />
          </svg>
        )}
      </motion.button>

      {/* Node label */}
      <div
        className="absolute text-center pointer-events-none"
        style={{
          top: cfg.size / 2 + 12,
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: 11,
          fontWeight: 500,
          color: status === "locked" ? "#64748b" : "#e2e8f0",
          textShadow: "0 1px 4px rgba(0,0,0,0.9)",
          maxWidth: 110,
          whiteSpace: "normal",
          lineHeight: 1.3,
        }}
      >
        {node.title}
      </div>
    </div>
  );
}

export const StarNode = memo(StarNodeImpl);
