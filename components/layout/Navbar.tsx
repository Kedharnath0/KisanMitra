"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { useRole } from "@/lib/role-context";
import { useFarmerProfile } from "@/lib/farmer-profile-context";
import { NotificationsDropdown } from "@/components/ui/NotificationsDropdown";

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const router = useRouter();
  const { currentRole } = useRole();
  const { profile, setIsProfileOpen } = useFarmerProfile();

  // Initials for avatar
  const initials = profile.name
    ? profile.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "RK";

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
          {/* Functional Notification dropdown */}
          <NotificationsDropdown />

          {/* User profile button — opens Profile modal */}
          <button
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center gap-2.5 pl-3 border-l border-km-neutral-200/60 group hover:opacity-90 transition-all rounded-xl p-1.5 hover:bg-km-neutral-50 text-left"
            title="Click to view and edit profile"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#D9A441]/20 text-[#D9A441] ring-2 ring-white shadow-sm font-bold text-xs group-hover:ring-[#D9A441]/40 transition-all">
              {currentRole === "FARMER" ? initials : currentRole === "BUYER" ? "FF" : "AD"}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-bold text-km-neutral-900 leading-none tracking-tight group-hover:text-[#D9A441] transition-colors">
                {currentRole === "FARMER" ? profile.name : currentRole === "BUYER" ? "FreshFoods Ltd" : "Admin Officer"}
              </p>
              <p className="text-[10px] font-semibold text-[#D9A441] mt-0.5 uppercase tracking-wider">
                {currentRole} · Edit Profile
              </p>
            </div>
          </button>
        </div>
      </header>
    </>
  );
}
