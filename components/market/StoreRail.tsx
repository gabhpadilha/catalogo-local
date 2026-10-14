import Link from "next/link";
import type { Store } from "@/lib/types";
import StoreMark from "../StoreMark";

// Fileira de lojas no topo da home (rola de lado, como stories): logo, nome curto e um ponto de entrega.
export default function StoreRail({ stores }: { stores: Store[] }) {
  if (!stores.length) return null;
  return (
    <nav aria-label="Lojas" className="mt-5 sm:mt-7">
      <ul className="relative flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 pb-1">
        {stores.map((s) => (
          <li key={s.id} className="shrink-0 w-[4.5rem] sm:w-20">
            <Link
              href={`/${s.slug}`}
              aria-label={`${s.name}, ${s.deliveryOpen ? "entregando hoje" : "entregas pausadas"}`}
              className="group flex flex-col items-center gap-1.5 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-dark"
            >
              <span className="relative">
                <StoreMark store={s} size={56} round className="ring-2 ring-white group-hover:ring-brand-line transition-shadow" />
                <span
                  aria-hidden="true"
                  className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full ring-2 ring-brand-light ${s.deliveryOpen ? "bg-emerald-500" : "bg-brand-muted"}`}
                />
              </span>
              <span className="w-full text-center text-xs font-medium leading-tight line-clamp-2 break-words">{s.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
