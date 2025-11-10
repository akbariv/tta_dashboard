"use client";
import DashboardKaryawan from "./dashboard_karyawan";
import DashboardStaffTTA from "./dashboard_staff_tta";

function normalizeRole(role?: string) {
  return (role ?? "").trim().toLowerCase().replace(/\s+/g, "_");
}

export default function RoleDashboard({ role }: { role?: string }) {
  switch (normalizeRole(role)) {
    case "staff_tta":
      return <DashboardStaffTTA />;
    // tambahin case lain nanti: "hod", "management_team", dll.
    case "karyawan":
    default:
      return <DashboardKaryawan />;
  }
}
