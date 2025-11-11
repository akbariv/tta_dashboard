"use client";
import * as React from "react";

type Slice = { label?: string; value: number; color: string };

export function Donut({
  slices,
  size = 120,
  thickness = 14,
  bg = "#ffffff",
}: {
  slices: Slice[];
  size?: number;
  thickness?: number;
  bg?: string;
}) {
  const total = Math.max(
    0.000001,
    slices.reduce(
      (a, s) => a + (isFinite(s.value) ? Math.max(0, s.value) : 0),
      0
    )
  );

  let acc = 0;
  const stops = slices
    .map((s) => {
      const start = (acc / total) * 100;
      acc += Math.max(0, s.value);
      const end = (acc / total) * 100;
      return `${s.color} ${start}% ${end}%`;
    })
    .join(", ");

  const gradient = stops.length ? `conic-gradient(${stops})` : "conic-gradient(#e5e7eb 0 100%)";

  return (
    <div className="relative" style={{ width: size, height: size }} aria-hidden>
      {/* ring */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: gradient,
          borderRadius: "9999px",
          // lubangi tengahnya (mask)
          maskImage: `radial-gradient(circle at center, transparent calc(50% - ${thickness}px), black calc(50% - ${thickness - 0.5}px))`,
          WebkitMaskImage: `radial-gradient(circle at center, transparent calc(50% - ${thickness}px), black calc(50% - ${thickness - 0.5}px))`,
        }}
      />
      {/* isi tengah mengikuti warna kartu */}
      <div
        className="absolute rounded-full"
        style={{
          inset: thickness,
          background: bg,
          borderRadius: "9999px",
        }}
      />
    </div>
  );
}
