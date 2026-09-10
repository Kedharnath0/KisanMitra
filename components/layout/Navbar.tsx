"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Bell, LogOut } from "lucide-react";
import { useRole } from "@/lib/role-context";

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const router = useRouter();
  const { currentRole } = useRole();

  const handleLogout = async () => {
    try {
      const { signOutUser } = await import("@/lib/auth");
      await signOutUser();
    } catch (error) {
      console.warn("Sign out completed (demo mode):", error);
    }
    router.push("/login");
  };

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
            {/* Logo matching landing page: K monogram in rounded square badge */}
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#D9A441] text-[#0E2318] font-fraunces font-bold text-lg shadow-sm group-hover:scale-105 transition-transform duration-200">
              K
            </div>
            <div>
              <span className="text-xl font-bold font-fraunces text-km-neutral-900 tracking-tight leading-none group-hover:text-[#D9A441] transition-colors">
                KisanMitra
              </span>
              <span className="block text-[10px] font-semibold text-km-neutral-500 tracking-widest uppercase leading-none mt-0.5">
                Smart Market Intel
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          {/* Notification bell with dot */}
          <button className="relative rounded-lg p-2 text-km-neutral-400 hover:text-km-neutral-700 hover:bg-km-neutral-100 transition-all duration-200">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D9A441] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#D9A441]" />
            </span>
            <span className="sr-only">Notifications</span>
          </button>

          {/* User avatar & info */}
          <div className="flex items-center gap-2.5 pl-3 border-l border-km-neutral-200/60">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D9A441]/20 text-[#D9A441] ring-2 ring-white shadow-sm font-bold text-xs">
              {currentRole === "FARMER" ? "RK" : currentRole === "BUYER" ? "FF" : "AD"}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-bold text-km-neutral-900 leading-none tracking-tight">
                {currentRole === "FARMER" ? "Ramesh Kumar" : currentRole === "BUYER" ? "FreshFoods Ltd" : "Admin Officer"}
              </p>
              <p className="text-[10px] font-semibold text-[#D9A441] mt-0.5 uppercase tracking-wider">{currentRole}</p>
            </div>
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-km-neutral-600 hover:text-red-700 hover:bg-red-50 border border-km-neutral-200/80 hover:border-red-200 transition-all duration-200 shadow-2xs"
            title="Logout"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>
    </>
  );
}
