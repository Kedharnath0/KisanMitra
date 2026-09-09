"use client";

import Link from "next/link";
import { Menu, Bell, UserCircle, Sprout } from "lucide-react";
import { useRole } from "@/lib/role-context";
import { UserRole } from "@/types";

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { currentRole, setCurrentRole } = useRole();

  return (
    <>
      {/* Premium gradient accent line */}
      <div className="km-accent-line" />
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-km-neutral-200/60 bg-white/90 backdrop-blur-xl px-4 sm:px-6 shadow-[var(--shadow-sm)] transition-all duration-200">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="rounded-lg p-1.5 text-km-neutral-500 hover:text-km-neutral-900 hover:bg-km-neutral-100 lg:hidden transition-all duration-200"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open sidebar</span>
          </button>
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* Logo with leafy gradient */}
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#16A34A] to-[#10B981] text-white shadow-md shadow-green-500/20 ring-1 ring-green-900/10 group-hover:shadow-lg group-hover:shadow-green-500/30 transition-all duration-300">
              <Sprout className="h-5 w-5" />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold text-km-neutral-900 tracking-tight leading-none">
                KisanMitra
              </span>
              <span className="block text-[10px] font-semibold text-km-primary-600 tracking-widest uppercase leading-none mt-0.5">
                Smart Market Intel
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {/* Desktop role switcher — pill style */}
          <div className="hidden sm:flex items-center gap-1.5 bg-km-neutral-100/80 rounded-xl p-1 ring-1 ring-km-neutral-200/60">
            {(["FARMER", "BUYER", "ADMIN"] as UserRole[]).map((role) => (
              <button
                key={role}
                onClick={() => setCurrentRole(role)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-200 uppercase tracking-wider ${
                  currentRole === role
                    ? "bg-white text-km-primary-700 shadow-sm ring-1 ring-km-neutral-200/80"
                    : "text-km-neutral-500 hover:text-km-neutral-700 hover:bg-white/50"
                }`}
              >
                {role === "FARMER" ? "Farmer" : role === "BUYER" ? "Buyer" : "Admin"}
              </button>
            ))}
          </div>

          {/* Notification bell with dot */}
          <button className="relative rounded-lg p-2 text-km-neutral-400 hover:text-km-neutral-700 hover:bg-km-neutral-100 transition-all duration-200">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-km-primary-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-km-primary-500" />
            </span>
            <span className="sr-only">Notifications</span>
          </button>

          {/* User avatar */}
          <div className="flex items-center gap-3 pl-3 border-l border-km-neutral-200/60">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-km-primary-100 to-km-emerald-100 ring-2 ring-white shadow-sm">
              <UserCircle className="h-5 w-5 text-km-primary-600" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-bold text-km-neutral-900 leading-none tracking-tight">Ramesh</p>
              <p className="text-[10px] font-semibold text-km-primary-600 mt-0.5 uppercase tracking-wider">{currentRole}</p>
            </div>
          </div>
          
          {/* Mobile role switcher */}
          <div className="sm:hidden">
            <select
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value as UserRole)}
              className="rounded-lg border border-km-neutral-200 bg-white/80 backdrop-blur-sm px-2 py-1 text-xs font-bold text-km-neutral-700 shadow-sm focus:border-km-primary-500 focus:outline-none focus:ring-2 focus:ring-km-primary-200 transition-all duration-200"
            >
              <option value="FARMER">Farmer</option>
              <option value="FPO">FPO</option>
              <option value="BUYER">Buyer</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        </div>
      </header>
    </>
  );
}
