// approval_detail_view.tsx
"use client";

import * as React from "react";
import {
  approvalDetailById,
  type ApprovalDetail,
  type TravelApproval,
  type ClaimApproval,
} from "@/app/dashboard/data/ttaMock";
import TravelRequest from "./detailsection/travel_request";
import ReimbursementRequest from "./detailsection/reimbursement_request";

type Row = {
  id: string;
  category: string;
  requestor: string;
  department: string;
  status: "Pending" | "Approved" | "Rejected";
  countdownISO: string;
  countdownBadge?: string;
};

type Props = {
  row: Row;
  onClose: () => void;
  onApprove: (id: string) => void; // <- biarkan ada, tapi TIDAK kita panggil dulu
  onReject: (id: string) => void;
};

// ...imports & types tetap

export default function ApprovalDetailView(props: Props) {
  const raw = approvalDetailById[props.row.id] as ApprovalDetail | undefined;
  const isClaim = raw?.kind === "claim" || /claim/i.test(props.row.category);

  // ==== TRAVEL path (pakai state lokal) ====
  const initialTravel: TravelApproval =
    raw && raw.kind === "travel"
      ? (raw as TravelApproval)
      : {
          id: props.row.id,
          kind: "travel",
          employee: {
            name: props.row.requestor,
            id: "—",
            department: props.row.department,
            position: "—",
          },
          travel: {
            requestId: props.row.id,
            type: "Moda Eksternal",
            destination: "—",
            departureDateISO: props.row.countdownISO,
            transportation: "—",
            estimatedCost: 0,
          },
          approval: {
            requestDateISO: new Date().toISOString(),
            deadlineISO: props.row.countdownISO,
            status: props.row.status,
          },
        };

  const [detail, setDetail] = React.useState<TravelApproval>(initialTravel);
  const [row, setRow] = React.useState<Row>(props.row);

  React.useEffect(() => {
    setDetail(initialTravel);
    setRow(props.row);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.row.id]);

  // === approve/reject LOKAL (tetap di halaman detail) ===
  const approveLocal = (id: string) => {
    setDetail(d => ({
      ...d,
      approval: {
        ...d.approval,
        status: "Approved",
        decisionDateISO: new Date().toISOString(),
      } as any,
    }));
    setRow(r => ({ ...r, status: "Approved" }));
  };

  const rejectLocal = (id: string) => {
    setDetail(d => ({
      ...d,
      approval: {
        ...d.approval,
        status: "Rejected",
        decisionDateISO: new Date().toISOString(),
        // reason sudah diisi di komponen detail (kalau ada)
      } as any,
    }));
    setRow(r => ({ ...r, status: "Rejected" }));
  };

  // === saat CLOSE: baru propagate ke parent agar baris di list DIHAPUS ===
  const handleClose = () => {
    if (row.status === "Approved") props.onApprove(row.id);
    else if (row.status === "Rejected") props.onReject(row.id);
    props.onClose();
  };

  return (
    <TravelRequest
      row={row}
      detail={detail}
      onClose={handleClose}     // <— penting: close menghapus baris bila sudah decided
      onApprove={approveLocal}  // <— tidak menutup halaman
      onReject={rejectLocal}    // <— tidak menutup halaman
    />
  );
}

