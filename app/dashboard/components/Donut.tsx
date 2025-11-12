"use client";

import React from "react";

type Segment = {
  value: number;
  color: string;
  label?: string;
};

type Props = {
  size?: number; // px
  strokeWidth?: number;
  segments: Segment[];
  innerBg?: string;
};

export default function Donut({ size = 155, strokeWidth = 18, segments, innerBg = "#fff" }: Props) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const total = segments.reduce((s, seg) => s + Math.max(0, seg.value), 0);

  // accumulate offsets (sum of previous segment values)
  let accumulated = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* background ring */}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke="#eef2f6"
        strokeWidth={strokeWidth}
      />

      {/* segments */}
      {total > 0 ? (
        segments.map((seg, i) => {
          const value = Math.max(0, seg.value);
          const portion = value / total;
          const dash = portion * circumference;
          // dashArray should be [dash, remainder] so the segment length is dash
          const dashArray = `${dash} ${Math.max(0, circumference - dash)}`;
          // offset the segment by the cumulative length of previous segments
          const dashOffset = circumference * (1 - accumulated / (total || 1));
          accumulated += value;
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={dashArray}
              strokeDashoffset={dashOffset}
              strokeLinecap="butt"
              transform={`rotate(-90 ${cx} ${cy})`}
            />
          );
        })
      ) : (
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#e6e6e6" strokeWidth={strokeWidth} />
      )}

      {/* center hole */}
      <circle cx={cx} cy={cy} r={radius - strokeWidth / 2} fill={innerBg} />
    </svg>
  );
}
