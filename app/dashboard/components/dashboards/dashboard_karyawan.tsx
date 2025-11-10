// app/dashboard/components/dashboards/dashboard_karyawan.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Donut } from "./parts/donut";

/* ---------- helpers ---------- */
const IDR = (n: number) =>
  "Rp " + n.toLocaleString("id-ID", { maximumFractionDigits: 0 });

function daysLeft(dateISO: string) {
  const target = new Date(dateISO).getTime();
  const now = Date.now();
  const diff = target - now;
  if (diff <= 0) return "due";
  const d = Math.floor(diff / (24 * 3600_000));
  if (d >= 1) return `${d} day${d > 1 ? "s" : ""} left`;
  const h = Math.ceil(diff / 3600_000);
  return `${h} hour${h > 1 ? "s" : ""} left`;
}


/* ---------- dummy data ---------- */
const travelRequestStats = { approved: 6, pending: 3, rejected: 1 };
const claimStats = { approved: 2, pending: 4, rejected: 1 };
const bookingStats = { approved: 2, pending: 0, rejected: 3 };

type TripRow = {
  id: string;
  type: "Moda Eksternal" | "Moda Internal";
  destination: string;
  date: string; // ISO
};
const upcomingTrips: TripRow[] = [
  {
    id: "TTA001",
    type: "Moda Eksternal",
    destination: "Jakarta → Bali",
    date: "2025-11-10",
  },
  {
    id: "TTA002",
    type: "Moda Eksternal",
    destination: "Bali → Jakarta",
    date: "2025-11-14",
  },
  {
    id: "TTA033",
    type: "Moda Internal",
    destination: "Jakarta → Bandung",
    date: "2025-10-02",
  },
];

type ClaimRow = {
  id: string;
  tripId: string;
  type: string;
  requestDate: string;
  status: "Pending" | "Approved" | "Rejected";
};
const claimTracker: ClaimRow[] = [
  {
    id: "C2025-001",
    tripId: "TTA021",
    type: "Expense - Food",
    requestDate: "2025-10-20",
    status: "Pending",
  },
  {
    id: "C2025-002",
    tripId: "TTA022",
    type: "Expense - Taxi",
    requestDate: "2025-10-14",
    status: "Approved",
  },
  {
    id: "C2025-003",
    tripId: "TTA025",
    type: "Expense - Taxi",
    requestDate: "2025-10-11",
    status: "Approved",
  },
];

type ReqRow = {
  id: string;
  category: string;
  type: "Moda Eksternal" | "Moda Internal";
  requestDate: string;
  status: "Approved" | "Pending" | "Rejected";
};
const requestTracker: ReqRow[] = [
  {
    id: "TTA001",
    category: "Travel Req.",
    type: "Moda Eksternal",
    requestDate: "2025-10-25",
    status: "Approved",
  },
  {
    id: "TTA002",
    category: "Changes Req.",
    type: "Moda Eksternal",
    requestDate: "2025-10-29",
    status: "Approved",
  },
  {
    id: "TTA003",
    category: "Travel Req.",
    type: "Moda Internal",
    requestDate: "2025-10-29",
    status: "Pending",
  },
];

/* ---------- sinkron budget dengan chatbot ---------- */
function readBudget() {
  if (typeof window === "undefined") return { initial: 10_000_000, used: 0 };
  const initial =
    Number(localStorage.getItem("tta_budget_initial")) || 10_000_000;
  const used =
    Number(localStorage.getItem("tta_budget_used")) ||
    Number(localStorage.getItem("budget_used")) ||
    0;
  return { initial, used };
}

/* ---------- UI kecil ---------- */
function StatusBadge({ s }: { s: string }) {
  const map: Record<string, string> = {
    Approved: "bg-emerald-100 text-emerald-700",
    Pending: "bg-amber-100 text-amber-700",
    Rejected: "bg-rose-100 text-rose-700",
  };
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
        map[s] ?? "bg-gray-100 text-gray-700"
      }`}
    >
      {s}
    </span>
  );
}
function LegendItem({
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

function Card({
  title,
  children,
  right,
  footer,
}: {
  title: React.ReactNode;
  children: React.ReactNode;
  right?: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(2,6,23,0.06)] p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[15px] font-semibold text-slate-800">{title}</h3>
        {right}
      </div>
      <div className="flex-1">{children}</div>
      {footer && <div className="pt-3 flex justify-end">{footer}</div>}
    </div>
  );
}

/* ==================== MAIN ==================== */
export default function DashboardKaryawan() {
  const router = useRouter();

  const [{ initial, used }, setBudget] = React.useState(readBudget());
  React.useEffect(() => setBudget(readBudget()), []);

  // Breakdown budget yang tidak double-count
  const refunded = Math.min(1_000_000, used);
  const loss = Math.min(1_000_000, Math.max(0, used - refunded));
  const usedNet = Math.max(0, used - refunded - loss);
  const remaining = Math.max(0, initial - (usedNet + refunded + loss));

  const detailsBtn = (to?: string) => (
    <button
      onClick={() => (to ? router.push(to) : null)}
      className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#3B82F6] text-white shadow hover:bg-[#2563EB] active:scale-[.98] transition"
    >
      Details
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Title + filters (dummy) */}
      <div className="flex items-center justify-between">
        <h2 className="text-[28px] font-semibold text-slate-800">Dashboard</h2>
        <div className="hidden md:flex gap-2">
          <select className="px-3 py-2 text-sm border rounded-lg">
            <option>Period</option>
            <option>This Month</option>
            <option>This Quarter</option>
            <option>This Year</option>
          </select>
          <select className="px-3 py-2 text-sm border rounded-lg">
            <option>Category</option>
            <option>Travel</option>
            <option>Claims</option>
            <option>Booking</option>
          </select>
        </div>
      </div>

      {/* Top donuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card title="Travel Request">
          <div className="flex items-center gap-6">
            <Donut
              size={120}
              thickness={14}
              bg="#ffffff"
              slices={[
                {
                  label: "Approved",
                  value: travelRequestStats.approved,
                  color: "#3B82F6",
                },
                {
                  label: "Pending",
                  value: travelRequestStats.pending,
                  color: "#FACC15",
                },
                {
                  label: "Rejected",
                  value: travelRequestStats.rejected,
                  color: "#EF4444",
                },
              ]}
            />
            <div className="space-y-2">
              <LegendItem
                color="#3B82F6"
                label="Approved"
                value={travelRequestStats.approved}
              />
              <LegendItem
                color="#FACC15"
                label="Pending"
                value={travelRequestStats.pending}
              />
              <LegendItem
                color="#EF4444"
                label="Rejected"
                value={travelRequestStats.rejected}
              />
            </div>
          </div>
        </Card>

        <Card title="Claim & Reimburse">
          <div className="flex items-center gap-6">
            <Donut
              size={120}
              thickness={14}
              bg="#ffffff"
              slices={[
                {
                  label: "Approved",
                  value: claimStats.approved,
                  color: "#3B82F6",
                },
                {
                  label: "Pending",
                  value: claimStats.pending,
                  color: "#FACC15",
                },
                {
                  label: "Rejected",
                  value: claimStats.rejected,
                  color: "#EF4444",
                },
              ]}
            />
            <div className="space-y-2">
              <LegendItem
                color="#3B82F6"
                label="Approved"
                value={claimStats.approved}
              />
              <LegendItem
                color="#FACC15"
                label="Pending"
                value={claimStats.pending}
              />
              <LegendItem
                color="#EF4444"
                label="Rejected"
                value={claimStats.rejected}
              />
            </div>
          </div>
        </Card>

        <Card title="Booking Changes">
          <div className="flex items-center gap-6">
            <Donut
              size={120}
              thickness={14}
              bg="#ffffff"
              slices={[
                {
                  label: "Approved",
                  value: bookingStats.approved,
                  color: "#3B82F6",
                },
                {
                  label: "Pending",
                  value: bookingStats.pending,
                  color: "#FACC15",
                },
                {
                  label: "Rejected",
                  value: bookingStats.rejected,
                  color: "#EF4444",
                },
              ]}
            />
            <div className="space-y-2">
              <LegendItem
                color="#3B82F6"
                label="Approved"
                value={bookingStats.approved}
              />
              <LegendItem
                color="#FACC15"
                label="Pending"
                value={bookingStats.pending}
              />
              <LegendItem
                color="#EF4444"
                label="Rejected"
                value={bookingStats.rejected}
              />
            </div>
          </div>
        </Card>
      </div>

     <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card
          title="Travel Budget"
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
                { label: "Remaining", value: remaining, color: "#10B981" },   // green
                { label: "Used Budget", value: usedNet, color: "#F59E0B" },    // amber
                { label: "Refunded Budget", value: refunded, color: "#3B82F6" }, // blue
                { label: "Budget Loss", value: loss, color: "#EF4444" },       // red
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

        <Card
          title={
            <span className="inline-flex items-center gap-2">
              <img src="/icons/tracker_icons.svg" alt="" className="w-6 h-6" />
              <span>Active &amp; Upcoming Trips</span>
            </span>
          }
          footer={detailsBtn("/dashboard/trips")}
        >
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
                {upcomingTrips.map((r) => (
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
      </div>

      {/* Claim tracker + Request tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card
          title={
            <span className="inline-flex items-center gap-2">
              <img src="/icons/claim_card.svg" alt="" className="w-6 h-6" />
              <span>Claim &amp; Reimbursement Tracker</span>
            </span>
          }
          footer={detailsBtn("/dashboard/claims")}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="py-2">Claim ID</th>
                  <th className="py-2">Trip ID</th>
                  <th className="py-2">Type</th>
                  <th className="py-2">Request Date</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                {claimTracker.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="py-2">{r.id}</td>
                    <td className="py-2">{r.tripId}</td>
                    <td className="py-2">{r.type}</td>
                    <td className="py-2">
                      {new Date(r.requestDate).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-2">
                      <StatusBadge s={r.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card
          title={
            <span className="inline-flex items-center gap-2">
              <img src="/icons/tracker_icons.svg" alt="" className="w-6 h-6" />
              <span>Request Tracker</span>
            </span>
          }
          footer={detailsBtn("/dashboard/requests")}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500">
                  <th className="py-2">ID</th>
                  <th className="py-2">Category</th>
                  <th className="py-2">Type</th>
                  <th className="py-2">Request Date</th>
                  <th className="py-2">Status</th>
                </tr>
              </thead>
              <tbody className="text-slate-700">
                {requestTracker.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="py-2">{r.id}</td>
                    <td className="py-2">{r.category}</td>
                    <td className="py-2">{r.type}</td>
                    <td className="py-2">
                      {new Date(r.requestDate).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-2">
                      <StatusBadge s={r.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
