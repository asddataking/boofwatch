import Link from "next/link";

export const metadata = {
  title: "BoofMap — Offline",
};

export default function OfflinePage() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center">
      <h1 className="font-heading text-2xl font-bold">
        <span className="text-emerald-400">Boof</span>
        <span className="text-white">Map</span>
      </h1>
      <p className="mt-3 max-w-xs text-sm text-zinc-500">
        You&apos;re offline. Reconnect to load fresh community reports.
      </p>
      <Link href="/" className="btn-primary mt-6">
        Open BoofMap
      </Link>
    </div>
  );
}
