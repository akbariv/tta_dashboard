"use client";

import * as React from "react";
import { type TravelApproval } from "@/app/dashboard/data/ttaMock";

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
  detail: TravelApproval; // wajib
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
};

/* ===== helpers ===== */
function formatDateID(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6">
      <h2 className="text-[20px] font-semibold text-[#202224] flex items-center">
        <span>{title}</span>
        <span className="ml-4 h-[2px] flex-1 bg-slate-200" />
      </h2>
      <dl className="mt-2 divide-y divide-slate-200">{children}</dl>
    </div>
  );
}

function RowItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[220px_1fr] items-center py-3 text-sm">
      <dt className="text-slate-500">{label} :</dt>
      <dd className="text-slate-700 flex justify-end text-right">{children}</dd>
    </div>
  );
}

function statusBadgeClass(s: "Pending" | "Approved" | "Rejected") {
  if (s === "Approved")
    return "bg-emerald-50 text-emerald-700 border border-emerald-200";
  if (s === "Rejected")
    return "bg-rose-50 text-rose-700 border border-rose-200";
  return "bg-amber-50 text-amber-700 border border-amber-200";
}

export default function TravelRequest({
  row,
  detail,
  onClose,
  onApprove,
  onReject,
}: Props) {
  // === state untuk tampilan detail ===
  const [status, setStatus] = React.useState<
    "Pending" | "Approved" | "Rejected"
  >(detail.approval.status);
  const [decisionISO, setDecisionISO] = React.useState<string | undefined>(
    (detail as any).approval?.decisionDateISO
  );
  const [rejectReason, setRejectReason] = React.useState<string>(""); // reason yang diketik user
  const [showRejectModal, setShowRejectModal] = React.useState(false);

  React.useEffect(() => {
    setStatus(detail.approval.status);
    setDecisionISO((detail as any).approval?.decisionDateISO);
  }, [detail.approval.status]);

  const isPending = status === "Pending";

  const handleApprove = () => {
    setStatus("Approved");
    setDecisionISO(new Date().toISOString());
    onApprove(row.id); // parent update (kamu sudah non-navigate, aman)
  };

  // klik tombol reject => buka modal
  const openRejectModal = () => {
    setRejectReason("");
    setShowRejectModal(true);
  };

  const closeRejectModal = () => setShowRejectModal(false);

  const confirmReject = () => {
    const reason =
      rejectReason.trim() === "" ? "Untitled" : rejectReason.trim();
    // update tampilan detail
    (detail as any).approval = {
      ...detail.approval,
      status: "Rejected",
      decisionDateISO: new Date().toISOString(),
      reason, // simpan lokal untuk ditampilkan di detail
    };
    setStatus("Rejected");
    setDecisionISO((detail as any).approval.decisionDateISO);
    setShowRejectModal(false);
    onReject(row.id); // biar parent ikut sync status
  };

  const statusBadgeClass = (s: "Pending" | "Approved" | "Rejected") =>
    s === "Approved"
      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
      : s === "Rejected"
      ? "bg-rose-50 text-rose-700 border border-rose-200"
      : "bg-amber-50 text-amber-700 border border-amber-200";

  return (
    <div className="space-y-4">
      <h1 className="text-[28px] font-semibold text-[#202224]">
        History - Travel Approval Detail
      </h1>

      <div className="relative rounded-2xl bg-white p-6 shadow-sm">
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-rose-600 text-white grid place-items-center hover:bg-rose-200"
        >
          X
        </button>

        {/* Employee Information */}
        <Section title="Employee Information">
          <RowItem label="Employee Name">
            {detail.employee.name ?? row.requestor}
          </RowItem>
          <RowItem label="Employee ID">{detail.employee.id ?? "—"}</RowItem>
          <RowItem label="Departement">
            {detail.employee.department ?? row.department}
          </RowItem>
          <RowItem label="Position">{detail.employee.position ?? "—"}</RowItem>
        </Section>

        {/* Travel Request Information */}
        <Section title="Travel Request Information">
          <RowItem label="Request ID">{detail.travel.requestId}</RowItem>
          <RowItem label="Type">{detail.travel.type}</RowItem>
          <RowItem label="Destination">{detail.travel.destination}</RowItem>
          <RowItem label="Departure Date">
            {formatDateID(detail.travel.departureDateISO)}
          </RowItem>
          <RowItem label="Transportation">
            {detail.travel.transportation}
          </RowItem>
          <RowItem label="Estimated Cost">
            {(detail.travel.estimatedCost ?? 0).toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
              maximumFractionDigits: 0,
            })}
          </RowItem>
        </Section>

        {/* Approval Information */}
        <Section title="Approval Information">
          <RowItem label="Request Date">
            {formatDateID(detail.approval.requestDateISO)}
          </RowItem>

          {status === "Pending" ? (
            <RowItem label="Approval Countdown">
              {formatDateID(detail.approval.deadlineISO)}
            </RowItem>
          ) : status === "Approved" ? (
            <RowItem label="Approval Date">{formatDateID(decisionISO)}</RowItem>
          ) : (
            <>
              <RowItem label="Approval Date">
                {formatDateID(decisionISO)}
              </RowItem>
              {/* BARIS REASON: muncul hanya saat Rejected */}
              <RowItem label="Reason">
                {(detail as any).approval?.reason ?? "—"}
              </RowItem>
            </>
          )}

          <RowItem label="Status">
            <span
              className={`inline-flex items-center text-xs px-3 py-1 rounded-full ${statusBadgeClass(
                status
              )}`}
            >
              {status}
            </span>
          </RowItem>
        </Section>

        {/* Footer actions: sembunyikan kalau sudah non-pending */}
        {isPending && (
          <div className="mt-6 border-t border-slate-200 pt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={handleApprove}
              className="px-4 py-1.5 text-sm rounded-full bg-[#3B82F6] text-white hover:bg-[#2563EB]"
            >
              Approve
            </button>
            <button
              type="button"
              onClick={openRejectModal}
              className="px-4 py-1.5 text-sm rounded-full bg-rose-100 text-rose-700 hover:bg-rose-200"
            >
              Reject
            </button>
          </div>
        )}
      </div>

      {/* ===== Modal Reject Reason ===== */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeRejectModal}
          />
          {/* dialog */}
          <div
            role="dialog"
            aria-modal="true"
            className="absolute left-1/2 top-1/2 w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-5 shadow-xl"
            onKeyDown={(e) => {
              if (e.key === "Escape") closeRejectModal();
              if (e.key === "Enter") confirmReject();
            }}
          >
            <div className="text-sm font-semibold text-slate-800">
              Are you sure you want to reject this approval request?
            </div>
            <div className="mt-1 text-[12px] text-slate-500">
              If you reject this request, that person will not be able to go on
              a business trip.
            </div>

            <label className="mt-4 block text-xs text-slate-600">Reason:</label>
            <input
              autoFocus
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Untitled"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-400"
            />

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeRejectModal}
                className="px-3 py-1.5 text-sm rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmReject}
                className="px-3 py-1.5 text-sm rounded-full bg-rose-500 text-white hover:bg-rose-600"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
