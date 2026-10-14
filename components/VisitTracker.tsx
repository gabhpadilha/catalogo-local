"use client";

import { useEffect } from "react";
import { logStoreEvent } from "@/lib/events";

// Conta uma visita por loja a cada sessão do navegador (não a cada página vista).
export default function VisitTracker({ slug }: { slug: string }) {
  useEffect(() => {
    const key = `visita:${slug}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {}
    logStoreEvent(slug, "visit");
  }, [slug]);
  return null;
}
