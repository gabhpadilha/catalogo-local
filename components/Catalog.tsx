"use client";

import { useCallback, useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import { PRODUCTS } from "@/lib/products";
import { isOnSale } from "@/lib/format";
import type { Product } from "@/lib/types";

const ALL = "Todos";
const SALES = "🔥 Ofertas";

// Derivado uma única vez no carregamento do módulo (dados estáticos).
const CATEGORIES = [
  ...(PRODUCTS.some(isOnSale) ? [SALES] : []),
  ALL,
  ...new Set(PRODUCTS.map((p) => p.category)),
];

export default function Catalog() {
  const [activeFilter, setActiveFilter] = useState(ALL);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filteredProducts = useMemo(() => {
    if (activeFilter === ALL) return PRODUCTS;
    if (activeFilter === SALES) return PRODUCTS.filter(isOnSale);
    return PRODUCTS.filter((p) => p.category === activeFilter);
  }, [activeFilter]);

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} onSelect={setSelectedProduct} />
        ))}
      </div>

      {selectedProduct && (
        // key reinicia o estado interno (tamanho escolhido) a cada produto aberto
        <ProductModal key={selectedProduct.id} product={selectedProduct} onClose={closeModal} />
      )}
    </section>
  );
}
