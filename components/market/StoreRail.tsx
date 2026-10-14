import Link from "next/link";
import type { Store } from "@/lib/types";
import StoreMark from "../StoreMark";

// Fileira "Entregando hoje" no topo da home: só as lojas atendendo agora (a lista completa fica mais embaixo).
export default function StoreRail({ stores }: { stores: Store[] }) {
  const open = stores.filter((s) => s.deliveryOpen);
  if (!open.length) return null;
  return (
    <nav aria-labelledby="entregando-hoje" className="mt-5 sm:mt-7">
      <p id="entregando-hoje" className="flex items-center gap-2 text-sm font-medium text-emerald-700">
        <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" />
        Entregando hoje
      </p>
      <ul className="relative mt-3 flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 pb-1">
        {open.map((s) => (
          <li key={s.id} className="shrink-0 w-[4.5rem] sm:w-20">
            <Link
              href={`/${s.slug}`}
              className="group flex flex-col items-center gap-1.5 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-dark"
            >
              <StoreMark store={s} size={56} round className="ring-2 ring-white group-hover:ring-brand-line transition-shadow" />
              <span className="w-full text-center text-xs font-medium leading-tight line-clamp-2 break-words">{s.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
