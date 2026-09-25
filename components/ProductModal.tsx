"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "./CartProvider";
import { useDialog } from "@/lib/useDialog";
import { formatPrice, isOnSale } from "@/lib/format";
import type { Product } from "@/lib/types";

type ProductModalProps = {
  product: Product;
  onClose: () => void;
};

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] ?? "");
  useDialog(true, onClose);

  const handleAdd = () => {
    addItem(product, selectedSize);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        className="relative bg-white w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90dvh]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-4 right-4 z-20 p-2 bg-white/80 backdrop-blur-md rounded-full text-brand-dark hover:bg-gray-100 transition-colors shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="relative aspect-square w-full max-h-[45dvh] bg-[#F8F8F8] shrink-0">
          <Image src={product.imageUrl} alt={product.name} fill sizes="(min-width: 640px) 512px, 100vw" className="object-cover" />
        </div>

        <div className="p-6 sm:p-8 flex-1 overflow-y-auto">
          <span className="text-xs font-bold text-brand-muted uppercase tracking-wider">{product.store}</span>
          <h3 id="product-modal-title" className="text-2xl font-black text-brand-dark leading-tight mt-1 mb-2">
            {product.name}
          </h3>

          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-3xl font-black text-brand-primary">{formatPrice(product.price)}</span>
            {isOnSale(product) && (
              <span className="text-sm text-brand-muted line-through font-medium">{formatPrice(product.originalPrice!)}</span>
            )}
          </div>

          <p className="text-brand-muted text-sm leading-relaxed mb-6">{product.description}</p>

          <fieldset className="mb-6">
            <legend className="block text-xs font-bold text-brand-dark uppercase tracking-wider mb-2.5">
              Escolha o Tamanho:
            </legend>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  aria-pressed={selectedSize === size}
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[48px] h-12 px-4 rounded-xl font-bold text-sm transition-all active:scale-95 border ${
                    selectedSize === size
                      ? "bg-brand-dark text-white border-brand-dark shadow-md"
                      : "bg-white text-brand-dark border-gray-200 hover:border-brand-dark"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </fieldset>

          <button
            type="button"
            onClick={handleAdd}
            disabled={!selectedSize}
            className="w-full bg-brand-primary text-brand-light py-4 rounded-full font-bold text-lg hover:bg-brand-dark transition-colors active:scale-95 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            Adicionar à Sacola
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
