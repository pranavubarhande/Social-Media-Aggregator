"use client";

import React, { createContext, useContext } from "react";
import type { PlatformType } from "@/types/supabase";

interface SelectedPlatformContextValue {
  selectedPlatform: PlatformType;
  setSelectedPlatform: (p: PlatformType) => void;
}

const SelectedPlatformContext = createContext<SelectedPlatformContextValue | undefined>(
  undefined
);

export function SelectedPlatformProvider({
  value,
  children,
}: {
  value: SelectedPlatformContextValue;
  children: React.ReactNode;
}) {
  return (
    <SelectedPlatformContext.Provider value={value}>
      {children}
    </SelectedPlatformContext.Provider>
  );
}

export function useSelectedPlatform() {
  const ctx = useContext(SelectedPlatformContext);
  if (!ctx) {
    throw new Error(
      "useSelectedPlatform must be used within a SelectedPlatformProvider"
    );
  }
  return ctx;
}
