"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getApprovals, actOnApproval, ApprovalItem } from "../../../lib/approvals";

export default function ApprovalDetail({ params }: { params: any }) {
  // Next.js may pass params as a Promise in newer versions. Use React.use when available to unwrap.
  // Fallback to the params object when React.use is not present (migration compatibility).
  // @ts-ignore - React.use may not be typed in this environment
  const resolvedParams = (React as any).use ? (React as any).use(params) : params;
  const { id } = resolvedParams;
  const router = useRouter();
  const [item, setItem] = useState<ApprovalItem | null>(null);

  useEffect(() => {
    try {
      const a = getApprovals().find((x) => x.id === id);
      setItem(a || null);
    } catch (e) {}
  }, [id]);

  if (!item) return (
    <div className="p-6">Approval not found.</div>
  );

  function handleApprove() {
    if (!item) return;
    actOnApproval(item.id, "Approved");
    router.push("/history");
  }

  function handleReject() {
    if (!item) return;
    actOnApproval(item.id, "Rejected");
    router.push("/history");
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Approval Detail</h2>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-3">Employee Information</h3>
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
          <div>Employee Name :</div><div className="text-right">{item.employeeName || item.requestor}</div>
          <div>Employee ID :</div><div className="text-right">{item.employeeId || '-'}</div>
          <div>Departement :</div><div className="text-right">{item.department}</div>
          <div>Position :</div><div className="text-right">{item.position || '-'}</div>
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-3">Travel Request Information</h3>
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
          <div>Request ID :</div><div className="text-right">{item.id}</div>
          <div>Type :</div><div className="text-right">{item.type || '-'}</div>
          <div>Destination :</div><div className="text-right">{item.destination || '-'}</div>
          <div>Departure Date :</div><div className="text-right">{item.departureDate || '-'}</div>
          <div>Transportation :</div><div className="text-right">{item.transportation || '-'}</div>
          <div>Estimated Cost :</div><div className="text-right">{item.estimatedCost || '-'}</div>
        </div>

        <h3 className="text-lg font-semibold mt-6 mb-3">Approval Information</h3>
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
          <div>Request Date :</div><div className="text-right">{(item.requestDate || item.createdAt) ? new Date(item.requestDate || item.createdAt!).toLocaleDateString() : '-'}</div>
          <div>Approval Countdown :</div><div className="text-right">{item.countdown || '-'}</div>
          <div>Status :</div><div className="text-right"><span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">Pending</span></div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={handleApprove}>Approve</button>
          <button className="px-4 py-2 bg-red-100 text-red-700 rounded" onClick={handleReject}>Reject</button>
        </div>
      </div>
    </div>
  );
}
