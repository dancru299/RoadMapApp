"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { MissionContent } from "./MissionContent";
import { CodeTerminal } from "./CodeTerminal";
import { SelfEvalModal } from "./SelfEvalModal";
import { useGuestProgress } from "@/hooks/useGuestProgress";
import type { NodeData, SelfConfidence } from "@/types";

interface Props {
  node: NodeData;
  isRedo?: boolean;
}

export function MissionScreen({ node, isRedo }: Props) {
  const router = useRouter();
  const { completeNode } = useGuestProgress();
  const [showHint, setShowHint] = useState(false);
  const [showEval, setShowEval] = useState(false);

  const mission = node.mission;

  const handleCodeSubmit = () => {
    setShowEval(true);
  };

  const handleEvalChoice = (confidence: SelfConfidence) => {
    setShowEval(false);
    completeNode(node.id, confidence);
    router.push("/galaxy");
  };

  if (!mission) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500">
        Không tìm thấy nội dung nhiệm vụ.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-950">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm">
        <button
          onClick={() => router.push("/galaxy")}
          className="text-slate-500 hover:text-slate-300 transition-colors"
        >
          ← Quay lại
        </button>
        <div className="h-4 w-px bg-slate-700" />
        <h1 className="text-sm font-semibold text-slate-200">{node.title}</h1>
        {isRedo && (
          <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-amber-900/40 text-amber-400 border border-amber-700/40">
            Ôn tập
          </span>
        )}
      </div>

      {/* Main content: split pane */}
      <div className="flex flex-1 min-h-0">
        {/* Left: mission description */}
        <motion.div
          className="w-[42%] border-r border-slate-800 bg-slate-900/40 overflow-hidden flex flex-col"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <MissionContent
            description={mission.description}
            hint={mission.solutionHint}
            showHint={showHint}
            onToggleHint={() => setShowHint((v) => !v)}
          />
        </motion.div>

        {/* Right: code editor */}
        <motion.div
          className="flex-1 flex flex-col overflow-hidden"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <CodeTerminal
            initialCode={mission.initialCode ?? ""}
            validationPattern={mission.validationPattern}
            onSubmit={handleCodeSubmit}
          />
        </motion.div>
      </div>

      {/* Self-evaluation modal */}
      <SelfEvalModal
        isOpen={showEval}
        nodeTitle={node.title}
        onChoose={handleEvalChoice}
      />
    </div>
  );
}
