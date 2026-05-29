"use client";

import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PageTransition } from "@/components/PageTransition";
import { ReportForm } from "@/components/ReportForm";
import { MeetupReportForm } from "@/components/MeetupReportForm";
import { cn } from "@/lib/utils";

export default function ReportPage() {
  const [tab, setTab] = useState<"product" | "meetup">("product");

  return (
    <AppShell>
      <PageTransition>
        <div className="py-4">
          <h2 className="font-heading text-2xl font-bold text-white">
            Submit Report
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Sign in with Clerk to submit — keeps reports accountable
          </p>

          <div className="mt-4 flex rounded-2xl border border-zinc-800 bg-zinc-900/50 p-1">
            {(["product", "meetup"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={cn(
                  "flex-1 rounded-xl py-2 text-sm font-medium transition",
                  tab === t
                    ? t === "product"
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-purple-500/20 text-purple-300"
                    : "text-zinc-500"
                )}
              >
                {t === "product" ? "Product / Dispo" : "Meetup / Seller"}
              </button>
            ))}
          </div>

          <div className="mt-6">
            {tab === "product" ? <ReportForm /> : <MeetupReportForm />}
          </div>
        </div>
      </PageTransition>
    </AppShell>
  );
}
