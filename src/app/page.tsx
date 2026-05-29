import { HomeClient } from "./HomeClient";
import { preloadApprovedReports } from "@/lib/convex/queries";
import { getSeedApprovedReports } from "@/lib/convex/seed";

export default async function HomePage() {
  const seedReports = getSeedApprovedReports();
  const preloadedReports = await preloadApprovedReports();

  return (
    <HomeClient preloadedReports={preloadedReports} seedReports={seedReports} />
  );
}
