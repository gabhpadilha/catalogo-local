"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { SearchStore } from "@/lib/types";
import { cartKey } from "@/lib/storage";
import StoreMark from "../StoreMark";

type OpenCart = { store: SearchStore; count: number };

const countItems = (raw: string | null) => {
  try {
    const data: unknown = JSON.parse(raw ?? "[]");
    if (!Array.isArray(data)) return 0;
    return data.reduce((n: number, i: { quantity?: unknown }) => n + Math.max(0, Math.floor(Number(i?.quantity)) || 0), 0);
  } catch {
    return 0;
  }
};

// A sacola é uma por loja: avisa na home quando o cliente deixou alguma aberta.
export default function OpenCarts({ stores }: { stores: SearchStore[] }) {
  const [carts, setCarts] = useState<OpenCart[]>([]);

  // localStorage só existe no navegador: lê depois de montar.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const found: OpenCart[] = [];
    for (const store of stores) {
      let count = 0;
      try {
        count = countItems(localStorage.getItem(cartKey(store.slug)));
      } catch {}
      if (count > 0) found.push({ store, count });
    }
    setCarts(found);
  }, [stores]);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (!carts.length) return null;
  return (
    <ul aria-label="Sacolas abertas" className="mb-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {carts.map(({ store, count }) => (
        <li key={store.slug}>
          <Link
            href={`/${store.slug}?sacola=1`}
            className="flex items-center gap-3 rounded-2xl bg-white ring-1 ring-brand-line p-3 pr-4 hover:ring-brand-dark/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-dark"
          >
            <StoreMark store={store} size={36} />
            <span className="flex-1 min-w-0 text-sm leading-snug">
              <span className="block font-semibold truncate">Sua sacola na {store.name}</span>
              <span className="text-brand-muted tabular-nums">
                {count} {count === 1 ? "item" : "itens"}
              </span>
            </span>
            <span className="text-sm font-semibold whitespace-nowrap">Ver sacola</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
