"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface BankAccountDetails {
  accountHolder: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
}

export interface FarmerProfile {
  name: string;
  phone: string;
  village: string;
  district: string;
  state: string;
  location: string;
  acres: string;
  crops: string[];
  bankAccount: BankAccountDetails;
}

const DEFAULT_PROFILE: FarmerProfile = {
  name: "Ramesh Kumar",
  phone: "9876543210",
  village: "Tadikonda",
  district: "Guntur",
  state: "Andhra Pradesh",
  location: "Tadikonda, Guntur",
  acres: "4.5",
  crops: ["Tomato", "Chilli"],
  bankAccount: {
    accountHolder: "Ramesh Kumar",
    accountNumber: "918234567890",
    ifscCode: "SBIN0001234",
    bankName: "State Bank of India",
  },
};

interface FarmerProfileContextType {
  profile: FarmerProfile;
  updateProfile: (updated: Partial<FarmerProfile>) => void;
  isProfileOpen: boolean;
  setIsProfileOpen: (open: boolean) => void;
}

const FarmerProfileContext = createContext<FarmerProfileContextType | undefined>(undefined);

const STORAGE_KEY = "kisanmitra_farmer_profile_v1";

export function FarmerProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<FarmerProfile>(DEFAULT_PROFILE);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Load from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setProfile((prev) => ({ ...prev, ...parsed }));
      }
    } catch (e) {
      console.warn("Failed to read profile from localStorage:", e);
    }
    setIsInitialized(true);
  }, []);

  const updateProfile = (updated: Partial<FarmerProfile>) => {
    setProfile((prev) => {
      const next = {
        ...prev,
        ...updated,
        bankAccount: {
          ...prev.bankAccount,
          ...(updated.bankAccount || {}),
        },
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.warn("Failed to persist profile to localStorage:", e);
      }
      return next;
    });
  };

  return (
    <FarmerProfileContext.Provider
      value={{
        profile,
        updateProfile,
        isProfileOpen,
        setIsProfileOpen,
      }}
    >
      {children}
    </FarmerProfileContext.Provider>
  );
}

export function useFarmerProfile() {
  const context = useContext(FarmerProfileContext);
  if (!context) {
    throw new Error("useFarmerProfile must be used within a FarmerProfileProvider");
  }
  return context;
}
