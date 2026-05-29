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

  const pad = 160;
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
        background: `radial-gradient(ellipse at center, ${color}22 0%, ${color}0d 55%, transparent 75%)`,
        borderRadius: "50%",
        filter: "blur(24px)",
      }}
    />
  );
}
