"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { MobileNav } from "./MobileNav";
import { Disclaimer } from "./Disclaimer";
import { TAGLINE } from "@/lib/constants";
import { useAuth } from "@/components/BoofAuthProvider";
import { cn } from "@/lib/utils";

const desktopLinks = [
  { href: "/reports", label: "Reports" },
  { href: "/brands", label: "Brands" },
  { href: "/report", label: "Report" },
] as const;

export function AppShell({
  children,
  showFab = false,
  variant = "default",
}: {
  children: React.ReactNode;
  showFab?: boolean;
  variant?: "default" | "landing";
}) {
  const { isAuthenticated, loading } = useAuth();
  const pathname = usePathname();
  const isLanding = variant === "landing";

  return (
    <div
      className={cn(
        "relative min-h-[100dvh] bg-[#050505]",
        isLanding ? "pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-12" : "pb-[calc(5.5rem+env(safe-area-inset-bottom))]"
      )}
    >
      <header className="sticky top-0 z-30 border-b border-zinc-900/80 bg-[#050505]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))]">
          <Link href="/" className="group shrink-0">
            <h1 className="font-heading text-xl font-bold tracking-tight lg:text-2xl">
              <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                Boof
              </span>
              <span className="text-white">Map</span>
            </h1>
            <p className="text-[10px] font-medium tracking-wide text-amber-500/80 lg:text-xs">
              {TAGLINE}
            </p>
          </Link>

          <nav
            className="hidden items-center gap-1 lg:flex"
            aria-label="Desktop navigation"
          >
            {desktopLinks.map(({ href, label }) => {
              const active =
                pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "rounded-xl px-4 py-2 text-sm font-medium transition",
                    active
                      ? "bg-zinc-900 text-emerald-400"
                      : "text-zinc-400 hover:bg-zinc-900/60 hover:text-white"
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {!loading && (
              <>
                {isAuthenticated ? (
                  <UserButton
                    appearance={{
                      elements: {
                        avatarBox: "h-9 w-9",
                      },
                    }}
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <SignInButton mode="modal">
                      <button
                        type="button"
                        className="hidden rounded-xl px-4 py-2 text-sm font-medium text-zinc-400 transition hover:text-white sm:block"
                      >
                        Sign in
                      </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                      <button type="button" className="btn-primary !px-4 !py-2 text-sm">
                        Sign up
                      </button>
                    </SignUpButton>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4">{children}</main>

      {showFab && (
        <Link
          href="/report"
          className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] right-4 z-40 flex min-h-[48px] items-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-red-500 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_8px_32px_rgba(239,68,68,0.35)] transition hover:scale-[1.02] active:scale-[0.98] lg:bottom-8 lg:right-8"
        >
          <span className="text-lg leading-none">+</span>
          <span className="hidden sm:inline">Report Boof</span>
          <span className="sm:hidden">Report</span>
        </Link>
      )}

      <footer
        className={cn(
          "mx-auto max-w-6xl px-4 pt-8",
          isLanding ? "pb-28 lg:pb-8" : "pb-28"
        )}
      >
        <Disclaimer />
      </footer>

      <MobileNav />
    </div>
  );
}
