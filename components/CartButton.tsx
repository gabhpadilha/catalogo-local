"use client";

import { useCart } from "./CartProvider";
import BagIcon from "./BagIcon";
import { formatPrice } from "@/lib/format";

export default function CartButton() {
  const { count, total, setOpen } = useCart();
  if (count === 0) return null;

  return (
    <div className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-0 w-full px-4 z-40 flex justify-center pointer-events-none">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="pointer-events-auto w-full max-w-md bg-brand-primary text-white px-6 py-4 rounded-full shadow-[0_10px_40px_rgba(115,3,13,0.4)] hover:bg-brand-dark transition-all active:scale-95 flex items-center justify-between group"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <BagIcon />
            <span className="absolute -top-2 -right-2 bg-brand-dark text-white text-[11px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-brand-primary">
              {count}
            </span>
          </div>
          <span className="font-bold text-lg">Ver Sacola</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-black text-lg tracking-tight">{formatPrice(total)}</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5 group-hover:translate-x-1 transition-transform">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </div>
      </button>
    </div>
  );
}
