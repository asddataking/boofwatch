"use client";

import Link from "next/link";
import { MobileNav } from "./MobileNav";
import { Disclaimer } from "./Disclaimer";
import { TAGLINE } from "@/lib/constants";

export function AppShell({
  children,
  showFab = false,
}: {
  children: React.ReactNode;
  showFab?: boolean;
}) {
  return (
    <div className="relative min-h-[100dvh] bg-[#050505] pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
      <header className="sticky top-0 z-30 border-b border-zinc-900/80 bg-[#050505]/80 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-xl">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <Link href="/" className="group">
            <h1 className="font-heading text-xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                Boof
              </span>
              <span className="text-white">Map</span>
            </h1>
            <p className="text-[10px] font-medium tracking-wide text-amber-500/80">
              {TAGLINE}
            </p>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4">{children}</main>

      {showFab && (
        <Link
          href="/report"
          className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] right-4 z-40 flex min-h-[48px] items-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-red-500 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_8px_32px_rgba(239,68,68,0.35)] transition hover:scale-[1.02] active:scale-[0.98]"
        >
          <span className="text-lg leading-none">+</span>
          Report Boof
        </Link>
      )}

      <footer className="mx-auto max-w-lg px-4 pb-28 pt-6">
        <Disclaimer />
      </footer>

      <MobileNav />
    </div>
  );
}
