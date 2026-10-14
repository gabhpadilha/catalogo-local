"use client";

import { useState } from "react";
import Link from "next/link";
import type { SearchResult } from "@/lib/search";
import type { SearchStore } from "@/lib/types";
import StoreMark from "../StoreMark";
import { ChevronRightIcon } from "../icons";
import ResultCard from "./ResultCard";

const PAGE = 24;

const countLabel = (items: SearchResult["items"], storeBySlug: Map<string, SearchStore>) => {
  const slugs = new Set(items.map((i) => i.store));
  const n = items.length;
  const products = `${n} ${n === 1 ? "produto" : "produtos"}`;
  return slugs.size === 1 ? `${products} na ${storeBySlug.get([...slugs][0])?.name ?? "loja"}` : `${products} em ${slugs.size} lojas`;
};

type Props = {
  query: string;
  result: SearchResult | null;
  storeBySlug: Map<string, SearchStore> | null;
  failed: boolean;
  onRetry: () => void;
  onClear: () => void;
};

export default function SearchResults({ query, result, storeBySlug, failed, onRetry, onClear }: Props) {
  const [limit, setLimit] = useState(PAGE);

  if (failed) {
    return (
      <div className="py-14 text-center">
        <p className="font-semibold">Não foi possível carregar a busca.</p>
        <p className="mt-1 text-brand-muted">Confira a conexão e tente de novo.</p>
        <button type="button" onClick={onRetry} className="mt-5 h-11 px-5 rounded-full bg-brand-dark text-brand-light font-semibold text-sm">
          Tentar de novo
        </button>
      </div>
    );
  }
  if (!result || !storeBySlug) return <p className="py-14 text-center text-brand-muted">Buscando nas lojas…</p>;

  const { stores, items } = result;
  if (!stores.length && !items.length) {
    return (
      <div className="py-14 text-center max-w-md mx-auto">
        <p className="headline font-bold text-xl">Nenhuma loja tem &ldquo;{query}&rdquo; ainda</p>
        <p className="mt-2 text-brand-muted">Confira a escrita ou tente uma palavra mais geral, como o tipo do produto.</p>
        <button type="button" onClick={onClear} className="mt-6 h-11 px-5 rounded-full bg-brand-dark text-brand-light font-semibold text-sm">
          Ver todas as lojas
        </button>
      </div>
    );
  }

  return (
    <div className="pt-4 pb-4">
      {stores.length > 0 && (
        <section aria-labelledby="lojas-encontradas" className="mb-8">
          <h2 id="lojas-encontradas" className="text-sm font-medium text-brand-muted mb-3">
            {stores.length === 1 ? "Loja" : "Lojas"}
          </h2>
          <ul className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
            {stores.map((s) => (
              <li key={s.slug} className="shrink-0">
                <Link
                  href={`/${s.slug}`}
                  className="flex items-center gap-3 rounded-2xl bg-white ring-1 ring-brand-line py-2.5 pl-2.5 pr-3 hover:ring-brand-dark/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-dark"
                >
                  <StoreMark store={s} size={36} />
                  <span className="leading-tight">
                    <span className="block font-semibold">{s.name}</span>
                    <span className="block text-xs text-brand-muted">{s.segment}</span>
                  </span>
                  <ChevronRightIcon className="w-4 h-4 text-brand-muted" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {items.length > 0 ? (
        <section aria-labelledby="produtos-encontrados">
          <h2 id="produtos-encontrados" className="text-sm font-medium text-brand-muted mb-3 tabular-nums">
            {countLabel(items, storeBySlug)}
          </h2>
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {items.slice(0, limit).map((item) => {
              const store = storeBySlug.get(item.store);
              return store ? (
                <li key={item.id}>
                  <ResultCard item={item} store={store} />
                </li>
              ) : null;
            })}
          </ul>
          {items.length > limit && (
            <div className="mt-8 text-center">
              <button type="button" onClick={() => setLimit((l) => l + PAGE)} className="h-11 px-5 rounded-full bg-white ring-1 ring-brand-line font-semibold text-sm hover:ring-brand-dark/30">
                Ver mais produtos
              </button>
            </div>
          )}
        </section>
      ) : (
        <p className="text-brand-muted">Nenhum produto com &ldquo;{query}&rdquo; no nome. Veja as lojas acima.</p>
      )}
    </div>
  );
}
