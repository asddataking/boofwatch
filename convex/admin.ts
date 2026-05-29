import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { reportToApi, meetupToApi } from "./lib/mappers";
import {
  buildPublicWarning,
  computeSellerSignal,
} from "./lib/sellerSignal";
import { requireAdmin } from "./lib/auth";
import type { MutationCtx } from "./_generated/server";

export const listModerationQueue = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const items = await ctx.db
      .query("moderationQueue")
      .withIndex("by_status_created", (q) => q.eq("status", "pending"))
      .order("desc")
      .take(100);

    return items.map((item) => ({
      id: item._id,
      source_type: item.sourceType,
      source_id: item.sourceId,
      reasons: item.reasons,
      status: item.status,
      preview_text: item.previewText,
      image_url: item.imageUrl ?? null,
      created_at: new Date(item.createdAt).toISOString(),
    }));
  },
});

export const listFlaggedReports = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const flagged = await ctx.db
      .query("reports")
      .withIndex("by_status", (q) => q.eq("status", "flagged"))
      .take(100);

    const pending = await ctx.db
      .query("reports")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .take(100);

    return [...flagged, ...pending].map(reportToApi);
  },
});

export const listFlaggedMeetupReports = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);

    const flagged = await ctx.db
      .query("meetupReports")
      .withIndex("by_status", (q) => q.eq("status", "flagged"))
      .take(100);

    const pending = await ctx.db
      .query("meetupReports")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .take(100);

    return [...flagged, ...pending].map(meetupToApi);
  },
});

export const moderate = mutation({
  args: {
    sourceType: v.union(v.literal("report"), v.literal("meetupReport")),
    sourceId: v.string(),
    queueId: v.optional(v.id("moderationQueue")),
    action: v.union(v.literal("approve"), v.literal("reject")),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const now = Date.now();
    const status = args.action === "approve" ? "approved" : "rejected";

    if (args.sourceType === "report") {
      const id = args.sourceId as import("./_generated/dataModel").Id<"reports">;
      const report = await ctx.db.get(id);
      if (!report) throw new Error("Report not found");

      await ctx.db.patch(id, {
        status,
        reviewedAt: now,
        trustScore:
          status === "approved"
            ? Math.round(report.boofScore * 20)
            : report.trustScore,
      });
    } else {
      const id =
        args.sourceId as import("./_generated/dataModel").Id<"meetupReports">;
      const report = await ctx.db.get(id);
      if (!report) throw new Error("Meetup report not found");

      await ctx.db.patch(id, { status, reviewedAt: now });

      if (status === "approved") {
        await recalcMeetupWarnings(ctx, report.sellerDisplayName, report.city);
      }
    }

    if (args.queueId) {
      await ctx.db.patch(args.queueId, { status, reviewedAt: now });
    }
  },
});

async function recalcMeetupWarnings(
  ctx: MutationCtx,
  sellerDisplayName: string,
  city: string
) {
  const reports = await ctx.db
    .query("meetupReports")
    .withIndex("by_seller_city", (q) =>
      q.eq("sellerDisplayName", sellerDisplayName).eq("city", city)
    )
    .collect();

  const warning = buildPublicWarning(
    reports.map((r) => ({ issueTags: r.issueTags, status: r.status })),
    sellerDisplayName,
    city
  );

  for (const r of reports) {
    if (r.status === "approved") {
      await ctx.db.patch(r._id, { publicWarning: warning ?? undefined });
    }
  }
}
