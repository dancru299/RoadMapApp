import type { ChapterData, NodeStatus, GuestProgress } from "@/types";

/**
 * Derives the status of every node from the roadmap content + the user's
 * progress. Pure function of `chapters` + `progress` — no side effects, no
 * server call. Nodes are walked in `orderIndex` order so a node's prerequisite
 * is always resolved before the node itself.
 *
 * Rules (first match wins):
 *  1. progress says "completed"          → "completed"
 *  2. no prerequisite (the entry node)   → "active"
 *  3. prerequisite is "completed"        → "active"
 *  4. otherwise                          → "locked"
 */
export function computeStatusMap(
  chapters: ChapterData[],
  progress: GuestProgress["progress"]
): Map<string, NodeStatus> {
  const all = chapters
    .flatMap((c) => c.nodes)
    .sort((a, b) => a.orderIndex - b.orderIndex);

  const map = new Map<string, NodeStatus>();

  for (const node of all) {
    if (progress[node.id]?.status === "completed") {
      map.set(node.id, "completed");
    } else if (!node.prerequisiteNodeId) {
      map.set(node.id, "active");
    } else {
      const prereqStatus = map.get(node.prerequisiteNodeId);
      map.set(node.id, prereqStatus === "completed" ? "active" : "locked");
    }
  }

  return map;
}
