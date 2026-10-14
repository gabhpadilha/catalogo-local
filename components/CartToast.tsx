"use client";

import { useEffect } from "react";
import { useCart } from "./CartProvider";
import { CheckIcon } from "./icons";

// Confirma cada produto adicionado, com atalho para a sacola.
export default function CartToast() {
  const { lastAdded, dismissAdded, setOpen } = useCart();

  useEffect(() => {
    if (!lastAdded) return;
    const t = setTimeout(dismissAdded, 4000);
    return () => clearTimeout(t);
  }, [lastAdded, dismissAdded]);

  return (
    // A região existe sempre, para leitores de tela anunciarem o aviso quando ele aparece.
    <div aria-live="polite" className="fixed inset-x-0 bottom-[calc(max(1rem,env(safe-area-inset-bottom))+4.25rem)] md:bottom-6 z-40 flex justify-center px-4 pointer-events-none">
      {lastAdded && (
        <div key={lastAdded.id} className="pointer-events-auto animate-toast-in w-full max-w-md flex items-center gap-3 rounded-2xl bg-brand-dark text-brand-light pl-4 pr-2 py-2 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.4)]">
          <CheckIcon className="w-5 h-5 shrink-0 text-emerald-400" />
          <p className="flex-1 min-w-0 text-sm">
            <span className="block truncate font-medium">{lastAdded.name}</span>
            <span className="opacity-75">Adicionado à sacola</span>
          </p>
          {/* No mobile a barra da sacola logo abaixo já faz esse papel. */}
          <button
            type="button"
            onClick={() => {
              dismissAdded();
              setOpen(true);
            }}
            className="hidden md:block shrink-0 h-10 px-4 rounded-full bg-brand-light text-brand-dark text-sm font-semibold"
          >
            Ver sacola
          </button>
        </div>
      )}
    </div>
  );
}
