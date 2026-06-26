import { motion } from "framer-motion";
import clsx from "clsx";

export default function StatCard({ label, value, hint, Icon, tone = "brand" }) {
  const tones = {
    brand: "from-brand-500 to-brand-700 text-white",
    emerald: "from-emerald-500 to-emerald-700 text-white",
    amber: "from-amber-400 to-amber-600 text-white",
    rose: "from-rose-500 to-rose-700 text-white",
    slate: "from-slate-700 to-slate-900 text-white",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={clsx("relative overflow-hidden rounded-2xl p-5 bg-gradient-to-br shadow-soft", tones[tone])}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-medium uppercase tracking-wider opacity-80">{label}</div>
          <div className="mt-2 text-3xl font-bold tracking-tight">{value}</div>
          {hint && <div className="mt-1 text-xs opacity-80">{hint}</div>}
        </div>
        {Icon && <Icon className="w-8 h-8 opacity-70" />}
      </div>
    </motion.div>
  );
}