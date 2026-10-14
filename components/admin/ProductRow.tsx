"use client";

import { useTransition } from "react";
import Link from "next/link";
import { setProductActive, setProductStock } from "@/app/admin/actions";
import type { AdminProduct } from "@/lib/admin";
import { formatPrice } from "@/lib/format";

export default function ProductRow({ slug, product }: { slug: string; product: AdminProduct }) {
  const [pending, start] = useTransition();
  const inStock = product.product_variants.some((v) => v.stock == null || v.stock > 0);

  return (
    <li className={`flex items-center gap-3 bg-white rounded-[1.75rem] border border-gray-100 shadow-sm p-3 ${pending ? "opacity-60" : ""}`}>
      <Link href={`/admin/${slug}/produtos/${product.id}`} className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 overflow-hidden shrink-0">
          {product.image_url && (
            // eslint-disable-next-line @next/next/no-img-element -- miniatura do painel
            <img src={product.image_url} alt="" className="w-full h-full object-cover" />
          )}
        </div>
        <div className="min-w-0">
          <p className="font-bold leading-tight truncate">{product.name}</p>
          <p className="text-sm font-semibold text-brand-primary tabular-nums">{formatPrice(product.price)}</p>
          <div className="flex gap-1.5 mt-1">
            {!product.is_active && <span className="text-xs font-medium bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">Oculto</span>}
            {!inStock && <span className="text-xs font-medium bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Esgotado</span>}
          </div>
        </div>
      </Link>
      <div className="flex flex-col gap-1.5 shrink-0">
        <button
          type="button"
          disabled={pending}
          onClick={() => start(() => setProductStock(slug, product.id, !inStock))}
          className={`h-9 px-3 rounded-full text-xs font-bold transition-colors ${inStock ? "bg-red-50 text-red-700 hover:bg-red-100" : "bg-green-50 text-green-800 hover:bg-green-100"}`}
        >
          {inStock ? "Esgotou" : "Chegou"}
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => start(() => setProductActive(slug, product.id, !product.is_active))}
          className="h-9 px-3 rounded-full text-xs font-bold bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          {product.is_active ? "Esconder" : "Mostrar"}
        </button>
      </div>
    </li>
  );
}
