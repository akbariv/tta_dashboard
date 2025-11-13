"use client";

import * as React from "react";
import {
  approvalDetailById,
  persistStaffNotify,
  type TravelApproval,
} from "@/app/dashboard/data/ttaMock";
import NotifyConfirmation from "./notify_confirmation";

export type MgmtRow = {
  id: string;
  category: string;
  requestor: string;
  department: string;
  requestDate: string;
  approvalDate?: string;
  approvalStatus: "Approved" | "Pending" | "Rejected";
  priority?: "Low" | "Medium" | "High";
};

type Props = {
  row: MgmtRow;
  onBack: () => void;
  /** opsional: kalau mau mindahin data ke history di parent */
  onNotifyEmployee?: (payload: {
    id: string;
    selectedOptionId: string | null;
  }) => void;
};

/* ===== helpers ===== */
function formatDateID(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
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

function statusBadgeClass(s: "Approved" | "Pending" | "Rejected") {
  if (s === "Approved")
    return "bg-emerald-50 text-emerald-700 border border-emerald-200";
  if (s === "Rejected")
    return "bg-rose-50 text-rose-700 border border-rose-200";
  return "bg-amber-50 text-amber-700 border border-amber-200";
}

function getPriorityLabel(p?: "Low" | "Medium" | "High") {
  if (!p) return "—";
  if (p === "High") return "High - Decision required within 24 hours";
  if (p === "Medium") return "Medium - Process before departure date";
  return "Low";
}

export default function StaffTravelRequestDetail({
  row,
  onBack,
  onNotifyEmployee,
}: Props) {
  const raw = approvalDetailById[row.id] as TravelApproval | undefined;

  const detail: TravelApproval =
    raw && raw.kind === "travel"
      ? raw
      : {
          id: row.id,
          kind: "travel",
          employee: {
            name: row.requestor,
            id: "—",
            department: row.department,
            position: "—",
          },
          travel: {
            requestId: row.id,
            bookingId: "—",
            type: "Moda Eksternal",
            destination: "—",
            departureDateISO: row.requestDate,
            transportation: "—",
            estimatedCost: 0,
          },
          approval: {
            requestDateISO: row.requestDate,
            deadlineISO: row.requestDate,
            status: row.approvalStatus,
          },
        };

  const options = detail.travel.options ?? [];

  const [showOptions, setShowOptions] = React.useState(false);
  const [selectedOptionId, setSelectedOptionId] = React.useState<string | null>(
    () => options[0]?.id ?? null
  );
  const [showNotifyModal, setShowNotifyModal] = React.useState(false);

  const handleProcess = () => {
    if (options.length === 0) {
      setShowNotifyModal(true);
      return;
    }

    if (!showOptions) {
      setShowOptions(true);
      return;
    }

    setShowNotifyModal(true);
  };

  /** klik YES di popup */
  const handleConfirmNotify = () => {
    setShowNotifyModal(false);

    // kasih tahu parent kalau disediakan
    if (onNotifyEmployee) {
      onNotifyEmployee({
        id: row.id,
        selectedOptionId,
      });
    }

    persistStaffNotify(row.id, {
      notifiedDateISO: new Date().toISOString(),
      selectedOptionId, // dari onNotifyEmployee
    });

    // kembali ke dashboard / list
    onBack();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-[28px] font-semibold text-[#202224]">
        Travel Request
      </h1>

      <div className="relative rounded-2xl bg-white p-6 shadow-sm">
        {/* Close / Back */}
        <button
          onClick={onBack}
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
          <RowItem label="Approval Date">
            {formatDateID(
              (detail.approval as any).decisionDateISO ?? row.approvalDate
            )}
          </RowItem>

          <RowItem label="Priority">
            <span className="inline-flex items-center gap-2">
              {row.priority && (
                <span className="w-2 h-2 rounded-full bg-amber-400" />
              )}
              <span className="text-xs text-slate-700">
                {getPriorityLabel(row.priority)}
              </span>
            </span>
          </RowItem>

          <RowItem label="Status">
            <span
              className={`inline-flex items-center text-xs px-3 py-1 rounded-full ${statusBadgeClass(
                row.approvalStatus
              )}`}
            >
              {row.approvalStatus}
            </span>
          </RowItem>
        </Section>

        {/* Option Information (muncul setelah klik Process & punya options) */}
        {showOptions && options.length > 0 && (
          <div className="mt-6">
            <h2 className="text-[20px] font-semibold text-[#202224] flex items-center">
              <span>Option Information</span>
              <span className="ml-4 h-[2px] flex-1 bg-slate-200" />
            </h2>

            <div className="mt-3 rounded-2xl border border-slate-200 overflow-hidden">
              {/* Header Best Option */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-amber-50">
                <span className="text-sm font-medium text-slate-700">
                  Best Option :
                </span>
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-1.5 text-xs rounded-full border border-amber-200 bg-amber-100 text-amber-800 font-medium"
                >
                  {detail.travel.transportation || "—"}
                </button>
              </div>

              {/* Table options */}
              <div className="p-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-500">
                      <th className="py-2">Class</th>
                      <th className="py-2">Departure Time</th>
                      <th className="py-2">Arrival Time</th>
                      <th className="py-2">Departure Station</th>
                      <th className="py-2">Destination Station</th>
                      <th className="py-2">Price</th>
                      <th className="py-2 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700">
                    {options.map((opt) => (
                      <tr key={opt.id} className="border-t">
                        <td className="py-2">{opt.className}</td>
                        <td className="py-2">{opt.departureTime}</td>
                        <td className="py-2">{opt.arrivalTime}</td>
                        <td className="py-2">{opt.departureStation}</td>
                        <td className="py-2">{opt.destinationStation}</td>
                        <td className="py-2">
                          {opt.price.toLocaleString("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            maximumFractionDigits: 0,
                          })}
                        </td>
                        <td className="py-2 text-center">
                          <label className="inline-flex items-center gap-2 text-xs text-slate-600">
                            <input
                              type="radio"
                              name="best-option"
                              className="h-3 w-3"
                              checked={selectedOptionId === opt.id}
                              onChange={() => setSelectedOptionId(opt.id)}
                            />
                            <span>{opt.label}</span>
                          </label>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 border-t border-slate-200 pt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={handleProcess}
            className="px-4 py-1.5 text-sm rounded-full bg-[#3B82F6] text-white hover:bg-[#2563EB]"
          >
            Process
          </button>
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-1.5 text-sm rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Popup konfirmasi notify employee */}
      {showNotifyModal && (
        <NotifyConfirmation
          onClose={() => setShowNotifyModal(false)}
          onConfirm={handleConfirmNotify}
        />
      )}
    </div>
  );
}
