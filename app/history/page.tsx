"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getHistory, HistoryItem } from "../../lib/approvals";

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    try {
      setHistory(getHistory());
    } catch (e) {}
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Approval History</h2>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-500">Period</div>
          <div className="text-sm text-gray-500">Status</div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="py-2 pr-4">Request ID</th>
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
      </div>
    </div>
  );
}
