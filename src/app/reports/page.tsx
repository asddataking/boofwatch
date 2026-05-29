import { preloadApprovedMeetupReports, preloadApprovedReports } from "@/lib/convex/queries";
import {
  getSeedApprovedMeetupReports,
  getSeedApprovedReports,
} from "@/lib/convex/seed";
import { ReportsClient } from "./ReportsClient";

export default async function ReportsPage() {
  const seedReports = getSeedApprovedReports();
  const seedMeetupReports = getSeedApprovedMeetupReports();
  const [preloadedReports, preloadedMeetupReports] = await Promise.all([
    preloadApprovedReports(),
    preloadApprovedMeetupReports(),
  ]);

  return (
    <ReportsClient
      preloadedReports={preloadedReports}
      seedReports={seedReports}
      preloadedMeetupReports={preloadedMeetupReports}
      seedMeetupReports={seedMeetupReports}
    />
  );
}
