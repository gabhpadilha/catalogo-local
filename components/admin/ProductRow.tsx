"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { setProductStock } from "@/app/admin/actions";
import type { AdminProduct } from "@/lib/admin";
import { formatPrice } from "@/lib/format";
import Switch from "./Switch";

// Um produto: toque abre a edição; a chave marca disponível/esgotado (esconder fica dentro da edição).
export default function ProductRow({ slug, product, demo = false }: { slug: string; product: AdminProduct; demo?: boolean }) {
  const [pending, start] = useTransition();
  const real = product.product_variants.some((v) => v.stock == null || v.stock > 0);
  const [demoStock, setDemoStock] = useState(real);
  const inStock = demo ? demoStock : real;

  return (
    <li className={`flex items-center gap-3 bg-white rounded-2xl ring-1 ring-brand-line p-3 ${pending ? "opacity-60" : ""}`}>
      <Link href={demo ? "#" : `/admin/${slug}/produtos/${product.id}`} aria-disabled={demo || undefined} className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-14 h-14 rounded-xl bg-brand-soft overflow-hidden shrink-0">
          {product.image_url && (
            // eslint-disable-next-line @next/next/no-img-element -- miniatura do painel
            <img src={product.image_url} alt="" className="w-full h-full object-cover" />
          )}
        </div>
        <div className="min-w-0">
          <p className="font-medium leading-tight truncate">{product.name}</p>
          <p className="text-sm text-brand-muted tabular-nums">
            {formatPrice(product.price)}
            {!product.is_active && <span className="ml-2 text-xs">· Oculto na vitrine</span>}
          </p>
        </div>
      </Link>
      <button
        type="button"
        role="switch"
        aria-checked={inStock}
        aria-label={`${product.name}: ${inStock ? "disponível" : "esgotado"}`}
        disabled={pending}
        onClick={() => (demo ? setDemoStock(!inStock) : start(() => setProductStock(slug, product.id, !inStock)))}
        className="flex flex-col items-center gap-1 shrink-0 px-1"
      >
        <Switch on={inStock} />
        <span className={`text-[11px] font-medium ${inStock ? "text-emerald-700" : "text-brand-muted"}`}>{inStock ? "Disponível" : "Esgotado"}</span>
      </button>
    </li>
  );
}
