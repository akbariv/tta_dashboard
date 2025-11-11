// app/dashboard/components/common/TripsCard.tsx
"use client";
import * as React from "react";
import { Card } from "./card";
import { daysLeft } from "./format";
import { useRouter } from "next/navigation";

export type TripRow = {
  id: string;
  type: "Moda Eksternal" | "Moda Internal";
  destination: string;
  date: string; // ISO
};

export function TripsCard({
  title = (
    <span className="inline-flex items-center gap-2">
      <img src="/icons/tracker_icons.svg" alt="" className="w-6 h-6" />
      <span>Active &amp; Upcoming Trips</span>
    </span>
  ),
  rows,
  detailsHref,
}: {
  title?: React.ReactNode;
  rows: TripRow[];
  detailsHref?: string;
}) {
  const router = useRouter();
  const footer = detailsHref ? (
    <button
      onClick={() => router.push(detailsHref)}
      className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#3B82F6] text-white shadow hover:bg-[#2563EB] active:scale-[.98] transition"
    >
      Details
    </button>
  ) : undefined;

  return (
    <Card title={title} footer={footer}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500">
              <th className="py-2">Trip ID</th>
              <th className="py-2">Type</th>
              <th className="py-2">Destination</th>
              <th className="py-2">Date</th>
              <th className="py-2 text-right">Countdown</th>
            </tr>
          </thead>
          <tbody className="text-slate-700">
            {rows.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="py-2">{r.id}</td>
                <td className="py-2">{r.type}</td>
                <td className="py-2">{r.destination}</td>
                <td className="py-2">
                  {new Date(r.date).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="py-2 text-right">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-rose-100 text-rose-700">
                    {daysLeft(r.date)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
