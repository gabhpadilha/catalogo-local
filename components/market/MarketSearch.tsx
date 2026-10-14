"use client";

import { useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import FilterPills from "../FilterPills";
import { CloseIcon, SearchIcon } from "../icons";
import SearchResults from "./SearchResults";
import { MIN_QUERY, loadSearchIndex, logSearchMiss, search, type PreparedIndex } from "@/lib/search";
import { normalize } from "@/lib/format";
import { LAST_SEARCH_KEY } from "@/lib/storage";

type Props = {
  title: string;
  tagline: string;
  categories: string[];
  /** Conteúdo da home sem busca (lojas e faixa de ofertas), renderizado no servidor. */
  children: React.ReactNode;
};

// Busca entre todas as lojas: com texto, os resultados ocupam o lugar das lojas.
export default function MarketSearch({ title, tagline, categories, children }: Props) {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState<PreparedIndex | null>(null);
  const [failed, setFailed] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const deferred = useDeferredValue(query.trim());
  const active = query.trim().length >= MIN_QUERY;

  const ensureIndex = useCallback(() => {
    setFailed(false);
    loadSearchIndex().then(setIndex, () => setFailed(true));
  }, []);

  // Chegou com ?q= (link compartilhado ou "Voltar para..." de uma loja).
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("q")?.slice(0, 60).trim();
    if (q) {
      setQuery(q);
      ensureIndex();
    }
  }, [ensureIndex]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // A URL acompanha a busca sem empilhar histórico a cada letra; o termo fica guardado para a
  // faixa "Voltar para..." das lojas.
  const saveQuery = useCallback((value: string) => {
    const q = value.trim();
    const url = q ? `/?q=${encodeURIComponent(q)}` : "/";
    if (window.location.pathname + window.location.search !== url) window.history.replaceState(null, "", url);
    try {
      if (q) sessionStorage.setItem(LAST_SEARCH_KEY, q);
      else sessionStorage.removeItem(LAST_SEARCH_KEY);
    } catch {}
  }, []);

  useEffect(() => {
    const t = setTimeout(() => saveQuery(query), 300);
    return () => clearTimeout(t);
  }, [query, saveQuery]);

  const result = useMemo(() => (index && deferred.length >= MIN_QUERY ? search(index, deferred) : null), [index, deferred]);
  const empty = !!result && !result.items.length && !result.stores.length;

  // Busca sem resultado: registra depois de uma pausa na digitação (o Enter registra na hora).
  useEffect(() => {
    if (!empty) return;
    const t = setTimeout(() => logSearchMiss(deferred), 1500);
    return () => clearTimeout(t);
  }, [empty, deferred]);

  const change = (value: string) => {
    if (!query.trim() && value.trim()) {
      ensureIndex();
      // No celular, sobe o campo para o topo: os resultados aparecem acima do teclado.
      const form = formRef.current;
      if (form && window.matchMedia("(max-width: 639px)").matches && form.getBoundingClientRect().top > 90) {
        form.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
    setQuery(value);
  };

  const clear = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  const activeCategory = categories.find((c) => normalize(c) === normalize(query)) ?? "";
  // Resumo curto para leitores de tela (anunciar a grade inteira seria demais).
  const status = !active ? "" : failed ? "Erro ao carregar a busca" : !result ? "Buscando" : empty ? `Nenhuma loja tem ${deferred}` : `${result.items.length} produtos e ${result.stores.length} lojas encontrados`;

  return (
    <div>
      <h1 className="headline font-bold text-5xl sm:text-7xl leading-[1]">{title}</h1>
      <p className="mt-4 sm:mt-5 text-lg sm:text-xl text-brand-muted max-w-xl leading-relaxed">{tagline}</p>

      <form
        ref={formRef}
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          inputRef.current?.blur(); // fecha o teclado no celular
          if (empty) logSearchMiss(deferred);
        }}
        className={`mt-7 scroll-mt-16 ${active ? "sticky top-16 z-20 -mx-4 px-4 sm:-mx-6 sm:px-6 py-3 bg-brand-light/90 backdrop-blur-md" : ""}`}
      >
        <label htmlFor="busca" className="sr-only">
          Buscar produtos e lojas
        </label>
        <div className="relative max-w-2xl">
          <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-muted pointer-events-none" />
          <input
            ref={inputRef}
            id="busca"
            type="search"
            enterKeyHint="search"
            autoComplete="off"
            maxLength={60}
            placeholder="O que você procura hoje?"
            value={query}
            onFocus={ensureIndex}
            onChange={(e) => change(e.target.value)}
            onKeyDown={(e) => e.key === "Escape" && setQuery("")}
            className="w-full h-14 sm:h-16 pl-13 pr-14 rounded-full bg-white border border-brand-line text-base sm:text-lg text-brand-dark placeholder:text-brand-muted focus:outline-none focus:border-brand-dark/30 focus:ring-4 focus:ring-brand-primary/15 transition-shadow [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={clear}
              aria-label="Limpar busca"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 grid place-items-center w-10 h-10 rounded-full text-brand-muted hover:text-brand-dark hover:bg-brand-soft"
            >
              <CloseIcon />
            </button>
          )}
        </div>
      </form>

      {categories.length > 0 && (
        <div className="mt-4" aria-label="Categorias">
          <FilterPills options={categories} active={activeCategory} onChange={(c) => change(c === activeCategory ? "" : c)} />
        </div>
      )}

      <p role="status" className="sr-only">
        {status}
      </p>
      {/* Grava a busca antes de abrir um resultado, para o "voltar" cair nela de novo. */}
      <div onClickCapture={() => active && saveQuery(query)}>
        {active ? (
          <SearchResults
            key={deferred}
            query={deferred}
            result={result}
            storeBySlug={index?.storeBySlug ?? null}
            failed={failed}
            onRetry={ensureIndex}
            onClear={clear}
          />
        ) : (
          children
        )}
      </div>
    </div>
  );
}
