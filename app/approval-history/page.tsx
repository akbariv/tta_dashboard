"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, SearchInput } from "@/app/dashboard/components/common";
import {
  loadDecisionStore,
  approvalDetailById,
  approvalManagement,
} from "@/app/dashboard/data/ttaMock";

type Row = {
  id: string;
  category: string;
  requestor: string;
  department: string;
  requestDateISO: string;
  approvalDateISO: string;
  status: "Approved" | "Rejected";
};

function buildRows(): Row[] {
  const store = loadDecisionStore();
  return Object.entries(store)
    .map(([id, rec]) => {
      const d = approvalDetailById[id] as any | undefined;
      const base = approvalManagement.find((x) => x.id === id) as any | undefined;
      const category = base?.category ?? (d?.kind === "travel" ? "Travel Request" : "Claim Request");
      const requestor = base?.requestor ?? d?.employee?.name ?? "-";
      const department = base?.department ?? d?.employee?.department ?? "-";
      const requestDateISO = d?.approval?.requestDateISO ?? new Date().toISOString();

      return {
        id,
        category,
        requestor,
        department,
        requestDateISO,
        approvalDateISO: rec.decisionDateISO,
        status: rec.status,
      } as Row;
    })
    .sort((a, b) => new Date(b.approvalDateISO).getTime() - new Date(a.approvalDateISO).getTime());
}

export default function ApprovalHistoryPage() {
  const router = useRouter();
  const [rows, setRows] = React.useState<Row[]>(() => buildRows());
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (!e.key || e.key === undefined) {
        setRows(buildRows());
      }
    }
    // also listen to our custom same-window event dispatched by persistDecision
    function onCustom() {
      setRows(buildRows());
    }
    window.addEventListener("storage", onStorage);
    window.addEventListener("tta:decision", onCustom as any);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("tta:decision", onCustom as any);
    };
  }, []);

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => q.length === 0 || [r.id, r.category, r.requestor, r.department].join(" ").toLowerCase().includes(q));
  }, [rows, search]);

  return (
    <div className="space-y-4">
      <h1 className="text-[28px] font-semibold text-[#202224]">Approval History</h1>

      <Card
        title={
          <div className="inline-flex items-center gap-2">
            <span>Approval History</span>
            <span className="w-5 h-5 text-[11px] rounded-full bg-slate-200 text-slate-700 grid place-items-center">{rows.length}</span>
          </div>
        }
        right={<SearchInput placeholder="Search" size="sm" value={search} onChange={setSearch} />}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-500">
                <th className="py-2 text-center">ID</th>
                <th className="py-2 text-center">Category</th>
                <th className="py-2 text-center">Requestor</th>
                <th className="py-2 text-center">Department</th>
                <th className="py-2 text-center">Request Date</th>
                <th className="py-2 text-center">Decision Date</th>
                <th className="py-2 text-center">Status</th>
                <th className="py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-slate-700 text-center">
              {filtered.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="py-3">{r.id}</td>
                  <td className="py-3">{r.category}</td>
                  <td className="py-3">{r.requestor}</td>
                  <td className="py-3">{r.department}</td>
                  <td className="py-3">{new Date(r.requestDateISO).toLocaleDateString()}</td>
                  <td className="py-3">{new Date(r.approvalDateISO).toLocaleString()}</td>
                  <td className="py-3">
                    <span className={
                      "text-xs px-3 py-1 rounded-full " +
                      (r.status === "Approved" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700")
                    }>{r.status}</span>
                  </td>
                  <td className="py-2">
                    <div className="flex w-full items-center justify-end gap-2 pr-4">
                      <button onClick={() => router.push(`/approval-history/${r.id}`)} className="px-3 py-1 text-xs rounded bg-[#bdd5fd] text-[#1755b9] hover:bg-[#e0e4ec]">Detail</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr className="border-t">
                  <td className="py-6 text-center text-slate-500" colSpan={8}>No history</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
