"use client";
import * as React from "react";

export function Card({
  title,
  right,
  footer,
  children,
}: {
  title: React.ReactNode;
  right?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        bg-white rounded-2xl shadow-[0_10px_30px_rgba(2,6,23,0.06)]
        p-5 flex flex-col overflow-visible
      "
    >
      {/* Header selalu di atas grafik & bisa diklik */}
      <div className="flex items-center justify-between mb-4 relative z-30 shrink-0 overflow-visible">
        <h3 className="text-[15px] font-semibold text-slate-800">{title}</h3>
        {right && (
          <div className="relative pointer-events-auto">{right}</div>
        )}
      </div>

      {/* Konten di bawah header */}
      <div className="flex-1 relative z-0">{children}</div>

      {footer && <div className="pt-3 flex justify-end">{footer}</div>}
    </div>
  );
}
