"use client";

import { motion, AnimatePresence } from "motion/react";
import type { SelfConfidence } from "@/types";

interface Props {
  isOpen: boolean;
  nodeTitle: string;
  onChoose: (confidence: SelfConfidence) => void;
}

export function SelfEvalModal({ isOpen, nodeTitle, onChoose }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Modal card */}
          <motion.div
            className="relative z-10 w-full max-w-md mx-4 rounded-2xl border border-slate-700 bg-slate-900 p-8 shadow-2xl"
            initial={{ scale: 0.85, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.85, y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
          >
            {/* Star burst decoration */}
            <div className="flex justify-center mb-5">
              <div className="text-5xl">✨</div>
            </div>

            <h2 className="text-center text-xl font-bold text-slate-100 mb-1">
              Ải hoàn thành!
            </h2>
            <p className="text-center text-sm text-slate-400 mb-8">
              <span className="text-slate-300 font-medium">{nodeTitle}</span>
              <br />
              Bạn cảm thấy thế nào về kiến thức này?
            </p>

            <div className="flex flex-col gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onChoose("sure")}
                className="w-full py-3.5 rounded-xl font-semibold text-sm text-white transition-colors"
                style={{ background: "linear-gradient(135deg, #1d4ed8, #2563eb)" }}
              >
                Tiếp tục — Tôi đã hiểu rõ ✓
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onChoose("unsure")}
                className="w-full py-3.5 rounded-xl font-medium text-sm border border-amber-700/50 bg-amber-950/30 text-amber-300 hover:bg-amber-950/50 transition-colors"
              >
                Tiếp tục — Cần xem lại sau ⚠
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
