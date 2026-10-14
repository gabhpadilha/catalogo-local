"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSearch } from "./SearchProvider";
import { CloseIcon, SearchIcon } from "./icons";

const scrollToCatalog = () => {
  const el = document.getElementById("catalogo");
  if (el && el.getBoundingClientRect().top > 160) el.scrollIntoView({ behavior: "smooth" });
};

// Ao começar a digitar, leva até o catálogo (ou volta para ele vindo de outra página da loja).
function useCatalogSearch(home: string) {
  const { query, setQuery } = useSearch();
  const pathname = usePathname();
  const router = useRouter();

  const change = (value: string) => {
    if (!query && value) {
      if (pathname === home) scrollToCatalog();
      else router.push(`${home}#catalogo`);
    }
    setQuery(value);
  };
  return { query, setQuery, change };
}

const inputBase =
  "w-full text-brand-dark placeholder:text-brand-muted focus:outline-none [&::-webkit-search-cancel-button]:hidden";

/** Campo sempre visível (desktop). */
export function SearchField({ home, placeholder }: { home: string; placeholder: string }) {
  const { query, setQuery, change } = useCatalogSearch(home);
  return (
    <div role="search" className="relative">
      <SearchIcon className="w-[18px] h-[18px] absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted pointer-events-none" />
      <input
        type="search"
        enterKeyHint="search"
        placeholder={placeholder}
        aria-label="Buscar produtos"
        value={query}
        onChange={(e) => change(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setQuery("");
          if (e.key === "Enter") scrollToCatalog();
        }}
        className={`${inputBase} h-11 pl-11 pr-10 rounded-full bg-brand-soft border border-transparent focus:bg-white focus:border-brand-line focus:ring-2 focus:ring-brand-dark/10 transition-colors`}
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery("")}
          aria-label="Limpar busca"
          className="absolute right-1.5 top-1/2 -translate-y-1/2 grid place-items-center w-8 h-8 rounded-full text-brand-muted hover:text-brand-dark hover:bg-brand-soft"
        >
          <CloseIcon className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

/** Lupa que abre o campo por cima do cabeçalho (mobile). */
export function SearchToggle({ home, placeholder }: { home: string; placeholder: string }) {
  const { query, setQuery, change } = useCatalogSearch(home);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const close = () => {
    setQuery("");
    setOpen(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Buscar produtos"
        aria-expanded={open}
        className="grid place-items-center w-10 h-10 rounded-full text-brand-dark hover:bg-brand-soft transition-colors"
      >
        <SearchIcon />
      </button>

      {open && (
        <div role="search" className="absolute inset-0 z-10 flex items-center gap-2 bg-white px-4 animate-search-in">
          <SearchIcon className="w-5 h-5 text-brand-muted shrink-0" />
          <input
            ref={inputRef}
            type="search"
            enterKeyHint="search"
            placeholder={placeholder}
            aria-label="Buscar produtos"
            value={query}
            onChange={(e) => change(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") close();
              if (e.key === "Enter") {
                e.currentTarget.blur(); // fecha o teclado no mobile
                scrollToCatalog();
              }
            }}
            className={`${inputBase} flex-1 min-w-0 h-11 text-base bg-transparent`}
          />
          <button
            type="button"
            onClick={close}
            aria-label="Fechar busca"
            className="grid place-items-center w-10 h-10 rounded-full text-brand-dark hover:bg-brand-soft shrink-0"
          >
            <CloseIcon />
          </button>
        </div>
      )}
    </>
  );
}
