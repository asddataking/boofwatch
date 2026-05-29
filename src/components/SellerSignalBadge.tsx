"use client";

import { SELLER_SIGNAL_COLORS } from "@/lib/constants";
import type { SellerSignal } from "@/lib/types";
import { cn } from "@/lib/utils";

const labels: Record<SellerSignal, string> = {
  green: "Low concern",
  yellow: "Watch",
  orange: "Caution",
  red: "High concern",
};

export function SellerSignalBadge({
  signal,
  size = "md",
}: {
  signal: SellerSignal;
  size?: "sm" | "md";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium capitalize",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"
      )}
      style={{
        borderColor: `${SELLER_SIGNAL_COLORS[signal]}44`,
        backgroundColor: `${SELLER_SIGNAL_COLORS[signal]}18`,
        color: SELLER_SIGNAL_COLORS[signal],
      }}
    >
      <span
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: SELLER_SIGNAL_COLORS[signal] }}
      />
      {labels[signal]}
    </span>
  );
}
