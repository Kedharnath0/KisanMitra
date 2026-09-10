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
        "group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-200 cursor-pointer",
        isActive
          ? "bg-[#0E2318] text-[#F4F1E4] shadow-md border border-[#0E2318] ring-2 ring-[#0E2318]/20 scale-[1.01]"
          : "text-km-neutral-700 hover:bg-km-neutral-100 hover:text-km-neutral-950 border border-transparent hover:border-km-neutral-200/60 active:scale-[0.98]"
      )}
    >
      <div className="flex items-center gap-3">
        <Icon
          className={cn(
            "h-4.5 w-4.5 flex-shrink-0 transition-colors",
            isActive ? "text-[#D9A441]" : "text-km-neutral-400 group-hover:text-km-neutral-700"
          )}
        />
        <span className={cn(isActive && "font-bold tracking-tight")}>{item.label}</span>
      </div>
      {item.badge !== undefined && item.badge > 0 && (
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold",
            isActive
              ? "bg-[#D9A441] text-[#0E2318] shadow-xs"
              : "bg-km-neutral-200 text-km-neutral-800"
          )}
        >
          {item.badge}
        </span>
      )}
    </Link>
  );
}
