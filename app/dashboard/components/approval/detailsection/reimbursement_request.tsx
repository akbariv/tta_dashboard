"use client";

import * as React from "react";
import { IDR } from "@/app/dashboard/components/common";
import type { ClaimApproval } from "@/app/dashboard/data/ttaMock";

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
  detail: ClaimApproval;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
};

function Field({
  label,
  children,
  align = "right",
}: {
  label: string;
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <div className="grid grid-cols-[220px_1fr] items-center border-b border-slate-200">
      <div className="py-3 pr-4 text-slate-500">{label} :</div>
      <div
        className={
          "py-3 " +
          (align === "right"
            ? "text-right pr-0 sm:pr-2 md:pr-4"
            : "text-left pl-0")
        }
      >
        {children}
      </div>
    </div>
  );
}
// --- helper currency: 100000 -> "100.000" (tanpa "Rp")
const asIDRNoPrefix = (n: number) =>
  new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(n);

// --- EXPENSE TABLE (compact, grid, total-row seperti mockup)
function ExpenseTable({
  items,
}: {
  items: Array<{ category: string; description: string; amount: number; attachment?: string }>;
}) {
  const total = items.reduce((s, it) => s + (it.amount || 0), 0);

  return (
    <div className="border border-slate-300 rounded-md overflow-hidden max-w-[1120px]">
      <table className="w-full table-fixed text-[13px]">
        <colgroup>
          <col className="w-[26%]" />
          <col className="w-[34%]" />
          <col className="w-[18%]" />
          <col className="w-[22%]" />
        </colgroup>
        <thead>
          <tr className="bg-white">
            <th className="border-b border-slate-300 px-3 py-2 text-left font-semibold text-slate-700">
              Category
            </th>
            <th className="border-b border-slate-300 px-3 py-2 text-left font-semibold text-slate-700">
              Description
            </th>
            <th className="border-b border-slate-300 px-3 py-2 text-center font-semibold text-slate-700">
              Amount (Rp)
            </th>
            <th className="border-b border-slate-300 px-3 py-2 text-left font-semibold text-slate-700">
              Attachment
            </th>
          </tr>
        </thead>

        <tbody>
          {items.map((it, i) => (
            <tr key={i} className="bg-white">
              <td className="border-t border-slate-300 px-3 py-2 text-slate-800">
                {it.category}
              </td>
              <td className="border-t border-slate-300 px-3 py-2 text-slate-800">
                {it.description || "–"}
              </td>
              <td className="border-t border-slate-300 px-3 py-2 text-center text-slate-800">
                {it.amount ? asIDRNoPrefix(it.amount) : "–"}
              </td>
              <td className="border-t border-slate-300 px-3 py-2">
                {it.attachment ? (
                  <a className="text-[#1B63E7] hover:underline" href="#">
                    {it.attachment}
                  </a>
                ) : (
                  <span className="text-slate-800">–</span>
                )}
              </td>
            </tr>
          ))}

          {/* TOTAL row — sel 1 & 4 diberi blok abu-abu seperti mockup */}
          <tr>
            <td className="border-t border-slate-300 px-3 py-2 bg-slate-400/70"></td>
            <td className="border-t border-slate-300 px-3 py-2 font-semibold text-slate-800">
              Total
            </td>
            <td className="border-t border-slate-300 px-3 py-2 text-center font-semibold text-slate-800">
              {asIDRNoPrefix(total)}
            </td>
            <td className="border-t border-slate-300 px-3 py-2 bg-slate-400/70"></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
function LabelRow({
  label,
  children,
  noValue, 
  labelClassName,
}: {
  label: string;
  children?: React.ReactNode;
  noValue?: boolean;
  labelClassName?: string;
}) {
  return (
    <div className="grid grid-cols-[220px_1fr] items-start border-b border-slate-200">
      <div className={"py-3 pr-4 text-slate-500 " + (labelClassName ?? "")}>
        {label}
      </div>
      <div className="py-3 pl-0">{children}</div>
    </div>
  );
}


function StatusBadge({ s }: { s: "Pending" | "Approved" | "Rejected" }) {
  const base = "text-xs px-3 py-1 rounded-full";
  if (s === "Approved")
    return <span className={`${base} bg-emerald-100 text-emerald-700`}>Approved</span>;
  if (s === "Rejected")
    return <span className={`${base} bg-rose-100 text-rose-700`}>Rejected</span>;
  return <span className={`${base} bg-amber-100 text-amber-700`}>Pending</span>;
}

export default function ReimbursementRequest({
  row,
  detail,
  onClose,
  onApprove,
  onReject,
}: Props) {
  const total = React.useMemo(
    () => detail.claim.expenses.reduce((a, b) => a + (b.amount ?? 0), 0),
    [detail.claim.expenses]
  );

  return (
    <div className="space-y-6">
      <h1 className="text-[28px] font-semibold text-[#202224]">
        Claim Approval Detail
      </h1>

      <div className="rounded-2xl bg-white shadow-sm border border-slate-200">
        <div className="flex justify-end p-3">
          <button
            onClick={onClose}
            className="grid place-items-center w-7 h-7 rounded-full bg-rose-500 text-white hover:bg-rose-600"
            aria-label="Close"
            title="Close"
          >
            X
          </button>
        </div>

        <div className="px-6 pb-6">
          {/* Employee Information */}
          <div className="text-lg font-semibold text-slate-800 mb-2">
            Employee Information
          </div>
          <div className="border-t border-slate-200">
            <Field label="Employee Name">{detail.employee.name}</Field>
            <Field label="Employee ID">{detail.employee.id}</Field>
            <Field label="Departement">{detail.employee.department}</Field>
            <Field label="Position">{detail.employee.position}</Field>
          </div>

          {/* Claim Request Information */}
          <div className="text-lg font-semibold text-slate-800 mt-8 mb-2">
            Claim Request Information
          </div>
          <div className="border-t border-slate-200">
            <Field label="Claim ID">{detail.claim.claimId}</Field>
            <Field label="Booking ID">{detail.claim.bookingId}</Field>
            <Field label="Request ID">{detail.claim.requestId}</Field>
            <LabelRow label="Expense Breakdown :" noValue>
  <div className="mt-2">
    <ExpenseTable items={detail.claim.expenses} />
  </div>
</LabelRow>

          </div>

          {/* Approval Information */}
          <div className="text-lg font-semibold text-slate-800 mt-8 mb-2">
            Approval Information
          </div>
          <div className="border-t border-slate-200">
            <Field label="Request Date">
              {new Date(detail.approval.requestDateISO).toLocaleDateString("id-ID", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </Field>

            <Field label="Approval Countdown">
              <span className="text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-700">
                {detail.approval.deadlineISO
                  ? (() => {
                      const ms =
                        new Date(detail.approval.deadlineISO).getTime() - Date.now();
                      if (ms <= 0) return "Decision overdue";
                      const days = Math.ceil(ms / 86_400_000);
                      return `Approval due in ${days} day${days > 1 ? "s" : ""}`;
                    })()
                  : "—"}
              </span>
            </Field>

            <Field label="Status">
              <StatusBadge s={detail.approval.status} />
            </Field>
          </div>

          {/* CTA */}
          {detail.approval.status === "Pending" && (
            <div className="pt-6 flex justify-end gap-2">
              <button
                onClick={() => onApprove(row.id)}
                className="px-4 py-2 rounded bg-[#3B82F6] text-white text-sm hover:bg-[#2563EB]"
              >
                Approve
              </button>
              <button
                onClick={() => onReject(row.id)}
                className="px-4 py-2 rounded bg-rose-100 text-rose-700 text-sm hover:bg-rose-200"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
