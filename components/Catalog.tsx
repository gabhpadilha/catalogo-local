"use client";

import { useCallback, useDeferredValue, useEffect, useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import ProductModal, { PRODUCT_PARAM } from "./ProductModal";
import FilterPills from "./FilterPills";
import { useStore } from "./StoreProvider";
import { useSearch } from "./SearchProvider";
import { useCart } from "./CartProvider";
import { isOnSale, normalize } from "@/lib/format";
import type { Product } from "@/lib/types";

const ALL = "Todos";
const SALES = "Ofertas";

const plural = (n: number) => `${n} ${n === 1 ? "produto" : "produtos"}`;

export default function Catalog() {
  const { products } = useStore();
  const { addItem } = useCart();
  // Texto pesquisável pré-normalizado e categorias: recalculados só se o catálogo mudar.
  const searchIndex = useMemo(() => new Map(products.map((p) => [p.id, normalize(`${p.name} ${p.category} ${p.description}`)])), [products]);
  const categories = useMemo(
    () => [ALL, ...(products.some(isOnSale) ? [SALES] : []), ...new Set(products.map((p) => p.category))],
    [products]
  );
  const [activeFilter, setActiveFilter] = useState(ALL);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { query, setQuery } = useSearch();
  // Mantém a digitação fluida: a lista filtra com prioridade mais baixa.
  const deferredQuery = useDeferredValue(query);

  const filteredProducts = useMemo(() => {
    const terms = normalize(deferredQuery).split(/\s+/).filter(Boolean);
    return products.filter((p) => {
      if (activeFilter === SALES && !isOnSale(p)) return false;
      if (activeFilter !== ALL && activeFilter !== SALES && p.category !== activeFilter) return false;
      const text = searchIndex.get(p.id)!;
      return terms.every((t) => text.includes(t));
    });
  }, [products, searchIndex, activeFilter, deferredQuery]);

  // Link direto (?produto=id, vindo de um compartilhamento): abre o produto já na chegada.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const url = new URL(window.location.href);
    const product = products.find((p) => p.id === url.searchParams.get(PRODUCT_PARAM));
    if (!product) return;
    // Tira o parâmetro desta entrada: fechar o produto volta para a vitrine limpa.
    url.searchParams.delete(PRODUCT_PARAM);
    window.history.replaceState(null, "", url.pathname + url.search + url.hash);
    setSelectedProduct(product);
  }, [products]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const closeModal = useCallback(() => setSelectedProduct(null), []);
  // Com uma opção só, o "+" já adiciona; com várias, abre o produto para escolher.
  const quickAdd = useCallback(
    (product: Product) => {
      const options = product.variants.filter((v) => v.inStock);
      if (options.length === 1) addItem(product, options[0].label);
      else setSelectedProduct(product);
    },
    [addItem]
  );

  const filtered = activeFilter !== ALL || query.trim();
  const countLabel = filtered ? `${plural(filteredProducts.length)} de ${products.length}` : plural(products.length);

  return (
    <section id="catalogo" aria-labelledby="catalogo-titulo" className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-24 scroll-mt-16">
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="catalogo-titulo" className="headline font-bold text-2xl sm:text-3xl">Produtos</h2>
        <p className="text-sm text-brand-muted tabular-nums" aria-live="polite">{countLabel}</p>
      </div>

      {/* Filtros grudam abaixo do cabeçalho enquanto a lista rola. */}
      <div className="sticky top-16 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 mt-3 mb-2 bg-brand-light/90 backdrop-blur-md">
        <FilterPills options={categories} active={activeFilter} highlight={SALES} onChange={setActiveFilter} />
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} onSelect={setSelectedProduct} onQuickAdd={quickAdd} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center max-w-sm mx-auto">
          <p className="headline font-bold text-xl text-brand-dark">Nenhum produto encontrado</p>
          <p className="mt-2 text-brand-muted">
            {query ? <>Nada para &ldquo;{query}&rdquo; em {activeFilter}. Tente outra palavra.</> : <>Ainda não há produtos em {activeFilter}.</>}
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setActiveFilter(ALL);
            }}
            className="mt-6 h-11 px-5 rounded-full bg-brand-dark text-brand-light font-semibold text-sm active:scale-95 transition-transform"
          >
            Ver todos os produtos
          </button>
        </div>
      )}

      {selectedProduct && (
        // key reinicia o estado interno (opção escolhida) a cada produto aberto
        <ProductModal key={selectedProduct.id} product={selectedProduct} onClose={closeModal} />
      )}
    </section>
  );
}
