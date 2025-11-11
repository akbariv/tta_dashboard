// app/dashboard/components/common/Legend.tsx
"use client";
import * as React from "react";

export function LegendItem({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value?: string | number;
}) {
  return (
    <div className="flex items-center gap-2 text-slate-700">
      <span
        className="inline-block w-2.5 h-2.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      {value !== undefined && (
        <span className="ml-2 text-sm font-medium text-slate-900">{value}</span>
      )}
      <span className="text-sm">{label}</span>
    </div>
  );
}
