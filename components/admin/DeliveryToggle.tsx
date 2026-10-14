"use client";

import { useOptimistic, useState, useTransition } from "react";
import { setDeliveryOpen } from "@/app/admin/actions";
import Switch from "./Switch";
import { card } from "./ui";

export default function DeliveryToggle({ slug, open, demo = false }: { slug: string; open: boolean; demo?: boolean }) {
  const [pending, start] = useTransition();
  const [optimistic, setOptimistic] = useOptimistic(open);
  const [demoOpen, setDemoOpen] = useState(open);
  const on = demo ? demoOpen : optimistic;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      disabled={pending}
      onClick={() =>
        demo
          ? setDemoOpen(!on)
          : start(async () => {
              setOptimistic(!on);
              await setDeliveryOpen(slug, !on);
            })
      }
      className={`${card} w-full flex items-center justify-between gap-4 text-left`}
    >
      <span>
        <span className="flex items-center gap-2 font-semibold">
          <span className={`w-2.5 h-2.5 rounded-full ${on ? "bg-emerald-500" : "bg-brand-muted"}`} aria-hidden="true" />
          {on ? "Entregando hoje" : "Entregas pausadas"}
        </span>
        <span>
          <span className="block text-sm text-brand-muted mt-0.5">{on ? "Toque para pausar (ex.: sem entregador hoje)." : "Toque para voltar a entregar."}</span>
        </span>
      </span>
      <Switch on={on} />
    </button>
  );
}
