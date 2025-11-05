import { QAItem } from "./types";

// waktu HH:MM lokal
export const nowTime = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

// ---------- parser form "external" ----------
export const parseExternalForm = (raw: string) => {
  const s = raw.replace(/\s+/g, " ").trim();
  const LABELS =
    "(?:destination|tujuan|departure\\s*date|tanggal\\s*berangkat|transportation|transportasi|estimated\\s*cost|perkiraan\\s*biaya)";

  const pick = (labelAlt: string) => {
    const rgx = new RegExp(
      `${labelAlt}\\s*[:\\-\\?]?\\s*(.+?)(?=\\s*${LABELS}\\b|$)`,
      "i"
    );
    return s.match(rgx)?.[1]?.trim();
  };

  const destination = pick("(?:destination|tujuan)");
  const date = pick("(?:departure\\s*date|tanggal\\s*berangkat)");
  const transport = pick("(?:transportation|transportasi)");
  const cost = pick("(?:estimated\\s*cost|perkiraan\\s*biaya)");

  if (!destination && !date && !transport && !cost) return null;

  return {
    destination: destination ?? "-",
    date: date ?? "-",
    transport: transport ?? "-",
    cost: cost ?? "-",
  };
};

// ---------- normalisasi & validasi tanggal ----------
const MONTHS: Record<string, number> = {
  jan: 1,
  january: 1,
  januari: 1,
  feb: 2,
  february: 2,
  februari: 2,
  mar: 3,
  march: 3,
  maret: 3,
  apr: 4,
  april: 4,
  may: 5,
  mei: 5,
  jun: 6,
  june: 6,
  juni: 6,
  jul: 7,
  july: 7,
  juli: 7,
  aug: 8,
  august: 8,
  agustus: 8,
  sep: 9,
  sept: 9,
  september: 9,
  oct: 10,
  october: 10,
  oktober: 10,
  okt: 10,
  nov: 11,
  november: 11,
  nopember: 11,
  dec: 12,
  december: 12,
  desember: 12,
  des: 12,
};

export const normalizeToISO = (raw: string): string | null => {
  if (!raw) return null;
  const s = raw.trim().replace(/\s+/g, " ");

  let m = s.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
  if (m) {
    const [_, y, mo, d] = m;
    const iso = `${y}-${String(+mo).padStart(2, "0")}-${String(+d).padStart(
      2,
      "0"
    )}`;
    return Number.isNaN(Date.parse(iso)) ? null : iso;
  }

  m = s.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (m) {
    const [_, d, mo, y] = m;
    const iso = `${y}-${String(+mo).padStart(2, "0")}-${String(+d).padStart(
      2,
      "0"
    )}`;
    return Number.isNaN(Date.parse(iso)) ? null : iso;
  }

  m = s.match(/^(\d{1,2})\s+([A-Za-z\.]+)\s+(\d{4})$/);
  if (m) {
    const d = +m[1];
    const key = m[2].toLowerCase().replace(/\./g, "");
    const y = +m[3];
    const mo = MONTHS[key] ?? MONTHS[key.slice(0, 3)];
    if (!mo) return null;
    const iso = `${y}-${String(mo).padStart(2, "0")}-${String(d).padStart(
      2,
      "0"
    )}`;
    return Number.isNaN(Date.parse(iso)) ? null : iso;
  }

  const t = Date.parse(s);
  if (!Number.isNaN(t)) {
    const d = new Date(t);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;
  }
  return null;
};

export const validateDepartureDate = (
  dateStr: string,
  mode: ">=today" | "today-only" = ">=today"
): { ok: boolean; reason?: string; iso?: string } => {
  const iso = normalizeToISO(dateStr);
  if (!iso) {
    return {
      ok: false,
      reason: "Invalid date format. Use 2025-11-05 or 5 November 2025.",
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(iso);
  d.setHours(0, 0, 0, 0);

  if (mode === "today-only") {
    if (d.getTime() !== today.getTime()) {
      return { ok: false, reason: "Departure date can only be today." };
    }
  } else {
    if (d < today) {
      return { ok: false, reason: "Departure date cannot be in the past." };
    }
  }
  return { ok: true, iso };
};

// ---------- Quick Action items ----------
export const qaItems: QAItem[] = [
  {
    title: "Submit Travel Request",
    desc: "Start a new business travel plan",
    bg: "bg-[#dbeafe]",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M15.305 1.09675C15.0715 0.71725 14.6647 0.5 14.1885 0.5C13.9115 0.5 13.6265 0.573 13.3415 0.71675C12.3777 1.20375 11.151 2.08375 9.86374 3.1965L7.25224 2.90625L7.72549 2.43275L7.24824 1.95525L6.39274 2.8105L3.66999 2.50825L4.23749 1.94075L3.75974 1.463L2.81049 2.41275L0.817987 2.19125C0.325987 2.1365 0.420987 3.373 0.992987 3.63975L6.71024 6.30475C5.60824 7.536 4.12174 9.35375 3.57274 10.7475L1.06549 10.469C0.895987 10.4505 0.928487 10.8752 1.12524 10.967C2.39049 11.5565 3.05449 11.8663 3.40349 12.029C3.41149 12.0553 3.42224 12.0803 3.43249 12.1053C2.95149 12.686 2.68124 13.1265 2.77899 13.2235C2.87549 13.3197 3.31349 13.051 3.89174 12.5715C3.91774 12.5825 3.94474 12.5933 3.97374 12.6025L5.03274 14.8752C5.12474 15.0722 5.54974 15.104 5.53099 14.935L5.25374 12.4347C6.46899 11.9487 8.13399 10.708 9.69974 9.299L12.3595 15.0065C12.6265 15.5798 13.8635 15.6737 13.8087 15.1812L13.5872 13.1885L14.5365 12.2395L14.0587 11.7618L13.4917 12.329L13.1895 9.606L14.0442 8.7515L13.5665 8.2735L13.0937 8.7465L12.8037 6.13625C13.917 4.849 14.797 3.62225 15.2835 2.6585C15.5647 2.10025 15.5725 1.531 15.305 1.09675Z"
          fill="#193CB8"
        />
      </svg>
    ),
  },
  {
    title: "Claim & Reimburse",
    desc: "Submit travel expense",
    bg: "bg-[#dcfce7]",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M8 1.33325V14.6666"
          stroke="#016630"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.3333 3.33325H6.33333C5.71449 3.33325 5.121 3.57908 4.68342 4.01667C4.24583 4.45425 4 5.04775 4 5.66659C4 6.28542 4.24583 6.87892 4.68342 7.3165C5.121 7.75409 5.71449 7.99992 6.33333 7.99992H9.66667C10.2855 7.99992 10.879 8.24575 11.3166 8.68334C11.7542 9.12092 12 9.71441 12 10.3333C12 10.9521 11.7542 11.5456 11.3166 11.9832C10.879 12.4208 10.2855 12.6666 9.66667 12.6666H4"
          stroke="#016630"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Reschedule / Cancel Trip",
    desc: "Adjust your existing booking",
    bg: "bg-[#f3e8ff]",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M8 4V8L10.6667 9.33333"
          stroke="#6E11B0"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.00001 14.6666C11.6819 14.6666 14.6667 11.6818 14.6667 7.99992C14.6667 4.31802 11.6819 1.33325 8.00001 1.33325C4.31811 1.33325 1.33334 4.31802 1.33334 7.99992C1.33334 11.6818 4.31811 14.6666 8.00001 14.6666Z"
          stroke="#6E11B0"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Check Booking Status",
    desc: "View your current trip and approval status",
    bg: "bg-[#ffedd4]",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden
        className="block"
      >
        <circle cx="8" cy="8" r="6.333" stroke="#9F2D00" strokeWidth="1.333" />
        <path
          d="M8 4.8v4.2"
          stroke="#9F2D00"
          strokeWidth="1.333"
          strokeLinecap="round"
        />
        <circle cx="8" cy="11.6" r="0.8" fill="#9F2D00" />
      </svg>
    ),
  },
  {
    title: "Company Policies",
    desc: "Access travel & accommodation rules",
    bg: "bg-[#cbfbf1]",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M3.99999 14.6666C3.64637 14.6666 3.30723 14.5261 3.05718 14.2761C2.80713 14.026 2.66666 13.6869 2.66666 13.3333V2.66659C2.66666 2.31297 2.80713 1.97383 3.05718 1.72378C3.30723 1.47373 3.64637 1.33325 3.99999 1.33325H9.33332C9.54436 1.33291 9.75338 1.37432 9.94834 1.4551C10.1433 1.53588 10.3204 1.65443 10.4693 1.80392L12.8613 4.19592C13.0112 4.34493 13.1301 4.52215 13.2111 4.71736C13.2921 4.91257 13.3337 5.1219 13.3333 5.33325V13.3333C13.3333 13.6869 13.1928 14.026 12.9428 14.2761C12.6927 14.5261 12.3536 14.6666 12 14.6666H3.99999Z"
          stroke="#005F5A"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.33334 1.33325V4.66659C9.33334 4.8434 9.40358 5.01297 9.52861 5.13799C9.65363 5.26301 9.8232 5.33325 10 5.33325H13.3333"
          stroke="#005F5A"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.66668 6H5.33334M10.6667 8.66675H5.33334M10.6667 11.3333H5.33334"
          stroke="#005F5A"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "View Budget Summary",
    desc: "Check your travel budget",
    bg: "bg-[#fce7f3]",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M10.6667 4.66675H14.6667V8.66675"
          stroke="#A3004C"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14.6667 4.66675L9.00001 10.3334L5.66668 7.00008L1.33334 11.3334"
          stroke="#A3004C"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Travel History",
    desc: "Review past trips and reimbursements",
    bg: "bg-[#e7f3fc]",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M8 4V8L10.6667 9.33333"
          stroke="#005FA3"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.00001 14.6666C11.6819 14.6666 14.6667 11.6818 14.6667 7.99992C14.6667 4.31802 11.6819 1.33325 8.00001 1.33325C4.31811 1.33325 1.33334 4.31802 1.33334 7.99992C1.33334 11.6818 4.31811 14.6666 8.00001 14.6666Z"
          stroke="#005FA3"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];
