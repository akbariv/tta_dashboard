import * as React from "react";

type ChipColor =
  | "sky"
  | "emerald"
  | "indigo"
  | "slate"
  | "amber"
  | "rose"
  | "violet"
  | "cyan"
  | "blue";

type Size = "xs" | "sm";

const palette: Record<
  ChipColor,
  { bg: string; text: string; border: string; dot: string }
> = {
  sky:    { bg: "bg-sky-50",    text: "text-sky-700",    border: "border-sky-100",    dot: "bg-sky-500" },
  emerald:{ bg: "bg-emerald-50",text: "text-emerald-700",border: "border-emerald-100",dot: "bg-emerald-500" },
  indigo: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-100", dot: "bg-indigo-500" },
  slate:  { bg: "bg-slate-50",  text: "text-slate-700",  border: "border-slate-200",  dot: "bg-slate-400" },
  amber:  { bg: "bg-amber-50",  text: "text-amber-700",  border: "border-amber-100",  dot: "bg-amber-500" },
  rose:   { bg: "bg-rose-50",   text: "text-rose-700",   border: "border-rose-100",   dot: "bg-rose-500" },
  violet: { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-100", dot: "bg-violet-500" },
  cyan:   { bg: "bg-cyan-50",   text: "text-cyan-700",   border: "border-cyan-100",   dot: "bg-cyan-500" },
  blue:   { bg: "bg-blue-50",   text: "text-blue-700",   border: "border-blue-100",   dot: "bg-blue-500" },
};

export function SectionChip({
  color = "slate",
  label,
  size = "xs",
  className,
}: {
  color?: ChipColor;
  label: React.ReactNode;
  size?: Size;
  className?: string;
}) {
  const p = palette[color];
  const sizeCls = size === "sm" ? "text-sm px-3 py-1.5" : "text-xs px-2.5 py-1";
  const dotCls = size === "sm" ? "w-2 h-2" : "w-1.5 h-1.5";

  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full border",
        p.bg,
        p.text,
        p.border,
        sizeCls,
        className ?? "",
      ].join(" ")}
    >
      <span className={`rounded-full ${p.dot} ${dotCls}`} />
      {label}
    </span>
  );
}

export default SectionChip;
