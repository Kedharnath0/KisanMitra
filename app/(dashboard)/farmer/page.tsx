import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Leaf } from "lucide-react";
import AuthGuard from "@/lib/auth-guard";

export default function FarmerDashboard() {
  return (
    <div>
      <PageHeader
        title="Farmer Dashboard"
        description="Welcome to KisanMitra. Manage your produce and get smart market recommendations."
      />
      <EmptyState
        title="Agent 2 Placeholder"
        description="Agent 2 (Farmer module) will build out the market intelligence and lot creation UI here."
        icon={<Leaf className="h-8 w-8 text-km-primary-600" />}
      />
    </div>
  );
}
