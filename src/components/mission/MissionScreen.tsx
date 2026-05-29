"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { MissionContent } from "./MissionContent";
import { CodeTerminal } from "./CodeTerminal";
import { SelfEvalModal } from "./SelfEvalModal";
import { CompletionBurst } from "./CompletionBurst";
import { CosmicBackground } from "@/components/cosmic/CosmicBackground";
import { useGuestProgress } from "@/hooks/useGuestProgress";
import { playWhoosh, playSuccess } from "@/lib/sound";
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
  const [showBurst, setShowBurst] = useState(false);

  const mission = node.mission;

  // Whoosh when the mission opens
  useEffect(() => {
    playWhoosh();
  }, []);

  const handleCodeSubmit = () => {
    playSuccess();
    setShowBurst(true);
    // let the burst play, then ask for self-evaluation
    setTimeout(() => {
      setShowBurst(false);
      setShowEval(true);
    }, 1050);
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
    <div
      className="relative flex flex-col h-full overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 120% 90% at 50% 0%, #0b1430 0%, #060a1c 45%, #030711 100%)",
      }}
    >
      {/* Ambient animated space behind the panels */}
      <CosmicBackground dimmed />

      {/* Top bar — mission HUD */}
      <div className="relative z-10 flex items-center gap-3 px-5 py-3 border-b border-white/10 bg-slate-950/60 backdrop-blur-md">
        <button
          onClick={() => router.push("/galaxy")}
          className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-sm"
        >
          <span className="text-base leading-none">←</span> Bản đồ
        </button>
        <div className="h-5 w-px bg-white/10" />

        {/* Mission badge */}
        <div className="flex items-center gap-2.5">
          <span
            className="flex items-center justify-center rounded-md px-2 py-1 text-[11px] font-bold tracking-widest text-cyan-200"
            style={{
              background: "linear-gradient(135deg, rgba(56,189,248,0.18), rgba(59,130,246,0.18))",
              border: "1px solid rgba(56,189,248,0.4)",
              boxShadow: "0 0 14px rgba(56,189,248,0.25)",
            }}
          >
            ẢI {node.orderIndex}
          </span>
          <h1 className="text-sm font-semibold text-slate-100 tracking-wide">{node.title}</h1>
        </div>

        {isRedo && (
          <span className="ml-1 px-2 py-0.5 rounded-full text-xs bg-amber-900/40 text-amber-300 border border-amber-700/40">
            Ôn tập
          </span>
        )}
      </div>

      {/* Main content: split pane */}
      <div className="relative z-10 flex flex-1 min-h-0 p-3 gap-3">
        {/* Left: mission briefing */}
        <motion.div
          className="w-[42%] flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-900/55 backdrop-blur-md"
          style={{ boxShadow: "0 0 0 1px rgba(56,189,248,0.06), 0 18px 50px -20px rgba(0,0,0,0.8)" }}
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          {/* glowing accent bar */}
          <div
            className="h-0.5 w-full shrink-0"
            style={{ background: "linear-gradient(90deg, transparent, #38bdf8, transparent)" }}
          />
          <div className="px-4 pt-3 text-[10px] font-bold tracking-[0.2em] text-cyan-400/70">
            ⬡ NHIỆM VỤ
          </div>
          <div className="flex-1 min-h-0">
            <MissionContent
              description={mission.description}
              hint={mission.solutionHint}
              showHint={showHint}
              onToggleHint={() => setShowHint((v) => !v)}
            />
          </div>
        </motion.div>

        {/* Right: code terminal */}
        <motion.div
          className="flex-1 flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-950/70 backdrop-blur-md"
          style={{ boxShadow: "0 0 0 1px rgba(148,163,184,0.06), 0 18px 50px -20px rgba(0,0,0,0.8)" }}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <CodeTerminal
            initialCode={mission.initialCode ?? ""}
            validationPattern={mission.validationPattern}
            onSubmit={handleCodeSubmit}
          />
        </motion.div>
      </div>

      {/* Completion burst effect */}
      <CompletionBurst show={showBurst} />

      {/* Self-evaluation modal */}
      <SelfEvalModal
        isOpen={showEval}
        nodeTitle={node.title}
        onChoose={handleEvalChoice}
      />
    </div>
  );
}
