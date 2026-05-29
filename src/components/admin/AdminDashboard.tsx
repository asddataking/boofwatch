"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { Shield, Check, X, Image } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { useAuth } from "@/components/BoofAuthProvider";
import { SignInPrompt } from "@/components/SignInPrompt";
import { isConvexConfigured } from "@/lib/convex/config";
import type { MeetupReport, ModerationQueueItem, Report } from "@/lib/types";
import { cn } from "@/lib/utils";

export function AdminDashboard() {
  const { isAdmin, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-zinc-500">
        Loading…
      </div>
    );
  }

  if (!isAuthenticated) {
    return <SignInPrompt message="Sign in with an admin account to continue." />;
  }

  if (!isAdmin) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center">
        <Shield className="mx-auto mb-2 h-8 w-8 text-red-400" />
        <p className="text-red-200">Admin access required.</p>
        <p className="mt-1 text-sm text-zinc-500">
          Add your Clerk user ID to ADMIN_USER_IDS in Convex and .env.local.
        </p>
      </div>
    );
  }

  if (!isConvexConfigured()) {
    return (
      <p className="text-zinc-500">
        Connect Convex (NEXT_PUBLIC_CONVEX_URL) to use the admin dashboard.
      </p>
    );
  }

  return <AdminDashboardConvex />;
}

function AdminDashboardConvex() {
  const { isAdmin } = useAuth();
  const [tab, setTab] = useState<"queue" | "product" | "meetup">("queue");

  const queue = useQuery(
    api.admin.listModerationQueue,
    isAdmin ? {} : "skip"
  ) as ModerationQueueItem[] | undefined;

  const flaggedProduct = useQuery(
    api.admin.listFlaggedReports,
    isAdmin ? {} : "skip"
  ) as Report[] | undefined;

  const flaggedMeetup = useQuery(
    api.admin.listFlaggedMeetupReports,
    isAdmin ? {} : "skip"
  ) as MeetupReport[] | undefined;

  const moderate = useMutation(api.admin.moderate);

  const handleModerate = async (
    sourceType: "report" | "meetupReport",
    sourceId: string,
    queueId: string | undefined,
    action: "approve" | "reject"
  ) => {
    await moderate({
      sourceType,
      sourceId,
      queueId: queueId as Id<"moderationQueue"> | undefined,
      action,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {(["queue", "product", "meetup"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "rounded-xl px-4 py-2 text-sm capitalize",
              tab === t
                ? "bg-emerald-500/20 text-emerald-300"
                : "bg-zinc-900 text-zinc-400"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "queue" && (
        <div className="space-y-3">
          {(queue ?? []).map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4"
            >
              <p className="text-xs text-zinc-500">
                {item.source_type} · {item.reasons.join(", ")}
              </p>
              <p className="mt-2 text-sm text-zinc-300">{item.preview_text}</p>
              {item.image_url && (
                <a
                  href={item.image_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-xs text-emerald-400"
                >
                  <Image className="h-3 w-3" /> View image
                </a>
              )}
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleModerate(
                      item.source_type,
                      item.source_id,
                      item.id,
                      "approve"
                    )
                  }
                  className="flex items-center gap-1 rounded-lg bg-emerald-500/20 px-3 py-1.5 text-sm text-emerald-300"
                >
                  <Check className="h-4 w-4" /> Approve
                </button>
                <button
                  type="button"
                  onClick={() =>
                    handleModerate(
                      item.source_type,
                      item.source_id,
                      item.id,
                      "reject"
                    )
                  }
                  className="flex items-center gap-1 rounded-lg bg-red-500/20 px-3 py-1.5 text-sm text-red-300"
                >
                  <X className="h-4 w-4" /> Reject
                </button>
              </div>
            </div>
          ))}
          {!queue?.length && (
            <p className="text-zinc-500">Moderation queue is empty.</p>
          )}
        </div>
      )}

      {tab === "product" && (
        <FlaggedList
          items={flaggedProduct ?? []}
          onApprove={(id) => handleModerate("report", id, undefined, "approve")}
          onReject={(id) => handleModerate("report", id, undefined, "reject")}
        />
      )}

      {tab === "meetup" && (
        <FlaggedList
          items={flaggedMeetup ?? []}
          onApprove={(id) =>
            handleModerate("meetupReport", id, undefined, "approve")
          }
          onReject={(id) =>
            handleModerate("meetupReport", id, undefined, "reject")
          }
        />
      )}
    </div>
  );
}

function FlaggedList({
  items,
  onApprove,
  onReject,
}: {
  items: (Report | MeetupReport)[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  if (!items.length) {
    return <p className="text-zinc-500">No flagged items.</p>;
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4"
        >
          <p className="text-sm text-zinc-300">
            {"brand_name" in item
              ? `${item.brand_name} @ ${item.dispensary_name}`
              : item.seller_display_name}
          </p>
          <p className="mt-1 text-xs text-zinc-500">{item.notes}</p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => onApprove(item.id)}
              className="rounded-lg bg-emerald-500/20 px-3 py-1.5 text-sm text-emerald-300"
            >
              Approve
            </button>
            <button
              type="button"
              onClick={() => onReject(item.id)}
              className="rounded-lg bg-red-500/20 px-3 py-1.5 text-sm text-red-300"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
