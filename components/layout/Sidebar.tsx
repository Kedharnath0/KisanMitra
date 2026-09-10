"use client";

import { useRouter } from "next/navigation";
import { X, Sprout, LogOut } from "lucide-react";
import { useRole } from "@/lib/role-context";
import { SidebarItem } from "./SidebarItem";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter();
  const { currentRole } = useRole();

  const handleLogout = async () => {
    try {
      const { signOutUser } = await import("@/lib/auth");
      await signOutUser();
    } catch (error) {
      console.warn("Sign out completed (demo mode):", error);
    }
    if (window.innerWidth < 1024) {
      onClose();
    }
    router.push("/login");
  };

  // Define navigation items grouped by section based on role
  const getNavSections = (): NavSection[] => {
    switch (currentRole) {
      case "FARMER":
      case "FPO":
        return [
          {
            title: "Overview",
            items: [
              { label: "Dashboard", href: "/farmer", icon: "LayoutDashboard" },
            ],
          },
          {
            title: "Intelligence",
            items: [
              { label: "Market Prices", href: "/farmer/markets", icon: "TrendingUp" },
              { label: "Recommendations", href: "/farmer/recommendations", icon: "Lightbulb" },
            ],
          },
          {
            title: "Trading",
            items: [
              { label: "My Crops", href: "/farmer/lots", icon: "Package" },
              { label: "Offers", href: "/farmer/offers", icon: "MessageSquare", badge: 2 },
              { label: "Transactions", href: "/farmer/transactions", icon: "CreditCard" },
            ],
          },
          {
            title: "Support",
            items: [
              { label: "Help & Support", href: "/support", icon: "LifeBuoy" },
            ],
          },
        ];
      case "BUYER":
        return [
          {
            title: "Overview",
            items: [
              { label: "Dashboard", href: "/buyer", icon: "LayoutDashboard" },
            ],
          },
          {
            title: "Sourcing",
            items: [
              { label: "My Demand", href: "/buyer/demand", icon: "ClipboardList" },
              { label: "Available Lots", href: "/buyer/lots", icon: "Search" },
            ],
          },
          {
            title: "Trading",
            items: [
              { label: "Offers Made", href: "/buyer/offers", icon: "Send" },
              { label: "Transactions", href: "/buyer/transactions", icon: "CreditCard" },
            ],
          },
          {
            title: "Support",
            items: [
              { label: "Help & Support", href: "/support", icon: "LifeBuoy" },
            ],
          },
        ];
      case "ADMIN":
        return [
          {
            title: "Overview",
            items: [
              { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
            ],
          },
          {
            title: "Management",
            items: [
              { label: "Users", href: "/admin/users", icon: "Users" },
              { label: "Disputes", href: "/admin/disputes", icon: "AlertTriangle" },
              { label: "Market Data", href: "/admin/markets", icon: "Database" },
            ],
          },
          {
            title: "Support",
            items: [
              { label: "Help & Support", href: "/support", icon: "LifeBuoy" },
            ],
          },
        ];
      default:
        return [];
    }
  };

  const navSections = getNavSections();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-km-neutral-900/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          // Base & mobile styles
          "fixed inset-y-0 left-0 z-40 w-64 min-w-[16rem] max-w-[16rem] bg-white border-r border-km-neutral-200/60 shadow-xl transition-transform duration-300 ease-in-out flex flex-col shrink-0",
          // Desktop styles: permanently visible, full container height, in-flow
          "lg:relative lg:inset-auto lg:top-0 lg:h-full lg:translate-x-0 lg:shadow-none lg:z-10",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Mobile header (visible only on mobile) */}
        <div className="flex h-16 items-center justify-between px-4 lg:hidden border-b border-km-neutral-200/60 bg-transparent shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#16A34A] to-[#10B981] text-white shadow-sm">
              <Sprout className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold text-km-neutral-900 tracking-tight">KisanMitra</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-km-neutral-400 hover:text-km-neutral-900 hover:bg-km-neutral-100 transition-all duration-200"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close sidebar</span>
          </button>
        </div>

        {/* Navigation items (without section labels) */}
        <div className="flex-1 min-h-0 overflow-y-auto py-5 px-3 space-y-1.5">
          {navSections.flatMap((section) => section.items).map((item) => (
            <SidebarItem
              key={item.href}
              item={item}
              onClick={() => {
                // Close sidebar on mobile when an item is clicked
                if (window.innerWidth < 1024) {
                  onClose();
                }
              }}
            />
          ))}
        </div>
        
        {/* Bottom branding & Logout */}
        <div className="border-t border-km-neutral-200/60 p-3 space-y-2 shrink-0">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-km-neutral-600 hover:bg-red-50 hover:text-red-700 transition-colors group"
          >
            <LogOut className="h-4 w-4 text-km-neutral-400 group-hover:text-red-600 transition-colors" />
            <span>Sign Out / Logout</span>
          </button>
          <div className="px-3 pt-1">
            <p className="text-[10px] font-semibold text-km-neutral-400 tracking-wider uppercase">
              KisanMitra v0.1
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
