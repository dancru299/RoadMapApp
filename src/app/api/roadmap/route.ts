import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const roadmap = await prisma.roadmap.findFirst({
      include: {
        chapters: {
          orderBy: { orderIndex: "asc" },
          include: {
            nodes: {
              orderBy: { orderIndex: "asc" },
              include: { mission: true },
            },
          },
        },
      },
    });

    if (!roadmap) {
      return NextResponse.json({ error: "Roadmap not found" }, { status: 404 });
    }

    return NextResponse.json(roadmap);
  } catch (error) {
    console.error("[GET /api/roadmap]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
