import clsx from "clsx";

const cfg = {
  PENDING:     "bg-amber-100 text-amber-800",
  APPROVED:    "bg-emerald-100 text-emerald-800",
  REJECTED:    "bg-rose-100 text-rose-800",
  ON_HOLD:     "bg-slate-200 text-slate-800",
  CHECKED_IN:  "bg-brand-100 text-brand-700",
  CHECKED_OUT: "bg-slate-100 text-slate-600",
  CANCELLED:   "bg-rose-100 text-rose-700",
};

export default function StatusBadge({ status }) {
  return <span className={clsx("badge", cfg[status] || "bg-slate-100 text-slate-700")}>{status?.replace("_"," ")}</span>;
}