"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  Donut,
  LegendItem,
  StatusBadge,
  SectionChip,
  SearchInput,
  DetailsButton,
  MapEmbed,
  IDR,
  Pie,
  FilterDropdown,
} from "@/app/dashboard/components/common";
import {
  MOCK,
  getMonthlyTravelCost,
  getYearlyTravelCost,
  getAllRequest,
  getChangeBooking,
  getApprovalTrend,
  getSla,
  getActiveTripStacked,
  type Department,
  type PeriodKey,
} from "@/app/dashboard/data/ttaMock";
import { CountDownPill } from "../approval/approval_view";

/* ================== HELPERS ================== */
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
const sortByDeadlineAsc = (
  a: { countdownISO: string },
  b: { countdownISO: string }
) => new Date(a.countdownISO).getTime() - new Date(b.countdownISO).getTime();

function formatApprovalCountdown(iso: string) {
  const ms = new Date(iso).getTime() - Date.now();
  if (ms <= 0) return { text: "Decision overdue", color: "bg-rose-400" };

  const hours = Math.ceil(ms / 3_600_000);
  if (hours <= 24) {
    return { text: "Decision required within 24 hours", color: "bg-amber-400" };
  }
  const days = Math.ceil(hours / 24);
  return {
    text: `Approval due in ${days} day${days > 1 ? "s" : ""}`,
    color: "bg-emerald-400",
  };
}

/* ---------- SIMPLE CHARTS (SVG) ---------- */
type Pt = { label: string; value: number };

function SimpleBarChart({ data }: { data: Array<Pt & { color?: string }> }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const W = 680,
    H = 180,
    pad = 24;
  const innerW = W - pad * 2,
    innerH = H - pad * 2;
  const band = innerW / data.length;

  return (
    <svg
      className="block w-full min-h-[180px] pointer-events-none select-none"
      viewBox={`0 0 ${W} ${H}`}
    >
      <rect
        x={pad}
        y={pad}
        width={innerW}
        height={innerH}
        fill="white"
        stroke="#e5e7eb"
      />
      {data.map((d, i) => {
        const h = (d.value / max) * innerH;
        const x = pad + i * band + band * 0.15;
        const y = pad + innerH - h;
        const barW = band * 0.7;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={barW}
            height={h}
            fill={d.color ?? "#3B82F6"}
            rx="4"
          />
        );
      })}
      {data.map((d, i) => (
        <text
          key={`l${i}`}
          x={pad + i * band + band / 2}
          y={H - 6}
          textAnchor="middle"
          fontSize="10"
          fill="#64748b"
        >
          {d.label}
        </text>
      ))}
    </svg>
  );
}

function SimpleLineChart({
  data,
  yFormatter,
}: {
  data: { label: string; value: number }[];
  yFormatter?: (v: number) => string;
}) {
  const niceStep = (rough: number) => {
    const p = Math.pow(10, Math.floor(Math.log10(rough)));
    const e = rough / p;
    const n = e <= 1 ? 1 : e <= 2 ? 2 : e <= 5 ? 5 : 10;
    return n * p;
  };
  const TICKS = 5;
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const stepY = niceStep(maxVal / TICKS);
  const niceMax = Math.ceil(maxVal / stepY) * stepY;
  const ticks = Array.from({ length: TICKS + 1 }, (_, i) => i * stepY);

  // dynamic left pad (biar label Rp ga kepotong)
  const sample = yFormatter ? yFormatter(niceMax) : String(niceMax);
  const approxTextW = Math.ceil(sample.length * 7);
  const padL = Math.max(72, approxTextW + 14);

  const W = 680,
    H = 220;
  const padT = 28,
    padR = 24,
    padB = 30;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const stepX = innerW / (data.length - 1 || 1);

  const points = data
    .map((d, i) => {
      const x = padL + i * stepX;
      const y = padT + innerH - (d.value / niceMax) * innerH;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      className="block w-full pointer-events-none select-none"
      viewBox={`0 0 ${W} ${H}`}
    >
      <rect
        x={padL}
        y={padT}
        width={innerW}
        height={innerH}
        fill="white"
        stroke="#e5e7eb"
      />
      {ticks.map((t, i) => {
        const y = padT + innerH - (t / niceMax) * innerH;
        return (
          <g key={i}>
            <line
              x1={padL}
              y1={y}
              x2={padL + innerW}
              y2={y}
              stroke="#e5e7eb"
              strokeDasharray="3 3"
            />
            <text
              x={padL - 8}
              y={y + 4}
              textAnchor="end"
              fontSize="10"
              fill="#64748b"
            >
              {yFormatter ? yFormatter(t) : `${t}`}
            </text>
          </g>
        );
      })}
      <polyline points={points} fill="none" stroke="#3B82F6" strokeWidth="3" />
      {data.map((d, i) => {
        const x = padL + i * stepX;
        const y = padT + innerH - (d.value / niceMax) * innerH;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="4"
            fill="white"
            stroke="#3B82F6"
            strokeWidth="2"
          />
        );
      })}
      {data.map((d, i) => (
        <text
          key={i}
          x={padL + i * stepX}
          y={H - 8}
          textAnchor="middle"
          fontSize="10"
          fill="#64748b"
        >
          {d.label}
        </text>
      ))}
    </svg>
  );
}

function GroupedBarChart({
  labels,
  series,
}: {
  labels: string[];
  series: { name: string; values: number[]; color: string }[];
}) {
  const flat = series.flatMap((s) => s.values);
  const max = Math.max(...flat, 1);
  const W = 680,
    H = 200,
    pad = 28;
  const innerW = W - pad * 2,
    innerH = H - pad * 2;
  const band = innerW / labels.length;
  const groupW = band * 0.8;
  const barW = groupW / series.length;

  return (
    <svg
      className="block w-full pointer-events-none select-none"
      viewBox={`0 0 ${W} ${H}`}
    >
      <rect
        x={pad}
        y={pad}
        width={innerW}
        height={innerH}
        fill="white"
        stroke="#e5e7eb"
      />
      {labels.map((lbl, i) => {
        const gx = pad + i * band + (band - groupW) / 2;
        return (
          <g key={i} transform={`translate(${gx},0)`}>
            {series.map((s, j) => {
              const h = (s.values[i] / max) * innerH;
              const x = j * barW;
              const y = pad + innerH - h;
              return (
                <rect
                  key={j}
                  x={x}
                  y={y}
                  width={barW - 2}
                  height={h}
                  fill={s.color}
                  rx="3"
                />
              );
            })}
            <text
              x={groupW / 2}
              y={H - 6}
              textAnchor="middle"
              fontSize="10"
              fill="#64748b"
            >
              {lbl}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ================== PAGE ================== */
export default function DashboardHOD() {
  // Filter dropdowns
  const [dept, setDept] = React.useState<string>("all");
  const [period, setPeriod] = React.useState<string>("2023-2025");
  const router = useRouter();

  // Map UI -> tipe di mock
  const deptMap: Record<string, Department> = {
    all: "All",
    fin: "Finance",
    hrd: "HRD",
    tta: "TTA",
  };
  const periodMap: Record<string, PeriodKey> = {
    "2023-2025": "2023-2025",
    "last-12": "last-12",
    ytd: "ytd",
    thisyear: "last-12",
  };
  const d: Department = deptMap[dept] ?? "All";
  const p: PeriodKey = periodMap[period] ?? "2023-2025";

  /* ======= DATA DARI MOCK ======= */
  // Approval cards
  const approvalTravel = MOCK.approval.cards.travelRequest;
  const approvalClaim = MOCK.approval.cards.claim;
  const approvalBooking = MOCK.approval.cards.booking;

  // Approval management table
  const approvalMgmtRows = MOCK.approval.managementRows
    .map((r: any) => {
      const now = Date.now();
      const countdownISO = r.dueInHours
        ? new Date(now + r.dueInHours * 3600_000).toISOString()
        : r.dueInDays
        ? new Date(now + r.dueInDays * 86400_000).toISOString()
        : new Date(now + 24 * 3600_000).toISOString();

      return {
        id: r.id,
        bookingId: r.bookingId ?? "-",
        category: r.category,
        requestor: r.requestor,
        department: r.department,
        countdownISO,
      };
    })
    .sort(sortByDeadlineAsc) // <= konsisten urutan
    .slice(0, 3); // <= hanya top 3

  // urutkan berdasar deadline terdekat, ambil 3 teratas
  const approvalMgmtRowsTop3 = [...approvalMgmtRows]
    .sort(
      (a, b) =>
        new Date(a.countdownISO).getTime() - new Date(b.countdownISO).getTime()
    )
    .slice(0, 3);

  // My Request
  const myTravelReq = MOCK.myRequest.cards.travelRequest;
  const myClaim = MOCK.myRequest.cards.claim;
  const myBooking = MOCK.myRequest.cards.booking;

  const upcomingTrips = MOCK.myRequest.activeTrips.map((t: any) => ({
    id: t.tripId ?? t.id,
    type: t.type,
    destination: t.destination,
    date: t.date,
  }));

  const claimTracker = MOCK.myRequest.claimTracker.map((c: any) => ({
    id: c.claimId ?? c.id,
    tripId: c.tripId,
    type: c.type,
    requestDate: c.requestDate,
    status: c.status,
  }));

  const requestTracker = MOCK.myRequest.requestTracker;
  const tBudget = MOCK.myRequest.travelBudget;

  // Budget (Dept KPI)
  const budget = MOCK.deptKpi.budget ?? {
    initial: 150_000_000,
    used: 40_000_000,
  };
  const refunded = budget.refunded ?? 15_000_000;
  const loss = budget.loss ?? 5_000_000;
  const usedGross = budget.used ?? 40_000_000;
  const usedNet = Math.max(0, usedGross - refunded - loss);
  const remaining = Math.max(
    0,
    (budget.initial ?? 150_000_000) - (usedNet + refunded + loss)
  );

  // Charts (Dept KPI)
  const MONTHLY_COST = getMonthlyTravelCost(d, p).map((m) => ({
    label: m.month,
    value: m.amount,
  }));

  const YEARLY_COST = getYearlyTravelCost(d, p).map((y) => ({
    label: String(y.year),
    value: y.amount,
  }));

  const ALL_REQUEST = getAllRequest(d).map((x, i) => ({
    label: x.label,
    value: x.value,
    color: ["#0072FF", "#00CDC7", "#FF8743"][i % 3],
  }));

  const CHANGE_BOOKING = getChangeBooking(d).map((x, i) => ({
    label: x.label,
    value: x.value,
    color: ["#3B82F6", "#FACC15", "#EF4444"][i % 3],
  }));

  const _trend = getApprovalTrend(d);
  const APPROVAL_TREND = {
    labels: _trend.map((t) => t.label),
    series: [
      {
        name: "Approved",
        values: _trend.map((t) => t.approved),
        color: "#3B82F6",
      },
      {
        name: "Pending",
        values: _trend.map((t) => t.pending),
        color: "#FACC15",
      },
      {
        name: "Rejected",
        values: _trend.map((t) => t.rejected),
        color: "#EF4444",
      },
    ],
  };

  const SLA = getSla(); // { complete, nonCompliance }

  const _active = getActiveTripStacked(d);
  const ACTIVE_TRIP_SERIES = [
    {
      name: "Moda Internal",
      values: _active.map((a) => a.internal),
      color: "#33D7D2",
    },
    {
      name: "Moda Eksternal",
      values: _active.map((a) => a.external),
      color: "#FCD532",
    },
  ];

  /* ================== UI ================== */
  return (
    <div className="space-y-6">
      {/* ====== SECTION: APPROVAL ====== */}
      <div className="flex items-center justify-between">
        <SectionChip color="sky" label="Approval" />
        <div className="hidden md:flex gap-2">
          <select className="px-3 py-2 text-sm border rounded-lg">
            <option>Period</option>
          </select>
          <select className="px-3 py-2 text-sm border rounded-lg">
            <option>Category</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card title="Travel Request Approval">
          <div className="flex items-center gap-6">
            <Donut
              size={120}
              thickness={14}
              bg="#ffffff"
              slices={[
                {
                  label: "Approved",
                  value: approvalTravel.approved,
                  color: "#3B82F6",
                },
                {
                  label: "Pending",
                  value: approvalTravel.pending,
                  color: "#FACC15",
                },
                {
                  label: "Rejected",
                  value: approvalTravel.rejected,
                  color: "#EF4444",
                },
              ]}
            />
            <div className="space-y-2">
              <LegendItem
                color="#3B82F6"
                label={`${approvalTravel.approved} Approved`}
              />
              <LegendItem
                color="#FACC15"
                label={`${approvalTravel.pending} Pending`}
              />
              <LegendItem
                color="#EF4444"
                label={`${approvalTravel.rejected} Rejected`}
              />
            </div>
          </div>
        </Card>

        <Card title="Claim & Reimburse Approval">
          <div className="flex items-center gap-6">
            <Donut
              size={120}
              thickness={14}
              bg="#ffffff"
              slices={[
                {
                  label: "Approved",
                  value: approvalClaim.approved,
                  color: "#3B82F6",
                },
                {
                  label: "Pending",
                  value: approvalClaim.pending,
                  color: "#FACC15",
                },
                {
                  label: "Rejected",
                  value: approvalClaim.rejected,
                  color: "#EF4444",
                },
              ]}
            />
            <div className="space-y-2">
              <LegendItem
                color="#3B82F6"
                label={`${approvalClaim.approved} Approved`}
              />
              <LegendItem
                color="#FACC15"
                label={`${approvalClaim.pending} Pending`}
              />
              <LegendItem
                color="#EF4444"
                label={`${approvalClaim.rejected} Rejected`}
              />
            </div>
          </div>
        </Card>

        <Card title="Booking Changes Approval">
          <div className="flex items-center gap-6">
            <Donut
              size={120}
              thickness={14}
              bg="#ffffff"
              slices={[
                {
                  label: "Approved",
                  value: approvalBooking.approved,
                  color: "#3B82F6",
                },
                {
                  label: "Pending",
                  value: approvalBooking.pending,
                  color: "#FACC15",
                },
                {
                  label: "Rejected",
                  value: approvalBooking.rejected,
                  color: "#EF4444",
                },
              ]}
            />
            <div className="space-y-2">
              <LegendItem
                color="#3B82F6"
                label={`${approvalBooking.approved} Approved`}
              />
              <LegendItem
                color="#FACC15"
                label={`${approvalBooking.pending} Pending`}
              />
              <LegendItem
                color="#EF4444"
                label={`${approvalBooking.rejected} Rejected`}
              />
            </div>
          </div>
        </Card>
      </div>

      <Card
        title={
          <div className="inline-flex items-center gap-2">
            <span>Approval Management</span>
            <span className="w-5 h-5 text-[11px] rounded-full bg-rose-500 text-white grid place-items-center">
              {approvalMgmtRows.length}
            </span>
          </div>
        }
        right={<SearchInput placeholder="Search" size="sm" />}
        footer={
          <button
            onClick={() => router.push("/dashboard?section=approval")}
            className="text-xs text-slate-600 hover:text-slate-900"
          >
            More
          </button>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-center text-slate-500">
                <th className="py-2">ID</th>
                <th className="py-2">Category</th>
                <th className="py-2">Requestor</th>
                <th className="py-2">Departement</th>
                <th className="py-2">Approval Countdown</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>

            <tbody className="text-slate-700">
              {approvalMgmtRowsTop3.map((r: any) => (
                <tr key={r.id} className="border-t text-center">
                  <td className="py-2">{r.id}</td>
                  <td className="py-2">{r.category}</td>
                  <td className="py-2">{r.requestor}</td>
                  <td className="py-2">{r.department}</td>
                  <td className="py-2">
                    {/* <span className="text-xs px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
                      {daysLeft(r.countdownISO)}
                    </span> */}
                    <CountDownPill
                      targetISO={r.countdownISO}
                      badge={r.countdownBadge}
                    />
                  </td>
                  <td className="py-2">
                    <div className="flex w-full items-center justify-end gap-2 pr-4">
                      <button className="px-3 py-1 text-xs rounded bg-[#bdd5fd] text-[#1755b9] hover:bg-[#e0e4ec]">
                        Detail
                      </button>
                      <button className="px-3 py-1 text-xs rounded bg-[#3B82F6] text-white hover:bg-[#2563EB]">
                        Approve
                      </button>
                      <button className="px-3 py-1 text-xs rounded bg-rose-100 text-rose-700 hover:bg-rose-200">
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card
        title="Approval History"
        right={<SearchInput placeholder="Search" size="sm" />}
        footer={
          <button className="text-xs text-slate-600 hover:text-slate-900">
            More
          </button>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="py-2">ID</th>
                <th className="py-2">Booking ID</th>
                <th className="py-2">Category</th>
                <th className="py-2">Requestor</th>
                <th className="py-2">Department</th>
                <th className="py-2">Request Date</th>
                <th className="py-2">Approval Date</th>
                <th className="py-2">Status</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody className="text-slate-500">
              <tr className="border-t">
                <td className="py-3" colSpan={9}>
                  <div className="text-center">–</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* ====== SECTION: MY REQUEST ====== */}
      <SectionChip color="emerald" label="My Request" />
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
                  value: myTravelReq.approved,
                  color: "#3B82F6",
                },
                {
                  label: "Pending",
                  value: myTravelReq.pending,
                  color: "#FACC15",
                },
                {
                  label: "Rejected",
                  value: myTravelReq.rejected,
                  color: "#EF4444",
                },
              ]}
            />
            <div className="space-y-2">
              <LegendItem
                color="#3B82F6"
                label={`${myTravelReq.approved} Approved`}
              />
              <LegendItem
                color="#FACC15"
                label={`${myTravelReq.pending} Pending`}
              />
              <LegendItem
                color="#EF4444"
                label={`${myTravelReq.rejected} Rejected`}
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
                  value: myClaim.approved,
                  color: "#3B82F6",
                },
                { label: "Pending", value: myClaim.pending, color: "#FACC15" },
                {
                  label: "Rejected",
                  value: myClaim.rejected,
                  color: "#EF4444",
                },
              ]}
            />
            <div className="space-y-2">
              <LegendItem
                color="#3B82F6"
                label={`${myClaim.approved} Approved`}
              />
              <LegendItem
                color="#FACC15"
                label={`${myClaim.pending} Pending`}
              />
              <LegendItem
                color="#EF4444"
                label={`${myClaim.rejected} Rejected`}
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
                  value: myBooking.approved,
                  color: "#3B82F6",
                },
                {
                  label: "Pending",
                  value: myBooking.pending,
                  color: "#FACC15",
                },
                {
                  label: "Rejected",
                  value: myBooking.rejected,
                  color: "#EF4444",
                },
              ]}
            />
            <div className="space-y-2">
              <LegendItem
                color="#3B82F6"
                label={`${myBooking.approved} Approved`}
              />
              <LegendItem
                color="#FACC15"
                label={`${myBooking.pending} Pending`}
              />
              <LegendItem
                color="#EF4444"
                label={`${myBooking.rejected} Rejected`}
              />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Travel Budget */}
        <Card
          title="Travel Budget"
          right={
            <span className="text-xs px-2.5 py-1 rounded-full bg-sky-100 text-sky-700">
              Initial Budget {IDR(tBudget.initial)}
            </span>
          }
        >
          <div className="flex items-center gap-6">
            <Donut
              size={160}
              thickness={22}
              bg="#ffffff"
              slices={[
                {
                  label: "Remaining",
                  value: tBudget.remaining,
                  color: "#10B981",
                },
                { label: "Used Budget", value: tBudget.used, color: "#F59E0B" },
                {
                  label: "Refunded Budget",
                  value: tBudget.refunded,
                  color: "#3B82F6",
                },
                { label: "Budget Loss", value: tBudget.loss, color: "#EF4444" },
              ]}
            />
            <div className="grid grid-cols-1 gap-2">
              <LegendItem
                color="#10B981"
                label="Remaining Budget"
                value={IDR(tBudget.remaining)}
              />
              <LegendItem
                color="#F59E0B"
                label="Used Budget"
                value={IDR(tBudget.used)}
              />
              <LegendItem
                color="#3B82F6"
                label="Refunded Budget"
                value={IDR(tBudget.refunded)}
              />
              <LegendItem
                color="#EF4444"
                label="Budget Loss"
                value={IDR(tBudget.loss)}
              />
            </div>
          </div>
        </Card>

        {/* Active & Upcoming Trips */}
        <Card
          title={
            <span className="inline-flex items-center gap-2">
              <img src="/icons/tracker_icons.svg" alt="" className="w-6 h-6" />
              <span>Active &amp; Upcoming Trips</span>
            </span>
          }
          footer={<DetailsButton label="Details" href="/dashboard/trips" />}
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
                {upcomingTrips.map((r: any) => (
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

      {/* Claim & Request trackers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card
          title={
            <span className="inline-flex items-center gap-2">
              <img src="/icons/claim_card.svg" alt="" className="w-6 h-6" />
              <span>Claim &amp; Reimbursement Tracker</span>
            </span>
          }
          footer={<DetailsButton label="Details" href="/dashboard/claims" />}
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
                {claimTracker.map((r: any) => (
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
          footer={<DetailsButton label="Details" href="/dashboard/requests" />}
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
                {requestTracker.map((r: any) => (
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

      {/* ====== SECTION: INTERNAL TRANSPORTATION TRACKING ====== */}
      <SectionChip color="indigo" label="Internal Transportation Tracking" />
      <Card title=" ">
        <MapEmbed
          bbox="106.70,-6.35,106.90,-6.05"
          marker="-6.2,106.82"
          height={520}
        />
      </Card>

      <Card
        title="Internal Transportation Tracker"
        right={
          <div className="flex items-center gap-2">
            <select className="px-2.5 py-1.5 text-xs border rounded-lg">
              <option>Depart…</option>
            </select>
            <select className="px-2.5 py-1.5 text-xs border rounded-lg">
              <option>Status…</option>
              <option>Available</option>
              <option>Reserved</option>
              <option>In-Use</option>
              <option>Maintenance</option>
            </select>
            <SearchInput placeholder="Search" size="sm" />
          </div>
        }
        footer={
          <button className="text-xs text-slate-600 hover:text-slate-900">
            More
          </button>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="py-2">Vehicle ID</th>
                <th className="py-2">Request ID</th>
                <th className="py-2">Booking ID</th>
                <th className="py-2">Requestor</th>
                <th className="py-2">Department</th>
                <th className="py-2">Departure Date</th>
                <th className="py-2">Start From</th>
                <th className="py-2">To</th>
                <th className="py-2">Status</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody className="text-slate-500">
              <tr className="border-t">
                <td className="py-3" colSpan={10}>
                  <div className="text-center">–</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* ====== SECTION: DEPARTMENT KPI ====== */}
      <SectionChip color="sky" label="Department KPI" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card
          title="Budget Utilization"
          right={
            <span className="text-xs px-2.5 py-1 rounded-full bg-sky-100 text-sky-700">
              Initial Budget {IDR(budget.initial)}
            </span>
          }
        >
          <div className="flex items-center gap-6">
            <Donut
              size={140}
              thickness={16}
              bg="#ffffff"
              slices={[
                { label: "Remaining", value: remaining, color: "#10B981" },
                { label: "Used Budget", value: usedNet, color: "#F59E0B" },
                { label: "Refunded Budget", value: refunded, color: "#3B82F6" },
                { label: "Budget Loss", value: loss, color: "#EF4444" },
              ]}
            />
            <div className="grid grid-cols-1 gap-2">
              <LegendItem
                color="#10B981"
                label="Remaining Budget"
                value={IDR(budget.initial - (usedNet + refunded + loss))}
              />
              <LegendItem
                color="#F59E0B"
                label="Used Budget"
                value={IDR(usedNet)}
              />
              <LegendItem
                color="#3B82F6"
                label="Refunded Budget"
                value={IDR(refunded)}
              />
              <LegendItem
                color="#EF4444"
                label="Budget Loss"
                value={IDR(loss)}
              />
            </div>
          </div>
        </Card>

        <Card
          title="Monthly Travel Cost"
          right={
            <div className="flex items-center gap-2">
              <FilterDropdown
                placeholder="Depart..."
                value={dept}
                onChange={(v) => setDept(v)}
                options={[
                  { label: "All Departments", value: "all" },
                  { label: "Finance", value: "fin" },
                  { label: "HRD", value: "hrd" },
                  { label: "TTA", value: "tta" },
                ]}
              />
              <FilterDropdown
                placeholder="Period"
                value={period}
                onChange={(v) => setPeriod(v)}
                options={[
                  { label: "This year", value: "thisyear" },
                  { label: "Last 12 months", value: "last-12" },
                  { label: "YTD", value: "ytd" },
                ]}
              />
            </div>
          }
        >
          <SimpleBarChart data={MONTHLY_COST} />
        </Card>

        <Card
          title="Yearly Travel Cost"
          right={
            <div className="flex items-center gap-2">
              <FilterDropdown
                placeholder="Depart..."
                value={dept}
                onChange={(v) => setDept(v)}
                options={[
                  { label: "All Departments", value: "all" },
                  { label: "Finance", value: "fin" },
                  { label: "HRD", value: "hrd" },
                  { label: "TTA", value: "tta" },
                ]}
              />
              <FilterDropdown
                placeholder="Period"
                value={period}
                onChange={(v) => setPeriod(v)}
                options={[
                  { label: "This year", value: "thisyear" },
                  { label: "Last 12 months", value: "last-12" },
                  { label: "YTD", value: "ytd" },
                ]}
              />
            </div>
          }
        >
          <SimpleLineChart data={YEARLY_COST} yFormatter={(v) => IDR(v)} />
        </Card>

        <Card
          title="All Request"
          right={
            <div className="flex items-center gap-2">
              <FilterDropdown
                placeholder="Depart..."
                value={dept}
                onChange={(v) => setDept(v)}
                options={[
                  { label: "All Departments", value: "all" },
                  { label: "Finance", value: "fin" },
                  { label: "HRD", value: "hrd" },
                  { label: "TTA", value: "tta" },
                ]}
              />
              <FilterDropdown
                placeholder="Period"
                value={period}
                onChange={(v) => setPeriod(v)}
                options={[
                  { label: "This year", value: "thisyear" },
                  { label: "Last 12 months", value: "last-12" },
                  { label: "YTD", value: "ytd" },
                ]}
              />
            </div>
          }
        >
          <SimpleBarChart data={ALL_REQUEST} />
        </Card>

        <Card
          title="Change Booking"
          right={
            <div className="flex items-center gap-2">
              <FilterDropdown
                placeholder="Depart..."
                value={dept}
                onChange={(v) => setDept(v)}
                options={[
                  { label: "All Departments", value: "all" },
                  { label: "Finance", value: "fin" },
                  { label: "HRD", value: "hrd" },
                  { label: "TTA", value: "tta" },
                ]}
              />
              <FilterDropdown
                placeholder="Period"
                value={period}
                onChange={(v) => setPeriod(v)}
                options={[
                  { label: "This year", value: "thisyear" },
                  { label: "Last 12 months", value: "last-12" },
                  { label: "YTD", value: "ytd" },
                ]}
              />
            </div>
          }
        >
          <SimpleBarChart data={CHANGE_BOOKING} />
        </Card>

        <Card
          title="Approval Trend"
          right={
            <div className="flex items-center gap-2">
              <FilterDropdown
                placeholder="Depart..."
                value={dept}
                onChange={(v) => setDept(v)}
                options={[
                  { label: "All Departments", value: "all" },
                  { label: "Finance", value: "fin" },
                  { label: "HRD", value: "hrd" },
                  { label: "TTA", value: "tta" },
                ]}
              />
              <FilterDropdown
                placeholder="Period"
                value={period}
                onChange={(v) => setPeriod(v)}
                options={[
                  { label: "This year", value: "thisyear" },
                  { label: "Last 12 months", value: "last-12" },
                  { label: "YTD", value: "ytd" },
                ]}
              />
            </div>
          }
        >
          <GroupedBarChart
            labels={APPROVAL_TREND.labels}
            series={APPROVAL_TREND.series}
          />
          <div className="mt-2 flex gap-4">
            <LegendItem color="#3B82F6" label="Approved" />
            <LegendItem color="#FACC15" label="Pending" />
            <LegendItem color="#EF4444" label="Rejected" />
          </div>
        </Card>

        <Card
          title="SLA Approval Trend"
          right={
            <div className="flex items-center gap-2">
              <FilterDropdown
                placeholder="Depart..."
                value={dept}
                onChange={(v) => setDept(v)}
                options={[
                  { label: "All Departments", value: "all" },
                  { label: "Finance", value: "fin" },
                  { label: "HRD", value: "hrd" },
                  { label: "TTA", value: "tta" },
                ]}
              />
              <FilterDropdown
                placeholder="Period"
                value={period}
                onChange={(v) => setPeriod(v)}
                options={[
                  { label: "This year", value: "thisyear" },
                  { label: "Last 12 months", value: "last-12" },
                  { label: "YTD", value: "ytd" },
                ]}
              />
            </div>
          }
        >
          <div className="flex items-center gap-6">
            <Pie
              size={140}
              slices={[
                {
                  label: "SLA Completion",
                  value: SLA.complete,
                  color: "#3B82F6",
                },
                {
                  label: "Non-Compliance",
                  value: SLA.nonCompliance,
                  color: "#EF4444",
                },
              ]}
            />
            <div className="space-y-2">
              <LegendItem
                color="#3B82F6"
                label="SLA Completion Rate"
                value="92%"
              />
              <LegendItem
                color="#EF4444"
                label="SLA Non-Compliance"
                value="8%"
              />
              <span className="text-xs text-slate-500">
                *termasuk jumlah eskalasi approval
              </span>
            </div>
          </div>
        </Card>

        <Card
          title="Active Trip"
          right={
            <div className="flex items-center gap-2">
              <FilterDropdown
                placeholder="Depart..."
                value={dept}
                onChange={(v) => setDept(v)}
                options={[
                  { label: "All Departments", value: "all" },
                  { label: "Finance", value: "fin" },
                  { label: "HRD", value: "hrd" },
                  { label: "TTA", value: "tta" },
                ]}
              />
              <FilterDropdown
                placeholder="Period"
                value={period}
                onChange={(v) => setPeriod(v)}
                options={[
                  { label: "This year", value: "thisyear" },
                  { label: "Last 12 months", value: "last-12" },
                  { label: "YTD", value: "ytd" },
                ]}
              />
            </div>
          }
        >
          <GroupedBarChart
            labels={_active.map((a) => a.label)}
            series={ACTIVE_TRIP_SERIES}
          />
          <div className="mt-2 flex gap-4">
            <LegendItem color="#33D7D2" label="Moda Internal" />
            <LegendItem color="#FCD532" label="Moda Eksternal" />
          </div>
        </Card>
      </div>

      {/* CTA di pojok kanan bawah */}
      <div className="mt-4 flex justify-end gap-3">
        <button
          onClick={() => console.log("Schedule Report")}
          className="px-5 py-2 rounded-xl text-sm font-semibold text-[#2563EB] bg-[#a9caff] shadow-sm hover:shadow transition"
        >
          Schedule Report
        </button>
        <button
          onClick={() => console.log("Download Report")}
          className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-[#2563EB] shadow hover:bg-[#1D4ED8] transition"
        >
          Download Report
        </button>
      </div>
    </div>
  );
}
