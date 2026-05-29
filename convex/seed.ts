import { mutation } from "./_generated/server";
import { v } from "convex/values";

/** One-time seed for Michigan demo data. Call from Convex dashboard or a script. */
export const seedDemo = mutation({
  args: { adminUserId: v.optional(v.string()) },
  handler: async (ctx) => {
    const existing = await ctx.db.query("reports").take(1);
    if (existing.length > 0) {
      return { skipped: true, message: "Database already has reports" };
    }

    const now = Date.now();
    const demoReports = [
      {
        userId: "seed",
        productType: "flower",
        brandName: "Common Citizen",
        dispensaryName: "Green Genie",
        city: "Detroit",
        strainName: "Runtz",
        issueTags: ["Dry", "Weak High"],
        boofScore: 2,
        notes: "Dry and weak — not worth the ticket price.",
        latitude: 42.3314,
        longitude: -83.0458,
        confirmCount: 3,
        downvoteCount: 0,
        status: "approved" as const,
        moderationFlags: [],
        trustScore: 40,
        createdAt: now - 86400000,
      },
      {
        userId: "seed",
        productType: "cart",
        brandName: "Jeeter",
        dispensaryName: "House of Dank",
        city: "Detroit",
        strainName: "Honeydew",
        issueTags: ["Fire"],
        boofScore: 4.8,
        notes: "Legit flavor and strong high.",
        latitude: 42.35,
        longitude: -83.05,
        confirmCount: 8,
        downvoteCount: 0,
        status: "approved" as const,
        moderationFlags: [],
        trustScore: 96,
        createdAt: now - 43200000,
      },
    ];

    for (const r of demoReports) {
      await ctx.db.insert("reports", r);
    }

    return { inserted: demoReports.length };
  },
});
