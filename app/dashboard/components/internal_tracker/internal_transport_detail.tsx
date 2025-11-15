"use client";

import * as React from "react";
import type { TripStatus } from "./internal_transport_map_inner";

type Props = {
  status: TripStatus;
  onBack: () => void;
};

/* ===== helpers: layout mirip StaffTravelRequestDetail ===== */
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6">
      <h2 className="flex items-center text-[20px] font-semibold text-[#202224]">
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
      <dd className="flex justify-end text-right text-slate-700">{children}</dd>
    </div>
  );
}

function statusBadgeClassFromTrip(status: TripStatus) {
  if (status === "Arrived") {
    return "bg-emerald-50 text-emerald-700 border border-emerald-200";
  }
  return "bg-amber-50 text-amber-700 border border-amber-200";
}

/* ===== data dummy ===== */
const employeeInfo = {
  name: "Alicia Key",
  id: "EMP-2025-034",
  department: "IT",
  position: "Senior IT Governance Specialist",
};

const travelInfoBase = {
  vehicleId: "CAR-02",
  requestId: "TTA003",
  bookingId: "Book2025-303",
  departureDate: "25 October 2025",
  departureTime: "11.40 WIB",
  startFrom: "Head Office",
  to: "PIK Avenue",
  driver: "Budi Santoso",
  tripType: "Round Trip",
};

type LogRow = { label: string; description: string; notes: string };

function buildTravelLog(status: TripStatus): LogRow[] {
  const arrivedTime = status === "Arrived" ? "12.48 WIB" : "-";

  return [
    { label: "Departure Time", description: "11.40 WIB", notes: "On-Time" },
    { label: "ETA", description: "12.45 WIB", notes: "-" },
    { label: "Arrived Time", description: arrivedTime, notes: "-" },
    { label: "Completion Trip Time", description: "-", notes: "-" },
    {
      label: "Current Location",
      description: status === "Arrived" ? "PIK Avenue" : "On The Way",
      notes: "-",
    },
    { label: "Alert", description: "-", notes: "N/A" },
    { label: "Last Update", description: "11.38 WIB", notes: "N/A" },
  ];
}

/* ===== main component ===== */
export default function InternalTransportDetail({ status, onBack }: Props) {
  const isArrived = status === "Arrived";
  const travelLog = buildTravelLog(status);

  return (
    <div className="space-y-4">
      <h1 className="text-[28px] font-semibold text-[#202224]">
        Internal Transportation Tracker
      </h1>

      {/* card lebar, sama pattern dengan StaffTravelRequestDetail */}
      <div className="relative rounded-2xl bg-white p-6 shadow-sm">
        {/* Close / Back di DALAM card */}
        <button
          onClick={onBack}
          aria-label="Close"
          className="absolute right-4 top-4 grid h-7 w-7 place-items-center rounded-full bg-rose-600 text-sm font-semibold text-white hover:bg-rose-700"
        >
          X
        </button>

        {/* ===== EMPLOYEE INFORMATION ===== */}
        <Section title="Employee Information">
          <RowItem label="Employee Name">{employeeInfo.name}</RowItem>
          <RowItem label="Employee ID">{employeeInfo.id}</RowItem>
          <RowItem label="Departement">{employeeInfo.department}</RowItem>
          <RowItem label="Position">{employeeInfo.position}</RowItem>
        </Section>

        {/* ===== TRAVEL INFORMATION ===== */}
        <Section title="Travel Information">
          <RowItem label="Vehicle ID">{travelInfoBase.vehicleId}</RowItem>
          <RowItem label="Request ID">{travelInfoBase.requestId}</RowItem>
          <RowItem label="Booking ID">{travelInfoBase.bookingId}</RowItem>
          <RowItem label="Departure Date">{travelInfoBase.departureDate}</RowItem>
          <RowItem label="Departure Time">{travelInfoBase.departureTime}</RowItem>
          <RowItem label="Start From">{travelInfoBase.startFrom}</RowItem>
          <RowItem label="To">{travelInfoBase.to}</RowItem>
          <RowItem label="Driver">{travelInfoBase.driver}</RowItem>
          <RowItem label="Trip Type">{travelInfoBase.tripType}</RowItem>
          <RowItem label="Status">
            <span
              className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full ${statusBadgeClassFromTrip(
                status
              )}`}
            >
              {isArrived ? "Arrived" : "On-Trip"}
            </span>
          </RowItem>
        </Section>

        {/* ===== TRAVEL LOG ===== */}
        <Section title="Travel Log">
          <div className="mt-2 overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-600">
                  <th className="w-[190px] border-b border-slate-200 px-3 py-2 text-left">
                    &nbsp;
                  </th>
                  <th className="border-b border-l border-slate-200 px-3 py-2 text-left">
                    Description
                  </th>
                  <th className="w-[140px] border-b border-l border-slate-200 px-3 py-2 text-left">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {travelLog.map((row) => (
                  <tr key={row.label} className="text-slate-700">
                    <td className="border-t border-slate-200 px-3 py-1.5 align-top">
                      {row.label}
                    </td>
                    <td className="border-t border-l border-slate-200 px-3 py-1.5 align-top">
                      {row.description}
                    </td>
                    <td className="border-t border-l border-slate-200 px-3 py-1.5 align-top">
                      {row.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      </div>
    </div>
  );
}
