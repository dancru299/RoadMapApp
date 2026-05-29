"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  show: boolean;
}

const COLORS = ["#38bdf8", "#a78bfa", "#34d399", "#fcd34d", "#f472b6"];
const PARTICLE_COUNT = 26;

export function CompletionBurst({ show }: Props) {
  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => {
        const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
        const dist = 120 + Math.random() * 140;
        return {
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist,
          color: COLORS[i % COLORS.length],
          size: 5 + Math.random() * 7,
          delay: Math.random() * 0.08,
        };
      }),
    []
  );

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Central flash */}
          <motion.div
            className="absolute rounded-full"
            style={{ background: "radial-gradient(circle, #ffffff 0%, rgba(125,211,252,0.6) 35%, transparent 70%)" }}
            initial={{ width: 30, height: 30, opacity: 1 }}
            animate={{ width: 300, height: 300, opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />

          {/* Shockwave rings */}
          {[0, 1, 2].map((r) => (
            <motion.div
              key={r}
              className="absolute rounded-full"
              style={{ border: "2px solid #7dd3fc", boxShadow: "0 0 18px #38bdf8" }}
              initial={{ width: 50, height: 50, opacity: 0.85 }}
              animate={{ width: 520, height: 520, opacity: 0 }}
              transition={{ duration: 0.95, delay: r * 0.13, ease: "easeOut" }}
            />
          ))}

          {/* Radial particles */}
          {particles.map((p, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full"
              style={{ width: p.size, height: p.size, background: p.color, boxShadow: `0 0 8px ${p.color}` }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.3 }}
              transition={{ duration: 0.95, delay: p.delay, ease: "easeOut" }}
            />
          ))}

          {/* Label */}
          <motion.div
            className="absolute text-lg font-bold tracking-[0.25em] text-cyan-100"
            style={{ textShadow: "0 0 24px #38bdf8, 0 0 8px #fff" }}
            initial={{ scale: 0.6, opacity: 0, y: 14 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.12, ease: "easeOut" }}
          >
            ẢI HOÀN THÀNH
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
