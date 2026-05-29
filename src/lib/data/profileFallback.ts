import type { BrandProfile, DispensaryProfile, Report } from "@/lib/types";
import { slugify } from "@/lib/utils";

export function getBrandProfileFromReports(
  slug: string,
  reports: Report[]
): BrandProfile | null {
  const brandReports = reports.filter((r) => slugify(r.brand_name) === slug);
  if (!brandReports.length) return null;

  const name = brandReports[0].brand_name;
  const avg =
    brandReports.reduce((s, r) => s + r.boof_score, 0) / brandReports.length;
  const moldCount = brandReports.filter((r) =>
    r.issue_tags.includes("Mold")
  ).length;

  const complaintCounts: Record<string, number> = {};
  brandReports.forEach((r) => {
    r.issue_tags.forEach((t) => {
      complaintCounts[t] = (complaintCounts[t] ?? 0) + 1;
    });
  });
  const topComplaint = Object.entries(complaintCounts).sort(
    (a, b) => b[1] - a[1]
  )[0]?.[0];

  const product_breakdown: Record<string, number> = {};
  brandReports.forEach((r) => {
    product_breakdown[r.product_type] =
      (product_breakdown[r.product_type] ?? 0) + 1;
  });

  const trust = Math.round(
    Math.min(100, Math.max(0, avg * 18 + (5 - moldCount) * 4))
  );

  return {
    id: slug,
    name,
    slug,
    trust_score: trust,
    avg_boof_score: Math.round(avg * 10) / 10,
    report_count: brandReports.length,
    mold_report_count: moldCount,
    top_complaint: topComplaint,
    product_breakdown,
    recent_reports: brandReports.slice(0, 8),
  };
}

export function getDispensaryProfileFromReports(
  slug: string,
  reports: Report[]
): DispensaryProfile | null {
  const dispoReports = reports.filter(
    (r) => slugify(r.dispensary_name) === slug
  );
  if (!dispoReports.length) return null;

  const name = dispoReports[0].dispensary_name;
  const city = dispoReports[0].city;
  const prices = dispoReports
    .map((r) => r.price_paid)
    .filter((p): p is number => p != null);
  const avgPrice =
    prices.length > 0
      ? prices.reduce((a, b) => a + b, 0) / prices.length
      : 0;
  const taxed = dispoReports.filter((r) =>
    r.issue_tags.some((t) =>
      ["Overpriced / Taxed", "Fake Sale"].includes(t)
    )
  ).length;
  const avgScore =
    dispoReports.reduce((s, r) => s + r.boof_score, 0) / dispoReports.length;
  const value = Math.round(
    Math.min(100, Math.max(0, avgScore * 20 - taxed * 5))
  );

  let sentiment: DispensaryProfile["sentiment"] = "mixed";
  if (avgScore >= 4) sentiment = "positive";
  else if (avgScore <= 2.5) sentiment = "negative";

  const fire_finds = dispoReports.filter((r) => r.boof_score >= 4.5);

  return {
    id: slug,
    name,
    slug,
    city,
    value_score: value,
    taxed_alert_count: taxed,
    avg_reported_price: Math.round(avgPrice),
    report_count: dispoReports.length,
    recent_reports: dispoReports.slice(0, 8),
    fire_finds: fire_finds.slice(0, 5),
    sentiment,
  };
}
