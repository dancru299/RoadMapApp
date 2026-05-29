"use client";

import { motion } from "motion/react";
import type { NodeData, NodeStatus, SelfConfidence } from "@/types";

interface Props {
  node: NodeData;
  status: NodeStatus;
  selfConfidence: SelfConfidence | null;
  onClick: () => void;
}

const NODE_CONFIG = {
  locked: {
    size: 44,
    bg: "#1e293b",
    border: "#334155",
    glow: "none",
    opacity: 0.45,
    cursor: "default",
  },
  active: {
    size: 54,
    bg: "#1d4ed8",
    border: "#60a5fa",
    glow: "0 0 16px 6px #3b82f680",
    opacity: 1,
    cursor: "pointer",
  },
  completed: {
    size: 50,
    bg: "#064e3b",
    border: "#34d399",
    glow: "0 0 12px 4px #10b98160",
    opacity: 1,
    cursor: "pointer",
  },
};

function unsureConfig() {
  return {
    size: 50,
    bg: "#451a03",
    border: "#f59e0b",
    glow: "0 0 12px 4px #f59e0b50",
    opacity: 1,
    cursor: "pointer",
  };
}

export function StarNode({ node, status, selfConfidence, onClick }: Props) {
  const isUnsure = status === "completed" && selfConfidence === "unsure";
  const cfg = isUnsure ? unsureConfig() : NODE_CONFIG[status];

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
      {/* Unsure: rotating dashed orbit ring */}
      {isUnsure && (
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: cfg.size + 20,
            height: cfg.size + 20,
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            border: "2px dashed #f59e0b",
            animation: "orbit-spin 6s linear infinite",
            opacity: 0.7,
          }}
        />
      )}

      {/* Active: outer pulse ring */}
      {status === "active" && (
        <div
          className="absolute rounded-full pointer-events-none"
          style={{
            width: cfg.size + 16,
            height: cfg.size + 16,
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            border: "2px solid #60a5fa",
            animation: "node-pulse 2s ease-in-out infinite",
            opacity: 0.5,
          }}
        />
      )}

      {/* Planet body */}
      <motion.button
        onClick={status !== "locked" ? onClick : undefined}
        whileHover={status !== "locked" ? { scale: 1.12 } : undefined}
        whileTap={status !== "locked" ? { scale: 0.95 } : undefined}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className="relative flex items-center justify-center rounded-full border-2 focus:outline-none"
        style={{
          width: cfg.size,
          height: cfg.size,
          background: cfg.bg,
          borderColor: cfg.border,
          boxShadow: cfg.glow,
          opacity: cfg.opacity,
          cursor: cfg.cursor,
        }}
      >
        {/* Icon */}
        {status === "locked" && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        )}
        {status === "completed" && selfConfidence !== "unsure" && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
        {isUnsure && (
          <span style={{ color: "#f59e0b", fontSize: 18, fontWeight: 700 }}>?</span>
        )}
        {status === "active" && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="2">
            <polygon points="5 3 19 12 5 21 5 3" fill="#93c5fd" />
          </svg>
        )}
      </motion.button>

      {/* Node label */}
      <div
        className="absolute text-center pointer-events-none whitespace-nowrap"
        style={{
          top: cfg.size / 2 + 10,
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: 11,
          fontWeight: 500,
          color: status === "locked" ? "#475569" : "#cbd5e1",
          textShadow: "0 1px 3px rgba(0,0,0,0.8)",
          maxWidth: 100,
          whiteSpace: "normal",
          textAlign: "center",
          lineHeight: 1.3,
        }}
      >
        {node.title}
      </div>
    </div>
  );
}
