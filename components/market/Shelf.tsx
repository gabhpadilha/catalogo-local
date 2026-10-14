import type { SearchItem, SearchStore } from "@/lib/types";
import ResultCard from "./ResultCard";

// Faixa curta da home (ofertas ou novidades de todas as lojas): rola de lado no mobile,
// uma fileira de 6 no desktop. "relative" segura os textos sr-only (absolutos) dentro da rolagem,
// senão eles esticam a página na horizontal.
export default function Shelf({ title, items, stores }: { title: string; items: SearchItem[]; stores: Map<string, SearchStore> }) {
  return (
    <section aria-labelledby="faixa" className="mt-14 sm:mt-20">
      <h2 id="faixa" className="headline font-bold text-2xl sm:text-3xl">{title}</h2>
      <ul className="relative mt-5 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 flex gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-px-4 lg:grid lg:grid-cols-6 lg:overflow-visible">
        {items.map((item, i) => {
          const store = stores.get(item.store);
          if (!store) return null;
          return (
            <li key={item.id} className={`w-44 sm:w-52 lg:w-auto shrink-0 snap-start ${i >= 6 ? "lg:hidden" : ""}`}>
              <ResultCard item={item} store={store} sizes="(min-width: 1024px) 180px, 208px" />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
