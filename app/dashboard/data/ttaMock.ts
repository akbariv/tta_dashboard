// PUSAT DUMMY DATA + SELECTOR UNTUK 4 SECTION

/* ========= Types & constants ========= */
export type Department = "All" | "IT Governance" | "Finance" | "HRD" | "TTA";
export type PeriodKey = "2023-2025" | "last-12" | "ytd";

export const DEPARTMENTS: Department[] = [
  "All",
  "IT Governance",
  "Finance",
  "HRD",
  "TTA",
];

const DEPT_MULT: Record<Department, number> = {
  All: 1,
  "IT Governance": 1.0,
  Finance: 0.9,
  HRD: 0.8,
  TTA: 1.1,
};

const currency = (n: number) => Math.round(n);

/* ========= Base dataset (single source) ========= */
const baseYearlyCost = [
  { year: 2023, amount: 100_000_000 },
  { year: 2024, amount: 130_000_000 },
  { year: 2025, amount: 120_000_000 },
];

const baseMonthlyCost = [
  40, 60, 80, 90, 120, 150, 140, 170, 110, 95, 85, 70,
].map((v) => v * 1_000_000);

const baseAllRequest = [
  { label: "Travel", value: 10 },
  { label: "Claim & Reimburse", value: 6 },
  { label: "Change Booking", value: 5 },
];

const baseApprovalTrend = [
  { label: "Travel Request", approved: 10, pending: 2, rejected: 1 },
  { label: "Claim & Reimburse Request", approved: 6, pending: 1, rejected: 0 },
  { label: "Change Booking Request", approved: 5, pending: 1, rejected: 1 },
];

const baseChangeBooking = [
  { label: "Reschedule", value: 2 },
  { label: "Cancel & Refund", value: 1 },
  { label: "Cancel & No Refund", value: 1 },
];

const baseSla = { complete: 92, nonCompliance: 8 };

const baseActiveTrip = [
  { label: "Active Trip", internal: 1, external: 2 },
  { label: "Upcoming Trip", internal: 2, external: 2 },
];

const approvalCards = {
  travelRequest: { approved: 6, pending: 4, rejected: 1 },
  claim: { approved: 6, pending: 0, rejected: 0 },
  booking: { approved: 2, pending: 0, rejected: 3 },
};

const approvalManagement = [
  {
    id: "TTA003",
    category: "Travel Request",
    requestor: "Alice Key",
    department: "IT Governance",
    countdownBadge: "Decision required within 24 hours",
    dueInHours: 24,
  },
  {
    id: "C2025-010",
    category: "Claim Request",
    requestor: "Rudi",
    department: "IT Governance",
    countdownBadge: "Approval due in 2 days",
    dueInDays: 2,
  },
];

const requestTracker = [
  { id: "TTA001", category: "Travel Req.", type: "Moda Eksternal", requestDate: "25 Oct 2025", status: "Approved" },
  { id: "TTA002", category: "Changes Req.", type: "Moda Eksternal", requestDate: "29 Oct 2025", status: "Approved" },
  { id: "TTA003", category: "Travel Req.", type: "Moda Internal", requestDate: "29 Oct 2025", status: "Pending" },
];

const claimTracker = [
  { claimId: "C2025-031", tripId: "TTA041", type: "Expense - Food", requestDate: "20 Oct 2025", status: "Pending" },
  { claimId: "C2025-032", tripId: "TTA042", type: "Expense - Taxi", requestDate: "14 Oct 2025", status: "Approved" },
  { claimId: "C2025-033", tripId: "TTA045", type: "Expense - Taxi", requestDate: "29 Oct 2025", status: "Approved" },
];

const activeTrips = [
  { tripId: "TTA031", type: "Moda Eksternal", destination: "Jakarta - Bali", date: "10 Nov 2025", countdown: "5 hours left" },
  { tripId: "TTA032", type: "Moda Eksternal", destination: "Bali - Jakarta", date: "14 Nov 2025", countdown: "3 days left" },
  { tripId: "TTA003", type: "Moda Internal", destination: "Jakarta - Bandung", date: "02 Oct 2025", countdown: "5 days left" },
];

const travelBudget = {
  initial: 30_000_000,
  remaining: 20_000_000,
  used: 10_000_000,
  refunded: 5_000_000,
  loss: 5_000_000,
};

const deptBudget = {
  initial: 150_000_000,
  remaining: 100_000_000,
  used: 40_000_000,
  refunded: 15_000_000,
  loss: 5_000_000,
};

const transportMapMarkers = [
  { id: "blibli-hq", name: "Blibli Head Office", lat: -6.2115, lng: 106.8219 },
  { id: "gold-coast", name: "Gold Coast Office", lat: -6.1047, lng: 106.7416 },
];

const transportRows = [
  {
    vehicleId: "INT-001",
    requestId: "REQ-2201",
    bookingId: "BK-991",
    requestor: "Akbar",
    department: "IT Governance",
    startFrom: "Blibli HQ",
    to: "Soekarno-Hatta",
    departDate: "2025-11-10 08:00",
    status: "On Route",
  },
];

/* ========= Exported single object (optional) ========= */
export const MOCK = {
  approval: {
    cards: approvalCards,
    managementRows: approvalManagement,
    historyRows: [] as any[],
  },
  myRequest: {
    cards: {
      travelRequest: { approved: 6, pending: 2, rejected: 2 },
      claim: { approved: 6, pending: 3, rejected: 2 },
      booking: { approved: 3, pending: 2, rejected: 1 },
    },
    travelBudget,
    activeTrips,
    claimTracker,
    requestTracker,
  },
  internalTransport: {
    markers: transportMapMarkers,
    rows: transportRows,
  },
  deptKpi: {
    budget: deptBudget,
    monthlyCost: baseMonthlyCost,
    yearlyCost: baseYearlyCost,
    allRequest: baseAllRequest,
    changeBooking: baseChangeBooking,
    approvalTrend: baseApprovalTrend,
    sla: baseSla,
    activeTrip: baseActiveTrip,
  },
};

/* ========= Selectors (filter by dept & period) ========= */
export function getYearlyTravelCost(
  dept: Department = "All",
  period: PeriodKey = "2023-2025"
) {
  // untuk demo: scale by dept; period "2023-2025" hanya mengembalikan base
  const m = DEPT_MULT[dept];
  return baseYearlyCost.map((d) => ({ ...d, amount: currency(d.amount * m) }));
}

export function getMonthlyTravelCost(
  dept: Department = "All",
  period: PeriodKey = "last-12"
) {
  const m = DEPT_MULT[dept];
  const now = new Date();
  const months = Array.from({ length: 12 }).map((_, i) => {
    const idx = i; // 0..11
    return {
      month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"][idx],
      amount: currency(baseMonthlyCost[idx] * m),
    };
  });
  if (period === "ytd") {
    const until = now.getMonth() + 1; // 1..12
    return months.slice(0, until);
  }
  return months;
}

export function getAllRequest(dept: Department = "All") {
  const m = DEPT_MULT[dept];
  return baseAllRequest.map((x) => ({ ...x, value: Math.round(x.value * m) }));
}

export function getApprovalTrend(dept: Department = "All") {
  const m = DEPT_MULT[dept];
  return baseApprovalTrend.map((x) => ({
    label: x.label,
    approved: Math.round(x.approved * m),
    pending: Math.round(x.pending * m),
    rejected: Math.round(x.rejected * m),
  }));
}

export function getChangeBooking(dept: Department = "All") {
  const m = DEPT_MULT[dept];
  return baseChangeBooking.map((x) => ({ ...x, value: Math.round(x.value * m) }));
}

export function getSla() {
  return baseSla; // tetap sama untuk demo
}

export function getActiveTripStacked(dept: Department = "All") {
  const m = DEPT_MULT[dept];
  return baseActiveTrip.map((x) => ({
    label: x.label,
    internal: Math.round(x.internal * m),
    external: Math.round(x.external * m),
  }));
}
