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
  PriorityBadge,
  IDR,
  readBudget,
} from "@/app/dashboard/components/common";
import {
  getStaffRequestManagementRows,
  getStaffRequestHistoryRows,
  persistStaffNotify,
  type StaffRequestRow,
  type StaffHistoryRow,
} from "@/app/dashboard/data/ttaMock";

import StaffTravelRequestDetail, {
  MgmtRow,
} from "@/app/dashboard/components/request/travel_request_detail";

import InternalTransportMap from "../internal_tracker/internal_transport_map";
import InternalTransportDetail from "../internal_tracker/internal_transport_detail";
import type { TripStatus } from "../internal_tracker/internal_transport_map_inner";

/* ================== DUMMY DATA (UI-ONLY) ================== */
// Top: Travel Request
const travelRequestSummary = { complete: 6, onProcess: 3, pending: 1 };
const bookingChangesSummary = { complete: 6, onProcess: 0, pending: 4 };
const internalTransportStatus = {
  available: 7,
  reserved: 3,
  inUse: 2,
  maintenance: 1,
};

// Middle: My Request
const myTravelReq = { approved: 6, pending: 2, rejected: 2 };
const myClaim = { approved: 6, pending: 0, rejected: 0 };
const myBooking = { approved: 3, pending: 2, rejected: 1 };

type TripRow = {
  id: string;
  type: "Moda Eksternal" | "Moda Internal";
  destination: string;
  date: string;
};
const upcomingTrips: TripRow[] = [
  {
    id: "TTA031",
    type: "Moda Eksternal",
    destination: "Jakarta → Bali",
    date: "2025-11-10",
  },
  {
    id: "TTA032",
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
    id: "C2025-031",
    tripId: "TTA041",
    type: "Expense - Food",
    requestDate: "2025-10-20",
    status: "Pending",
  },
  {
    id: "C2025-032",
    tripId: "TTA042",
    type: "Expense - Taxi",
    requestDate: "2025-10-14",
    status: "Approved",
  },
  {
    id: "C2025-033",
    tripId: "TTA045",
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

// mapping StaffRequestRow → MgmtRow untuk kebutuhan detail view
function toMgmtRow(row: StaffRequestRow): MgmtRow {
  return {
    ...(row as any),
    requestDate: row.requestDateISO,
    approvalDate: row.approvalDateISO,
  } as MgmtRow;
}

/* ================== PAGE ================== */
export default function DashboardStaffTTA() {
  const router = useRouter();

  // === STATE INTERNAL TRANSPORT ===
  const [showInternalTrip, setShowInternalTrip] = React.useState(true);
  const [tripStatus, setTripStatus] = React.useState<TripStatus>("OnTrip");
  const [showInternalTripDetail, setShowInternalTripDetail] =
    React.useState(false);

  // NOTE: sekarang state pakai StaffRequestRow, bukan MgmtRow
  const [selectedRow, setSelectedRow] = React.useState<StaffRequestRow | null>(
    null
  );

  const [requestManagementRows, setRequestManagementRows] = React.useState<
    StaffRequestRow[]
  >([]);
  const [requestHistoryRows, setRequestHistoryRows] = React.useState<
    StaffHistoryRow[]
  >([]);

  React.useEffect(() => {
    setRequestManagementRows(getStaffRequestManagementRows());
    setRequestHistoryRows(getStaffRequestHistoryRows());
  }, []);

  React.useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (!detail?.rec) return;
      if (detail.rec.status === "Approved") {
        setRequestManagementRows(getStaffRequestManagementRows());
        setRequestHistoryRows(getStaffRequestHistoryRows());
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("tta:decision", handler as any);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("tta:decision", handler as any);
      }
    };
  }, []);

  // Budget sinkron (fallback 30jt / 20jt untuk demo)
  const [{ initial, used }, setBudget] = React.useState(
    typeof window === "undefined"
      ? { initial: 30_000_000, used: 20_000_000 }
      : readBudget() ?? { initial: 30_000_000, used: 20_000_000 }
  );

  React.useEffect(() => {
    const b = readBudget();
    if (b) setBudget(b);
  }, []);

  const refunded = 5_000_000;
  const loss = 5_000_000;
  const usedNet = Math.max(0, used - refunded - loss);
  const remaining = Math.max(0, initial - (usedNet + refunded + loss));

  const handleNotifyEmployee = (payload: {
    id: string;
    selectedOptionId: string | null;
  }) => {
    persistStaffNotify(payload.id, {
      notifiedDateISO: new Date().toISOString(),
      selectedOptionId: payload.selectedOptionId,
    });

    setRequestManagementRows(getStaffRequestManagementRows());
    setRequestHistoryRows(getStaffRequestHistoryRows());
    setSelectedRow(null);
  };

  if (selectedRow) {
    return (
      <StaffTravelRequestDetail
        row={toMgmtRow(selectedRow)}
        onBack={() => setSelectedRow(null)}
        onNotifyEmployee={handleNotifyEmployee}
      />
    );
  }
  if (showInternalTripDetail) {
    return (
      <InternalTransportDetail
        status={tripStatus}
        onBack={() => setShowInternalTripDetail(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* ====== SECTION: TRAVEL REQUEST ====== */}
      <div className="flex items-center justify-between">
        <SectionChip color="sky" label="Travel Request" />
        <div className="hidden gap-2 md:flex">
          <select className="rounded-lg border px-3 py-2 text-sm">
            <option>Period</option>
            <option>This Month</option>
            <option>This Quarter</option>
            <option>This Year</option>
          </select>
          <select className="rounded-lg border px-3 py-2 text-sm">
            <option>Category</option>
            <option>Travel</option>
            <option>Claims</option>
            <option>Booking</option>
          </select>
        </div>
      </div>

      {/* Top donuts */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <Card title="Travel Request Summary">
          <div className="flex items-center gap-6">
            <Donut
              size={120}
              thickness={14}
              bg="#ffffff"
              slices={[
                {
                  label: "Complete",
                  value: travelRequestSummary.complete,
                  color: "#3B82F6",
                },
                {
                  label: "On-Process",
                  value: travelRequestSummary.onProcess,
                  color: "#06B6D4",
                },
                {
                  label: "Pending",
                  value: travelRequestSummary.pending,
                  color: "#FACC15",
                },
              ]}
            />
            <div className="space-y-2">
              <LegendItem color="#3B82F6" label="6 Complete" />
              <LegendItem color="#06B6D4" label="3 On-Process" />
              <LegendItem color="#FACC15" label="1 Pending" />
            </div>
          </div>
        </Card>

        <Card title="Booking Changes Request">
          <div className="flex items-center gap-6">
            <Donut
              size={120}
              thickness={14}
              bg="#ffffff"
              slices={[
                {
                  label: "Complete",
                  value: bookingChangesSummary.complete,
                  color: "#3B82F6",
                },
                {
                  label: "On-Process",
                  value: bookingChangesSummary.onProcess,
                  color: "#06B6D4",
                },
                {
                  label: "Pending",
                  value: bookingChangesSummary.pending,
                  color: "#FACC15",
                },
              ]}
            />
            <div className="space-y-2">
              <LegendItem color="#3B82F6" label="6 Complete" />
              <LegendItem color="#06B6D4" label="0 On-Process" />
              <LegendItem color="#FACC15" label="4 Pending" />
            </div>
          </div>
        </Card>

        <Card title="Internal Transportation Status">
          <div className="flex items-center gap-6">
            <Donut
              size={120}
              thickness={14}
              bg="#ffffff"
              slices={[
                {
                  label: "Available",
                  value: internalTransportStatus.available,
                  color: "#3B82F6",
                },
                {
                  label: "Reserved",
                  value: internalTransportStatus.reserved,
                  color: "#06B6D4",
                },
                {
                  label: "In-Use",
                  value: internalTransportStatus.inUse,
                  color: "#F59E0B",
                },
                {
                  label: "Maintenance",
                  value: internalTransportStatus.maintenance,
                  color: "#EF4444",
                },
              ]}
            />
            <div className="space-y-2">
              <LegendItem color="#3B82F6" label="7 Available" />
              <LegendItem color="#06B6D4" label="3 Reserved" />
              <LegendItem color="#F59E0B" label="2 In-Use" />
              <LegendItem color="#EF4444" label="1 Maintenance" />
            </div>
          </div>
        </Card>
      </div>

      {/* Request Management */}
      <Card
        title={
          <div className="inline-flex items-center gap-2">
            <span>Request Management</span>
            <span className="grid h-5 w-5 place-items-center rounded-full bg-rose-500 text-[11px] text-white">
              {requestManagementRows.length}
            </span>
          </div>
        }
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
                <th className="py-2">Category</th>
                <th className="py-2">Requestor</th>
                <th className="py-2">Department</th>
                <th className="py-2">Request Date</th>
                <th className="py-2">Approval Date</th>
                <th className="py-2">Status Approval</th>
                <th className="py-2">Priority</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {requestManagementRows.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="py-2">{r.id}</td>
                  <td className="py-2">{r.category}</td>
                  <td className="py-2">{r.requestor}</td>
                  <td className="py-2">{r.department}</td>
                  <td className="py-2">
                    {new Date(r.requestDateISO).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-2">
                    {new Date(r.approvalDateISO).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-2">
                    <StatusBadge s={r.approvalStatus} />
                  </td>
                  <td className="py-2">
                    {r.priority ? <PriorityBadge level={r.priority} /> : "-"}
                  </td>
                  <td className="py-2">
                    <DetailsButton
                      label="Detail"
                      onClick={() => setSelectedRow(r)}
                    />
                  </td>
                </tr>
              ))}
              {requestManagementRows.length === 0 && (
                <tr className="border-t">
                  <td className="py-3" colSpan={9}>
                    <div className="text-center text-slate-500">
                      No approved request yet
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Request History */}
      <Card
        title="Request History"
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
                <th className="py-2 text-center">ID</th>
                <th className="py-2 text-center">Booking ID</th>
                <th className="py-2 text-center">Category</th>
                <th className="py-2 text-center">Requestor</th>
                <th className="py-2 text-center">Request Date</th>
                <th className="py-2 text-center">Approval Date</th>
                <th className="py-2 text-center">Status</th>
                <th className="py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {requestHistoryRows.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="py-2 text-center">{r.id}</td>
                  <td className="py-2 text-center">{r.bookingId}</td>
                  <td className="py-2 text-center">{r.category}</td>
                  <td className="py-2 text-center">{r.requestor}</td>
                  <td className="py-2 text-center">
                    {new Date(r.requestDateISO).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-2 text-center">
                    {new Date(r.approvalDateISO).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-2 text-center">
                    <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs text-amber-700">
                      {r.status}
                    </span>
                  </td>
                  <td className="py-2 text-center">
                    <DetailsButton
                      label="Detail"
                      onClick={() => {
                        // detail history
                      }}
                    />
                  </td>
                </tr>
              ))}

              {requestHistoryRows.length === 0 && (
                <tr className="border-t">
                  <td className="py-3" colSpan={8}>
                    <div className="text-center text-slate-500">–</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ====== SECTION: MY REQUEST ====== */}
      <SectionChip color="emerald" label="My Request" />

      {/* donuts */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
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
              <LegendItem color="#3B82F6" label="6 Approved" />
              <LegendItem color="#FACC15" label="2 Pending" />
              <LegendItem color="#EF4444" label="2 Rejected" />
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
              <LegendItem color="#3B82F6" label="6 Approved" />
              <LegendItem color="#FACC15" label="0 Pending" />
              <LegendItem color="#EF4444" label="0 Rejected" />
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
              <LegendItem color="#3B82F6" label="3 Approved" />
              <LegendItem color="#FACC15" label="2 Pending" />
              <LegendItem color="#EF4444" label="1 Rejected" />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Travel Budget */}
        <Card
          title="Travel Budget"
          right={
            <span className="rounded-full bg-sky-100 px-2.5 py-1 text-xs text-sky-700">
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
                value={IDR(remaining)}
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

        {/* Active & Upcoming Trips */}
        <Card
          title={
            <span className="inline-flex items-center gap-2">
              <img src="/icons/tracker_icons.svg" alt="" className="h-6 w-6" />
              <span>Active &amp; Upcoming Trips</span>
            </span>
          }
          right={null}
          footer={
            <DetailsButton onClick={() => router.push("/dashboard/trips")} />
          }
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
                      <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs text-rose-700">
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

      {/* Trackers */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card
          title={
            <span className="inline-flex items-center gap-2">
              <img src="/icons/claim_card.svg" alt="" className="h-6 w-6" />
              <span>Claim &amp; Reimbursement Tracker</span>
            </span>
          }
          footer={
            <DetailsButton onClick={() => router.push("/dashboard/claims")} />
          }
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
              <img src="/icons/tracker_icons.svg" alt="" className="h-6 w-6" />
              <span>Request Tracker</span>
            </span>
          }
          footer={
            <DetailsButton onClick={() => router.push("/dashboard/requests")} />
          }
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

      {/* ====== SECTION: INTERNAL TRANSPORTATION TRACKING ====== */}
      <SectionChip color="indigo" label="Internal Transportation Tracking" />

      {/* Map tracker – pakai showInternalTrip */}
      <InternalTransportMap
        showTrip={showInternalTrip}
        status={tripStatus}
        onStatusChange={setTripStatus}
      />

      {/* Control table */}
      <Card
        title="Internal Transportation Tracker"
        right={
          <div className="flex items-center gap-2">
            <select className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-600 shadow-sm">
              <option value="">Depart…</option>
              <option value="IT Governance">IT Governance</option>
            </select>

            <select className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-600 shadow-sm">
              <option value="">Status…</option>
              <option value="OnTrip">On-Trip</option>
              <option value="Arrived">Arrived</option>
            </select>

            <SearchInput placeholder="Search" size="xs" />
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
                <th className="py-2">Departement</th>
                <th className="py-2">Departure Date</th>
                <th className="py-2">Start From</th>
                <th className="py-2">To</th>
                <th className="py-2 text-center">Status</th>
                <th className="py-2 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="text-slate-700">
              <tr className="border-t">
                <td className="py-2">CAR-02</td>
                <td className="py-2">TTA003</td>
                <td className="py-2">Book2025-303</td>
                <td className="py-2">Alicia Key</td>
                <td className="py-2">IT Governance</td>
                <td className="py-2">25 Oct 2025</td>
                <td className="py-2">Head Office</td>
                <td className="py-2">PIK Avenue</td>

                {/* STATUS BADGE – sinkron dengan tripStatus */}
                <td className="py-2 text-center">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                      tripStatus === "Arrived"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {tripStatus === "Arrived" ? "Arrived" : "On-Trip"}
                  </span>
                </td>

                {/* ACTION BUTTONS */}
                <td className="py-2">
                  <div className="flex items-center justify-end gap-2">
                    <DetailsButton
                      label="Detail"
                      onClick={() => setShowInternalTripDetail(true)}
                    />

                    <button
                      type="button"
                      className={`rounded-lg px-3 py-1 text-xs font-semibold shadow-sm transition ${
                        showInternalTrip
                          ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                          : "bg-indigo-600 text-white hover:bg-indigo-700"
                      }`}
                      onClick={() => setShowInternalTrip((prev) => !prev)}
                    >
                      {showInternalTrip ? "Hide" : "Show"}
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
