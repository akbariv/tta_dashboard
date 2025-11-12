"use client";

export type ApprovalItem = {
  id: string;
  category: string;
  requestor: string;
  department: string;
  countdown?: string;
  createdAt?: string;
  // additional travel fields
  employeeName?: string;
  employeeId?: string;
  position?: string;
  type?: string;
  destination?: string;
  departureDate?: string;
  transportation?: string;
  estimatedCost?: string;
  requestDate?: string;
};

export type HistoryItem = ApprovalItem & {
  status: "Approved" | "Rejected" | "Pending";
  actedAt: string;
};

const APPROVALS_KEY = "tta_approvals";
const HISTORY_KEY = "tta_approval_history";

function defaultApprovals(): ApprovalItem[] {
  const now = new Date();
  return [
    {
      id: "TTA003",
      category: "Travel Request",
      requestor: "Alicia Key",
      department: "IT Governance",
      countdown: "Decision required within 24 hours",
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      employeeName: "Alicia Key",
      employeeId: "EMP-2025-034",
      position: "Senior IT Governance Specialist",
      type: "Moda Eksternal",
      destination: "Bandung",
      departureDate: "2025-11-18",
      transportation: "Train",
      estimatedCost: "Rp 250.000",
      requestDate: "2025-10-25",
    },
    {
      id: "TTA010",
      category: "Travel Request",
      requestor: "Budi Santoso",
      department: "Sales",
      countdown: "Approval due in 2 days",
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 1).toISOString(),
      employeeName: "Budi Santoso",
      employeeId: "EMP-2025-041",
      position: "Area Sales Manager",
      type: "Moda Internal",
      destination: "Surabaya",
      departureDate: "2025-11-20",
      transportation: "Flight",
      estimatedCost: "Rp 1.200.000",
      requestDate: "2025-11-10",
    },
    {
      id: "C2025-011",
      category: "Claim Request",
      requestor: "Rudi",
      department: "Finance",
      countdown: "Approval due in 3 days",
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 5).toISOString(),
      employeeName: "Rudi",
      employeeId: "EMP-2025-045",
      position: "Finance Staff",
      type: "Expense - Taxi",
      destination: "Jakarta",
      departureDate: "2025-11-05",
      transportation: "Taxi",
      estimatedCost: "Rp 150.000",
      requestDate: "2025-11-05",
    },
    {
      id: "BKG2025-005",
      category: "Booking Change",
      requestor: "Siti Aminah",
      department: "Operations",
      countdown: "Decision required within 48 hours",
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 12).toISOString(),
      employeeName: "Siti Aminah",
      employeeId: "EMP-2025-052",
      position: "Operations Coordinator",
      type: "Change - Flight Date",
      destination: "Medan",
      departureDate: "2025-12-02",
      transportation: "Flight",
      estimatedCost: "Rp 450.000",
      requestDate: "2025-11-11",
    },
    {
      id: "TTA031",
      category: "Travel Request",
      requestor: "Fajar Pratama",
      department: "Marketing",
      countdown: "Approval due in 6 hours",
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 2).toISOString(),
      employeeName: "Fajar Pratama",
      employeeId: "EMP-2025-060",
      position: "Marketing Executive",
      type: "Moda Eksternal",
      destination: "Bali",
      departureDate: "2025-11-15",
      transportation: "Bus",
      estimatedCost: "Rp 300.000",
      requestDate: "2025-11-12",
    },
  ];
}

export function getApprovals(): ApprovalItem[] {
  try {
    const raw = localStorage.getItem(APPROVALS_KEY);
    if (!raw) {
      const def = defaultApprovals();
      localStorage.setItem(APPROVALS_KEY, JSON.stringify(def));
      return def;
    }
    const parsed = JSON.parse(raw) as ApprovalItem[];
    // If storage contains an empty array (e.g. cleared during development), populate defaults so UI shows demo data
    if (Array.isArray(parsed) && parsed.length === 0) {
      const def = defaultApprovals();
      try { localStorage.setItem(APPROVALS_KEY, JSON.stringify(def)); } catch {}
      return def;
    }
    return parsed;
  } catch (e) {
    const def = defaultApprovals();
    try { localStorage.setItem(APPROVALS_KEY, JSON.stringify(def)); } catch {}
    return def;
  }
}

export function setApprovals(items: ApprovalItem[]) {
  try {
    localStorage.setItem(APPROVALS_KEY, JSON.stringify(items));
  } catch (e) {}
}

export function getHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) {
      localStorage.setItem(HISTORY_KEY, JSON.stringify([]));
      return [];
    }
    return JSON.parse(raw) as HistoryItem[];
  } catch (e) {
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify([])); } catch {}
    return [];
  }
}

export function setHistory(items: HistoryItem[]) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(items));
  } catch (e) {}
}

export function actOnApproval(id: string, status: "Approved" | "Rejected") {
  const approvals = getApprovals();
  const idx = approvals.findIndex((a) => a.id === id);
  if (idx === -1) return { approvals, history: getHistory() };

  const [item] = approvals.splice(idx, 1);
  setApprovals(approvals);

  const history = getHistory();
  const h = {
    ...item,
    status,
    actedAt: new Date().toISOString(),
  } as HistoryItem;
  history.unshift(h);
  setHistory(history);

  return { approvals, history };
}

export function addApproval(item: ApprovalItem) {
  const approvals = getApprovals();
  approvals.unshift(item);
  setApprovals(approvals);
}
