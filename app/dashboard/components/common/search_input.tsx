import * as React from "react";

type Size = "xs" | "sm" | "md";

export function SearchInput({
  placeholder = "Search",
  size = "sm",
  className,
  value,
  onChange,
  onSubmit,
  ariaLabel,
}: {
  placeholder?: string;
  size?: Size;
  className?: string;
  value?: string;
  onChange?: (v: string) => void;
  onSubmit?: () => void; // dipanggil saat Enter
  ariaLabel?: string;
}) {
  const inputSize = {
    xs: "h-8 text-xs pl-8 pr-2",
    sm: "h-9 text-sm pl-8 pr-3",
    md: "h-10 text-sm pl-9 pr-3",
  }[size];

  const iconPos = {
    xs: "left-2 top-2",
    sm: "left-2.5 top-2.5",
    md: "left-3 top-3",
  }[size];

  return (
    <div className={`relative ${className ?? ""}`}>
      <input
        aria-label={ariaLabel ?? placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSubmit?.()}
        className={[
          "w-full rounded-lg border bg-white outline-none",
          "focus:ring-2 focus:ring-sky-200 focus:border-sky-300",
          "placeholder:text-slate-400",
          inputSize,
        ].join(" ")}
      />
      <span
        className={`absolute ${iconPos} text-slate-400 pointer-events-none`}
        aria-hidden
      >
        🔍
      </span>
    </div>
  );
}

export default SearchInput;
