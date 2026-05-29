"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SignUpButton } from "@clerk/nextjs";
import type { Preloaded } from "convex/react";
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  Eye,
  Flame,
  MapPin,
  MessageSquarePlus,
  Tag,
  ThumbsUp,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { LandingHero } from "@/components/LandingHero";
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
import { useIsMobile } from "@/hooks/useMediaQuery";

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

const steps = [
  {
    icon: Eye,
    title: "Browse",
    description: "Search strains, brands, and dispos. No account needed.",
    accent: "emerald" as const,
  },
  {
    icon: MessageSquarePlus,
    title: "Report",
    description: "Flag mold, dry packs, taxed prices, and fake sales.",
    accent: "gold" as const,
  },
  {
    icon: ThumbsUp,
    title: "Confirm",
    description: "Vote on reports to help the community spot the real deal.",
    accent: "red" as const,
  },
];

function HomeClientView({ reports }: { reports: Report[] }) {
  const { isAuthenticated } = useAuth();
  const voteMutation = useMutation(api.reports.vote);
  const [search, setSearch] = useState("");
  const isMobile = useIsMobile();

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

  const scrollToReports = () => {
    document.getElementById("reports")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToMap = () => {
    document.getElementById("map")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <AppShell showFab variant="landing">
      <PageTransition>
        <div className="space-y-14 pb-8 pt-4 lg:space-y-20 lg:pt-8">
          <LandingHero onBrowseReports={scrollToReports} stats={stats} />

          <section aria-label="How it works">
            <SectionHeader
              eyebrow="How it works"
              title="Three moves. Zero guesswork."
            />
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {steps.map((step, i) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="glass-card group p-5 transition hover:border-zinc-700/80"
                >
                  <div
                    className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${
                      step.accent === "emerald"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : step.accent === "gold"
                          ? "bg-amber-500/10 text-amber-400"
                          : "bg-red-500/10 text-red-400"
                    }`}
                  >
                    <step.icon className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-500">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>

          <section id="reports" className="scroll-mt-24" aria-label="Reports">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeader
                eyebrow="Live feed"
                title="Community reports"
                subtitle="Read every report — no signup required."
              />
              <Link
                href="/reports"
                className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-emerald-400 transition hover:text-emerald-300"
              >
                View all reports
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.slice(0, isMobile ? 4 : 6).map((report, i) => (
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

            {filtered.length === 0 && (
              <div className="glass-card p-8 text-center">
                <p className="text-sm text-zinc-500">No reports match your search.</p>
              </div>
            )}
          </section>

          <section aria-label="Community stats">
            <SectionHeader eyebrow="By the numbers" title="Michigan, mapped." />
            <div className="mt-6 flex gap-3 overflow-x-auto pb-1 scrollbar-thin lg:grid lg:grid-cols-4 lg:overflow-visible">
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
          </section>

          <section id="map" className="scroll-mt-24" aria-label="Map">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <SectionHeader
                eyebrow="Explore"
                title="See it on the map"
                subtitle="Geo-tagged reports across Michigan."
              />
              <button
                type="button"
                onClick={scrollToMap}
                className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-zinc-400 transition hover:text-zinc-300"
              >
                <MapPin className="h-4 w-4" />
                Jump to map
              </button>
            </div>

            <div className="mt-6">
              <SearchBar value={search} onChange={setSearch} />
            </div>

            <div className="mt-4 h-[42vh] min-h-[280px] overflow-hidden rounded-2xl border border-zinc-800/60 lg:h-[50vh] lg:min-h-[400px]">
              <MapViewDynamic
                reports={filtered}
                center={[MICHIGAN_CENTER.lat, MICHIGAN_CENTER.lng]}
                zoom={8}
                className="h-full shadow-[0_12px_48px_rgba(0,0,0,0.5)]"
              />
            </div>
          </section>

          {!isAuthenticated && (
            <section aria-label="Sign up">
              <div className="relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/40 via-zinc-950 to-zinc-950 p-8 lg:p-12">
                <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
                <div className="relative flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="max-w-xl">
                    <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
                      Join the community
                    </p>
                    <h3 className="mt-2 font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
                      Ready to report boof?
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-400 sm:text-base">
                      Create a free account to submit reports, confirm what
                      others find, and help Michigan smokers avoid trash product.
                    </p>
                  </div>
                  <SignUpButton mode="modal">
                    <button type="button" className="btn-primary shrink-0 px-8 py-4 text-base">
                      Sign up free
                    </button>
                  </SignUpButton>
                </div>
              </div>
            </section>
          )}
        </div>
      </PageTransition>
    </AppShell>
  );
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-emerald-500/80">
        {eyebrow}
      </p>
      <h2 className="mt-1 font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-1.5 text-sm text-zinc-500">{subtitle}</p>
      )}
    </div>
  );
}
