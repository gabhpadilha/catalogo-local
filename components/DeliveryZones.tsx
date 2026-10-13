import { DELIVERY_OPTIONS } from "@/lib/delivery";
import { formatPrice } from "@/lib/format";

// Valores de referência: o frete real do Uber Flash é dinâmico e confirmado no WhatsApp.
export default function DeliveryZones() {
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {DELIVERY_OPTIONS.map((opt) => (
        <li
          key={opt.id}
          className={`flex items-center justify-between p-6 rounded-[2.5rem] border transition-shadow hover:shadow-md ${
            opt.pickup ? "bg-brand-dark text-brand-light border-brand-dark" : "bg-white border-gray-100 shadow-sm"
          }`}
        >
          <div>
            <h3 className={`font-black text-xl ${opt.pickup ? "text-brand-light" : "text-brand-dark"}`}>{opt.label}</h3>
            <p className="text-sm text-brand-muted">{opt.pickup ? "Sem custo, combine o horário" : "Uber Flash · estimativa"}</p>
          </div>
          <span className={`font-black text-lg ${opt.pickup ? "text-brand-light" : "text-brand-primary"}`}>
            {opt.pickup ? "Grátis" : `~${formatPrice(opt.fee)}`}
          </span>
        </li>
      ))}
    </ul>
  );
}
