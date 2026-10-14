"use client";

import { useOptimistic, useTransition } from "react";
import { setDeliveryOpen } from "@/app/admin/actions";

export default function DeliveryToggle({ slug, open }: { slug: string; open: boolean }) {
  const [pending, start] = useTransition();
  const [optimistic, setOptimistic] = useOptimistic(open);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={optimistic}
      disabled={pending}
      onClick={() =>
        start(async () => {
          setOptimistic(!optimistic);
          await setDeliveryOpen(slug, !optimistic);
        })
      }
      className={`w-full flex items-center justify-between gap-4 rounded-[2rem] p-5 text-left transition-colors ${
        optimistic ? "bg-green-600 text-white" : "bg-gray-200 text-brand-dark"
      }`}
    >
      <span>
        <span className="block text-lg font-black">{optimistic ? "Entregando hoje" : "Entregas pausadas"}</span>
        <span className="block text-sm opacity-80">Toque para {optimistic ? "pausar" : "voltar a entregar"}.</span>
      </span>
      <span className={`w-14 h-8 rounded-full p-1 transition-colors shrink-0 ${optimistic ? "bg-white/30" : "bg-gray-400"}`}>
        <span className={`block w-6 h-6 rounded-full bg-white shadow transition-transform ${optimistic ? "translate-x-6" : ""}`} />
      </span>
    </button>
  );
}
