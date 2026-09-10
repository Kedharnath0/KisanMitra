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
  const isActive =
    pathname === item.href ||
    (item.href !== "/" && item.href !== "/buyer" && item.href !== "/farmer" && pathname.startsWith(`${item.href}/`));

  // Dynamically render the icon
  const Icon = (Icons as any)[item.icon] || Icons.Circle;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "group flex items-center justify-between rounded-2xl py-4 px-5 text-base sm:text-lg font-semibold tracking-wide transition-all duration-200 cursor-pointer",
        isActive
          ? "bg-[#D9A441]/15 border border-[#D9A441]/40 text-[#D9A441] shadow-lg shadow-[#D9A441]/10"
          : "text-[#F4F1E4] hover:text-[#D9A441] hover:bg-[#F4F1E4]/5 border border-transparent"
      )}
    >
      <div className="flex items-center gap-4">
        <Icon
          className={cn(
            "h-7 w-7 flex-shrink-0 transition-colors",
            isActive ? "text-[#D9A441]" : "text-[#F4F1E4] group-hover:text-[#D9A441]"
          )}
        />
        <span>{item.label}</span>
      </div>
      {item.badge !== undefined && item.badge > 0 && (
        <span
          className={cn(
            "inline-flex items-center rounded-full px-3 py-1 text-xs font-black",
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
