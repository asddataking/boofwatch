import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-[#050505]">
      <div className="mx-auto max-w-lg px-4 pb-12">
        <AdminDashboard />
      </div>
    </div>
  );
}
