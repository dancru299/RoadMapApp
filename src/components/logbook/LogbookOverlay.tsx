"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { LogbookItem } from "./LogbookItem";
import type { ChapterData, GuestProgress } from "@/types";

interface Props {
  isOpen: boolean;
  chapters: ChapterData[];
  progress: GuestProgress["progress"];
  onClose: () => void;
}

export function LogbookOverlay({ isOpen, chapters, progress, onClose }: Props) {
  const router = useRouter();

  const completedNodes = chapters
    .flatMap((ch) => ch.nodes.map((n) => ({ ...n, chapterTitle: ch.title })))
    .filter((n) => progress[n.id]?.status === "completed")
    .sort((a, b) => a.orderIndex - b.orderIndex);

  const handleSelectNode = (nodeId: string) => {
    onClose();
    router.push(`/mission/${nodeId}?redo=true`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/75 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="relative z-10 w-full max-w-lg mx-4 rounded-2xl border border-slate-700/80 bg-slate-950/95 shadow-2xl flex flex-col max-h-[80vh]"
            initial={{ scale: 0.92, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.92, y: 24, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <div>
                <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <span>📓</span> Ship Archives
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {completedNodes.length} ải đã hoàn thành
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-200 hover:bg-slate-800 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Node list */}
            <div className="overflow-y-auto flex-1 p-4">
              {completedNodes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-3xl mb-3">🚀</p>
                  <p className="text-sm text-slate-500">
                    Chưa có ải nào được hoàn thành.
                    <br />
                    Bắt đầu hành trình trên Galaxy Map!
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {completedNodes.map((node, idx) => (
                    <LogbookItem
                      key={node.id}
                      node={node}
                      selfConfidence={progress[node.id]?.selfConfidence ?? null}
                      onClick={() => handleSelectNode(node.id)}
                      index={idx}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
