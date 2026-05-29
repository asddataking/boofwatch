import type { MarkerTier, Report } from "./types";

const TAXED_TAGS = ["Overpriced / Taxed", "Fake Sale"];
const BOOF_TAGS = ["Mold", "CRC Garbage", "Leaking Cart"];

export function getMarkerTier(report: Report): MarkerTier {
  const tags = report.issue_tags ?? [];

  if (tags.some((t) => TAXED_TAGS.includes(t))) return "taxed";
  if (report.boof_score <= 2 || tags.some((t) => BOOF_TAGS.includes(t)))
    return "boof";
  if (report.boof_score >= 4.5 && tags.length <= 1) return "fire";
  if (report.boof_score >= 4) return "fire";
  return "mid";
}

export function scoreLabel(score: number): string {
  if (score <= 1.5) return "Boof Alert";
  if (score <= 2.5) return "Mostly Boof";
  if (score <= 3.5) return "Mid";
  if (score <= 4.5) return "Decent";
  return "Fire";
}
