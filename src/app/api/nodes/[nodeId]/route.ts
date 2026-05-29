import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ nodeId: string }> }
) {
  try {
    const { nodeId } = await params;

    const node = await prisma.node.findUnique({
      where: { id: nodeId },
      include: { mission: true, chapter: true },
    });

    if (!node) {
      return NextResponse.json({ error: "Node not found" }, { status: 404 });
    }

    return NextResponse.json(node);
  } catch (error) {
    console.error("[GET /api/nodes/[nodeId]]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
