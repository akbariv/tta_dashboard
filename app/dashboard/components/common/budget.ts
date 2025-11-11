export function readBudget() {
  if (typeof window === "undefined") return { initial: 10_000_000, used: 0 };
  const initial =
    Number(localStorage.getItem("tta_budget_initial")) || 10_000_000;
  const used =
    Number(localStorage.getItem("tta_budget_used")) ||
    Number(localStorage.getItem("budget_used")) ||
    0;
  return { initial, used };
}

export function breakdown(initial: number, used: number) {
  const refunded = Math.min(1_000_000, used);
  const loss = Math.min(1_000_000, Math.max(0, used - refunded));
  const usedNet = Math.max(0, used - refunded - loss);
  const remaining = Math.max(0, initial - (usedNet + refunded + loss));
  return { remaining, usedNet, refunded, loss };
}
