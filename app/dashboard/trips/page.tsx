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

type TripRow = {
  id: string;
  type: "Moda Eksternal" | "Moda Internal";
  destination: string;
  date: string;
};

// Dummy data untuk semua trips
const allTrips: TripRow[] = [
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
  {
    id: "TTA001",
    type: "Moda Eksternal",
    destination: "Jakarta → Surabaya",
    date: "2025-11-05",
  },
  {
    id: "TTA002",
    type: "Moda Internal",
    destination: "Bandung → Jakarta",
    date: "2025-11-08",
  },
  {
    id: "TTA003",
    type: "Moda Eksternal",
    destination: "Jakarta → Medan",
    date: "2025-11-12",
  },
];

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

export default function TripsPage() {
  const router = useRouter();
  const [user, setUser] = React.useState<{
    username: string;
    name: string;
    role?: string;
  } | null>(null);
  const [search, setSearch] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<"All" | "Moda Eksternal" | "Moda Internal">("All");

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

  // Filter trips
  const filteredTrips = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return allTrips.filter((r) => {
      const passType = typeFilter === "All" ? true : r.type === typeFilter;
      const passSearch =
        q.length === 0 ||
        [r.id, r.destination].join(" ").toLowerCase().includes(q);
      return passType && passSearch;
    });
  }, [search, typeFilter]);

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
                Active & Upcoming Trips
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
                  <span>All Trips</span>
                  <span className="w-5 h-5 text-[11px] rounded-full bg-sky-500 text-white grid place-items-center">
                    {filteredTrips.length}
                  </span>
                </div>
              }
              right={
                <div className="flex items-center gap-2">
                  <select
                    className="px-3 py-2 text-sm border rounded-lg"
                    value={typeFilter}
                    onChange={(e) =>
                      setTypeFilter(
                        e.target.value as "All" | "Moda Eksternal" | "Moda Internal"
                      )
                    }
                  >
                    <option value="All">All Type</option>
                    <option value="Moda Eksternal">Moda Eksternal</option>
                    <option value="Moda Internal">Moda Internal</option>
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
                      <th className="py-2">Trip ID</th>
                      <th className="py-2">Type</th>
                      <th className="py-2">Destination</th>
                      <th className="py-2">Date</th>
                      <th className="py-2 text-right">Countdown</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-700">
                    {filteredTrips.map((r) => (
                      <tr key={r.id} className="border-t hover:bg-slate-50">
                        <td className="py-3">{r.id}</td>
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
                        <td className="py-3">{r.destination}</td>
                        <td className="py-3">
                          {new Date(r.date).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="py-3 text-right">
                          <span className="inline-flex items-center rounded-full bg-rose-100 px-2.5 py-0.5 text-xs text-rose-700 font-semibold">
                            {daysLeft(r.date)}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {filteredTrips.length === 0 && (
                      <tr className="border-t">
                        <td className="py-3" colSpan={5}>
                          <div className="text-center text-slate-500">
                            No trips found
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
