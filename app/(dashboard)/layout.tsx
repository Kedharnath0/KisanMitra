import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AuthProvider } from "@/lib/auth-context";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#0E2318] text-[#F4F1E4]">
        <DashboardLayout>{children}</DashboardLayout>
      </div>
    </AuthProvider>
  );
}
