"use client";
import * as React from "react";

export type FilterOption = { label: string; value: string };

export interface FilterDropdownProps {
  placeholder?: string;
  value?: string; // <- dikenali
  onChange?: (val: string) => void; // <- dikenali
  options: FilterOption[];
  className?: string;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  placeholder,
  value,
  onChange,
  options,
  className = "",
}) => {
  const [open, setOpen] = React.useState(false);
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const current =
    placeholder || options.find((o) => o.value === value)?.label || "Select";

  React.useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((s) => !s)}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300"
      >
        <span className="truncate max-w-[9rem]">{current}</span>
        <svg
          viewBox="0 0 20 20"
          className={`h-4 w-4 ${open ? "rotate-180" : ""}`}
          fill="currentColor"
        >
          <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.17l3.71-2.94a.75.75 0 1 1 .94 1.16l-4.24 3.36a.75.75 0 0 1-.94 0L5.25 8.39a.75.75 0 0 1-.02-1.18z" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 mt-2 w-52 rounded-xl border border-slate-200 bg-white shadow-lg ring-1 ring-black/5 z-[60] overflow-hidden"
        >
          <ul className="max-h-64 overflow-auto py-1">
            {options.map((opt) => (
              <li key={opt.value}>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onChange?.(opt.value);
                    setOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 focus:bg-slate-50"
                >
                  {opt.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// supaya bisa di-import sebagai default maupun named
export default FilterDropdown;
