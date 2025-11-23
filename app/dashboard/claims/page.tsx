"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "../components/Sidebar";
import { AppHeader } from "../components/appheader";
import {
  Card,
  SearchInput,
  StatusBadge,
  SectionChip,
} from "@/app/dashboard/components/common";

type ClaimRow = {
  id: string;
  tripId: string;
  type: string;
  requestDate: string;
  status: "Pending" | "Approved" | "Rejected";
};

// Dummy data untuk semua claims
const allClaims: ClaimRow[] = [
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
  {
    id: "C2025-001",
    tripId: "TTA021",
    type: "Expense - Accommodation",
    requestDate: "2025-10-25",
    status: "Approved",
  },
  {
    id: "C2025-002",
    tripId: "TTA022",
    type: "Expense - Food",
    requestDate: "2025-10-18",
    status: "Pending",
  },
  {
    id: "C2025-003",
    tripId: "TTA025",
    type: "Expense - Transportation",
    requestDate: "2025-10-16",
    status: "Rejected",
  },
];

export default function ClaimsPage() {
  const router = useRouter();
  const [user, setUser] = React.useState<{
    username: string;
    name: string;
    role?: string;
  } | null>(null);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<
    "All" | "Pending" | "Approved" | "Rejected"
  >("All");

  // Load user
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("authUser");
      if (!raw) {
        router.replace("/");
        return;
      }
      setUser(JSON.parse(raw));
    } catch {
      router.replace("/");
    }
  }, [router]);

  // Filter claims
  const filteredClaims = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return allClaims.filter((r) => {
      const passStatus = statusFilter === "All" ? true : r.status === statusFilter;
      const passSearch =
        q.length === 0 ||
        [r.id, r.tripId, r.type].join(" ").toLowerCase().includes(q);
      return passStatus && passSearch;
    });
  }, [search, statusFilter]);

  function logout() {
    try {
      localStorage.removeItem("authUser");
    } catch {}
    router.push("/");
  }

  if (!user) return null;

  return (
    <div className="size-full flex bg-[#f5f6fa] min-h-screen">
      <Sidebar
        activeMenu="dashboard"
        onMenuClick={(m) => {
          if (m === "logout") logout();
          else router.push("/dashboard");
        }}
      />

      <div className="flex-1 flex flex-col">
        <AppHeader
          userName={user.name ?? "User"}
          userTitle={user.role ?? "Employee"}
          search={search}
          onSearchChange={setSearch}
          onToggleSidebar={() => {}}
          onLogout={logout}
        />

        <div className="flex-1 px-8 py-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-[28px] font-semibold text-slate-800">
                Claim & Reimbursement Tracker
              </h1>
              <button
                onClick={() => router.push("/dashboard")}
                className="text-xs text-slate-600 hover:text-slate-900 px-3 py-2 hover:bg-slate-100 rounded-lg transition"
              >
                Back to Dashboard
              </button>
            </div>

            <Card
              title={
                <div className="inline-flex items-center gap-2">
                  <span>All Claims</span>
                  <span className="w-5 h-5 text-[11px] rounded-full bg-sky-500 text-white grid place-items-center">
                    {filteredClaims.length}
                  </span>
                </div>
              }
              right={
                <div className="flex items-center gap-2">
                  <select
                    className="px-3 py-2 text-sm border rounded-lg"
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(
                        e.target.value as
                          | "All"
                          | "Pending"
                          | "Approved"
                          | "Rejected"
                      )
                    }
                  >
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  <SearchInput
                    placeholder="Search"
                    size="sm"
                    value={search}
                    onChange={setSearch}
                  />
                </div>
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
                    {filteredClaims.map((r) => (
                      <tr key={r.id} className="border-t hover:bg-slate-50">
                        <td className="py-3">{r.id}</td>
                        <td className="py-3">{r.tripId}</td>
                        <td className="py-3">{r.type}</td>
                        <td className="py-3">
                          {new Date(r.requestDate).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="py-3">
                          <StatusBadge s={r.status} />
                        </td>
                      </tr>
                    ))}

                    {filteredClaims.length === 0 && (
                      <tr className="border-t">
                        <td className="py-3" colSpan={5}>
                          <div className="text-center text-slate-500">
                            No claims found
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
