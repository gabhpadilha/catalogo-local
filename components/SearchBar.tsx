"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSearch } from "./SearchProvider";

const SearchIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className} aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

const scrollToCatalog = () => {
  const el = document.getElementById("catalogo");
  if (el && el.getBoundingClientRect().top > 120) el.scrollIntoView({ behavior: "smooth" });
};

// Botão de lupa que expande um campo sobre a própria Navbar (não altera o layout).
export default function SearchBar({ onOpen }: { onOpen?: () => void }) {
  const { query, setQuery } = useSearch();
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const openSearch = () => {
    onOpen?.();
    setOpen(true);
  };

  const close = () => {
    setQuery("");
    setOpen(false);
  };

  const handleChange = (value: string) => {
    if (!query && value) {
      if (pathname === "/") scrollToCatalog();
      else router.push("/#catalogo");
    }
    setQuery(value);
  };

  return (
    <>
      <button
        type="button"
        onClick={openSearch}
        aria-label="Pesquisar produtos"
        aria-expanded={open}
        className="flex items-center justify-center w-10 h-10 rounded-full text-brand-light hover:bg-[#2A2A2A] transition-colors shrink-0"
      >
        <SearchIcon />
      </button>

      {open && (
        <div role="search" className="absolute inset-0 z-30 flex items-center gap-2 bg-brand-dark rounded-full pl-5 pr-2 animate-search-in">
          <SearchIcon className="w-5 h-5 text-brand-muted shrink-0" />
          <input
            ref={inputRef}
            type="search"
            enterKeyHint="search"
            placeholder="Pesquisar na vitrine..."
            aria-label="Pesquisar produtos"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") close();
              if (e.key === "Enter") {
                e.currentTarget.blur(); // fecha o teclado no mobile
                scrollToCatalog();
              }
            }}
            className="flex-1 min-w-0 h-10 bg-transparent text-brand-light placeholder:text-brand-muted font-medium focus:outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          <button
            type="button"
            onClick={close}
            aria-label="Fechar pesquisa"
            className="flex items-center justify-center w-10 h-10 rounded-full text-brand-light hover:bg-[#2A2A2A] transition-colors shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}
