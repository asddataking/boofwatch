const HIGH_RISK_TAGS = [
  "Suspected Scam",
  "Unsafe Meetup",
  "No Show",
  "Changed Price",
];

export type SellerSignal = "green" | "yellow" | "orange" | "red";

export function computeSellerSignal(
  reports: { issueTags: string[]; confirmCount: number }[]
): SellerSignal {
  if (!reports.length) return "green";

  const highRisk = reports.filter((r) =>
    r.issueTags.some((t) => HIGH_RISK_TAGS.includes(t))
  ).length;
  const confirms = reports.reduce((s, r) => s + r.confirmCount, 0);

  if (highRisk >= 3 || confirms >= 15) return "red";
  if (highRisk >= 2 || reports.length >= 4) return "orange";
  if (highRisk >= 1 || reports.length >= 2) return "yellow";
  return "green";
}

export function buildPublicWarning(
  reports: {
    issueTags: string[];
    status: string;
  }[],
  sellerName: string,
  city: string
): string | null {
  const approved = reports.filter(
    (r) => r.status === "approved" || !r.status
  );
  if (approved.length < 3) return null;

  const tagCounts: Record<string, number> = {};
  approved.forEach((r) => {
    r.issueTags.forEach((t) => {
      tagCounts[t] = (tagCounts[t] ?? 0) + 1;
    });
  });

  const top = Object.entries(tagCounts).sort((a, b) => b[1] - a[1])[0];
  if (!top || top[1] < 3) return null;

  const [tag, count] = top;
  return `${count} community reports mention ${tag.toLowerCase()} near ${city} for "${sellerName}".`;
}
