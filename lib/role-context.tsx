"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { usePathname } from "next/navigation";
import type { UserRole } from "@/types";

interface RoleContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const getRoleFromPath = (path: string | null): UserRole => {
    if (path?.startsWith("/buyer")) return "BUYER";
    if (path?.startsWith("/admin")) return "ADMIN";
    if (path?.startsWith("/farmer")) return "FARMER";
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("km_role") as UserRole | null;
      if (saved && ["FARMER", "BUYER", "ADMIN", "FPO"].includes(saved)) {
        return saved;
      }
    }
    return "FARMER";
  };

  const [currentRole, setCurrentRoleState] = useState<UserRole>(() => getRoleFromPath(pathname));

  useEffect(() => {
    if (pathname?.startsWith("/buyer")) {
      setCurrentRoleState("BUYER");
      if (typeof window !== "undefined") localStorage.setItem("km_role", "BUYER");
    } else if (pathname?.startsWith("/admin")) {
      setCurrentRoleState("ADMIN");
      if (typeof window !== "undefined") localStorage.setItem("km_role", "ADMIN");
    } else if (pathname?.startsWith("/farmer")) {
      setCurrentRoleState("FARMER");
      if (typeof window !== "undefined") localStorage.setItem("km_role", "FARMER");
    }
  }, [pathname]);

  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
    if (typeof window !== "undefined") {
      localStorage.setItem("km_role", role);
    }
  };

  return (
    <RoleContext.Provider value={{ currentRole, setCurrentRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
