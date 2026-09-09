import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { ShieldAlert } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div>
      <PageHeader
        title="Admin Console"
        description="Monitor platform activity, resolve disputes, and verify users."
      />
      <EmptyState
        title="Admin Placeholder"
        description="This area is reserved for administrative capabilities."
        icon={<ShieldAlert className="h-8 w-8 text-indigo-600" />}
      />
    </div>
  );
}
