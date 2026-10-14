"use client";

import { useState } from "react";
import type { SearchItem, SearchStore } from "@/lib/types";
import ResultCard from "./ResultCard";

const VISIBLE = 6;

type Props = { id: string; title: string; items: SearchItem[]; stores: Record<string, SearchStore>; eager?: boolean };

// Faixa de produtos da home: uma fileira (rola de lado no mobile) e "Ver todas" abre a grade completa.
// "relative" segura os textos sr-only (absolutos) dentro da rolagem, senão eles esticam a página.
export default function Shelf({ id, title, items, stores, eager = false }: Props) {
  const [open, setOpen] = useState(false);
  const list = items.filter((i) => stores[i.store]);
  const more = list.length > VISIBLE;
  const shown = open ? list : list.slice(0, 12);

  return (
    <section aria-labelledby={id} className="mt-10 sm:mt-12">
      <div className="flex items-baseline justify-between gap-4">
        <h2 id={id} className="headline font-bold text-2xl sm:text-3xl">{title}</h2>
        {more && (
          <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="text-sm font-semibold text-brand-dark underline-offset-4 hover:underline">
            {open ? "Mostrar menos" : `Ver todas (${list.length})`}
          </button>
        )}
      </div>
      <ul
        className={
          open
            ? "mt-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3"
            : "relative mt-5 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-px-4 lg:grid lg:grid-cols-6 lg:overflow-visible"
        }
      >
        {shown.map((item, i) => (
          <li key={item.id} className={open ? undefined : `w-44 sm:w-52 lg:w-auto shrink-0 snap-start ${i >= VISIBLE ? "lg:hidden" : ""}`}>
            <ResultCard item={item} store={stores[item.store]} sizes="(min-width: 1024px) 180px, 208px" eager={eager && i < 4} />
          </li>
        ))}
      </ul>
    </section>
  );
}
