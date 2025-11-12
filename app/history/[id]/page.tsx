"use client";

import React, { useEffect, useState } from "react";
import { getHistory, HistoryItem } from "../../../lib/approvals";

export default function HistoryDetail({ params }: { params: any }) {
  // Next.js may pass params as a Promise in newer versions. Use React.use when available to unwrap.
  // Fallback to the params object when React.use is not present (migration compatibility).
  // @ts-ignore - React.use may not be typed in this environment
  const resolvedParams = (React as any).use ? (React as any).use(params) : params;
  const { id } = resolvedParams;
  const [item, setItem] = useState<HistoryItem | null>(null);

  useEffect(() => {
    try {
      const h = getHistory().find((x) => x.id === id);
      setItem(h || null);
    } catch (e) {}
  }, [id]);

  if (!item) return <div className="p-6">History item not found.</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">History - Travel Approval Detail</h2>

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
          <div>Request Date :</div><div className="text-right">{item.requestDate || item.createdAt ? new Date(item.requestDate || item.createdAt!).toLocaleDateString() : '-'}</div>
          <div>Approval Date :</div><div className="text-right">{new Date(item.actedAt).toLocaleDateString()}</div>
          <div>Status :</div><div className="text-right"><span className={`px-2 py-1 rounded-full text-xs ${item.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{item.status}</span></div>
        </div>
      </div>
    </div>
  );
}
