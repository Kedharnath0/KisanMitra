"use client";

import { useState } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { RoleProvider } from "@/lib/role-context";
import { FarmerProfileProvider } from "@/lib/farmer-profile-context";
import { ProfileModal } from "@/components/ui/ProfileModal";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <RoleProvider>
      <FarmerProfileProvider>
        <div className="flex h-screen w-full flex-col bg-km-neutral-50 overflow-hidden">
          <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
          <div className="flex flex-1 w-full min-h-0 overflow-hidden relative">
            <Sidebar
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
            />
            <main className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6 lg:p-8 km-dashboard-bg">
              <div className="mx-auto max-w-7xl km-animate-fade-in">
                  {children}
              </div>
            </main>
          </div>
          <ProfileModal />
        </div>
      </FarmerProfileProvider>
    </RoleProvider>
  );
}
