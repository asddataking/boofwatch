"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SignUpButton } from "@clerk/nextjs";
import {
  ArrowRight,
  MapPin,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";
import { useAuth } from "@/components/BoofAuthProvider";
import { TAGLINE } from "@/lib/constants";
import { useIsMobile } from "@/hooks/useMediaQuery";

const chips = ["Flower", "Carts", "Concentrates", "Edibles", "Pre-rolls"];

export function LandingHero({
  onBrowseReports,
  stats,
}: {
  onBrowseReports: () => void;
  stats: {
    boofReports: number;
    disposRated: number;
    brandsReviewed: number;
  };
}) {
  const { isAuthenticated } = useAuth();
  const isMobile = useIsMobile();

  return (
    <section className="relative overflow-hidden" aria-label="Welcome">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-amber-500/8 blur-3xl" />

      <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-12">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5"
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
              Michigan community
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            <h2 className="font-heading text-[2.75rem] font-bold leading-[0.95] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Find{" "}
              <span className="bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text text-transparent">
                fire
              </span>
              .
              <br />
              Avoid{" "}
              <span className="bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent">
                boof
              </span>
              .
            </h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-zinc-400 sm:text-lg">
              {TAGLINE} Real reports from real smokers — know what&apos;s worth
              your money before you buy.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.12 }}
            className="flex flex-wrap gap-2"
          >
            {chips.map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs font-medium text-zinc-400"
              >
                {chip}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.18 }}
            className="flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            {!isAuthenticated ? (
              <SignUpButton mode="modal">
                <button type="button" className="btn-primary group flex items-center justify-center gap-2 px-8 py-4 text-base">
                  Create free account
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </button>
              </SignUpButton>
            ) : (
              <Link
                href="/report"
                className="btn-primary group flex items-center justify-center gap-2 px-8 py-4 text-base"
              >
                Report boof
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
            )}
            <button
              type="button"
              onClick={onBrowseReports}
              className="btn-secondary flex items-center justify-center gap-2 px-8 py-4 text-base"
            >
              Browse reports
              <span className="text-xs font-normal text-zinc-500">No signup</span>
            </button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.28 }}
            className="text-xs text-zinc-600"
          >
            Browse every report for free. Sign up only to submit and vote.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 lg:gap-4"
        >
          <HeroStatCard
            icon={MapPin}
            value={stats.disposRated}
            label="Dispensaries rated"
            accent="gold"
          />
          <HeroStatCard
            icon={Users}
            value={stats.boofReports}
            label="Boof alerts"
            accent="red"
          />
          <HeroStatCard
            icon={Shield}
            value={stats.brandsReviewed}
            label="Brands reviewed"
            accent="emerald"
          />

          {!isMobile && (
            <div className="glass-card hidden p-5 lg:block">
              <p className="font-heading text-sm font-semibold text-white">
                Community-powered quality checks
              </p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500">
                Spot mold, dry packs, taxed prices, and fake sales before they
                hit your stash. Every report is geo-tagged and searchable.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function HeroStatCard({
  icon: Icon,
  value,
  label,
  accent,
}: {
  icon: typeof MapPin;
  value: number;
  label: string;
  accent: "emerald" | "gold" | "red";
}) {
  const accents = {
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    gold: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    red: "text-red-400 bg-red-500/10 border-red-500/20",
  };

  return (
    <div className="glass-card flex items-center gap-4 p-4 lg:p-5">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${accents[accent]}`}
      >
        <Icon className="h-5 w-5" strokeWidth={2} />
      </div>
      <div>
        <p className="font-heading text-2xl font-bold tracking-tight text-white">
          {value}
        </p>
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          {label}
        </p>
      </div>
    </div>
  );
}
