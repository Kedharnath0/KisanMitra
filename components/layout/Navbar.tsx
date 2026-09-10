"use client";

import Link from "next/link";
import { Menu, Bell, UserCircle, Sprout } from "lucide-react";
import { useRole } from "@/lib/role-context";
import { useAuth } from "@/lib/auth-context";

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { currentRole } = useRole();
  const { userProfile } = useAuth();

  const displayName =
    userProfile?.name ||
    (currentRole === "BUYER"
      ? "Sri Lakshmi Traders"
      : currentRole === "ADMIN"
      ? "Platform Admin"
      : "Ramesh Kumar");

  const roleLabel =
    currentRole === "BUYER"
      ? "Verified Buyer"
      : currentRole === "ADMIN"
      ? "Administrator"
      : "Farmer Portal";

  return (
    <>
      {/* Premium gradient accent line */}
      <div className="h-1 bg-gradient-to-r from-[#163C29] via-[#D9A441] to-[#163C29]" />
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#F4F1E4]/10 bg-[#163C29]/85 backdrop-blur-md px-4 sm:px-6 shadow-2xl transition-all duration-200 text-[#F4F1E4]">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="rounded-lg p-1.5 text-[#F4F1E4]/70 hover:text-[#F4F1E4] hover:bg-[#F4F1E4]/10 lg:hidden transition-all duration-200"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open sidebar</span>
          </button>
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* Logo with gold gradient */}
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#D9A441] to-[#C08A2E] text-[#0E2318] shadow-md shadow-[#D9A441]/20 ring-1 ring-[#D9A441]/30 group-hover:shadow-lg group-hover:shadow-[#D9A441]/40 transition-all duration-300">
              <Sprout className="h-5 w-5" />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold text-[#F4F1E4] tracking-tight leading-none font-['Fraunces',serif]">
                KisanMitra
              </span>
              <span className="block text-[10px] font-semibold text-[#D9A441] tracking-widest uppercase leading-none mt-0.5">
                Smart Market Intel
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {/* Notification bell with dot */}
          <button className="relative rounded-lg p-2 text-[#F4F1E4]/70 hover:text-[#D9A441] hover:bg-[#F4F1E4]/10 transition-all duration-200">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#D9A441] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#D9A441]" />
            </span>
            <span className="sr-only">Notifications</span>
          </button>

          {/* User avatar & badge */}
          <div className="flex items-center gap-3 pl-3 border-l border-[#F4F1E4]/15">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D9A441]/20 text-[#D9A441] ring-2 ring-[#D9A441]/40 shadow-sm">
              <UserCircle className="h-5 w-5" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-bold text-[#F4F1E4] leading-none tracking-tight">
                {displayName}
              </p>
              <p className="text-[10px] font-semibold text-[#D9A441] mt-0.5 uppercase tracking-wider">
                {roleLabel}
              </p>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
