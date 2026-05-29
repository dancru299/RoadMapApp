"use client";

interface Props {
  description: string;
  hint?: string | null;
  showHint: boolean;
  onToggleHint: () => void;
}

export function MissionContent({ description, hint, showHint, onToggleHint }: Props) {
  // Render markdown-like text: bold, code blocks, bullet lists
  const lines = description.split("\n");

  const renderLine = (line: string, idx: number) => {
    if (line.startsWith("# ")) {
      return (
        <h1 key={idx} className="text-xl font-bold text-slate-100 mb-3">
          {line.slice(2)}
        </h1>
      );
    }
    if (line.startsWith("## ")) {
      return (
        <h2 key={idx} className="text-base font-semibold text-slate-200 mt-4 mb-2">
          {line.slice(3)}
        </h2>
      );
    }
    if (line.startsWith("- ")) {
      return (
        <li key={idx} className="text-sm text-slate-300 ml-4 mb-1 list-disc">
          {renderInline(line.slice(2))}
        </li>
      );
    }
    if (line.startsWith("```")) {
      return null; // handled below in block parsing
    }
    if (line.trim() === "") {
      return <div key={idx} className="h-2" />;
    }
    return (
      <p key={idx} className="text-sm text-slate-300 mb-1 leading-relaxed">
        {renderInline(line)}
      </p>
    );
  };

  // Replace `code` and **bold** inline
  const renderInline = (text: string) => {
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("`") && part.endsWith("`")) {
        return (
          <code key={i} className="px-1 py-0.5 rounded bg-slate-800 text-blue-300 text-xs font-mono">
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="text-slate-100 font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto p-5">
      <div className="prose prose-invert max-w-none text-sm">
        {lines.map((line, idx) => renderLine(line, idx))}
      </div>

      {hint && (
        <div className="mt-4 border-t border-slate-800 pt-3">
          <button
            onClick={onToggleHint}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1"
          >
            <span>{showHint ? "▼" : "▶"}</span>
            <span>Gợi ý</span>
          </button>
          {showHint && (
            <p className="mt-2 text-xs text-amber-400/80 bg-amber-950/30 border border-amber-900/40 rounded-lg p-3 leading-relaxed">
              {hint}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
