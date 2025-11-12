"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/app/dashboard/components/ui/dialog";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  id?: string | null;
  onConfirm: (id: string, reason?: string) => void;
};

export default function RejectConfirmModal({ open, onOpenChange, id, onConfirm }: Props) {
  const [reason, setReason] = React.useState("");

  React.useEffect(() => {
    if (!open) setReason("");
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white text-slate-900">
        <DialogHeader>
          <DialogTitle>Are you sure you want to reject this approval request?</DialogTitle>
          <DialogDescription>
            If you reject this request, that person will not be able to go on a business trip.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <label className="block text-sm text-slate-600 mb-2">Reason:</label>
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Optional reason"
            className="w-full px-3 py-2 border rounded-lg text-sm outline-none"
          />
        </div>

        <DialogFooter>
          <div className="flex gap-2">
            <button
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 rounded bg-slate-100 text-slate-700"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (id) onConfirm(id, reason || undefined);
                onOpenChange(false);
              }}
              className="px-4 py-2 rounded bg-rose-100 text-rose-700"
            >
              Reject
            </button>
          </div>
        </DialogFooter>
        <DialogClose />
      </DialogContent>
    </Dialog>
  );
}
