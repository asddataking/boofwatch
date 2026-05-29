import type { Doc } from "../_generated/dataModel";

export function reportToApi(r: Doc<"reports">) {
  return {
    id: r._id as string,
    user_id: r.userId,
    product_type: r.productType,
    brand_name: r.brandName,
    dispensary_name: r.dispensaryName,
    city: r.city,
    strain_name: r.strainName,
    price_paid: r.pricePaid ?? null,
    package_date: r.packageDate ?? null,
    issue_tags: r.issueTags,
    boof_score: r.boofScore,
    notes: r.notes ?? null,
    latitude: r.latitude,
    longitude: r.longitude,
    confirm_count: r.confirmCount,
    downvote_count: r.downvoteCount,
    image_url: r.imageUrl ?? null,
    status: r.status,
    created_at: new Date(r.createdAt).toISOString(),
  };
}

export function meetupToApi(r: Doc<"meetupReports">) {
  return {
    id: r._id as string,
    user_id: r.userId,
    seller_display_name: r.sellerDisplayName,
    platform: r.platform,
    city: r.city,
    area: r.area ?? null,
    meetup_type: r.meetupType,
    issue_tags: r.issueTags,
    seller_signal: r.sellerSignal,
    notes: r.notes ?? null,
    latitude: r.latitude,
    longitude: r.longitude,
    confirm_count: r.confirmCount,
    image_url: r.imageUrl ?? null,
    status: r.status,
    public_warning: r.publicWarning ?? null,
    created_at: new Date(r.createdAt).toISOString(),
  };
}
