// approval_detail_view.tsx
"use client";

import * as React from "react";
import {
  approvalDetailById,
  loadDecisionStore,
  type ApprovalDetail,
  type TravelApproval,
  type ClaimApproval,
} from "@/app/dashboard/data/ttaMock";
import TravelRequest from "./detailsection/travel_request";
import ReimbursementRequest from "./detailsection/reimbursement_request";
import RejectConfirmModal from "@/app/dashboard/components/approval/reject_confirm";

type Row = {
  id: string;
  category: string;
  requestor: string;
  department: string;
  status: "Pending" | "Approved" | "Rejected";
  countdownISO: string;
  countdownBadge?: string;
  bookingId?: string;
};

type Props = {
  row: Row;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (id: string, reason?: string) => void;
};

// ...imports & types tetap

export default function ApprovalDetailView(props: Props) {
  const raw = approvalDetailById[props.row.id] as ApprovalDetail | undefined;

  // robust claim detection
  const isClaim =
    (raw && raw.kind === "claim") ||
    /claim/i.test(props.row.category) ||
    props.row.id.startsWith("C");

  // ====== STATE SHARED ======
  const [row, setRow] = React.useState<Row>(props.row);
  React.useEffect(() => setRow(props.row), [props.row.id]);

  // ====== TRAVEL detail (and fallback) ======
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
            bookingId: props.row.bookingId ?? "—", // <-- wajib ada sekarang
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

  // ====== CLAIM detail (and fallback) ======
  const initialClaim: ClaimApproval =
    raw && raw.kind === "claim"
      ? (raw as ClaimApproval)
      : {
          id: props.row.id,
          kind: "claim",
          employee: {
            name: props.row.requestor,
            id: "—",
            department: props.row.department,
            position: "—",
          },
          claim: {
            claimId: props.row.id,
            bookingId: props.row.bookingId ?? "—", // <-- ikutkan juga
            requestId: "—",
            expenses: [],
          },
          approval: {
            requestDateISO: new Date().toISOString(),
            deadlineISO: props.row.countdownISO,
            status: props.row.status,
          },
        };

  // ====== merge persisted decision (both types) ======
  try {
    const store = loadDecisionStore();
    const rec = store[props.row.id];
    if (rec) {
      (initialTravel.approval as any) = {
        ...initialTravel.approval,
        status: rec.status,
        decisionDateISO: rec.decisionDateISO,
        reason: rec.reason,
      };
      (initialClaim.approval as any) = {
        ...initialClaim.approval,
        status: rec.status,
        decisionDateISO: rec.decisionDateISO,
        reason: rec.reason,
      };
    }
  } catch {}

  const [travelDetail, setTravelDetail] =
    React.useState<TravelApproval>(initialTravel);
  const [claimDetail, setClaimDetail] =
    React.useState<ClaimApproval>(initialClaim);
  const [decidedHere, setDecidedHere] = React.useState(false);

  React.useEffect(() => {
    setTravelDetail(initialTravel);
    setClaimDetail(initialClaim);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.row.id]);

  // ====== local approve/reject (updates badge without leaving page) ======
  const approveLocal = () => {
    if (isClaim) {
      setClaimDetail((d) => ({
        ...d,
        approval: {
          ...(d.approval as any),
          status: "Approved",
          decisionDateISO: new Date().toISOString(),
        } as any,
      }));
    } else {
      setTravelDetail((d) => ({
        ...d,
        approval: {
          ...(d.approval as any),
          status: "Approved",
          decisionDateISO: new Date().toISOString(),
        } as any,
      }));
    }
    setRow((r) => ({ ...r, status: "Approved" }));
  };

  const rejectLocal = (reason?: string) => {
    if (isClaim) {
      setClaimDetail((d) => ({
        ...d,
        approval: {
          ...(d.approval as any),
          status: "Rejected",
          decisionDateISO: new Date().toISOString(),
          reason,
        } as any,
      }));
    } else {
      setTravelDetail((d) => ({
        ...d,
        approval: {
          ...(d.approval as any),
          status: "Rejected",
          decisionDateISO: new Date().toISOString(),
          reason,
        } as any,
      }));
    }
    setRow((r) => ({ ...r, status: "Rejected" }));
  };

  // ====== close behavior (bubble to parent only when decided) ======
  const handleClose = () => {
    if (decidedHere) {
      props.onClose();
      return;
    }
    if (row.status === "Approved") props.onApprove(row.id);
    else if (row.status === "Rejected") props.onReject(row.id);
    props.onClose();
  };

  const [rejectModalOpen, setRejectModalOpen] = React.useState(false);

  // ====== RENDER: choose the correct detail UI ======
  if (isClaim) {
    return (
      <>
        <ReimbursementRequest
          row={row}
          detail={claimDetail}
          onClose={handleClose}
          onApprove={() => approveLocal()}
          onReject={() => setRejectModalOpen(true)}
        />
        <RejectConfirmModal
          open={rejectModalOpen}
          onOpenChange={setRejectModalOpen}
          id={row.id}
          onConfirm={(_, reason) => {
            rejectLocal(reason);
            props.onReject(row.id, reason);
            setDecidedHere(true);
          }}
        />
      </>
    );
  }

  // Travel UI
  return (
    <>
      <TravelRequest
        row={row}
        detail={travelDetail}
        onClose={handleClose}
        onApprove={() => approveLocal()}
        onReject={(id, reason) => {
          props.onReject(id, reason);
          setDecidedHere(true);
        }}
      />
      <RejectConfirmModal
        open={rejectModalOpen}
        onOpenChange={setRejectModalOpen}
        id={row.id}
        onConfirm={(_, reason) => {
          rejectLocal(reason);
          props.onReject(row.id);
          // props.onClose();
        }}
      />
    </>
  );
}
