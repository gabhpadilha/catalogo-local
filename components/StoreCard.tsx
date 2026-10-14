import Link from "next/link";
import type { Store } from "@/lib/types";
import StoreMark from "./StoreMark";
import DeliveryStatus from "./DeliveryStatus";
import { ChevronRightIcon } from "./icons";

// Card compacto: marca na cor da loja, nome, segmento e se entrega hoje.
export default function StoreCard({ store }: { store: Store }) {
  return (
    <Link
      href={`/${store.slug}`}
      className="group flex items-center gap-4 h-full rounded-2xl bg-white p-4 ring-1 ring-brand-line hover:ring-brand-dark/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-dark"
    >
      <StoreMark store={store} size={52} />
      <span className="flex-1 min-w-0">
        <span className="block font-semibold leading-tight truncate">{store.name}</span>
        <span className="block text-sm text-brand-muted truncate">{store.segment}</span>
        <DeliveryStatus open={store.deliveryOpen} className={`mt-1 text-xs font-medium ${store.deliveryOpen ? "text-emerald-700" : "text-brand-muted"}`} />
      </span>
      <ChevronRightIcon className="w-5 h-5 shrink-0 text-brand-muted group-hover:text-brand-dark" />
    </Link>
  );
}
