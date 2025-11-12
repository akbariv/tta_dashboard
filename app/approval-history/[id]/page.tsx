"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import ApprovalDetailView from "@/app/dashboard/components/approval/approval_detail_view";
import { approvalDetailById, approvalManagement, loadDecisionStore } from "@/app/dashboard/data/ttaMock";

type Row = {
  id: string;
  category: string;
  requestor: string;
  department: string;
  status: "Approved" | "Rejected";
  countdownISO: string;
};

function buildRow(id: string): Row | null {
  const store = loadDecisionStore();
  const rec = store[id];
  if (!rec) return null;
  const d = approvalDetailById[id] as any | undefined;
  const base = approvalManagement.find((x) => x.id === id) as any | undefined;
  const category = base?.category ?? (d?.kind === "travel" ? "Travel Request" : "Claim Request");
  const requestor = base?.requestor ?? d?.employee?.name ?? "-";
  const department = base?.department ?? d?.employee?.department ?? "-";
  const countdownISO = d?.approval?.deadlineISO ?? new Date().toISOString();
  return {
    id,
    category,
    requestor,
    department,
    status: rec.status,
    countdownISO,
  } as Row;
}

export default function HistoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string | undefined;
  const [row, setRow] = React.useState<Row | null>(() => (id ? buildRow(id) : null));

  React.useEffect(() => {
    if (id) setRow(buildRow(id));
  }, [id]);

  if (!id || !row) {
    return (
      <div className="p-6">
        <div className="text-slate-600">No data or invalid id</div>
        <div className="mt-4">
          <button className="px-3 py-2 rounded bg-[#bdd5fd]" onClick={() => router.push("/approval-history")}>Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2">
      <ApprovalDetailView
        row={{ ...row, countdownISO: row.countdownISO }}
        onClose={() => router.push("/approval-history")}
        onApprove={() => {}}
        onReject={() => {}}
      />
    </div>
  );
}
