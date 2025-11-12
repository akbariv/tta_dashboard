"use client";
import * as React from "react";

export type PieSlice = { label?: string; value: number; color: string };

export function Pie({ size = 140, slices }: { size?: number; slices: PieSlice[] }) {
  const total = Math.max(
    1,
    slices.reduce((a, b) => a + (Number.isFinite(b.value) ? b.value : 0), 0)
  );
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2;

  let start = -90; // mulai dari atas (jam 12)

  const polar = (ang: number) => {
    const rad = (ang * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="pie-chart">
      {slices.map((s, i) => {
        if (!s.value) return null;
        const delta = (s.value / total) * 360;
        const end = start + delta;
        const large = delta > 180 ? 1 : 0;

        const p1 = polar(start);
        const p2 = polar(end);

        const d = [
          `M ${cx} ${cy}`,
          `L ${p1.x} ${p1.y}`,
          `A ${r} ${r} 0 ${large} 1 ${p2.x} ${p2.y}`,
          "Z",
        ].join(" ");

        start = end;
        return <path key={i} d={d} fill={s.color} />;
      })}
    </svg>
  );
}
