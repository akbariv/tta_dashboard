// app/dashboard/components/common/BudgetCard.tsx
"use client";
import * as React from "react";
import { Card } from "./card";
import { LegendItem } from "./legend";
import { Donut } from "./donut";
import { IDR } from "./format";

export function BudgetCard({
  title = "Travel Budget",
  initial,
  breakdown, // {remaining, usedNet, refunded, loss}
}: {
  title?: React.ReactNode;
  initial: number;
  breakdown: { remaining: number; usedNet: number; refunded: number; loss: number };
}) {
  const { remaining, usedNet, refunded, loss } = breakdown;
  return (
    <Card
      title={title}
      right={
        <span className="text-xs px-2.5 py-1 rounded-full bg-sky-100 text-sky-700">
          Initial Budget {IDR(initial)}
        </span>
      }
    >
      <div className="flex items-center gap-6">
        <Donut
          size={140}
          thickness={16}
          bg="#ffffff"
          slices={[
            { label: "Remaining Budget", value: remaining, color: "#10B981" },
            { label: "Used Budget", value: usedNet, color: "#F59E0B" },
            { label: "Refunded Budget", value: refunded, color: "#3B82F6" },
            { label: "Budget Loss", value: loss, color: "#EF4444" },
          ]}
        />
        <div className="grid grid-cols-1 gap-2">
          <LegendItem color="#10B981" label="Remaining Budget" value={IDR(remaining)} />
          <LegendItem color="#F59E0B" label="Used Budget" value={IDR(usedNet)} />
          <LegendItem color="#3B82F6" label="Refunded Budget" value={IDR(refunded)} />
          <LegendItem color="#EF4444" label="Budget Loss" value={IDR(loss)} />
        </div>
      </div>
    </Card>
  );
}
