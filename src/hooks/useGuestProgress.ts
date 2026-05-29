"use client";

import { useState, useEffect, useCallback } from "react";
import type { GuestProgress, NodeStatus, SelfConfidence, ProgressEntry } from "@/types";

const STORAGE_KEY = "roadmap_guest_v1";

function loadFromStorage(): GuestProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as GuestProgress;
  } catch {
    // corrupted storage — fall through to create fresh
  }
  const fresh: GuestProgress = {
    userId: `guest_${crypto.randomUUID()}`,
    progress: {},
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  return fresh;
}

export function useGuestProgress() {
  const [data, setData] = useState<GuestProgress>({ userId: "", progress: {} });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setData(loadFromStorage());
    setHydrated(true);
  }, []);

  const completeNode = useCallback((nodeId: string, confidence: SelfConfidence) => {
    setData((prev) => {
      const entry: ProgressEntry = {
        status: "completed",
        selfConfidence: confidence,
        completedAt: new Date().toISOString(),
      };
      const next: GuestProgress = {
        ...prev,
        progress: { ...prev.progress, [nodeId]: entry },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const getStatus = useCallback(
    (nodeId: string): NodeStatus => data.progress[nodeId]?.status ?? "locked",
    [data]
  );

  const getConfidence = useCallback(
    (nodeId: string): SelfConfidence | null =>
      data.progress[nodeId]?.selfConfidence ?? null,
    [data]
  );

  const isCompleted = useCallback(
    (nodeId: string) => data.progress[nodeId]?.status === "completed",
    [data]
  );

  return {
    hydrated,
    userId: data.userId,
    progress: data.progress,
    completeNode,
    getStatus,
    getConfidence,
    isCompleted,
  };
}
