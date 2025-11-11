import * as React from "react";
import Link from "next/link";

type Size = "xs" | "sm" | "md";

export function DetailsButton({
  label,
  children,
  href,
  onClick,
  size = "sm",
  className,
  disabled = false,
}: {
  label?: string;                 // optional: "Detail", dst.
  children?: React.ReactNode;     // alternatif dari label
  href?: string;                  // jika diisi -> render <Link>
  onClick?: () => void;           // jika href kosong -> render <button>
  size?: Size;                    // xs | sm | md
  className?: string;
  disabled?: boolean;
}) {
  const sizeCls = {
    xs: "px-2.5 py-1 text-[11px]",
    sm: "px-3.5 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
  }[size];

  const base =
    "inline-flex items-center justify-center rounded-full font-medium " +
    "bg-[#3B82F6] text-white shadow hover:bg-[#2563EB] active:scale-[.98] " +
    "transition disabled:opacity-60 disabled:cursor-not-allowed";

  const content = children ?? label ?? "Details";

  if (href) {
    return (
      <Link
        href={href}
        className={[base, sizeCls, className ?? ""].join(" ")}
        aria-disabled={disabled}
        onClick={(e) => disabled && e.preventDefault()}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={[base, sizeCls, className ?? ""].join(" ")}
      onClick={onClick}
      disabled={disabled}
    >
      {content}
    </button>
  );
}

export default DetailsButton;
