"use client";

import { useState } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { RoleProvider } from "@/lib/role-context";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <RoleProvider>
      <div className="flex min-h-screen flex-col bg-km-neutral-50">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 km-dashboard-bg">
            <div className="mx-auto max-w-7xl km-animate-fade-in">
                {children}
            </div>
          </main>
        </div>
      </div>
    </RoleProvider>
  );
}
