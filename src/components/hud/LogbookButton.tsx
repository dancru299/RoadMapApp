"use client";

import { motion } from "motion/react";

interface Props {
  onClick: () => void;
}

export function LogbookButton({ onClick }: Props) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900/80 text-slate-300 text-xs font-medium hover:border-slate-500 hover:text-slate-100 transition-colors"
      title="Mở Logbook — Xem lại các ải đã hoàn thành"
    >
      <span className="text-base">📓</span>
      <span className="hidden sm:inline">Logbook</span>
    </motion.button>
  );
}
