"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types";
import * as Icons from "lucide-react";

interface SidebarItemProps {
  item: NavItem;
  onClick?: () => void;
}

export function SidebarItem({ item, onClick }: SidebarItemProps) {
  const pathname = usePathname();

  // Exact match for root dashboards, prefix match for deep routes
  const isExact = pathname === item.href;
  const isSub =
    item.href !== "/" &&
    item.href !== "/farmer" &&
    item.href !== "/buyer" &&
    item.href !== "/admin" &&
    pathname.startsWith(`${item.href}/`);
  const isActive = isExact || isSub;

  // Dynamically render the icon
  const Icon = (Icons as any)[item.icon] || Icons.Circle;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "group flex items-center justify-between rounded-2xl py-3.5 px-4 text-base sm:text-lg font-semibold tracking-wide transition-all duration-200 cursor-pointer w-full",
        isActive
          ? "bg-[#D9A441]/15 border border-[#D9A441]/40 text-[#D9A441] shadow-lg shadow-[#D9A441]/10 font-bold"
          : "text-[#F4F1E4]/80 hover:text-[#D9A441] hover:bg-[#F4F1E4]/5 border border-transparent font-medium"
      )}
    >
      <div className="flex items-center gap-3.5">
        <Icon
          className={cn(
            "h-6 w-6 flex-shrink-0 transition-colors",
            isActive ? "text-[#D9A441]" : "text-[#F4F1E4]/70 group-hover:text-[#D9A441]"
          )}
        />
        <span className={cn(isActive && "font-bold tracking-tight")}>{item.label}</span>
      </div>
      {item.badge !== undefined && item.badge > 0 && (
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-black",
            isActive
              ? "bg-[#D9A441] text-[#0E2318]"
              : "bg-[#F4F1E4]/20 text-[#F4F1E4]"
          )}
        >
          {item.badge}
        </span>
      )}
    </Link>
  );
}
