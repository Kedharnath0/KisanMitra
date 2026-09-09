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
  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

  // Dynamically render the icon
  const Icon = (Icons as any)[item.icon] || Icons.Circle;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-km-primary-50/80 text-km-primary-700 shadow-sm ring-1 ring-km-primary-900/5"
          : "text-km-neutral-600 hover:bg-km-neutral-100/50 hover:text-km-neutral-900"
      )}
    >
      <div className="flex items-center gap-3">
        <Icon
          className={cn(
            "h-5 w-5 flex-shrink-0 transition-colors",
            isActive ? "text-km-primary-600" : "text-km-neutral-400 group-hover:text-km-neutral-600"
          )}
        />
        <span>{item.label}</span>
      </div>
      {item.badge !== undefined && item.badge > 0 && (
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold",
            isActive
              ? "bg-km-primary-200 text-km-primary-800"
              : "bg-km-neutral-200 text-km-neutral-800"
          )}
        >
          {item.badge}
        </span>
      )}
    </Link>
  );
}
