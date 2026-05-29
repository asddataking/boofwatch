const PROFANITY = ["fuck", "shit", "bitch", "asshole", "cunt"];

const PATTERNS: { pattern: RegExp; reason: string }[] = [
  { pattern: /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/, reason: "phone_number" },
  {
    pattern:
      /\b\d{1,5}\s+\w+\s+(st|street|ave|avenue|rd|road|blvd|drive|ln|lane)\b/i,
    reason: "address",
  },
  { pattern: /\b[A-Z0-9]{7,8}\b/, reason: "license_plate" },
  { pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i, reason: "email" },
];

export function runModeration(
  ...texts: (string | null | undefined)[]
): { pass: boolean; reasons: string[] } {
  const combined = texts.filter(Boolean).join(" ");
  const reasons: string[] = [];

  for (const { pattern, reason } of PATTERNS) {
    if (pattern.test(combined)) reasons.push(reason);
  }

  const lower = combined.toLowerCase();
  if (PROFANITY.some((w) => lower.includes(w))) reasons.push("profanity");

  if (combined.length > 2000) reasons.push("spam_length");
  if ((combined.match(/http/gi) || []).length > 3) reasons.push("spam_links");

  return { pass: reasons.length === 0, reasons: [...new Set(reasons)] };
}

export function looksLikeFullName(text: string): boolean {
  const parts = text.trim().split(/\s+/);
  return parts.length >= 3 && parts.every((p) => /^[A-Z][a-z]+$/.test(p));
}
