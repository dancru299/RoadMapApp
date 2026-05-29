"use client";

import { use } from "react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { MissionScreen } from "@/components/mission/MissionScreen";
import type { NodeData } from "@/types";

interface PageProps {
  params: Promise<{ nodeId: string }>;
}

export default function MissionPage({ params }: PageProps) {
  const { nodeId } = use(params);
  const searchParams = useSearchParams();
  const isRedo = searchParams.get("redo") === "true";

  const [node, setNode] = useState<NodeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/nodes/${nodeId}`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<NodeData>;
      })
      .then(setNode)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [nodeId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-950">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !node) {
    return (
      <div className="flex items-center justify-center h-full bg-slate-950">
        <p className="text-red-400 text-sm">{error ?? "Node not found"}</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-slate-950">
      <MissionScreen node={node} isRedo={isRedo} />
    </div>
  );
}
