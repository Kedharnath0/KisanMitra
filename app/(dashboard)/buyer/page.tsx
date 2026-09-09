import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { ShoppingCart } from "lucide-react";

export default function BuyerDashboard() {
  return (
    <div>
      <PageHeader
        title="Buyer Dashboard"
        description="Browse available lots, make offers, and track your active purchases."
      />
      <EmptyState
        title="Agent 3 Placeholder"
        description="Agent 3 (Buyer module) will build out the marketplace and offer flows here."
        icon={<ShoppingCart className="h-8 w-8 text-emerald-600" />}
      />
    </div>
  );
}
