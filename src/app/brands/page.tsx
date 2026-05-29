import Link from "next/link";
import { fetchBrandNames } from "@/lib/convex/queries";
import { AppShell } from "@/components/AppShell";
import { PageTransition } from "@/components/PageTransition";
import { slugify } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

export default async function BrandsPage() {
  const brands = await fetchBrandNames();

  return (
    <AppShell>
      <PageTransition>
        <div className="py-4">
          <h2 className="font-heading text-2xl font-bold text-white">Brands</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Community trust scores by brand
          </p>
          <ul className="mt-6 space-y-2">
            {brands.map((name) => (
              <li key={name}>
                <Link
                  href={`/brands/${slugify(name)}`}
                  className="glass-card flex items-center justify-between px-4 py-3.5 transition hover:border-zinc-700"
                >
                  <span className="font-medium text-white">{name}</span>
                  <ChevronRight className="h-4 w-4 text-zinc-600" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </PageTransition>
    </AppShell>
  );
}
