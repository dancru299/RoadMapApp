"use client";

import { useRef, useCallback, type RefObject } from "react";

interface Vec2 { x: number; y: number }

const MIN_SCALE = 0.4;
const MAX_SCALE = 2.2;

/**
 * Pan/zoom controller for the Galaxy Map.
 *
 * Offset and scale are kept in refs (not React state) and written straight to
 * the world element's `transform` inside a requestAnimationFrame callback. This
 * means dragging / zooming never triggers a React re-render — the ~10 star
 * nodes and connector lines are not reconciled on every mouse move, which is
 * the difference between a janky and a buttery-smooth map.
 */
/** Fraction of the map's pan applied to the parallax layer (depth illusion). */
const PARALLAX = 0.12;

export function useGalaxyMap(
  worldRef: RefObject<HTMLDivElement | null>,
  parallaxRef?: RefObject<HTMLDivElement | null>
) {
  const offset = useRef<Vec2>({ x: 0, y: 0 });
  const scale = useRef(1);
  const dragging = useRef(false);
  const last = useRef<Vec2>({ x: 0, y: 0 });
  const frame = useRef<number | null>(null);

  const flush = useCallback(() => {
    frame.current = null;
    const el = worldRef.current;
    if (el) {
      el.style.transform =
        `translate3d(${offset.current.x}px, ${offset.current.y}px, 0) scale(${scale.current})`;
    }
    const bg = parallaxRef?.current;
    if (bg) {
      bg.style.transform =
        `translate3d(${offset.current.x * PARALLAX}px, ${offset.current.y * PARALLAX}px, 0) scale(1.18)`;
    }
  }, [worldRef, parallaxRef]);

  const schedule = useCallback(() => {
    if (frame.current == null) frame.current = requestAnimationFrame(flush);
  }, [flush]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    dragging.current = true;
    last.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging.current) return;
    offset.current = {
      x: offset.current.x + (e.clientX - last.current.x),
      y: offset.current.y + (e.clientY - last.current.y),
    };
    last.current = { x: e.clientX, y: e.clientY };
    schedule();
  }, [schedule]);

  const onMouseUp = useCallback(() => {
    dragging.current = false;
  }, []);

  // Zoom towards the cursor position.
  const onWheel = useCallback((e: React.WheelEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    const prev = scale.current;
    const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, prev * (e.deltaY < 0 ? 1.1 : 0.9)));
    if (next === prev) return;

    offset.current = {
      x: cx - (cx - offset.current.x) * (next / prev),
      y: cy - (cy - offset.current.y) * (next / prev),
    };
    scale.current = next;
    schedule();
  }, [schedule]);

  // Recenter the viewport on a world coordinate (used once on mount).
  const centerOn = useCallback(
    (worldX: number, worldY: number, viewW: number, viewH: number) => {
      offset.current = {
        x: viewW / 2 - worldX * scale.current,
        y: viewH / 2 - worldY * scale.current,
      };
      flush();
    },
    [flush]
  );

  return { onMouseDown, onMouseMove, onMouseUp, onMouseLeave: onMouseUp, onWheel, centerOn };
}
