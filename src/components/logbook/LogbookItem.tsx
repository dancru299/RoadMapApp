"use client";

import { motion } from "motion/react";
import type { NodeData, SelfConfidence } from "@/types";

interface Props {
  node: NodeData;
  selfConfidence: SelfConfidence | null;
  onClick: () => void;
  index: number;
}

export function LogbookItem({ node, selfConfidence, onClick, index }: Props) {
  const isUnsure = selfConfidence === "unsure";

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.25 }}
      whileHover={{ x: 4 }}
      className="w-full flex items-center gap-4 px-4 py-3 rounded-xl border transition-colors text-left"
      style={{
        background: isUnsure ? "rgba(120, 53, 15, 0.15)" : "rgba(5, 150, 105, 0.08)",
        borderColor: isUnsure ? "#78350f50" : "#065f4650",
      }}
    >
      {/* Status icon */}
      <div
        className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm"
        style={{
          background: isUnsure ? "#78350f40" : "#064e3b40",
          border: `1.5px solid ${isUnsure ? "#f59e0b" : "#34d399"}`,
          color: isUnsure ? "#f59e0b" : "#34d399",
        }}
      >
        {isUnsure ? "⚠" : "✓"}
      </div>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-200 truncate">{node.title}</p>
        <p className="text-xs text-slate-500 mt-0.5">
          {isUnsure ? "Cần xem lại" : "Đã hoàn thành"}
        </p>
      </div>

      {/* Arrow */}
      <span className="text-slate-600 text-sm">→</span>
    </motion.button>
  );
}
