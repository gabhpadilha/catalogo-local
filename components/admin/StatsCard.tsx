import type { StoreStats } from "@/lib/admin";
import { formatPrice } from "@/lib/format";
import { card } from "./ui";

// O primeiro bloco do painel: o resultado da vitrine na semana.
export default function StatsCard({ stats }: { stats: StoreStats }) {
  const items = [
    { label: "Pedidos enviados", value: String(stats.weekOrders) },
    { label: "Em pedidos", value: formatPrice(stats.weekTotal) },
    { label: "Visitas na vitrine", value: String(stats.weekVisits) },
  ];
  return (
    <section aria-labelledby="resumo" className={card}>
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="resumo" className="headline font-bold text-lg">Últimos 7 dias</h2>
        <p className="text-sm text-brand-muted tabular-nums">
          Hoje: {stats.todayOrders} {stats.todayOrders === 1 ? "pedido" : "pedidos"}
          {stats.todayOrders > 0 && <>, {formatPrice(stats.todayTotal)}</>}
        </p>
      </div>
      <dl className="mt-4 grid grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)_minmax(0,1fr)] gap-2">
        {items.map((i) => (
          <div key={i.label} className="rounded-xl bg-brand-soft p-3">
            <dt className="text-xs text-brand-muted leading-tight">{i.label}</dt>
            <dd className="mt-1 text-[15px] sm:text-2xl font-semibold tabular-nums leading-tight whitespace-nowrap">{i.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-xs text-brand-muted">Pedidos enviados pelo WhatsApp a partir da sua vitrine, com o valor mostrado no checkout.</p>
    </section>
  );
}
