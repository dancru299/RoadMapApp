"use client";

import { useState, useRef, useCallback } from "react";

interface Vec2 { x: number; y: number }

const MIN_SCALE = 0.3;
const MAX_SCALE = 2.0;

export function useGalaxyMap() {
  const [offset, setOffset] = useState<Vec2>({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const dragging = useRef(false);
  const lastMouse = useRef<Vec2>({ x: 0, y: 0 });

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    dragging.current = true;
    lastMouse.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastMouse.current.x;
    const dy = e.clientY - lastMouse.current.y;
    lastMouse.current = { x: e.clientX, y: e.clientY };
    setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
  }, []);

  const onMouseUp = useCallback(() => {
    dragging.current = false;
  }, []);

  // Zoom towards cursor position
  const onWheel = useCallback((e: React.WheelEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const factor = e.deltaY < 0 ? 1.08 : 0.92;

    setScale((prev) => {
      const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev * factor));
      setOffset((o) => ({
        x: cx - (cx - o.x) * (next / prev),
        y: cy - (cy - o.y) * (next / prev),
      }));
      return next;
    });
  }, []);

  const centerOn = useCallback((worldX: number, worldY: number, viewW: number, viewH: number) => {
    setOffset({ x: viewW / 2 - worldX, y: viewH / 2 - worldY });
  }, []);

  return { offset, scale, setOffset, onMouseDown, onMouseMove, onMouseUp, onMouseLeave: onMouseUp, onWheel, centerOn };
}
