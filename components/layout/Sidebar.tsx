"use client";

import { X, Sprout } from "lucide-react";
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
  const { currentRole } = useRole();

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
            ],
          },
          {
            title: "Trading",
            items: [
              { label: "My Lots", href: "/farmer/lots", icon: "Package" },
              { label: "Offers", href: "/farmer/offers", icon: "MessageSquare", badge: 2 },
              { label: "Transactions", href: "/farmer/transactions", icon: "CreditCard" },
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
          "fixed inset-y-0 left-0 z-50 w-[260px] transform bg-white/90 backdrop-blur-xl border-r border-km-neutral-200/60 shadow-[var(--shadow-lg)] transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:pt-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "flex flex-col"
        )}
      >
        {/* Mobile header (visible only on mobile) */}
        <div className="flex h-16 items-center justify-between px-4 lg:hidden border-b border-km-neutral-200/60 bg-transparent">
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

        {/* Navigation sections */}
        <div className="flex-1 overflow-y-auto py-4 px-3">
          {navSections.map((section, sIdx) => (
            <div key={section.title} className={cn(sIdx > 0 && "mt-6")}>
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-km-neutral-400">
                {section.title}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => (
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
            </div>
          ))}
        </div>
        
        {/* Bottom section with Help link and branding */}
        <div className="border-t border-km-neutral-200/60">
          <div className="px-3 py-3">
            <SidebarItem 
              item={{ label: "Help & Support", href: "/support", icon: "LifeBuoy" }} 
            />
          </div>
          <div className="px-5 pb-4 pt-1">
            <p className="text-[10px] font-semibold text-km-neutral-300 tracking-wider uppercase">
              KisanMitra v0.1 · SIH 2026
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
