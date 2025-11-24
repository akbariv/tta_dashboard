"use client";

import { useEffect } from "react";
import {
  resetAllDecisions,
  seedTravelConfirmationFromApprovals,
  TRAVEL_CONFIRMATION_STORAGE_KEY,
  HOD_NOTIFY_STORAGE_KEY,
} from "@/app/dashboard/data/ttaMock";

export default function DevLocalReset() {
  useEffect(() => {
    try {
      // Only run in development mode
      if (process.env.NODE_ENV !== "development") return;

      // Run once per browser session to avoid clearing on every navigation
      if (typeof sessionStorage === "undefined") return;
      if (sessionStorage.getItem("tta_dev_cleared_v1")) return;

      try {
        // clear decision/store keys and HOD notify
        resetAllDecisions();
      } catch (e) {
        // ignore
      }

      try {
        localStorage.removeItem(TRAVEL_CONFIRMATION_STORAGE_KEY);
      } catch (e) {}

      try {
        localStorage.removeItem(HOD_NOTIFY_STORAGE_KEY);
      } catch (e) {}

      // reseed travel confirmations from approval data so dev starts from known state
      try {
        seedTravelConfirmationFromApprovals();
      } catch (e) {}

      try {
        sessionStorage.setItem("tta_dev_cleared_v1", String(Date.now()));
      } catch (e) {}
    } catch (e) {}
  }, []);

  return null;
}
