"use client";

import { createContext, useContext } from "react";
import type { StoreCatalog } from "@/lib/types";

const StoreContext = createContext<StoreCatalog | null>(null);

export function StoreProvider({ catalog, children }: { catalog: StoreCatalog; children: React.ReactNode }) {
  return <StoreContext.Provider value={catalog}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore deve ser usado dentro de <StoreProvider>");
  return ctx;
}
