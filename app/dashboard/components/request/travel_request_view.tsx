"use client";

import * as React from "react";
import {
  getStaffRequestManagementRows,
  type StaffRequestRow,
} from "@/app/dashboard/data/ttaMock";
import { Card, SearchInput, StatusBadge, PriorityBadge, DetailsButton } from "@/app/dashboard/components/common";

export default function TravelRequestView() {
  const [rows, setRows] = React.useState<StaffRequestRow[]>([]);

  React.useEffect(() => {
    setRows(getStaffRequestManagementRows());
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-[28px] font-semibold text-[#202224]">
        Approval Detail
      </h1>

      <Card
        title={
          <div className="inline-flex items-center gap-2">
            <span>Approval Management</span>
            <span className="w-5 h-5 text-[11px] rounded-full bg-rose-500 text-white grid place-items-center">
              {rows.length}
            </span>
          </div>
        }
        right={<SearchInput placeholder="Search" size="sm" />}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="py-2">ID</th>
                <th className="py-2">Category</th>
                <th className="py-2">Requestor</th>
                <th className="py-2">Department</th>
                <th className="py-2">Request Date</th>
                <th className="py-2">Approval Date</th>
                <th className="py-2">Status Approval</th>
                <th className="py-2">Priority</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody className="text-slate-700">
              {rows.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="py-2">{r.id}</td>
                  <td className="py-2">{r.category}</td>
                  <td className="py-2">{r.requestor}</td>
                  <td className="py-2">{r.department}</td>
                  <td className="py-2">
                    {new Date(r.requestDateISO).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-2">
                    {new Date(r.approvalDateISO).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-2">
                    <StatusBadge s={r.approvalStatus} />
                  </td>
                  <td className="py-2">
                    {r.priority ? <PriorityBadge level={r.priority} /> : "-"}
                  </td>
                  <td className="py-2">
                    <DetailsButton
                      label="Detail"
                      onClick={() => {
                        // kalau mau, bisa reuse StaffTravelRequestDetail di sini juga
                      }}
                    />
                  </td>
                </tr>
              ))}

              {rows.length === 0 && (
                <tr className="border-t">
                  <td colSpan={9} className="py-3">
                    <div className="text-center text-slate-500">
                      No approved request yet
                    </div>
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
