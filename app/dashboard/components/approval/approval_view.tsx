// app/dashboard/components/approval/approvalview.tsx
"use client";

import * as React from "react";
import { Card, SearchInput } from "@/app/dashboard/components/common";
import {
  approvalManagement as APPROVAL_SRC,
  loadDecisionStore,
  persistDecision,         // <— pakai dari ttaMock
} from "@/app/dashboard/data/ttaMock";
import ApprovalDetailView from "@/app/dashboard/components/approval/approval_detail_view";

/* ---------------- Persist helpers (localStorage) ---------------- */
// type DecisionStatus = "Approved" | "Rejected";
// type DecisionStore = Record<string, { status: DecisionStatus; decisionDateISO: string; reason?: string }>;

// const STORAGE_KEY = "tta_approval_decisions_v1";

// function loadDecisionStore(): DecisionStore {
//   if (typeof window === "undefined") return {};
//   try {
//     return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
//   } catch {
//     return {};
//   }
// }

// function persistDecision(id: string, status: DecisionStatus, reason?: string) {
//   const store = loadDecisionStore();
//   store[id] = { status, decisionDateISO: new Date().toISOString(), reason };
//   localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
// }

export function CountDownPill({ targetISO, badge }: { targetISO: string; badge?: string }) {
  if (badge) return <span className="text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-700">{badge}</span>;
  const target = new Date(targetISO).getTime();
  const diff = target - Date.now();
  const hours = Math.ceil(diff / 3_600_000);
  const days = Math.ceil(diff / 86_400_000);
  const label = hours <= 24 ? "24 hours left" : days === 1 ? "1 day left" : `${days} days left`;
  return <span className="text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-700">{label}</span>;
}

/* --- tipe Row list --- */
type Row = {
  id: string;
  category: string;
  requestor: string;
  department: string;
  status: "Pending" | "Approved" | "Rejected";
  countdownISO: string;
  countdownBadge?: string;
};

function mapToRows(): Row[] {
  const now = Date.now();
  return APPROVAL_SRC.map((r) => {
    const countdownISO = r.dueInHours
      ? new Date(now + r.dueInHours * 3_600_000).toISOString()
      : r.dueInDays
      ? new Date(now + r.dueInDays * 86_400_000).toISOString()
      : new Date(now + 24 * 3_600_000).toISOString();

    return {
      id: r.id,
      category: r.category,
      requestor: r.requestor,
      department: r.department,
      status: (r.status as Row["status"]) ?? "Pending",
      countdownISO,
      countdownBadge: r.countdownBadge,
    };
  });
}

const sortByDeadlineAsc = (a: { countdownISO: string }, b: { countdownISO: string }) =>
  new Date(a.countdownISO).getTime() - new Date(b.countdownISO).getTime();

export default function ApprovalView({
  initialOpenId = null,
  onCloseDetail,                 
}: {
  initialOpenId?: string | null;
  onCloseDetail?: () => void;    
}) {
  const [data, setData] = React.useState<Row[]>([]);
  const [status, setStatus] = React.useState<"All" | Row["status"]>("All");
  const [search, setSearch] = React.useState("");
  const [openId, setOpenId] = React.useState<string | null>(initialOpenId);
  React.useEffect(() => setOpenId(initialOpenId ?? null), [initialOpenId]);

  // ---------- INIT: load sumber + apply persist (filter yg sudah diputus) ----------
 React.useEffect(() => {
  const decided = loadDecisionStore();
  const base = mapToRows();
  const pendingOnly = base.filter((r) => !decided[r.id]); 
  setData(pendingOnly);
}, []);


  const rows = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return data
      .filter((r) => {
        const passStatus = status === "All" ? true : r.status === status;
        const passSearch =
          q.length === 0 || [r.id, r.category, r.requestor, r.department].join(" ").toLowerCase().includes(q);
        return passStatus && passSearch;
      })
      .sort(sortByDeadlineAsc);
  }, [data, status, search]);

  const selected = React.useMemo(() => data.find((x) => x.id === openId) ?? null, [data, openId]);

  // ---------- DECIDE from LIST or from DETAIL (via onClose in detail view) ----------
 const onApprove = (id: string) => {
  setData((prev) => prev.filter((r) => r.id !== id));
  persistDecision(id, { status: "Approved", decisionDateISO: new Date().toISOString() });
};
const onReject = (id: string) => {
  setData((prev) => prev.filter((r) => r.id !== id));
  // kalau nanti bawa reason, tinggal persistDecision(id, { status: "Rejected", decisionDateISO: new Date().toISOString(), reason })
  persistDecision(id, { status: "Rejected", decisionDateISO: new Date().toISOString() });
};


  /* ---------- TAMPILAN DETAIL ---------- */
  if (selected) {
    return (
      <ApprovalDetailView
        row={selected}
        onClose={() => {
          setOpenId(null);
          onCloseDetail?.();      // ← panggil callback untuk hapus ?id di URL
        }}
        onApprove={onApprove}
        onReject={onReject}
      />
    );
  }

  /* ---------- TAMPILAN LIST ---------- */
  return (
    <div className="space-y-4">
      <h1 className="text-[28px] font-semibold text-[#202224]">Approval Detail</h1>

      <Card
        title={
          <div className="inline-flex items-center gap-2">
            <span>Approval Management</span>
            <span className="w-5 h-5 text-[11px] rounded-full bg-rose-500 text-white grid place-items-center">
              {rows.length}
            </span>
          </div>
        }
        right={
          <div className="flex items-center gap-2">
            <select className="px-3 py-2 text-sm border rounded-lg">
              <option>Period</option>
            </select>
            <select className="px-3 py-2 text-sm border rounded-lg" value={status} onChange={(e) => setStatus(e.target.value as any)}>
              <option value="All">Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
            <SearchInput placeholder="Search" size="sm" value={search} onChange={setSearch} />
          </div>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-500">
                <th className="py-2 text-center">ID</th>
                <th className="py-2 text-center">Category</th>
                <th className="py-2 text-center">Requestor</th>
                <th className="py-2 text-center">Department</th>
                <th className="py-2 text-center">Approval Countdown</th>
                <th className="py-2 text-center">Status</th>
                <th className="py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-slate-700 text-center">
              {rows.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="py-3">{r.id}</td>
                  <td className="py-3">{r.category}</td>
                  <td className="py-3">{r.requestor}</td>
                  <td className="py-3">{r.department}</td>
                  <td className="py-3">
                    <CountDownPill targetISO={r.countdownISO} badge={r.countdownBadge} />
                  </td>
                  <td className="py-3">
                    <span
                      className={
                        "text-xs px-3 py-1 rounded-full " +
                        (r.status === "Approved"
                          ? "bg-emerald-100 text-emerald-700"
                          : r.status === "Rejected"
                          ? "bg-rose-100 text-rose-700"
                          : "bg-amber-100 text-amber-700")
                      }
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="py-2">
                    <div className="flex w-full items-center justify-end gap-2 pr-4">
                      <button onClick={() => setOpenId(r.id)} className="px-3 py-1 text-xs rounded bg-[#bdd5fd] text-[#1755b9] hover:bg-[#e0e4ec]">
                        Detail
                      </button>
                      <button onClick={() => onApprove(r.id)} className="px-3 py-1 text-xs rounded bg-[#3B82F6] text-white hover:bg-[#2563EB]">
                        Approve
                      </button>
                      <button onClick={() => onReject(r.id)} className="px-3 py-1 text-xs rounded bg-rose-100 text-rose-700 hover:bg-rose-200">
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr className="border-t">
                  <td className="py-6 text-center text-slate-500" colSpan={7}>
                    No data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
