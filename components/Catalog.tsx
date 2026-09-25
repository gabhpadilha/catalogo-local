"use client";

import { useCallback, useDeferredValue, useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import { PRODUCTS } from "@/lib/products";
import { useSearch } from "./SearchProvider";
import { isOnSale, normalize } from "@/lib/format";
import type { Product } from "@/lib/types";

const ALL = "Todos";
const SALES = "🔥 Ofertas";

// Texto pesquisável pré-normalizado uma única vez.
const SEARCH_INDEX = new Map(PRODUCTS.map((p) => [p.id, normalize(`${p.name} ${p.description}`)]));

// Derivado uma única vez no carregamento do módulo (dados estáticos).
const CATEGORIES = [
  ...(PRODUCTS.some(isOnSale) ? [SALES] : []),
  ALL,
  ...new Set(PRODUCTS.map((p) => p.category)),
];

export default function Catalog() {
  const [activeFilter, setActiveFilter] = useState(ALL);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { query, setQuery } = useSearch();
  // Mantém a digitação fluida: a lista filtra com prioridade mais baixa.
  const deferredQuery = useDeferredValue(query);

  const filteredProducts = useMemo(() => {
    const terms = normalize(deferredQuery).split(/\s+/).filter(Boolean);
    return PRODUCTS.filter((p) => {
      if (activeFilter === SALES && !isOnSale(p)) return false;
      if (activeFilter !== ALL && activeFilter !== SALES && p.category !== activeFilter) return false;
      const text = SEARCH_INDEX.get(p.id)!;
      return terms.every((t) => text.includes(t));
    });
  }, [activeFilter, deferredQuery]);

  const closeModal = useCallback(() => setSelectedProduct(null), []);

  return (
    <section
      id="catalogo"
      className="min-h-screen pt-24 md:pt-32 pb-32 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto scroll-mt-10 border-t border-gray-200/60"
    >
      <div className="mb-8 md:mb-10 text-center md:text-left">
        <h2 className="text-3xl sm:text-4xl font-black text-brand-dark tracking-tighter mb-2">VITRINE DISPONÍVEL</h2>
        <p className="text-brand-muted font-medium">Clique em um produto para ver detalhes e escolher o tamanho.</p>
      </div>

      <div className="flex flex-wrap gap-2.5 mb-10 justify-center md:justify-start">
        {CATEGORIES.map((category) => {
          const active = activeFilter === category;
          return (
            <button
              key={category}
              type="button"
              aria-pressed={active}
              onClick={() => setActiveFilter(category)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all active:scale-95 ${
                active
                  ? `${category === SALES ? "bg-brand-primary" : "bg-brand-dark"} text-brand-light shadow-md`
                  : "bg-white text-brand-muted border border-gray-200 hover:border-brand-dark hover:text-brand-dark"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onSelect={setSelectedProduct} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-xl font-black text-brand-dark mb-2">Nenhum produto encontrado</p>
          <p className="text-brand-muted mb-6">
            {query ? <>Nada para &ldquo;{query}&rdquo; em {activeFilter}.</> : <>Sem produtos em {activeFilter}.</>}
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setActiveFilter(ALL);
            }}
            className="px-6 py-3 rounded-full bg-brand-dark text-brand-light font-bold text-sm active:scale-95 transition-transform"
          >
            Limpar filtros
          </button>
        </div>
      )}

      {selectedProduct && (
        // key reinicia o estado interno (tamanho escolhido) a cada produto aberto
        <ProductModal key={selectedProduct.id} product={selectedProduct} onClose={closeModal} />
      )}
    </section>
  );
}
