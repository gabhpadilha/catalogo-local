"use client";

import { useCart } from "./CartProvider";
import { BagIcon } from "./icons";
import { formatPrice } from "@/lib/format";

// Atalho da sacola ao alcance do polegar (no desktop a sacola fica no cabeçalho).
export default function CartButton() {
  const { count, total, setOpen } = useCart();
  if (count === 0) return null;

  return (
    <div className="md:hidden fixed bottom-[max(1rem,env(safe-area-inset-bottom))] inset-x-0 px-4 z-40 flex justify-center pointer-events-none">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="pointer-events-auto w-full max-w-md h-14 pl-5 pr-6 rounded-full bg-brand-primary text-brand-light shadow-[0_12px_32px_-8px_rgba(0,0,0,0.35)] active:scale-[0.98] transition-transform flex items-center justify-between"
      >
        <span className="flex items-center gap-3 font-semibold">
          <span className="relative">
            <BagIcon />
            <span className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] px-1 grid place-items-center rounded-full bg-brand-light text-brand-primary text-[11px] font-bold tabular-nums">
              {count}
            </span>
          </span>
          Ver sacola
        </span>
        <span className="font-semibold tabular-nums">{formatPrice(total)}</span>
      </button>
    </div>
  );
}
