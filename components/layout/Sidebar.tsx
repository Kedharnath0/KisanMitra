"use client";

import { useRouter, usePathname } from "next/navigation";
import { X, Sprout, LogOut, ShieldCheck, Store, Send, FileText, TrendingUp, LayoutDashboard, Package } from "lucide-react";
import { useRole } from "@/lib/role-context";
import { useAuth } from "@/lib/auth-context";
import { useBuyerTab, type BuyerTab } from "@/lib/buyer-tab-context";
import { signOutUser } from "@/lib/auth";
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
  const pathname = usePathname();
  const { currentRole } = useRole();
  const { userProfile } = useAuth();
  const { activeTab, setActiveTab } = useBuyerTab();

  // Buyer navigation tabs definition
  const buyerTabs = [
    { label: "Overview", tab: "overview" as BuyerTab, icon: LayoutDashboard },
    { label: "Marketplace", tab: "marketplace" as BuyerTab, icon: Store },
    { label: "My Bids", tab: "bids" as BuyerTab, icon: Send },
    { label: "Contracts & Orders", tab: "contracts" as BuyerTab, icon: FileText },
  ];

  // Navigation items based on active role for other roles
  const getNavSections = (): NavSection[] => {
    switch (currentRole) {
      case "FARMER":
      case "FPO":
        return [
          {
            title: "Farmer Portal",
            items: [
              { label: "Dashboard", href: "/farmer", icon: "LayoutDashboard" },
              { label: "Market Prices", href: "/farmer", icon: "TrendingUp" },
              { label: "My Lots", href: "/farmer", icon: "Package" },
            ],
          },
        ];
      case "ADMIN":
        return [
          {
            title: "Admin Console",
            items: [
              { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
            ],
          },
        ];
      default:
        return [];
    }
  };

  const navSections = getNavSections();
  const portalTitle =
    currentRole === "BUYER"
      ? "Buyer Portal"
      : currentRole === "ADMIN"
      ? "Admin Console"
      : "Farmer Portal";

  const userName =
    userProfile?.name ||
    (currentRole === "BUYER"
      ? "Sri Lakshmi Traders"
      : currentRole === "ADMIN"
      ? "Platform Admin"
      : "Ramesh Kumar");

  const roleBadge =
    currentRole === "BUYER"
      ? "Buyer"
      : currentRole === "ADMIN"
      ? "Admin"
      : "Farmer";

  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (e) {
      // ignore
    }
    router.push("/login");
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#0E2318]/80 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 sm:w-80 shrink-0 transform bg-[#163C29] border-r border-[#F4F1E4]/15 shadow-2xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 text-[#F4F1E4] flex flex-col justify-between select-none",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* TOP SECTION: Prominent app logo / portal title with generous padding */}
        <div className="pt-8 pb-6 px-6 border-b border-[#F4F1E4]/10 bg-[#0E2318]/25">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#D9A441] to-[#C08A2E] text-[#0E2318] shadow-lg shadow-[#D9A441]/25 ring-1 ring-[#D9A441]/40">
                <Sprout className="h-7 w-7 stroke-[2.5]" />
              </div>
              <div>
                <span className="font-['Fraunces',serif] text-2xl font-bold tracking-tight text-[#F4F1E4] block leading-tight">
                  KisanMitra
                </span>
                <span className="text-xs font-bold text-[#D9A441] uppercase tracking-wider block mt-1">
                  {portalTitle}
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="lg:hidden rounded-xl p-2 text-[#F4F1E4]/70 hover:text-[#F4F1E4] hover:bg-[#F4F1E4]/10 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* MIDDLE NAVIGATION: Spacious with vertical breathing room */}
        <nav className="flex flex-col gap-3 px-4 flex-1 py-6 overflow-y-auto">
          {currentRole === "BUYER" ? (
            <div className="flex flex-col gap-2.5">
              <p className="px-3 text-xs font-black uppercase tracking-[0.16em] text-[#D9A441]/90">
                Buyer Workspace
              </p>
              <div className="flex flex-col gap-2.5">
                {buyerTabs.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.tab;

                  return (
                    <button
                      key={item.tab}
                      type="button"
                      onClick={() => {
                        setActiveTab(item.tab);
                        if (pathname !== "/buyer") {
                          router.push(`/buyer?tab=${item.tab}`);
                        }
                        if (window.innerWidth < 1024) {
                          onClose();
                        }
                      }}
                      className={cn(
                        "group flex items-center justify-between rounded-2xl py-3.5 px-4 text-base sm:text-lg tracking-wide transition-all duration-200 cursor-pointer w-full text-left",
                        isActive
                          ? "bg-[#D9A441]/15 text-[#D9A441] border border-[#D9A441]/30 font-bold shadow-lg shadow-[#D9A441]/10"
                          : "text-[#F4F1E4]/80 hover:text-[#D9A441] hover:bg-[#F4F1E4]/5 border border-transparent font-medium"
                      )}
                    >
                      <div className="flex items-center gap-3.5">
                        <Icon
                          className={cn(
                            "h-7 w-7 flex-shrink-0 transition-all",
                            isActive
                              ? "text-[#D9A441] drop-shadow-[0_0_8px_rgba(217,164,65,0.6)]"
                              : "text-[#F4F1E4]/70 group-hover:text-[#D9A441]"
                          )}
                        />
                        <span>{item.label}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            navSections.map((section) => (
              <div key={section.title} className="flex flex-col gap-2.5">
                <p className="px-3 text-xs font-black uppercase tracking-[0.16em] text-[#D9A441]/90">
                  {section.title}
                </p>
                <div className="flex flex-col gap-2.5">
                  {section.items.map((item) => (
                    <SidebarItem
                      key={item.href + item.label}
                      item={item}
                      onClick={() => {
                        if (window.innerWidth < 1024) {
                          onClose();
                        }
                      }}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </nav>

        {/* BOTTOM SECTION: User status & Sign Out cleanly docked to bottom */}
        <div className="mt-auto p-6 border-t border-[#F4F1E4]/10 bg-[#0E2318]/50">
          <div className="mb-4 flex items-center gap-3.5">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#D9A441]/20 text-[#D9A441] ring-1 ring-[#D9A441]/40 shadow-sm">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="overflow-hidden">
              <p className="truncate text-base font-bold text-[#F4F1E4]">
                {userName}
              </p>
              <p className="flex items-center gap-1.5 text-xs font-semibold text-[#D9A441] mt-0.5">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Verified {roleBadge}
              </p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-[#F4F1E4]/15 bg-[#F4F1E4]/5 py-3.5 px-4 text-base font-bold text-[#F4F1E4] transition-all duration-200 hover:border-red-400/50 hover:bg-red-500/15 hover:text-red-300 active:scale-[0.99] cursor-pointer"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
