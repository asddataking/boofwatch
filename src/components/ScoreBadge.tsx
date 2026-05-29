"use client";

import { scoreLabel } from "@/lib/markers";
import { cn } from "@/lib/utils";

const scoreStyles = (score: number) => {
  if (score <= 2) return "bg-red-500/20 text-red-400 border-red-500/30";
  if (score <= 3.5) return "bg-amber-500/20 text-amber-400 border-amber-500/30";
  if (score <= 4.5)
    return "bg-emerald-500/15 text-emerald-400 border-emerald-500/25";
  return "bg-emerald-500/25 text-emerald-300 border-emerald-400/40 shadow-[0_0_20px_rgba(16,185,129,0.15)]";
};

export function ScoreBadge({
  score,
  size = "md",
}: {
  score: number;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-medium tabular-nums",
        scoreStyles(score),
        sizes[size]
      )}
    >
      <span>{score.toFixed(1)}</span>
      <span className="opacity-70">·</span>
      <span className="text-[10px] uppercase tracking-wide opacity-90">
        {scoreLabel(score)}
      </span>
    </span>
  );
}
