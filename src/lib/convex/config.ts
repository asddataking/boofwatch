export function isConvexConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL ?? "";
  return Boolean(url && !url.includes("placeholder"));
}

export function isClerkConfigured(): boolean {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
  return Boolean(key && !key.includes("placeholder"));
}
