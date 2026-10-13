import Link from "next/link";
import type { Store } from "@/lib/types";

export default function StoreCard({ store }: { store: Store }) {
  return (
    <Link
      href={`/${store.slug}`}
      className="group flex items-center gap-5 bg-white p-5 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-shadow focus-visible:outline-2 focus-visible:outline-brand-primary"
    >
      <div
        className="w-20 h-20 shrink-0 rounded-[1.75rem] flex items-center justify-center text-4xl font-black group-hover:scale-105 transition-transform"
        style={{ background: store.theme.primary, color: store.theme.light }}
        aria-hidden="true"
      >
        {store.name.charAt(0)}
      </div>
      <div className="min-w-0 flex-1">
        <span className="text-[11px] font-bold text-brand-muted uppercase tracking-wider">{store.segment}</span>
        <h3 className="text-xl font-black text-brand-dark leading-tight truncate">{store.name}</h3>
        <p className="text-sm text-brand-muted line-clamp-2">{store.tagline}</p>
        <span className={`inline-flex items-center gap-1.5 mt-2 text-[11px] font-bold ${store.deliveryOpen ? "text-green-700" : "text-brand-muted"}`}>
          <span className={`w-2 h-2 rounded-full ${store.deliveryOpen ? "bg-green-500" : "bg-gray-400"}`} />
          {store.deliveryOpen ? "Entregando hoje" : "Entregas pausadas"}
        </span>
      </div>
    </Link>
  );
}
