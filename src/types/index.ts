export type NodeStatus = "locked" | "active" | "completed";
export type SelfConfidence = "sure" | "unsure";

export interface MissionData {
  id: string;
  description: string;
  initialCode: string | null;
  solutionHint: string | null;
  validationPattern: string | null;
}

export interface NodeData {
  id: string;
  title: string;
  orderIndex: number;
  posX: number;
  posY: number;
  chapterId: string;
  prerequisiteNodeId: string | null;
  mission: MissionData | null;
}

export interface ChapterData {
  id: string;
  title: string;
  orderIndex: number;
  nebulaColor: string;
  nodes: NodeData[];
}

export interface RoadmapData {
  id: string;
  title: string;
  description: string | null;
  chapters: ChapterData[];
}

export interface NodeWithStatus extends NodeData {
  status: NodeStatus;
  selfConfidence: SelfConfidence | null;
}

export interface ProgressEntry {
  status: NodeStatus;
  selfConfidence: SelfConfidence | null;
  completedAt: string | null;
}

export interface GuestProgress {
  userId: string;
  progress: Record<string, ProgressEntry>;
}
