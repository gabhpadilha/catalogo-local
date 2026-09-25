"use client";

import { useCallback } from "react";
import Image from "next/image";
import { useCart } from "./CartProvider";
import BagIcon from "./BagIcon";
import { useDialog } from "@/lib/useDialog";
import { formatPrice } from "@/lib/format";

export default function CartDrawer() {
  const { cart, total, isOpen, setOpen, setCheckoutOpen, updateQuantity, removeItem } = useCart();
  const close = useCallback(() => setOpen(false), [setOpen]);

  const goToCheckout = () => {
    setOpen(false);
    setCheckoutOpen(true);
  };
  useDialog(isOpen, close);

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={close} />}

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Sua Sacola"
        inert={!isOpen}
        className={`fixed top-0 right-0 h-dvh w-full sm:w-[400px] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.65,0,0.35,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-2xl font-black text-brand-dark tracking-tight">Sua Sacola</h2>
          <button
            type="button"
            onClick={close}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold text-brand-muted hover:text-brand-dark hover:bg-gray-100 rounded-full transition-colors active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Voltar às compras
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
              <BagIcon className="w-20 h-20 mb-4" strokeWidth={1} />
              <p className="font-bold text-xl mb-2">Sacola Vazia</p>
              <p className="text-sm">Explore o catálogo e adicione os seus produtos favoritos.</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4 bg-[#F8F8F8] p-3 rounded-2xl relative">
                <Image src={item.imageUrl} alt={item.name} width={96} height={96} className="w-24 h-24 object-cover rounded-xl bg-white border border-gray-100" />

                <div className="flex-1 flex flex-col py-1">
                  <span className="text-[10px] font-bold text-brand-muted uppercase tracking-wider">{item.store}</span>
                  <h4 className="text-sm font-bold text-brand-dark leading-tight line-clamp-2 my-0.5 pr-6">{item.name}</h4>
                  <span className="inline-block bg-gray-200/80 text-brand-dark font-bold text-[10px] px-2 py-0.5 rounded-md w-max mb-2">
                    Tamanho: {item.selectedSize}
                  </span>

                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center bg-white border border-gray-200 rounded-full overflow-hidden h-8">
                      <button type="button" aria-label="Diminuir" onClick={() => updateQuantity(item.id, item.selectedSize, -1)} disabled={item.quantity <= 1} className="w-8 h-full flex items-center justify-center text-brand-dark hover:bg-gray-100 disabled:opacity-30 transition-colors">-</button>
                      <span className="w-6 text-center text-xs font-bold text-brand-dark">{item.quantity}</span>
                      <button type="button" aria-label="Aumentar" onClick={() => updateQuantity(item.id, item.selectedSize, 1)} className="w-8 h-full flex items-center justify-center text-brand-dark hover:bg-gray-100 transition-colors">+</button>
                    </div>
                    <div className="font-black text-brand-primary">{formatPrice(item.price * item.quantity)}</div>
                  </div>
                </div>

                <button type="button" aria-label={`Remover ${item.name}`} onClick={() => removeItem(item.id, item.selectedSize)} className="absolute top-3 right-3 p-1.5 bg-white text-gray-400 hover:text-red-500 rounded-full shadow-sm hover:shadow transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] border-t border-gray-100 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-500 font-medium">Total da Sacola:</span>
              <span className="text-2xl font-black text-brand-dark">{formatPrice(total)}</span>
            </div>
            <button
              type="button"
              onClick={goToCheckout}
              className="w-full bg-brand-primary text-brand-light py-4 rounded-full font-bold text-lg hover:bg-brand-dark transition-colors active:scale-95 shadow-lg flex items-center justify-center gap-2"
            >
              Finalizar Compra
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
