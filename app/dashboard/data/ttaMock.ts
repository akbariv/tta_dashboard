// app/dashboard/data/ttaMock.ts

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

type Emp = { name: string; id: string; department: string; position: string };

export type StaffHistoryRow = {
  id: string;
  bookingId: string;
  category: string;
  requestor: string;
  department: string;
  requestDateISO: string;
  approvalDateISO: string;
  status: "Waiting User's Confirmation";
};

export type TravelOption = {
  id: string;
  label: string;
  className: string;
  departureTime: string;
  arrivalTime: string;
  departureStation: string;
  destinationStation: string;
  price: number;
};

type ApprovalBase = {
  id: string;
  kind: "travel" | "claim";
  employee: Emp;
  approval: {
    requestDateISO: string;
    deadlineISO: string;
    status: "Pending" | "Approved" | "Rejected";
    decisionDateISO?: string;
    reason?: string;
  };
};

export type TravelApproval = ApprovalBase & {
  kind: "travel";
  travel: {
    requestId: string;
    bookingId: string;
    changeId?: string;
    type: "Moda Internal" | "Moda Eksternal";
    destination: string;
    initialDepartureDateISO?: string;
    rescheduleDepartureDateISO?: string;
    departureDateISO: string;
    transportation: string;
    estimatedCost: number;
    extraCost?: number;
    refundAmount?: number;
    lossCost?: number;
    options?: TravelOption[];
  };
};

export type ClaimApproval = ApprovalBase & {
  kind: "claim";
  claim: {
    claimId: string;
    bookingId: string;
    requestId: string;
    expenses: Array<{
      category: string;
      description: string;
      amount: number;
      attachment?: string;
    }>;
  };
};

export type ApprovalDetail = TravelApproval | ClaimApproval;

const DEPT_MULT: Record<Department, number> = {
  All: 1,
  "IT Governance": 1.0,
  Finance: 0.9,
  HRD: 0.8,
  TTA: 1.1,
};

export type ApprovalRow = {
  id: string;
  bookingId: string;
  category: string;
  requestor: string;
  department: string;
  dueInHours?: number;
  dueInDays?: number;
  countdownBadge?: string;
  status?: "Pending" | "Approved" | "Rejected";
};

const currency = (n: number) => Math.round(n);
const addDays = (d: number) =>
  new Date(Date.now() + d * 86400000).toISOString();
const minusDays = (d: number) =>
  new Date(Date.now() - d * 86400000).toISOString();

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

/* ========= APPROVAL (list untuk tabel) ========= */
export const approvalManagement: ApprovalRow[] = [
  {
    id: "TTA003",
    category: "Travel Request",
    requestor: "Alice Key",
    bookingId: "Book2025-331",
    department: "IT Governance",
    dueInHours: 24,
    countdownBadge: "Decision required within 24 hours",
  },
  {
    id: "TTA004",
    category: "Travel Request",
    requestor: "Charles Muntz",
    bookingId: "Book2025-310",
    department: "Karyawan",
    dueInDays: 3,
    countdownBadge: "Approval due in 3 days",
  },
  {
    id: "C2025-010",
    category: "Claim Request",
    requestor: "Rudi",
    bookingId: "Book2025-310",
    department: "IT Governance",
    dueInDays: 2,
    countdownBadge: "Approval due in 2 days",
  },
  // additional dummy management rows so UI shows more items across categories
  {
    id: "TTA005",
    category: "Travel Request",
    requestor: "Sari Amelia",
    bookingId: "Book2025-512",
    department: "TTA",
    dueInDays: 1,
    countdownBadge: "Approval due in 1 day",
  },
  {
    id: "C2025-011",
    category: "Claim Request",
    requestor: "Dedi Kurnia",
    bookingId: "Book2025-418",
    department: "Finance",
    dueInDays: 4,
    countdownBadge: "Approval due in 4 days",
  },
  {
    id: "BC2025-002",
    category: "Booking Changes",
    requestor: "Intan",
    bookingId: "Book2025-602",
    department: "HRD",
    dueInDays: 2,
    countdownBadge: "Approval due in 2 days",
  },

  {
    id: "BK2025-003",
    category: "Refund Request",
    requestor: "Alex Johnson",
    bookingId: "Book2025-155",
    department: "IT Governance",
    dueInDays: 4,
    countdownBadge: "Approval due in 4 days",
  },
];

/* ========= APPROVAL (detail: discriminated union) ========= */
export const APPROVAL_DETAILS: Record<string, ApprovalDetail> = {
  // Travel: Alice Key
  TTA003: {
    id: "TTA003",
    kind: "travel",
    employee: {
      name: "Alice Key",
      id: "EMP-2025-034",
      department: "IT",
      position: "Senior IT Governance Specialist",
    },
    travel: {
      bookingId: "Book2025-331",
      requestId: "TTA003",
      type: "Moda Eksternal",
      destination: "Bandung",
      departureDateISO: "2025-11-18T00:00:00.000Z",
      transportation: "Whoosh",
      estimatedCost: 250_000,
      options: [
        {
          id: "opt-1",
          label: "Option 1",
          className: "Premium Economic",
          departureTime: "11:25 WIB",
          arrivalTime: "12:02 WIB",
          departureStation: "Halim",
          destinationStation: "Padalarang",
          price: 250_000,
        },
        {
          id: "opt-2",
          label: "Option 2",
          className: "Premium Economic",
          departureTime: "06:25 WIB",
          arrivalTime: "07:02 WIB",
          departureStation: "Halim",
          destinationStation: "Padalarang",
          price: 250_000,
        },
      ],
    },
    approval: {
      requestDateISO: "2025-10-25T00:00:00.000Z",
      deadlineISO: addDays(1),
      status: "Pending",
    },
  },

  // Travel: Charles Muntz
  TTA004: {
    id: "TTA004",
    kind: "travel",
    employee: {
      name: "Charles Muntz",
      id: "EMP-2025-057",
      department: "Marketing",
      position: "Senior Marketing",
    },
    travel: {
      bookingId: "Book2025-310",
      requestId: "TTA004",
      type: "Moda Eksternal",
      destination: "Semarang",
      departureDateISO: addDays(7),
      transportation: "Bus",
      estimatedCost: 400_000,
      options: [
        {
          id: "opt-1",
          label: "Option 1",
          className: "Economy",
          departureTime: "08:00 WIB",
          arrivalTime: "14:00 WIB",
          departureStation: "Jakarta (Tanjung Priok)",
          destinationStation: "Semarang (Terminal)",
          price: 400_000,
        },
        {
          id: "opt-2",
          label: "Option 2",
          className: "Economy",
          departureTime: "09:30 WIB",
          arrivalTime: "15:30 WIB",
          departureStation: "Jakarta (Tanjung Priok)",
          destinationStation: "Semarang (Terminal)",
          price: 380_000,
        },
      ],
    },
    approval: {
      requestDateISO: minusDays(2),
      deadlineISO: addDays(3), // sinkron badge "Approval due in 3 days"
      status: "Pending",
    },
  },

  // Travel: Sari Amelia
  TTA005: {
    id: "TTA005",
    kind: "travel",
    employee: {
      name: "Sari Amelia",
      id: "EMP-2025-071",
      department: "TTA",
      position: "Travel Admin",
    },
    travel: {
      bookingId: "Book2025-512",
      requestId: "TTA005",
      type: "Moda Internal",
      destination: "Surabaya",
      departureDateISO: addDays(5),
      transportation: "Kereta API",
      estimatedCost: 400_000,
      options: [
        {
          id: "opt-1",
          label: "Option 1",
          className: "Economy",
          departureTime: "08:00 WIB",
          arrivalTime: "19:00 WIB",
          departureStation: "Jakarta (Pasar Senen)",
          destinationStation: "Surabaya (Gubeng)",
          price: 400_000,
        },
        {
          id: "opt-2",
          label: "Option 2",
          className: "Economy",
          departureTime: "09:30 WIB",
          arrivalTime: "20:30 WIB",
          departureStation: "Jakarta (Pasar Senen)",
          destinationStation: "Surabaya (Gubeng)",
          price: 380_000,
        },
      ],
    },
    approval: {
      requestDateISO: minusDays(1),
      deadlineISO: addDays(1),
      status: "Pending",
    },
  },

  // Claim & Reimburse: Dedi Kurnia
  "C2025-011": {
    id: "C2025-011",
    kind: "claim",
    employee: {
      name: "Dedi Kurnia",
      id: "EMP-2025-062",
      department: "Finance",
      position: "Accounting Staff",
    },
    claim: {
      claimId: "C2025-011",
      bookingId: "Book2025-418",
      requestId: "TTA004",
      expenses: [
        {
          category: "Expense – Taxi",
          description: "Airport transfer",
          amount: 120_000,
          attachment: "TaxiReceipt.pdf",
        },
        {
          category: "Expense – Food",
          description: "Dinner with client",
          amount: 180_000,
          attachment: "RestaurantInvoice.pdf",
        },
      ],
    },
    approval: {
      requestDateISO: minusDays(3),
      deadlineISO: addDays(4),
      status: "Pending",
    },
  },

  // Claim & Reimburse:
  // Rudi
  "C2025-010": {
    id: "C2025-010",
    kind: "claim",
    employee: {
      name: "Rudi",
      id: "EMP-2025-040",
      department: "IT",
      position: "Senior IT Governance Specialist",
    },
    claim: {
      claimId: "C2025-010",
      bookingId: "Book2025-310",
      requestId: "TTA003",
      expenses: [
        {
          category: "Expense – Food",
          description: "Lunch",
          amount: 100_000,
          attachment: "Invoice_Food.pdf",
        },
        { category: "Expense – Taxi", description: "–", amount: 0 },
        { category: "Expense – Others", description: "–", amount: 0 },
      ],
    },
    approval: {
      requestDateISO: "2025-11-01T00:00:00.000Z",
      deadlineISO: "2025-11-05T00:00:00.000Z",
      status: "Pending",
    },
  },
  // Booking Changes: Intan
  "BC2025-002": {
    id: "BC2025-002",
    kind: "travel",
    employee: {
      name: "Intan",
      id: "EMP-2025-071",
      department: "HRD",
      position: "HR Specialist",
    },
    travel: {
      requestId: "BK2025-002",
      bookingId: "Book2025-602",
      changeId: "CH-BK2025-002",
      type: "Moda Eksternal",
      destination: "Jakarta — Surabaya",
      initialDepartureDateISO: "2025-11-15T00:00:00.000Z",
      rescheduleDepartureDateISO: "2025-11-20T00:00:00.000Z",
      departureDateISO: "2025-11-20T00:00:00.000Z",
      transportation: "Flight",
      estimatedCost: 1_200_000,
      extraCost: 0,
    },
    approval: {
      requestDateISO: "2025-11-01T00:00:00.000Z",
      deadlineISO: "2025-11-05T00:00:00.000Z",
      status: "Pending",
    },
  },

  "BK2025-003": {
    id: "BK2025-003",
    kind: "travel",
    employee: {
      name: "Alex Johnson",
      id: "EMP-2025-034",
      department: "IT",
      position: "Senior IT Governance Specialist",
    },
    travel: {
      requestId: "TTA055",
      bookingId: "Book2025-155",
      changeId: "CH-TTA055",
      type: "Moda Eksternal",
      destination: "Bandung",
      departureDateISO: "2025-11-18T00:00:00.000Z",
      transportation: "Whoosh",
      estimatedCost: 250_000,
      refundAmount: 200_000,
      lossCost: 250_000,
    },
    approval: {
      requestDateISO: "2025-11-01T00:00:00.000Z",
      deadlineISO: "2025-11-05T00:00:00.000Z",
      status: "Pending", // nanti jadi Approved setelah di-approve
    },
  },
};

export const approvalDetailById = APPROVAL_DETAILS;

/* ========= Lain-lain (tetap) ========= */
const approvalCards = {
  travelRequest: { approved: 6, pending: 4, rejected: 1 },
  claim: { approved: 6, pending: 0, rejected: 0 },
  booking: { approved: 2, pending: 0, rejected: 3 },
};

const requestTracker = [
  {
    id: "TTA001",
    category: "Travel Req.",
    type: "Moda Eksternal",
    requestDate: "25 Oct 2025",
    status: "Approved",
  },
  {
    id: "TTA002",
    category: "Changes Req.",
    type: "Moda Eksternal",
    requestDate: "29 Oct 2025",
    status: "Approved",
  },
  {
    id: "TTA003",
    category: "Travel Req.",
    type: "Moda Internal",
    requestDate: "29 Oct 2025",
    status: "Pending",
  },
];

const claimTracker = [
  {
    claimId: "C2025-031",
    tripId: "TTA041",
    type: "Expense - Food",
    requestDate: "20 Oct 2025",
    status: "Pending",
  },
  {
    claimId: "C2025-032",
    tripId: "TTA042",
    type: "Expense - Taxi",
    requestDate: "14 Oct 2025",
    status: "Approved",
  },
  {
    claimId: "C2025-033",
    tripId: "TTA045",
    type: "Expense - Taxi",
    requestDate: "29 Oct 2025",
    status: "Approved",
  },
];

const activeTrips = [
  {
    tripId: "TTA031",
    type: "Moda Eksternal",
    destination: "Jakarta - Bali",
    date: "10 Nov 2025",
    countdown: "5 hours left",
  },
  {
    tripId: "TTA032",
    type: "Moda Eksternal",
    destination: "Bali - Jakarta",
    date: "14 Nov 2025",
    countdown: "3 days left",
  },
  {
    tripId: "TTA003",
    type: "Moda Internal",
    destination: "Jakarta - Bandung",
    date: "02 Oct 2025",
    countdown: "5 days left",
  },
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

/* ========= Exported single object ========= */
export const MOCK = {
  approval: {
    cards: approvalCards,
    managementRows: approvalManagement,
    // untuk kompatibilitas dengan kode lama
    detailById: APPROVAL_DETAILS,
    // dummy history rows (approved/rejected items across categories)
    historyRows: [
      {
        id: "TTA001",
        category: "Travel Request",
        requestor: "Budi Santoso",
        department: "TTA",
        requestDateISO: "2025-09-20T00:00:00.000Z",
        approvalDateISO: "2025-09-22T00:00:00.000Z",
        status: "Approved",
      },
      {
        id: "TTA002",
        category: "Travel Request",
        requestor: "Sinta Dewi",
        department: "Finance",
        requestDateISO: "2025-10-01T00:00:00.000Z",
        approvalDateISO: "2025-10-03T00:00:00.000Z",
        status: "Rejected",
      },
      {
        id: "C2025-005",
        category: "Claim Request",
        requestor: "Joko",
        department: "IT Governance",
        requestDateISO: "2025-10-05T00:00:00.000Z",
        approvalDateISO: "2025-10-07T00:00:00.000Z",
        status: "Approved",
      },
      {
        id: "BK2025-001",
        category: "Booking Changes",
        requestor: "Maya",
        department: "HRD",
        requestDateISO: "2025-10-12T00:00:00.000Z",
        approvalDateISO: "2025-10-13T00:00:00.000Z",
        status: "Approved",
      },
    ] as any[],
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

/* ========= Selectors ========= */
export function getYearlyTravelCost(
  dept: Department = "All",
  period: PeriodKey = "2023-2025"
) {
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
    const idx = i;
    return {
      month: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec",
      ][idx],
      amount: currency(baseMonthlyCost[idx] * m),
    };
  });
  if (period === "ytd") {
    const until = now.getMonth() + 1;
    return months.slice(0, until);
  }
  return months;
}

export function getAllRequest(dept: Department = "All") {
  const m = DEPT_MULT[dept];
  return baseAllRequest.map((x) => ({ ...x, value: Math.round(x.value * m) }));
}

export function getApprovalManagementPendingRows(
  base: ApprovalRow[] = approvalManagement
): ApprovalRow[] {
  const decided = loadDecisionStore();
  return base.filter((r) => !decided[r.id]); // yang sudah Approved/Rejected disembunyikan
}

export function getCategorySummary(
  list: Array<{
    id: string;
    category: string;
    status?: "Pending" | "Approved" | "Rejected";
  }>
): Record<string, { approved: number; pending: number; rejected: number }> {
  const applied = applyDecisionsToList(list);
  return applied.reduce((acc, r) => {
    const k = r.category;
    if (!acc[k]) acc[k] = { approved: 0, pending: 0, rejected: 0 };
    acc[k][r.status.toLowerCase() as "approved" | "pending" | "rejected"]++;
    return acc;
  }, {} as Record<string, { approved: number; pending: number; rejected: number }>);
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
  return baseChangeBooking.map((x) => ({
    ...x,
    value: Math.round(x.value * m),
  }));
}

export function getSla() {
  return baseSla;
}

export function getActiveTripStacked(dept: Department = "All") {
  const m = DEPT_MULT[dept];
  return baseActiveTrip.map((x) => ({
    label: x.label,
    internal: Math.round(x.internal * m),
    external: Math.round(x.external * m),
  }));
}

/* ===================== PERSIST & SELECTORS (cross-page) ===================== */

export type DecisionStatus = "Approved" | "Rejected";
export type DecisionRecord = {
  status: DecisionStatus;
  decisionDateISO: string;
  reason?: string;
};

export const DECISION_STORAGE_KEY = "tta_approval_decisions_v1";

/** baca seluruh keputusan yang tersimpan */
export function loadDecisionStore(): Record<string, DecisionRecord> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(DECISION_STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

/** simpan/overwrite keputusan untuk 1 id */
export function persistDecision(id: string, rec: DecisionRecord) {
  const store = loadDecisionStore();
  store[id] = rec;
  try {
    localStorage.setItem(DECISION_STORAGE_KEY, JSON.stringify(store));
    // notify same-window listeners that a decision was persisted
    try {
      window.dispatchEvent(
        new CustomEvent("tta:decision", { detail: { id, rec } })
      );
    } catch (e) {}
  } catch (e) {
    // ignore
  }
}

/** utilities opsional */
export function clearDecision(id: string) {
  const store = loadDecisionStore();
  delete store[id];
  localStorage.setItem(DECISION_STORAGE_KEY, JSON.stringify(store));
}
export function resetAllDecisions() {
  localStorage.removeItem(DECISION_STORAGE_KEY);
}

/** override status dari base data dengan keputusan yang tersimpan */
export function applyDecisionsToList<
  T extends { id: string; status?: "Pending" | "Approved" | "Rejected" }
>(list: T[]): (T & { status: "Pending" | "Approved" | "Rejected" })[] {
  const store = loadDecisionStore();
  return list.map((it) => {
    const rec = store[it.id];
    return {
      ...it,
      status: (rec?.status ?? it.status ?? "Pending") as
        | "Pending"
        | "Approved"
        | "Rejected",
    };
  });
}

export function getPendingApprovals<
  T extends { id: string; status?: "Pending" | "Approved" | "Rejected" }
>(list: T[]) {
  return applyDecisionsToList(list).filter((x) => x.status === "Pending");
}

/** hitung ringkasan per kategori (untuk donut) */
export function countByCategory(
  category: string,
  list: Array<{
    id: string;
    category: string;
    status?: "Pending" | "Approved" | "Rejected";
  }>
) {
  const applied = applyDecisionsToList(
    list.filter((x) => x.category === category)
  );
  let approved = 0,
    rejected = 0,
    pending = 0;
  for (const r of applied) {
    if (r.status === "Approved") approved++;
    else if (r.status === "Rejected") rejected++;
    else pending++;
  }
  return { approved, pending, rejected };
}

// ===== Staff TTA notify store (Request Management -> Request History) =====
export const STAFF_NOTIFY_STORAGE_KEY = "tta_staff_notify_v1";

export type StaffNotifyRecord = {
  notifiedDateISO: string;
  selectedOptionId?: string | null;
};

export function loadStaffNotifyStore(): Record<string, StaffNotifyRecord> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(STAFF_NOTIFY_STORAGE_KEY) ?? "{}");
  } catch {
    return {};
  }
}

export function persistStaffNotify(id: string, rec: StaffNotifyRecord) {
  const store = loadStaffNotifyStore();
  store[id] = rec;
  try {
    localStorage.setItem(STAFF_NOTIFY_STORAGE_KEY, JSON.stringify(store));
    try {
      window.dispatchEvent(
        new CustomEvent("tta:staff-notify", { detail: { id, rec } })
      );
    } catch (e) {}
  } catch (e) {
    // ignore
  }
}

// ===================== STAFF TTA SELECTOR =====================

// baris untuk Request Management di dashboard Staff TTA
export type StaffRequestRow = {
  id: string;
  category: string;
  requestor: string;
  department: string;
  requestDateISO: string;
  approvalDateISO: string;
  approvalStatus: "Approved" | "Pending" | "Rejected";
  priority?: "Low" | "Medium" | "High";
};

/**
 * Ambil semua request yang sudah di-APPROVE HoD,
 * diproyeksikan untuk diproses oleh Staff TTA.
 */
export function getStaffRequestManagementRows(): StaffRequestRow[] {
  const decided = loadDecisionStore();
  const notified = loadStaffNotifyStore();

  return approvalManagement
    .filter((row) => decided[row.id]?.status === "Approved") 
    .filter((row) => !notified[row.id]) 
    .map((row) => {
      const rec = decided[row.id]!;
      const detail = approvalDetailById[row.id] as ApprovalDetail | undefined;

      const requestDateISO =
        detail?.approval?.requestDateISO ?? new Date().toISOString();

 
      let priority: StaffRequestRow["priority"] = "Low";
      if (row.dueInHours && row.dueInHours <= 24) {
        priority = "High";
      } else if (row.dueInDays && row.dueInDays <= 2) {
        priority = "Medium";
      }

      return {
        id: row.id,
        category: row.category,
        requestor: row.requestor,
        department: row.department,
        requestDateISO,
        approvalDateISO: rec.decisionDateISO,
        approvalStatus: rec.status, // pada filter di atas selalu "Approved"
        priority,
      };
    });
}

export function getStaffRequestHistoryRows(): StaffHistoryRow[] {
  const store = loadStaffNotifyStore();

  return Object.entries(store).map(([id, rec]) => {
    const baseRow = approvalManagement.find((r) => r.id === id);
    const detail = approvalDetailById[id] as ApprovalDetail | undefined;

    const requestDateISO =
      detail?.approval?.requestDateISO ?? new Date().toISOString();

    const bookingId =
      detail && detail.kind === "travel"
        ? detail.travel.bookingId
        : detail && detail.kind === "claim"
        ? detail.claim.bookingId
        : baseRow?.bookingId ?? "-";

    const category =
      baseRow?.category ??
      (detail?.kind === "travel" ? "Travel Request" : "Claim Request");

    const requestor = baseRow?.requestor ?? detail?.employee.name ?? "—";
    const department =
      baseRow?.department ?? detail?.employee.department ?? "—";

    return {
      id,
      bookingId,
      category,
      requestor,
      department,
      requestDateISO,
      approvalDateISO: rec.notifiedDateISO,
      status: "Waiting User's Confirmation",
    };
  });
}

