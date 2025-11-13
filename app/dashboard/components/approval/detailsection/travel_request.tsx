"use client";

import * as React from "react";
import { type TravelApproval } from "@/app/dashboard/data/ttaMock";
import RejectConfirmModal from "@/app/dashboard/components/approval/reject_confirm";

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
  onReject: (id: string, reason?: string) => void;
};

type TravelWithChange = TravelApproval["travel"] & {
  changeId?: string;
  initialDepartureDateISO?: string;
  rescheduleDepartureDateISO?: string;
  extraCost?: number;
  refundAmount?: number;
  lossCost?: number;
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
  const travel = detail.travel as TravelWithChange;

  // 🔽 Booking changes (reschedule / refund) detection
  const isBookingChange =
    row.category.toLowerCase().includes("booking") ||
    row.category.toLowerCase().includes("change") ||
    row.id.startsWith("BK") ||
    row.id.startsWith("BC") ||
    !!travel.changeId;

  // 🔽 tipe khusus
  const hasRescheduleInfo =
    !!travel.initialDepartureDateISO || !!travel.rescheduleDepartureDateISO;
  const hasCancelInfo =
    typeof travel.refundAmount !== "undefined" ||
    typeof travel.lossCost !== "undefined";

  const [status, setStatus] = React.useState<
    "Pending" | "Approved" | "Rejected"
  >(detail.approval.status);
  const [decisionISO, setDecisionISO] = React.useState<string | undefined>(
    (detail as any).approval?.decisionDateISO
  );

  React.useEffect(() => {
    setStatus(detail.approval.status);
    setDecisionISO((detail as any).approval?.decisionDateISO);
  }, [detail.approval.status]);

  const isPending = status === "Pending";

  const handleApprove = () => {
    setStatus("Approved");
    setDecisionISO(new Date().toISOString());
    onApprove(row.id);
  };

  const [rejectOpen, setRejectOpen] = React.useState(false);

  return (
    <div className="space-y-4">
      <h1 className="text-[28px] font-semibold text-[#202224]">
        {isBookingChange ? "Approval Detail" : "History - Travel Approval Detail"}
      </h1>

      <div className="relative rounded-2xl bg-white p-6 shadow-sm">
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-rose-600 text-white grid place-items-center hover:bg-rose-700"
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
          <RowItem label="Request ID">{travel.requestId}</RowItem>
          <RowItem label="Booking ID">{travel.bookingId}</RowItem>

          {isBookingChange && (
            <RowItem label="Change ID">{travel.changeId ?? "—"}</RowItem>
          )}

          <RowItem label="Type">{travel.type}</RowItem>
          <RowItem label="Destination">{travel.destination}</RowItem>
          <RowItem label="Departure Date">
            {formatDateID(travel.departureDateISO)}
          </RowItem>
          <RowItem label="Transportation">{travel.transportation}</RowItem>
          <RowItem label="Estimated Cost">
            {(travel.estimatedCost ?? 0).toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
              maximumFractionDigits: 0,
            })}
          </RowItem>
        </Section>

        {/* 🔽 Reschedule Information (untuk kasus seperti Intan) */}
        {hasRescheduleInfo && (
          <Section title="Reschedule Information">
            <RowItem label="Initial Departure Date">
              {formatDateID(
                travel.initialDepartureDateISO ?? travel.departureDateISO
              )}
            </RowItem>
            <RowItem label="Reschedule Departure Date">
              {formatDateID(
                travel.rescheduleDepartureDateISO ?? travel.departureDateISO
              )}
            </RowItem>
            <RowItem label="Extra Cost">
              {(travel.extraCost ?? 0).toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
              })}
            </RowItem>
          </Section>
        )}

        {/* 🔽 Cancel Travel Information (untuk Refund seperti mockup) */}
        {hasCancelInfo && (
          <Section title="Cancel Travel Information">
            <RowItem label="Refund Amount">
              {(travel.refundAmount ?? 0).toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
              })}
            </RowItem>
            <RowItem label="Loss Cost">
              {(travel.lossCost ?? 0).toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0,
              })}
            </RowItem>
          </Section>
        )}

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
            <RowItem label="Approval Date">
              {formatDateID(decisionISO)}
            </RowItem>
          ) : (
            <>
              <RowItem label="Approval Date">
                {formatDateID(decisionISO)}
              </RowItem>
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
              onClick={() => setRejectOpen(true)}
              className="px-4 py-1.5 text-sm rounded-full bg-rose-100 text-rose-700 hover:bg-rose-200"
            >
              Reject
            </button>
          </div>
        )}
      </div>

      {/* Modal Reject Reason */}
      <RejectConfirmModal
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        id={row.id}
        onConfirm={(id, reason) => {
          (detail as any).approval = {
            ...detail.approval,
            status: "Rejected",
            decisionDateISO: new Date().toISOString(),
            reason,
          };
          setStatus("Rejected");
          setDecisionISO((detail as any).approval.decisionDateISO);
          onReject(id, reason);
        }}
      />
    </div>
  );
}
