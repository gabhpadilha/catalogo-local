"use client";

import { useCallback } from "react";
import Image from "next/image";
import { MAX_QTY, useCart } from "./CartProvider";
import Sheet, { SheetIconButton } from "./Sheet";
import { BagIcon, CloseIcon, MinusIcon, PlusIcon } from "./icons";
import { formatPrice } from "@/lib/format";

const stepButton =
  "grid place-items-center w-9 h-full text-brand-dark hover:bg-brand-soft disabled:opacity-30 disabled:hover:bg-transparent transition-colors";

export default function CartDrawer() {
  const { cart, count, total, isOpen, setOpen, setCheckoutOpen, updateQuantity, removeItem } = useCart();
  const close = useCallback(() => setOpen(false), [setOpen]);

  const goToCheckout = () => {
    setOpen(false);
    setCheckoutOpen(true);
  };

  const browse = () => {
    close();
    document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Sheet open={isOpen} onClose={close} labelledBy="cart-title" variant="right">
      <div className="flex items-center justify-between gap-3 px-5 sm:px-6 h-16 border-b border-brand-line shrink-0">
        <h2 id="cart-title" className="headline font-bold text-xl">
          Sua sacola {count > 0 && <span className="text-brand-muted font-normal tabular-nums">({count})</span>}
        </h2>
        <SheetIconButton label="Fechar sacola" onClick={close}>
          <CloseIcon />
        </SheetIconButton>
      </div>

      {cart.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-14">
          <span className="grid place-items-center w-14 h-14 rounded-full bg-brand-soft text-brand-muted">
            <BagIcon className="w-6 h-6" />
          </span>
          <p className="mt-4 font-semibold text-lg">Sua sacola está vazia</p>
          <p className="mt-1 text-sm text-brand-muted">Escolha um produto no catálogo para começar.</p>
          <button type="button" onClick={browse} className="mt-6 h-11 px-5 rounded-full bg-brand-dark text-brand-light font-semibold text-sm">
            Ver produtos
          </button>
        </div>
      ) : (
        <>
          <ul className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 sm:px-6 divide-y divide-brand-line">
            {cart.map((item) => (
              <li key={`${item.id}-${item.selectedSize}`} className="flex gap-3 py-4">
                <Image src={item.imageUrl} alt="" width={72} height={72} className="w-18 h-18 shrink-0 object-cover rounded-xl bg-brand-soft" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-3">
                    <p className="text-sm font-medium leading-snug line-clamp-2">{item.name}</p>
                    <p className="text-sm font-semibold tabular-nums whitespace-nowrap">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                  {item.selectedSize !== "Único" && <p className="text-sm text-brand-muted mt-0.5">Opção: {item.selectedSize}</p>}

                  <div className="mt-2.5 flex items-center justify-between">
                    <div className="inline-flex items-center h-9 rounded-full border border-brand-line overflow-hidden">
                      <button type="button" aria-label={`Diminuir quantidade de ${item.name}`} onClick={() => updateQuantity(item.id, item.selectedSize, -1)} disabled={item.quantity <= 1} className={stepButton}>
                        <MinusIcon className="w-4 h-4" />
                      </button>
                      <span className="w-7 text-center text-sm font-medium tabular-nums" aria-label={`Quantidade: ${item.quantity}`}>{item.quantity}</span>
                      <button type="button" aria-label={`Aumentar quantidade de ${item.name}`} onClick={() => updateQuantity(item.id, item.selectedSize, 1)} disabled={item.quantity >= MAX_QTY} className={stepButton}>
                        <PlusIcon className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id, item.selectedSize)}
                      aria-label={`Remover ${item.name}`}
                      className="text-sm text-brand-muted hover:text-brand-dark underline-offset-4 hover:underline"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="shrink-0 border-t border-brand-line px-5 sm:px-6 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            <div className="flex justify-between items-baseline">
              <span className="text-brand-muted">Subtotal</span>
              <span className="text-xl font-semibold tabular-nums">{formatPrice(total)}</span>
            </div>
            <p className="text-sm text-brand-muted mt-1">O frete é calculado no próximo passo.</p>
            <button
              type="button"
              onClick={goToCheckout}
              className="mt-4 w-full h-13 rounded-full bg-brand-primary text-brand-light font-semibold hover:bg-brand-dark transition-colors active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-dark"
            >
              Finalizar pedido
            </button>
          </div>
        </>
      )}
    </Sheet>
  );
}
