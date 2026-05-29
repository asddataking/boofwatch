"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
  accent = "emerald",
  index = 0,
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  accent?: "emerald" | "gold" | "red" | "orange";
  index?: number;
}) {
  const accents = {
    emerald: "from-emerald-500/20 to-transparent text-emerald-400",
    gold: "from-amber-500/20 to-transparent text-amber-400",
    red: "from-red-500/20 to-transparent text-red-400",
    orange: "from-orange-500/20 to-transparent text-orange-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className="glass-card flex min-w-[140px] flex-col gap-1 p-3.5"
    >
      <div
        className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${accents[accent]}`}
      >
        <Icon className="h-4 w-4" strokeWidth={2} />
      </div>
      <p className="font-heading text-2xl font-semibold tracking-tight text-white">
        {value}
      </p>
      <p className="text-[11px] font-medium uppercase tracking-wider text-zinc-500">
        {label}
      </p>
    </motion.div>
  );
}
