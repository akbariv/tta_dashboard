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

type ReqRow = {
  id: string;
  category: string;
  type: "Moda Eksternal" | "Moda Internal";
  requestDate: string;
  status: "Approved" | "Pending" | "Rejected";
};

// Dummy data untuk semua requests
const allRequests: ReqRow[] = [
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
  {
    id: "TTA004",
    category: "Travel Req.",
    type: "Moda Eksternal",
    requestDate: "2025-10-30",
    status: "Approved",
  },
  {
    id: "TTA005",
    category: "Changes Req.",
    type: "Moda Internal",
    requestDate: "2025-10-28",
    status: "Rejected",
  },
  {
    id: "TTA006",
    category: "Travel Req.",
    type: "Moda Eksternal",
    requestDate: "2025-11-01",
    status: "Pending",
  },
];

export default function RequestsPage() {
  const router = useRouter();
  const [user, setUser] = React.useState<{
    username: string;
    name: string;
    role?: string;
  } | null>(null);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<
    "All" | "Approved" | "Pending" | "Rejected"
  >("All");
  const [categoryFilter, setCategoryFilter] = React.useState<
    "All" | "Travel Req." | "Changes Req."
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

  // Filter requests
  const filteredRequests = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return allRequests.filter((r) => {
      const passStatus = statusFilter === "All" ? true : r.status === statusFilter;
      const passCategory = categoryFilter === "All" ? true : r.category === categoryFilter;
      const passSearch =
        q.length === 0 ||
        [r.id, r.category, r.type].join(" ").toLowerCase().includes(q);
      return passStatus && passCategory && passSearch;
    });
  }, [search, statusFilter, categoryFilter]);

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
                Request Tracker
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
                  <span>All Requests</span>
                  <span className="w-5 h-5 text-[11px] rounded-full bg-sky-500 text-white grid place-items-center">
                    {filteredRequests.length}
                  </span>
                </div>
              }
              right={
                <div className="flex items-center gap-2">
                  <select
                    className="px-3 py-2 text-sm border rounded-lg"
                    value={categoryFilter}
                    onChange={(e) =>
                      setCategoryFilter(
                        e.target.value as "All" | "Travel Req." | "Changes Req."
                      )
                    }
                  >
                    <option value="All">All Category</option>
                    <option value="Travel Req.">Travel Req.</option>
                    <option value="Changes Req.">Changes Req.</option>
                  </select>
                  <select
                    className="px-3 py-2 text-sm border rounded-lg"
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(
                        e.target.value as
                          | "All"
                          | "Approved"
                          | "Pending"
                          | "Rejected"
                      )
                    }
                  >
                    <option value="All">All Status</option>
                    <option value="Approved">Approved</option>
                    <option value="Pending">Pending</option>
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
                      <th className="py-2">ID</th>
                      <th className="py-2">Category</th>
                      <th className="py-2">Type</th>
                      <th className="py-2">Request Date</th>
                      <th className="py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700">
                    {filteredRequests.map((r) => (
                      <tr key={r.id} className="border-t hover:bg-slate-50">
                        <td className="py-3">{r.id}</td>
                        <td className="py-3">{r.category}</td>
                        <td className="py-3">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              r.type === "Moda Eksternal"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            {r.type}
                          </span>
                        </td>
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

                    {filteredRequests.length === 0 && (
                      <tr className="border-t">
                        <td className="py-3" colSpan={5}>
                          <div className="text-center text-slate-500">
                            No requests found
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
