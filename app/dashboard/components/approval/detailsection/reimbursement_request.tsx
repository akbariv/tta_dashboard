"use client";

import * as React from "react";
import { type ClaimApproval } from "@/app/dashboard/data/ttaMock";

/** Harus sama dengan Row di approval_detail_view.tsx */
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
  detail: ClaimApproval;              // Wajib
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
};

/* ===== helpers ===== */
function formatDateID(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
}
function formatIDR(n?: number) {
  return (n ?? 0).toLocaleString("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });
}
function CountDownPill({ targetISO, badge }: { targetISO: string; badge?: string }) {
  if (badge) return <span className="text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-700">{badge}</span>;
  const diff = new Date(targetISO).getTime() - Date.now();
  const hours = Math.ceil(diff / 3_600_000);
  const days = Math.ceil(diff / 86_400_000);
  const label = hours <= 24 ? "24 hours left" : days === 1 ? "1 day left" : `${days} days left`;
  return <span className="text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-700">{label}</span>;
}

export default function ReimbursementRequest({ row, detail, onClose, onApprove, onReject }: Props) {
  const total = detail.claim.expenses.reduce((s, e) => s + (e.amount ?? 0), 0);

  return (
    <div className="space-y-4">
      <h1 className="text-[28px] font-semibold text-[#202224]">Claim Approval Detail</h1>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex justify-end">
          <button onClick={onClose} className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200">Close</button>
        </div>

        {/* Employee Information */}
        <div className="text-[18px] font-semibold mt-2 mb-3">Employee Information</div>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="col-span-1 text-slate-500">Employee Name :</div>
          <div className="col-span-2">{detail.employee.name}</div>

          <div className="col-span-1 text-slate-500">Employee ID :</div>
          <div className="col-span-2">{detail.employee.id}</div>

          <div className="col-span-1 text-slate-500">Departement :</div>
          <div className="col-span-2">{detail.employee.department}</div>

          <div className="col-span-1 text-slate-500">Position :</div>
          <div className="col-span-2">{detail.employee.position}</div>
        </div>

        {/* Claim Request Information */}
        <div className="text-[18px] font-semibold mt-6 mb-3">Claim Request Information</div>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="col-span-1 text-slate-500">Claim ID :</div>
          <div className="col-span-2">{detail.claim.claimId}</div>

          <div className="col-span-1 text-slate-500">Booking ID :</div>
          <div className="col-span-2">{detail.claim.bookingId}</div>

          <div className="col-span-1 text-slate-500">Request ID :</div>
          <div className="col-span-2">{detail.claim.requestId}</div>
        </div>

        {/* Expense Breakdown (table) */}
        <div className="text-sm mt-3">
          <div className="mb-2 font-medium">Expense Breakdown :</div>
          <div className="overflow-x-auto">
            <table className="min-w-[520px] w-full border border-slate-200">
              <thead className="bg-slate-50">
                <tr className="text-left">
                  <th className="px-3 py-2 border border-slate-200">Category</th>
                  <th className="px-3 py-2 border border-slate-200">Description</th>
                  <th className="px-3 py-2 border border-slate-200">Amount (Rp)</th>
                  <th className="px-3 py-2 border border-slate-200">Attachment</th>
                </tr>
              </thead>
              <tbody>
                {detail.claim.expenses.map((e, i) => (
                  <tr key={i}>
                    <td className="px-3 py-2 border border-slate-200">{e.category}</td>
                    <td className="px-3 py-2 border border-slate-200">{e.description || "—"}</td>
                    <td className="px-3 py-2 border border-slate-200">{(e.amount ?? 0).toLocaleString("id-ID")}</td>
                    <td className="px-3 py-2 border border-slate-200">
                      {e.attachment ? (
                        <a href="#" className="text-sky-600 hover:underline">{e.attachment}</a>
                      ) : "—"}
                    </td>
                  </tr>
                ))}
                <tr className="font-semibold bg-slate-50">
                  <td className="px-3 py-2 border border-slate-200" colSpan={2}>Total</td>
                  <td className="px-3 py-2 border border-slate-200">{total.toLocaleString("id-ID")}</td>
                  <td className="px-3 py-2 border border-slate-200">—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Approval Information */}
        <div className="text-[18px] font-semibold mt-6 mb-3">Approval Information</div>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="col-span-1 text-slate-500">Request Date :</div>
          <div className="col-span-2">{formatDateID(detail.approval.requestDateISO)}</div>

          <div className="col-span-1 text-slate-500">Approval Countdown :</div>
          <div className="col-span-2">
            <CountDownPill targetISO={detail.approval.deadlineISO} badge={row.countdownBadge} />
          </div>

          <div className="col-span-1 text-slate-500">Status :</div>
          <div className="col-span-2">
            <span className="text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-700">
              {detail.approval.status}
            </span>
          </div>
        </div>

        {/* actions */}
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={() => onApprove(row.id)} className="px-4 py-2 rounded bg-[#3B82F6] text-white hover:bg-[#2563EB]">
            Approve
          </button>
          <button onClick={() => onReject(row.id)} className="px-4 py-2 rounded bg-rose-100 text-rose-700 hover:bg-rose-200">
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
