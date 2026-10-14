import type { DeliveryZone } from "@/lib/types";
import { formatPrice } from "@/lib/format";

// Valores de referência: o frete real do Uber Flash é dinâmico e confirmado no WhatsApp.
export default function DeliveryZones({ zones }: { zones: DeliveryZone[] }) {
  return (
    <ul className="rounded-2xl bg-white border border-brand-line divide-y divide-brand-line">
      {zones.map((z) => (
        <li key={z.id} className="flex items-center justify-between gap-4 px-5 py-4">
          <div>
            <p className="font-medium">{z.label}</p>
            <p className="text-sm text-brand-muted">{z.pickup ? "Combine o horário no WhatsApp" : "Uber Flash, valor estimado"}</p>
          </div>
          <span className={`font-semibold tabular-nums ${z.pickup ? "text-brand-primary" : "text-brand-dark"}`}>
            {z.pickup ? "Grátis" : formatPrice(z.fee)}
          </span>
        </li>
      ))}
    </ul>
  );
}
