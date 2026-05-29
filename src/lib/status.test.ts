import { describe, it, expect } from "vitest";
import { computeStatusMap } from "./status";
import type { ChapterData, GuestProgress, NodeData, ProgressEntry } from "@/types";

// --- test helpers ---------------------------------------------------------

function node(id: string, orderIndex: number, prerequisiteNodeId: string | null): NodeData {
  return {
    id,
    title: id,
    orderIndex,
    posX: 0,
    posY: 0,
    chapterId: "ch1",
    prerequisiteNodeId,
    mission: null,
  };
}

function chapter(nodes: NodeData[]): ChapterData {
  return { id: "ch1", title: "Chapter", orderIndex: 1, nebulaColor: "#000", nodes };
}

function completed(confidence: ProgressEntry["selfConfidence"] = "sure"): ProgressEntry {
  return { status: "completed", selfConfidence: confidence, completedAt: "2026-01-01T00:00:00Z" };
}

const empty: GuestProgress["progress"] = {};

// --- tests ----------------------------------------------------------------

describe("computeStatusMap", () => {
  it("marks the first node (no prerequisite) as active and the rest locked", () => {
    const chapters = [chapter([node("a", 1, null), node("b", 2, "a"), node("c", 3, "b")])];

    const map = computeStatusMap(chapters, empty);

    expect(map.get("a")).toBe("active");
    expect(map.get("b")).toBe("locked");
    expect(map.get("c")).toBe("locked");
  });

  it("unlocks the next node only when its prerequisite is completed", () => {
    const chapters = [chapter([node("a", 1, null), node("b", 2, "a"), node("c", 3, "b")])];
    const progress = { a: completed() };

    const map = computeStatusMap(chapters, progress);

    expect(map.get("a")).toBe("completed");
    expect(map.get("b")).toBe("active");
    expect(map.get("c")).toBe("locked");
  });

  it("keeps later nodes locked when an intermediate node is not completed", () => {
    const chapters = [chapter([node("a", 1, null), node("b", 2, "a"), node("c", 3, "b")])];
    // 'c' is somehow completed but 'b' is not — 'c' stays completed, 'b' stays active
    const progress = { a: completed(), c: completed() };

    const map = computeStatusMap(chapters, progress);

    expect(map.get("a")).toBe("completed");
    expect(map.get("b")).toBe("active");
    expect(map.get("c")).toBe("completed");
  });

  it("treats 'unsure' completions as completed for unlocking purposes", () => {
    const chapters = [chapter([node("a", 1, null), node("b", 2, "a")])];
    const progress = { a: completed("unsure") };

    const map = computeStatusMap(chapters, progress);

    expect(map.get("a")).toBe("completed");
    expect(map.get("b")).toBe("active");
  });

  it("resolves prerequisites correctly regardless of array order, using orderIndex", () => {
    // nodes deliberately supplied out of order
    const chapters = [chapter([node("c", 3, "b"), node("a", 1, null), node("b", 2, "a")])];
    const progress = { a: completed(), b: completed() };

    const map = computeStatusMap(chapters, progress);

    expect(map.get("a")).toBe("completed");
    expect(map.get("b")).toBe("completed");
    expect(map.get("c")).toBe("active");
  });

  it("flattens nodes across multiple chapters and links cross-chapter prerequisites", () => {
    const chapters: ChapterData[] = [
      { id: "ch1", title: "C1", orderIndex: 1, nebulaColor: "#000", nodes: [node("a", 1, null)] },
      { id: "ch2", title: "C2", orderIndex: 2, nebulaColor: "#000", nodes: [node("b", 2, "a")] },
    ];
    const progress = { a: completed() };

    const map = computeStatusMap(chapters, progress);

    expect(map.get("a")).toBe("completed");
    expect(map.get("b")).toBe("active");
  });

  it("returns an empty map when there are no nodes", () => {
    expect(computeStatusMap([], empty).size).toBe(0);
  });
});
