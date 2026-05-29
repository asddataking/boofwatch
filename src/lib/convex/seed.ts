import { SEED_MEETUP_REPORTS } from "@/lib/seed-meetup-data";
import { SEED_REPORTS } from "@/lib/seed-data";
import type { MeetupReport, Report } from "@/lib/types";

function sortByCreated<T extends { created_at: string }>(items: T[]): T[] {
  return [...items].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export function getSeedApprovedReports(): Report[] {
  return sortByCreated(
    SEED_REPORTS.filter((r) => !r.status || r.status === "approved")
  );
}

export function getSeedApprovedMeetupReports(): MeetupReport[] {
  return sortByCreated(
    SEED_MEETUP_REPORTS.filter((r) => !r.status || r.status === "approved")
  );
}
