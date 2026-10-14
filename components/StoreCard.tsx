import Link from "next/link";
import Image from "next/image";
import type { Store } from "@/lib/types";
import StoreMark from "./StoreMark";
import DeliveryStatus from "./DeliveryStatus";

// Capa na cor da loja: cada vitrine traz a própria identidade para a lista.
export default function StoreCard({ store, eager = false }: { store: Store; eager?: boolean }) {
  const { theme, hero } = store;
  return (
    <Link
      href={`/${store.slug}`}
      className="group flex flex-col h-full rounded-2xl bg-white p-2 ring-1 ring-brand-line hover:ring-brand-dark/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-dark"
    >
      <div className="relative aspect-[16/9] rounded-xl overflow-hidden grid place-items-center" style={{ background: theme.primary }}>
        {hero.imageUrl ? (
          <Image src={hero.imageUrl} alt="" fill loading={eager ? "eager" : undefined} sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw" className="object-contain p-3 drop-shadow-[0_10px_10px_rgba(0,0,0,0.2)]" />
        ) : (
          <StoreMark store={store} size={72} />
        )}
      </div>
      <div className="flex flex-1 flex-col px-2 pt-4 pb-2">
        <h3 className="font-semibold text-lg leading-tight truncate">{store.name}</h3>
        <p className="mt-1 text-sm text-brand-muted">{store.segment}</p>
        {store.tagline && <p className="mt-3 text-sm text-brand-dark line-clamp-2">{store.tagline}</p>}
        <DeliveryStatus open={store.deliveryOpen} className={`mt-auto pt-4 text-xs font-medium ${store.deliveryOpen ? "text-emerald-700" : "text-brand-muted"}`} />
      </div>
    </Link>
  );
}
