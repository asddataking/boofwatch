"use client";

import { useMemo, useState } from "react";
import type { Preloaded } from "convex/react";
import { AlertTriangle, Building2, Flame, Tag } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { PwaHero } from "@/components/PwaHero";
import { BottomSheet } from "@/components/BottomSheet";
import { MapViewDynamic } from "@/components/MapViewDynamic";
import { PageTransition } from "@/components/PageTransition";
import { ReportCard } from "@/components/ReportCard";
import { SearchBar } from "@/components/SearchBar";
import { StatCard } from "@/components/StatCard";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { useAuth } from "@/components/BoofAuthProvider";
import { MICHIGAN_CENTER } from "@/lib/constants";
import { isConvexConfigured } from "@/lib/convex/config";
import type { Report } from "@/lib/types";
import { usePreloadedReports } from "@/hooks/useRealtimeReports";

export function HomeClient({
  preloadedReports,
  seedReports,
}: {
  preloadedReports: Preloaded<typeof api.reports.listApproved> | null;
  seedReports: Report[];
}) {
  if (preloadedReports) {
    return (
      <HomeClientLive
        preloadedReports={preloadedReports}
        seedReports={seedReports}
      />
    );
  }
  return <HomeClientView reports={seedReports} />;
}

function HomeClientLive({
  preloadedReports,
  seedReports,
}: {
  preloadedReports: Preloaded<typeof api.reports.listApproved>;
  seedReports: Report[];
}) {
  const reports = usePreloadedReports(preloadedReports, seedReports);
  return <HomeClientView reports={reports} />;
}

function HomeClientView({ reports }: { reports: Report[] }) {
  const { isAuthenticated } = useAuth();
  const voteMutation = useMutation(api.reports.vote);
  const [search, setSearch] = useState("");

  const stats = useMemo(() => {
    const brands = new Set(reports.map((r) => r.brand_name));
    const dispos = new Set(reports.map((r) => r.dispensary_name));
    const taxed = reports.filter((r) =>
      r.issue_tags.some((t) =>
        ["Overpriced / Taxed", "Fake Sale"].includes(t)
      )
    ).length;
    const boof = reports.filter((r) => r.boof_score <= 2.5).length;
    return {
      boofReports: boof,
      disposRated: dispos.size,
      brandsReviewed: brands.size,
      taxedAlerts: taxed,
    };
  }, [reports]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return reports;
    return reports.filter(
      (r) =>
        r.strain_name.toLowerCase().includes(q) ||
        r.brand_name.toLowerCase().includes(q) ||
        r.dispensary_name.toLowerCase().includes(q) ||
        r.city.toLowerCase().includes(q)
    );
  }, [reports, search]);

  const vote = async (reportId: string, voteType: "confirm" | "downvote") => {
    if (!isAuthenticated || !isConvexConfigured()) return;
    await voteMutation({
      reportId: reportId as Id<"reports">,
      voteType,
    });
  };

  return (
    <AppShell showFab>
      <PageTransition>
        <div className="space-y-4 pt-2">
          <PwaHero />

          <div id="map" className="scroll-mt-20">
            <SearchBar value={search} onChange={setSearch} />
          </div>

          <div className="-mx-1 h-[42vh] min-h-[280px]">
            <MapViewDynamic
              reports={filtered}
              center={[MICHIGAN_CENTER.lat, MICHIGAN_CENTER.lng]}
              zoom={8}
              className="h-full shadow-[0_12px_48px_rgba(0,0,0,0.5)]"
            />
          </div>

          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin">
            <StatCard
              label="Boof Reports"
              value={stats.boofReports}
              icon={AlertTriangle}
              accent="red"
              index={0}
            />
            <StatCard
              label="Dispos Rated"
              value={stats.disposRated}
              icon={Building2}
              accent="gold"
              index={1}
            />
            <StatCard
              label="Brands Reviewed"
              value={stats.brandsReviewed}
              icon={Flame}
              accent="emerald"
              index={2}
            />
            <StatCard
              label="Taxed Alerts"
              value={stats.taxedAlerts}
              icon={Tag}
              accent="orange"
              index={3}
            />
          </div>
        </div>
      </PageTransition>

      <BottomSheet title="Live community reports">
        <div className="space-y-3">
          {filtered.slice(0, 6).map((report, i) => (
            <ReportCard
              key={report.id}
              report={report}
              index={i}
              compact
              onConfirm={() => vote(report.id, "confirm")}
              onDownvote={() => vote(report.id, "downvote")}
            />
          ))}
        </div>
      </BottomSheet>
    </AppShell>
  );
}
