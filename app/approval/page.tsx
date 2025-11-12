"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getApprovals, actOnApproval, ApprovalItem } from "../../lib/approvals";

export default function ApprovalPage() {
  const [approvals, setApprovals] = useState<ApprovalItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    try {
      setApprovals(getApprovals());
    } catch (e) {}
  }, []);

  function handleApprove(id: string) {
    const res = actOnApproval(id, "Approved");
    setApprovals(res.approvals);
  }

  function handleReject(id: string) {
    const res = actOnApproval(id, "Rejected");
    setApprovals(res.approvals);
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Approval Management</h2>

      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-500">Period</div>
          <div className="text-sm text-gray-500">Status</div>
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
                  <td className="py-3 pr-4">{a.countdown}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1 text-sm border rounded-md" onClick={() => router.push(`/approval/${a.id}`)}>Detail</button>
                      <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md" onClick={() => handleApprove(a.id)}>Approve</button>
                      <button className="px-3 py-1 text-sm bg-red-50 text-red-600 border border-red-200 rounded-md" onClick={() => handleReject(a.id)}>Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
