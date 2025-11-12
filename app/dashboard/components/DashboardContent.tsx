"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Donut from "./Donut";
import { getApprovals, getHistory, actOnApproval, ApprovalItem, HistoryItem } from "../../../lib/approvals";

type Summary = {
  title: string;
  segments: { value: number; color: string }[];
  labels: { label: string; value: number; color: string }[];
};

// summaryData will be computed from approvals + history inside the component so it reflects live counts

export default function DashboardContent() {
  const router = useRouter();
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Compute summary counts per category (Approved / Pending / Rejected)
  const summaryData = useMemo<Summary[]>(() => {
    const categories = [
      { key: "Travel Request", title: "Travel Request Approval" },
      { key: "Claim Request", title: "Claim & Reimburse Approval" },
      { key: "Booking Change", title: "Booking Changes Approval" },
    ];

    return categories.map((c) => {
      const approved = history.filter((h) => h.category === c.key && h.status === "Approved").length;
      const rejected = history.filter((h) => h.category === c.key && h.status === "Rejected").length;
      const pending = approvals.filter((a) => a.category === c.key).length;

      return {
        title: c.title,
        segments: [
          { value: approved, color: "#2563EB" },
          { value: pending, color: "#F59E0B" },
          { value: rejected, color: "#EF4444" },
        ],
        labels: [
          { label: "Approved", value: approved, color: "#2563EB" },
          { label: "Pending", value: pending, color: "#F59E0B" },
          { label: "Rejected", value: rejected, color: "#EF4444" },
        ],
      } as Summary;
    });
  }, [approvals, history]);

  useEffect(() => {
    try {
      setApprovals(getApprovals());
      setHistory(getHistory());
    } catch (e) {}
  }, []);

  function handleApprove(id: string) {
    const res = actOnApproval(id, "Approved");
    setApprovals(res.approvals);
    setHistory(res.history);
  }

  function handleReject(id: string) {
    const res = actOnApproval(id, "Rejected");
    setApprovals(res.approvals);
    setHistory(res.history);
  }

  function goToApprovalPage() {
    router.push("/approval");
  }

  function goToHistoryPage() {
    router.push("/history");
  }

  return (
    <div className="space-y-8">
      {/* Top summary donuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {summaryData.map((s) => (
          <div key={s.title} className="bg-white rounded-[10px] shadow-md p-6">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-[16px] font-semibold text-[#0a0a0a]">{s.title}</h3>
              <div className="text-sm text-gray-500">&nbsp;</div>
            </div>

            <div className="flex items-center gap-6 mt-4">
              <Donut size={110} strokeWidth={16} segments={s.segments} />

              <div className="flex-1">
                {s.labels.map((l) => (
                  <div key={l.label} className="flex items-center gap-3 mb-2">
                    <span className="w-3 h-3 rounded-full" style={{ background: l.color }} />
                    <div className="text-sm text-gray-600">{l.value} {l.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Approval Management (highlighted) */}
      <div className="border-2 border-blue-200 rounded-lg p-4 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold">Approval Management <span className="inline-block ml-2 text-sm bg-red-500 text-white rounded-full px-2">{approvals.length}</span></h4>
          <div className="text-sm text-gray-500">Search</div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="py-2 pr-4">ID</th>
                <th className="py-2 pr-4">Category</th>
                <th className="py-2 pr-4">Requestor</th>
                <th className="py-2 pr-4">Department</th>
                <th className="py-2 pr-4">Approval Countdown</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {approvals.map((a) => (
                <tr key={a.id} className="border-t">
                  <td className="py-3 pr-4">{a.id}</td>
                  <td className="py-3 pr-4">{a.category}</td>
                  <td className="py-3 pr-4">{a.requestor}</td>
                  <td className="py-3 pr-4">{a.department}</td>
                  <td className="py-3 pr-4 text-sm text-gray-600">{a.countdown}</td>
                  <td className="py-3 pr-4"><span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">Pending</span></td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1 text-sm border rounded-md bg-white" onClick={() => router.push(`/approval/${a.id}`)}>Detail</button>
                      <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md" onClick={() => handleApprove(a.id)}>Approve</button>
                      <button className="px-3 py-1 text-sm bg-red-50 text-red-600 border border-red-200 rounded-md" onClick={() => handleReject(a.id)}>Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-right mt-3">
          <button className="text-sm text-blue-600" onClick={goToApprovalPage}>More</button>
        </div>
      </div>

      {/* Approval History */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold">Approval History</h4>
          <div className="text-sm text-gray-500">Search</div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="py-2 pr-4">ID</th>
                <th className="py-2 pr-4">Category</th>
                <th className="py-2 pr-4">Requestor</th>
                <th className="py-2 pr-4">Department</th>
                <th className="py-2 pr-4">Request Date</th>
                <th className="py-2 pr-4">Approval Date</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr className="border-t"><td className="py-4" colSpan={8}>-</td></tr>
              ) : (
                history.map((h) => (
                  <tr key={h.id + h.actedAt} className="border-t">
                    <td className="py-3 pr-4">{h.id}</td>
                    <td className="py-3 pr-4">{h.category}</td>
                    <td className="py-3 pr-4">{h.requestor}</td>
                    <td className="py-3 pr-4">{h.department}</td>
                    <td className="py-3 pr-4">{new Date(h.createdAt || h.actedAt).toLocaleDateString()}</td>
                    <td className="py-3 pr-4">{new Date(h.actedAt).toLocaleDateString()}</td>
                    <td className="py-3 pr-4"><span className={`px-2 py-1 rounded-full text-xs ${h.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{h.status}</span></td>
                    <td className="py-3 pr-4"><button className="text-blue-600 text-sm" onClick={() => router.push(`/history/${h.id}`)}>Detail</button></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="text-right mt-3">
          <button className="text-sm text-blue-600" onClick={goToHistoryPage}>More</button>
        </div>
      </div>

      {/* Lower section: My Request + Budget + Trackers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* My Request donuts (smaller) */}
            {summaryData.map((s) => (
              <div key={s.title + "-my"} className="bg-white rounded-[10px] shadow p-4">
                <h5 className="text-sm font-medium mb-3">{s.title}</h5>
                <div className="flex items-center gap-3">
                  <Donut size={80} strokeWidth={12} segments={s.segments} />
                  <div>
                    {s.labels.map((l) => (
                      <div key={l.label} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="w-2 h-2 rounded-full" style={{ background: l.color }} />
                        <span>{l.value} {l.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Travel Budget */}
            <div className="bg-white rounded-[10px] shadow p-4">
              <h5 className="font-medium mb-3">Travel Budget</h5>
              <div className="flex items-center gap-4">
                <Donut size={100} strokeWidth={14} segments={[{ value: 20, color: "#10B981" }, { value: 10, color: "#60A5FA" }, { value: 5, color: "#FBBF24" }]} />
                <div className="text-sm text-gray-700">
                  <div className="mb-2">Initial Budget <span className="font-semibold">Rp 30.000.000</span></div>
                  <div>Remaining Budget <span className="font-semibold">Rp 20.000.000</span></div>
                </div>
              </div>
            </div>

            {/* Active & Upcoming Trips */}
            <div className="bg-white rounded-[10px] shadow p-4">
              <h5 className="font-medium mb-3">Active & Upcoming Trips</h5>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">TTA031 - Moda Eksternal</div>
                    <div className="text-xs text-gray-500">Jakarta - Bali</div>
                  </div>
                  <div className="text-xs text-blue-600">5 hours left</div>
                </li>
                <li className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">TTA032 - Moda Eksternal</div>
                    <div className="text-xs text-gray-500">Bali - Jakarta</div>
                  </div>
                  <div className="text-xs text-yellow-600">3 days left</div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right column: trackers */}
        <div className="space-y-6">
          <div className="bg-white rounded-[10px] shadow p-4">
            <h5 className="font-medium mb-3">Claim & Reimbursement Tracker</h5>
            <table className="text-sm w-full">
              <tbody>
                <tr className="border-t"><td className="py-2">C2025-031</td><td className="py-2">TTA041</td><td className="py-2 text-right"><span className="text-yellow-600">Pending</span></td></tr>
                <tr className="border-t"><td className="py-2">C2025-032</td><td className="py-2">TTA042</td><td className="py-2 text-right"><span className="text-green-600">Approved</span></td></tr>
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-[10px] shadow p-4">
            <h5 className="font-medium mb-3">Request Tracker</h5>
            <table className="text-sm w-full">
              <tbody>
                <tr className="border-t"><td className="py-2">TTA001</td><td className="py-2">Approved</td></tr>
                <tr className="border-t"><td className="py-2">TTA003</td><td className="py-2">Pending</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
