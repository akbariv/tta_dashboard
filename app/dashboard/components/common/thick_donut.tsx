"use client";
import * as React from "react";

type Slice = { label: string; value: number | string; color: string };

type Props = {
  size?: number;                 // diameter
  thicknessMin?: number;         // ketebalan paling tipis (≈ <1/4)
  thicknessMax?: number;         // ketebalan paling tebal (≈ 4/4)
  slices: Slice[];
  bg?: string;                   // background & donut hole
  cap?: "butt" | "round";        // default linecap utk slice normal
  gap?: number;                  // jarak antar slice (px di keliling)
  showPercents?: boolean;
  minPercentLabel?: number;      // min % utk tampil label
};

export function ThickDonut({
  size = 180,
  thicknessMin = 10,
  thicknessMax = 40,
  slices,
  bg = "#ffffff",
  cap = "round",
  gap = 6,
  showPercents = true,
  minPercentLabel = 12,
}: Props) {
  // total aman dari 0
  const total = Math.max(
    0.0001,
    slices.reduce((a, b) => a + (Number(b.value) || 0), 0)
  );

  // Geometry berbasis ketebalan maksimum agar semua muat
  const center = size / 2;
  const r = size / 2 - thicknessMax / 2;       // radius jalur stroke
  const c = 2 * Math.PI * r;                   // keliling
  const gapLen = Math.max(0, gap);

  let offsetFrac = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* kanvas & hole */}
      <circle cx={center} cy={center} r={size / 2} fill={bg} />

      {slices.map((s, i) => {
        const val = Number(s.value) || 0;
        const p = val / total;                              // 0..1
        // Ketebalan per-slice: linear dari min → max berdasar proporsi
        const sw =
          thicknessMin + (thicknessMax - thicknessMin) * p; // dinamis

        const segRaw = c * p;                                // px arc
        const tiny = segRaw < sw * 1.35;                     // slice kecil
        const seg = Math.max(0, segRaw - (tiny ? 0 : gapLen));
        const dashArray = `${seg} ${c - seg}`;
        const dashOffset = c * (1 - offsetFrac) + (tiny ? 0 : gapLen / 2);

        // Label di tengah arc, jarak menyesuaikan ketebalan slice
        const midAngle = (offsetFrac + p / 2) * 2 * Math.PI - Math.PI / 2;
        const labelR = r - sw * 0.35;
        const lx = center + labelR * Math.cos(midAngle);
        const ly = center + labelR * Math.sin(midAngle);
        const percent = Math.round(p * 100);

        offsetFrac += p;

        return (
          <g key={i}>
            <circle
              cx={center}
              cy={center}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={sw}
              strokeDasharray={dashArray}
              strokeDashoffset={dashOffset}
              strokeLinecap={tiny ? "butt" : cap}
              transform={`rotate(-90 ${center} ${center})`}
            />
            {showPercents && percent >= minPercentLabel && (
              <text
                x={lx}
                y={ly + 3}
                fontSize={Math.max(10, Math.floor(sw * 0.6))}
                fontWeight={800}
                textAnchor="middle"
                fill="#0f172a"
                // outline putih biar kebaca di warna apa pun
                style={{ paintOrder: "stroke", stroke: "#fff", strokeWidth: 4 }}
              >
                {percent}%
              </text>
            )}
          </g>
        );
      })}

      {/* inner-hole pakai ketebalan max agar selalu bersih */}
      <circle cx={center} cy={center} r={r - thicknessMax / 2} fill={bg} />
    </svg>
  );
}

export default ThickDonut;
