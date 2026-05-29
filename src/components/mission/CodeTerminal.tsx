"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

interface Props {
  initialCode: string;
  validationPattern: string | null;
  onSubmit: (code: string) => void;
}

type ValidationState = "idle" | "success" | "error";

export function CodeTerminal({ initialCode, validationPattern, onSubmit }: Props) {
  const [code, setCode] = useState(initialCode);
  const [validation, setValidation] = useState<ValidationState>("idle");

  const handleSubmit = () => {
    if (!validationPattern) {
      onSubmit(code);
      return;
    }

    try {
      const regex = new RegExp(validationPattern);
      if (regex.test(code)) {
        setValidation("success");
        setTimeout(() => onSubmit(code), 400);
      } else {
        setValidation("error");
        setTimeout(() => setValidation("idle"), 2000);
      }
    } catch {
      // Invalid regex in DB — let it pass to avoid blocking user
      onSubmit(code);
    }
  };

  const borderColor =
    validation === "success"
      ? "#34d399"
      : validation === "error"
      ? "#f87171"
      : "#334155";

  const feedbackMsg =
    validation === "error"
      ? "Code chưa đúng — hãy kiểm tra lại cú pháp và các từ khóa yêu cầu."
      : null;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <div className="w-3 h-3 rounded-full bg-green-500/60" />
        </div>
        <span className="text-xs text-slate-500 font-mono">solution.js</span>
      </div>

      {/* Monaco Editor */}
      <div
        className="flex-1 overflow-hidden border-l-2 transition-colors duration-300"
        style={{ borderColor }}
      >
        <MonacoEditor
          height="100%"
          language="javascript"
          value={code}
          onChange={(val) => setCode(val ?? "")}
          theme="vs-dark"
          options={{
            fontSize: 14,
            fontFamily: "var(--font-geist-mono, 'Fira Code', monospace)",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: "on",
            renderWhitespace: "none",
            wordWrap: "on",
            padding: { top: 12, bottom: 12 },
            overviewRulerBorder: false,
            hideCursorInOverviewRuler: true,
          }}
        />
      </div>

      {/* Footer: feedback + submit */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800 bg-slate-900/60">
        <div className="text-xs text-red-400 min-h-[16px]">
          {feedbackMsg}
        </div>
        <button
          onClick={handleSubmit}
          disabled={validation === "success"}
          className="px-5 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {validation === "success" ? "✓ Hoàn thành!" : "Nộp bài →"}
        </button>
      </div>
    </div>
  );
}
