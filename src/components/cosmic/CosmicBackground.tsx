"use client";

import { memo, type RefObject } from "react";

/**
 * Purely decorative, fully CSS-driven animated space scene:
 *  - a breathing sun
 *  - planets orbiting on rings at different speeds
 *  - a distant ringed gas giant drifting
 *  - occasional comets streaking across
 *
 * Everything animates with `transform` / `opacity` only (GPU-friendly) and the
 * whole layer is `pointer-events: none`, so it never interferes with the map.
 */

interface OrbitConfig {
  /** orbit diameter in px */
  d: number;
  /** seconds per revolution */
  duration: number;
  /** planet diameter in px */
  size: number;
  color: string;
  glow: string;
  /** 0..1 fraction of the orbit to start at */
  start: number;
  reverse?: boolean;
}

const ORBITS: OrbitConfig[] = [
  { d: 280, duration: 26, size: 10, color: "#7dd3fc", glow: "#38bdf8", start: 0.1 },
  { d: 460, duration: 44, size: 16, color: "#c4b5fd", glow: "#8b5cf6", start: 0.55 },
  { d: 660, duration: 70, size: 13, color: "#6ee7b7", glow: "#10b981", start: 0.3, reverse: true },
  { d: 880, duration: 104, size: 22, color: "#fda4af", glow: "#f43f5e", start: 0.8 },
  { d: 1120, duration: 150, size: 9, color: "#fcd34d", glow: "#f59e0b", start: 0.45 },
];

interface Props {
  /** lower the intensity for content-heavy screens (e.g. mission) */
  dimmed?: boolean;
  /** when provided, useGalaxyMap drives this layer for a parallax effect */
  parallaxRef?: RefObject<HTMLDivElement | null>;
}

function CosmicBackgroundImpl({ dimmed = false, parallaxRef }: Props) {
  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ opacity: dimmed ? 0.4 : 1 }}
    >
      {/* Parallax layer — scaled up so panning never reveals its edges */}
      <div
        ref={parallaxRef}
        className="absolute inset-0"
        style={{ transform: "scale(1.18)", willChange: "transform" }}
      >
      {/* Drifting nebula clouds */}
      <div
        className="absolute rounded-full cosmic-drift"
        style={{
          left: "8%",
          top: "12%",
          width: 520,
          height: 520,
          background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 68%)",
          filter: "blur(50px)",
        }}
      />
      <div
        className="absolute rounded-full cosmic-drift-rev"
        style={{
          right: "4%",
          bottom: "6%",
          width: 620,
          height: 620,
          background: "radial-gradient(circle, rgba(236,72,153,0.14) 0%, transparent 68%)",
          filter: "blur(60px)",
        }}
      />

      {/* The solar system, centered on the viewport */}
      <div className="absolute left-1/2 top-1/2" style={{ transform: "translate(-50%, -50%)" }}>
        {/* Sun */}
        <div
          className="absolute rounded-full cosmic-sun"
          style={{
            width: 120,
            height: 120,
            left: "50%",
            top: "50%",
            marginLeft: -60,
            marginTop: -60,
            background:
              "radial-gradient(circle at 50% 45%, #fffbeb 0%, #fde68a 28%, #fbbf24 55%, #f97316 100%)",
          }}
        />

        {/* Orbit rings + planets */}
        {ORBITS.map((o, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: o.d,
              height: o.d,
              left: "50%",
              top: "50%",
              marginLeft: -o.d / 2,
              marginTop: -o.d / 2,
              border: "1px solid rgba(148,163,184,0.10)",
              animation: `cosmic-orbit ${o.duration}s linear infinite`,
              animationDirection: o.reverse ? "reverse" : "normal",
              animationDelay: `-${o.start * o.duration}s`,
            }}
          >
            <span
              className="absolute rounded-full"
              style={{
                width: o.size,
                height: o.size,
                top: -o.size / 2,
                left: "50%",
                marginLeft: -o.size / 2,
                background: `radial-gradient(circle at 35% 30%, #fff 0%, ${o.color} 45%, ${o.glow} 100%)`,
                boxShadow: `0 0 ${o.size}px ${o.size / 2}px ${o.glow}66`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Distant ringed gas giant */}
      <div
        className="absolute cosmic-float"
        style={{ right: "10%", top: "16%", width: 150, height: 150 }}
      >
        <div
          className="absolute rounded-full"
          style={{
            inset: 0,
            background:
              "radial-gradient(circle at 36% 30%, #ddd6fe 0%, #8b5cf6 45%, #4c1d95 100%)",
            boxShadow: "0 0 50px 8px rgba(139,92,246,0.35), inset -8px -6px 22px rgba(0,0,0,0.5)",
          }}
        />
        <div
          className="absolute"
          style={{
            left: "-32%",
            top: "38%",
            width: "164%",
            height: "24%",
            borderRadius: "50%",
            border: "5px solid rgba(196,181,253,0.45)",
            transform: "rotate(-22deg)",
          }}
        />
      </div>
      </div>
      {/* end parallax layer */}

      {/* Comets — outside the parallax layer so they cross the full screen */}
      <span className="cosmic-comet" style={{ animationDelay: "2s" }} />
      <span className="cosmic-comet cosmic-comet-2" style={{ animationDelay: "9s" }} />
    </div>
  );
}

export const CosmicBackground = memo(CosmicBackgroundImpl);
