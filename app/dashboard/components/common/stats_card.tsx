// app/dashboard/components/common/StatsCard.tsx
"use client";
import * as React from "react";
import { Card } from "./card";
import { LegendItem } from "./legend";
import { Donut } from "./donut";

export type Slice = { label: string; value: number; color: string };

export function StatsCard({
  title,
  slices,
  size = 120,
  thickness = 14,
  right,
}: {
  title: React.ReactNode;
  slices: Slice[];
  size?: number;
  thickness?: number;
  right?: React.ReactNode;
}) {
  return (
    <Card title={title} right={right}>
      <div className="flex items-center gap-6">
        <Donut size={size} thickness={thickness} bg="#ffffff" slices={slices} />
        <div className="space-y-2">
          {slices.map((s) => (
            <LegendItem key={s.label} color={s.color} label={s.label} value={s.value} />
          ))}
        </div>
      </div>
    </Card>
  );
}
