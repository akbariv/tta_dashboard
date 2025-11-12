"use client";

import * as React from "react";
import { approvalDetailById } from "@/app/dashboard/data/ttaMock";

type Row = {
  id: string;
  category: string;
  requestor: string;
  department: string;
  status: "Pending" | "Approved" | "Rejected";
  countdownISO: string;
  countdownBadge?: string;
};

type Props = {
  row: Row;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
};

/* --- local helpers (biar file ini self-contained) --- */
function formatDateID(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
function formatIDR(n?: number) {
  return (n ?? 0).toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  });
}
function CountDownPill({ targetISO, badge }: { targetISO: string; badge?: string }) {
  if (badge) {
    return <span className="text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-700">{badge}</span>;
  }
  const target = new Date(targetISO).getTime();
  const diff = target - Date.now();
  const hours = Math.ceil(diff / 3_600_000);
  const days = Math.ceil(diff / 86_400_000);
  const label = hours <= 24 ? "24 hours left" : days === 1 ? "1 day left" : `${days} days left`;
  return <span className="text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-700">{label}</span>;
}

export default function ApprovalDetailView({ row, onClose, onApprove, onReject }: Props) {
  const detail = approvalDetailById[row.id];
  const deadlineISO = detail?.approval.deadlineISO ?? row.countdownISO;

  return (
    <div className="space-y-4">
      <h1 className="text-[28px] font-semibold text-[#202224]">Approval Detail</h1>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        {/* Close (kanan atas) */}
        <div className="flex justify-end">
          <button onClick={onClose} className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200">
            Close
          </button>
        </div>

        {/* Employee Information */}
        <div className="text-[18px] font-semibold mt-2 mb-3">Employee Information</div>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="col-span-1 text-slate-500">Employee Name :</div>
          <div className="col-span-2">{detail?.employee.name ?? row.requestor}</div>

          <div className="col-span-1 text-slate-500">Employee ID :</div>
          <div className="col-span-2">{detail?.employee.id ?? "—"}</div>

          <div className="col-span-1 text-slate-500">Departement :</div>
          <div className="col-span-2">{detail?.employee.department ?? row.department}</div>

          <div className="col-span-1 text-slate-500">Position :</div>
          <div className="col-span-2">{detail?.employee.position ?? "—"}</div>
        </div>

        {/* Travel Request Information */}
        <div className="text-[18px] font-semibold mt-6 mb-3">Travel Request Information</div>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="col-span-1 text-slate-500">Request ID :</div>
          <div className="col-span-2">{row.id}</div>

          <div className="col-span-1 text-slate-500">Type :</div>
          <div className="col-span-2">{detail?.request.type ?? row.category}</div>

          <div className="col-span-1 text-slate-500">Destination :</div>
          <div className="col-span-2">{detail?.request.destination ?? "—"}</div>

          <div className="col-span-1 text-slate-500">Departure Date :</div>
          <div className="col-span-2">{formatDateID(detail?.request.departureDateISO)}</div>

          <div className="col-span-1 text-slate-500">Transportation :</div>
          <div className="col-span-2">{detail?.request.transportation ?? "—"}</div>

          <div className="col-span-1 text-slate-500">Estimated Cost :</div>
          <div className="col-span-2">{formatIDR(detail?.request.estimatedCost)}</div>
        </div>

        {/* Approval Information */}
        <div className="text-[18px] font-semibold mt-6 mb-3">Approval Information</div>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="col-span-1 text-slate-500">Request Date :</div>
          <div className="col-span-2">{formatDateID(detail?.approval.requestDateISO)}</div>

          <div className="col-span-1 text-slate-500">Approval Countdown :</div>
          <div className="col-span-2">
            <CountDownPill targetISO={deadlineISO} badge={row.countdownBadge} />
          </div>

          <div className="col-span-1 text-slate-500">Status :</div>
          <div className="col-span-2">
            <span className="text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-700">
              {detail?.approval.status ?? "Pending"}
            </span>
          </div>
        </div>

        {/* actions */}
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={() => onApprove(row.id)}
            className="px-4 py-2 rounded bg-[#3B82F6] text-white hover:bg-[#2563EB]"
          >
            Approve
          </button>
          <button
            onClick={() => onReject(row.id)}
            className="px-4 py-2 rounded bg-rose-100 text-rose-700 hover:bg-rose-200"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
