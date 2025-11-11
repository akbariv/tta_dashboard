"use client";
export function PriorityBadge({ level }: { level?: "Low" | "Medium" | "High" }) {
  if (!level) return <span>-</span>;
  const map = {
    Low:    "bg-slate-50 text-slate-700 border-slate-100",
    Medium: "bg-amber-50 text-amber-700 border-amber-100",
    High:   "bg-rose-50 text-rose-700 border-rose-100",
  } as const;
  const dot = {
    Low: "bg-slate-400",
    Medium: "bg-amber-500",
    High: "bg-rose-500",
  } as const;
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${map[level]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot[level]}`} />
      {level}
    </span>
  );
}
