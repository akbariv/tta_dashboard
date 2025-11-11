"use client";
export function StatusBadge({ s }: { s: string }) {
  const map: Record<string, string> = {
    Approved: "bg-emerald-100 text-emerald-700",
    Pending: "bg-amber-100 text-amber-700",
    Rejected: "bg-rose-100 text-rose-700",
  };
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
        map[s] ?? "bg-gray-100 text-gray-700"
      }`}
    >
      {s}
    </span>
  );
}
