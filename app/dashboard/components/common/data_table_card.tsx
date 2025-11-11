// app/dashboard/components/common/DataTableCard.tsx
"use client";
import * as React from "react";
import { Card } from "./card";

export type Column<Row> = {
  key: keyof Row;
  label: string;
  align?: "left" | "right";
  render?: (row: Row) => React.ReactNode;
};

export function DataTableCard<Row>({
  title,
  iconSrc,
  columns,
  rows,
  footer,
}: {
  title: string;
  iconSrc?: string;
  columns: Column<Row>[];
  rows: Row[];
  footer?: React.ReactNode;
}) {
  return (
    <Card
      title={
        <span className="inline-flex items-center gap-2">
          {iconSrc && <img src={iconSrc} alt="" className="w-6 h-6" />}
          <span>{title}</span>
        </span>
      }
      footer={footer}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500">
              {columns.map((c) => (
                <th
                  key={String(c.key)}
                  className={`py-2 ${c.align === "right" ? "text-right" : ""}`}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-slate-700">
            {rows.map((row, idx) => (
              <tr key={idx} className="border-t">
                {columns.map((c) => (
                  <td
                    key={String(c.key)}
                    className={`py-2 ${c.align === "right" ? "text-right" : ""}`}
                  >
                    {c.render ? c.render(row) : (row as any)[c.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
