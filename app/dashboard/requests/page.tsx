"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "../components/Sidebar";
import { AppHeader } from "../components/appheader";
import {
  Card,
  SearchInput,
  StatusBadge,
  DetailsButton,
} from "@/app/dashboard/components/common";
import { getStaffRequestHistoryRows } from "@/app/dashboard/data/ttaMock";

export default function RequestsPage() {
  const router = useRouter();
  const [user, setUser] = React.useState<{
    username: string;
    name: string;
    role?: string;
  } | null>(null);

  const [search, setSearch] = React.useState("");
  const [rows, setRows] = React.useState(() => getStaffRequestHistoryRows());

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

  React.useEffect(() => {
    setRows(getStaffRequestHistoryRows());
  }, []);

  // Listen for updates coming from other pages/components (staff notify, travel confirmation, decisions)
  React.useEffect(() => {
    const handler = (e: Event) => {
      try {
        setRows(getStaffRequestHistoryRows());
      } catch (err) {}
    };

    if (typeof window !== "undefined") {
      window.addEventListener("tta:staff-notify", handler as EventListener);
      window.addEventListener("tta:travel-confirmation", handler as EventListener);
      window.addEventListener("tta:decision", handler as EventListener);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("tta:staff-notify", handler as EventListener);
        window.removeEventListener("tta:travel-confirmation", handler as EventListener);
        window.removeEventListener("tta:decision", handler as EventListener);
      }
    };
  }, []);

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (!r) return false;
      const passSearch =
        q.length === 0 ||
        [r.id, r.bookingId ?? "", r.category, r.requestor, r.department]
          .join(" ")
          .toLowerCase()
          .includes(q);
      return passSearch;
    });
  }, [rows, search]);

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
                Request History
              </h1>
              <button
                onClick={() => router.push("/dashboard")}
                className="text-xs text-slate-600 hover:text-slate-900 px-3 py-2 hover:bg-slate-100 rounded-lg transition"
              >
                Back to Dashboard
              </button>
            </div>

            <Card
              title={<div className="inline-flex items-center gap-2">All Requests</div>}
              right={<SearchInput placeholder="Search" size="sm" value={search} onChange={setSearch} />}
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
                    {filtered.map((r) => (
                      <tr key={r.id} className="border-t">
                        <td className="py-2 text-center">{r.id}</td>
                        <td className="py-2 text-center">{r.bookingId ?? "-"}</td>
                        <td className="py-2 text-center">{r.category}</td>
                        <td className="py-2 text-center">{r.requestor ?? "—"}</td>
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
                          <StatusBadge s={r.status as any} />
                        </td>
                        <td className="py-2 text-center">
                          <DetailsButton
                            label="Detail"
                            onClick={() => router.push(`/dashboard/requests/${r.id}`)}
                          />
                        </td>
                      </tr>
                    ))}

                    {filtered.length === 0 && (
                      <tr className="border-t">
                        <td className="py-3" colSpan={8}>
                          <div className="text-center text-slate-500">No requests found</div>
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
