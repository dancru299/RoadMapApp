import type { ChapterData } from "@/types";

interface Props {
  chapter: ChapterData;
}

export function NebulaCluster({ chapter }: Props) {
  if (chapter.nodes.length === 0) return null;

  const xs = chapter.nodes.map((n) => n.posX);
  const ys = chapter.nodes.map((n) => n.posY);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const pad = 180;
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const rx = (maxX - minX) / 2 + pad;
  const ry = (maxY - minY) / 2 + pad;

  const color = chapter.nebulaColor;

  return (
    <div
      aria-hidden
      className="absolute pointer-events-none"
      style={{
        left: cx - rx,
        top: cy - ry,
        width: rx * 2,
        height: ry * 2,
      }}
    >
      {/* Outer diffuse cloud */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at center, ${color}33 0%, ${color}14 50%, transparent 72%)`,
          borderRadius: "50%",
          filter: "blur(40px)",
        }}
      />
      {/* Brighter offset core for depth */}
      <div
        className="absolute"
        style={{
          left: "30%",
          top: "28%",
          width: "45%",
          height: "45%",
          background: `radial-gradient(circle at center, ${color}55 0%, transparent 70%)`,
          borderRadius: "50%",
          filter: "blur(36px)",
        }}
      />
    </div>
  );
}
