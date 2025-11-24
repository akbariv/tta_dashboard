// app/dashboard/components/dashboards/dashboard_karyawan.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  StatsCard,
  BudgetCard,
  TripsCard,
  DataTableCard,
  Slice,
  StatusBadge,
  TripRow,
  readBudget,
  Column,
  breakdown,
  DetailsButton,
  Card,
  SearchInput,
} from "@/app/dashboard/components/common";
import {
  getTravelConfirmationForEmployee,
  approvalDetailById,
  type TravelConfirmationRecord,
} from "@/app/dashboard/data/ttaMock";

/* ---------- dummy data ---------- */
const travelRequestStats = { approved: 6, pending: 3, rejected: 1 };
const claimStats = { approved: 2, pending: 4, rejected: 1 };
const bookingStats = { approved: 2, pending: 0, rejected: 3 };

const TR_SLICES: Slice[] = [
  { label: "Approved", value: travelRequestStats.approved, color: "#3B82F6" },
  { label: "Pending", value: travelRequestStats.pending, color: "#FACC15" },
  { label: "Rejected", value: travelRequestStats.rejected, color: "#EF4444" },
];
const CR_SLICES: Slice[] = [
  { label: "Approved", value: claimStats.approved, color: "#3B82F6" },
  { label: "Pending", value: claimStats.pending, color: "#FACC15" },
  { label: "Rejected", value: claimStats.rejected, color: "#EF4444" },
];
const BC_SLICES: Slice[] = [
  { label: "Approved", value: bookingStats.approved, color: "#3B82F6" },
  { label: "Pending", value: bookingStats.pending, color: "#FACC15" },
  { label: "Rejected", value: bookingStats.rejected, color: "#EF4444" },
];

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

/* ==================== MAIN ==================== */
export default function DashboardKaryawan() {
  const router = useRouter();
  const [{ initial, used }, setBudget] = React.useState(readBudget());

  // State untuk track user info (untuk employee ID di travel confirmation)
  const [userInfo, setUserInfo] = React.useState<{
    id?: string;
    name?: string;
    username?: string;
  } | null>(null);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("authUser");
      if (raw) {
        setUserInfo(JSON.parse(raw));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  React.useEffect(() => {
    const refresh = () => setBudget(readBudget());
    refresh();
    const onVis = () => {
      if (document.visibilityState === "visible") refresh();
    };
    const onStorage = (e: StorageEvent) => {
      if (
        ["tta_budget_initial", "tta_budget_used", "budget_used"].includes(
          e.key || ""
        )
      )
        refresh();
    };
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("storage", onStorage);
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const b = breakdown(initial, used);

  // ===== TRAVEL CONFIRMATION DATA (fetched from localStorage) =====
  const [travelConfirmations, setTravelConfirmations] = React.useState<
    TravelConfirmationRecord[]
  >([]);

  const employeeIdForLookup = React.useMemo(() => {
    if (!userInfo) return "Alicia Key";
    if (userInfo.id) return userInfo.id;

    // try to find a matching approval detail where employee.name matches userInfo.name
    try {
      const entries = Object.values(approvalDetailById) as any[];
      const found = entries.find(
        (d) => d && d.employee && d.employee.name === userInfo.name
      );
      if (found && found.employee && found.employee.id)
        return found.employee.id;
    } catch (e) {
      // ignore and fallback
    }

    return userInfo.name || "Alicia Key";
  }, [userInfo]);

  React.useEffect(() => {
    const confirmations = getTravelConfirmationForEmployee(employeeIdForLookup);
    setTravelConfirmations(confirmations);
  }, [employeeIdForLookup]);

  React.useEffect(() => {
    const handler = (e: Event) => {
      const confirmations =
        getTravelConfirmationForEmployee(employeeIdForLookup);
      setTravelConfirmations(confirmations);
    };

    if (typeof window !== "undefined") {
      window.addEventListener("tta:travel-confirmation", handler as any);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("tta:travel-confirmation", handler as any);
      }
    };
  }, [employeeIdForLookup]);

  // Kolom untuk Travel Confirmation
  const travelConfirmationCols: Column<TravelConfirmationRecord>[] = [
    { key: "id", label: "Request ID" },
    { key: "bookingId", label: "Booking ID" },
    { key: "category", label: "Category" },
    {
      key: "processedDateISO",
      label: "Processed Date",
      render: (r) =>
        new Date(r.processedDateISO).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    },
    {
      key: "status",
      label: "Status",
      render: (r) => (
        <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs text-amber-700">
          {r.status}
        </span>
      ),
    },
  ];

  // Kolom reusable untuk DataTableCard
  const claimCols: Column<ClaimRow>[] = [
    { key: "id", label: "Claim ID" },
    { key: "tripId", label: "Trip ID" },
    { key: "type", label: "Type" },
    {
      key: "requestDate",
      label: "Request Date",
      render: (r) =>
        new Date(r.requestDate).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    },
    {
      key: "status",
      label: "Status",
      render: (r) => <StatusBadge s={r.status} />,
    },
  ];
  const reqCols: Column<ReqRow>[] = [
    { key: "id", label: "ID" },
    { key: "category", label: "Category" },
    { key: "type", label: "Type" },
    {
      key: "requestDate",
      label: "Request Date",
      render: (r) =>
        new Date(r.requestDate).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    },
    {
      key: "status",
      label: "Status",
      render: (r) => <StatusBadge s={r.status} />,
    },
  ];

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
        <StatsCard title="Travel Request" slices={TR_SLICES} />
        <StatsCard title="Claim & Reimburse" slices={CR_SLICES} />
        <StatsCard title="Booking Changes" slices={BC_SLICES} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <BudgetCard initial={initial} breakdown={b} />
        <TripsCard rows={upcomingTrips} detailsHref="/dashboard/trips" />
      </div>

      {/* Travel Confirmation Section (dari Staff TTA) */}
      <Card
        title={
          <div className="inline-flex items-center gap-2">
            <span>Travel Confirmation</span>
            {travelConfirmations.length > 0 && (
              <span className="w-5 h-5 text-[11px] rounded-full bg-rose-500 text-white grid place-items-center">
                {travelConfirmations.length}
              </span>
            )}
          </div>
        }
        right={<SearchInput placeholder="Search" size="sm" />}
        footer={
          <button
            onClick={() => router.push("/dashboard/travel-confirmation")}
            className="text-xs text-slate-600 hover:text-slate-900"
          >
            View All
          </button>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="py-2">Request ID</th>
                <th className="py-2">Booking ID</th>
                <th className="py-2">Category</th>
                <th className="py-2">Processed Date</th>
                <th className="py-2">Status</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {travelConfirmations.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="py-2">{r.id}</td>
                  <td className="py-2">{r.bookingId}</td>
                  <td className="py-2">{r.category}</td>
                  <td className="py-2">
                    {new Date(r.processedDateISO).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-2">
                    <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs text-amber-700">
                      {r.status === "Confirmed" ? "Booked" : r.status}
                    </span>
                  </td>
                  <td className="py-2">
                    <DetailsButton
                      label="View Details"
                      size="sm"
                      onClick={() =>
                        router.push("/dashboard/travel-confirmation")
                      }
                    />
                  </td>
                </tr>
              ))}

              {travelConfirmations.length === 0 && (
                <tr className="border-t">
                  <td className="py-3" colSpan={6}>
                    <div className="text-center text-slate-500">
                      No travel confirmation pending
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <DataTableCard
          title="Claim & Reimbursement Tracker"
          iconSrc="/icons/claim_card.svg"
          columns={claimCols}
          rows={claimTracker}
          footer={DetailsButton({
            label: "Details",
            onClick: () => router.push("/dashboard/claims"),
            size: "sm",
          })}
        />
        <DataTableCard
          title="Request Tracker"
          iconSrc="/icons/tracker_icons.svg"
          columns={reqCols}
          rows={requestTracker}
          footer={DetailsButton({
            label: "Details",
            onClick: () => router.push("/dashboard/requests"),
            size: "sm",
          })}
        />
      </div>
    </div>
  );
}
