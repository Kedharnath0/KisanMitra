"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type BuyerView = "overview" | "marketplace" | "bids" | "contracts";
export type BuyerTab = BuyerView;

interface BuyerTabContextType {
  currentView: BuyerView;
  setCurrentView: (view: BuyerView) => void;
  // Aliases for compatibility
  activeTab: BuyerView;
  setActiveTab: (view: BuyerView) => void;
}

const BuyerTabContext = createContext<BuyerTabContextType>({
  currentView: "marketplace",
  setCurrentView: () => {},
  activeTab: "marketplace",
  setActiveTab: () => {},
});

export function BuyerTabProvider({ children }: { children: React.ReactNode }) {
  const [currentView, setCurrentViewState] = useState<BuyerView>("marketplace");

  // Read view/tab from URL query on initial client load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = (params.get("view") || params.get("tab")) as BuyerView | null;
      if (tabParam && ["overview", "marketplace", "bids", "contracts"].includes(tabParam)) {
        setCurrentViewState(tabParam);
      }
    }
  }, []);

  const setCurrentView = (view: BuyerView) => {
    setCurrentViewState(view);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", view);
      window.history.replaceState({}, "", url.toString());
    }
  };

  return (
    <BuyerTabContext.Provider
      value={{
        currentView,
        setCurrentView,
        activeTab: currentView,
        setActiveTab: setCurrentView,
      }}
    >
      {children}
    </BuyerTabContext.Provider>
  );
}

export function useBuyerTab() {
  const context = useContext(BuyerTabContext);
  if (!context) {
    return {
      currentView: "marketplace" as BuyerView,
      setCurrentView: () => {},
      activeTab: "marketplace" as BuyerView,
      setActiveTab: () => {},
    };
  }
  return context;
}
