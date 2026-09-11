"use client";

import { useState } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { RoleProvider } from "@/lib/role-context";
import { BuyerTabProvider } from "@/lib/buyer-tab-context";
import { FarmerProfileProvider } from "@/lib/farmer-profile-context";
import { ProfileModal } from "@/components/ui/ProfileModal";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <RoleProvider>
      <FarmerProfileProvider>
        <BuyerTabProvider>
          <div className="flex min-h-screen flex-col bg-[#0E2318] text-[#F4F1E4]">
            <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
            <div className="flex flex-1 overflow-hidden">
              <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
              />
              <main className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6 md:p-8 bg-[#0E2318]">
                <div className="mx-auto max-w-7xl km-animate-fade-in">
                  {children}
                </div>
              </main>
            </div>
            <ProfileModal />
          </div>
        </BuyerTabProvider>
      </FarmerProfileProvider>
    </RoleProvider>
  );
}
