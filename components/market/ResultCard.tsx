import Link from "next/link";
import type { SearchItem, SearchStore } from "@/lib/types";
import StoreMark from "../StoreMark";
import { PriceTag, ProductImage, discountOf } from "../ProductTile";

// Produto de qualquer loja na home. Abre a vitrine da loja com o produto aberto (?produto=),
// então a sacola e o checkout continuam sendo os da loja.
export default function ResultCard({ item, store, sizes = "(min-width: 1024px) 270px, (min-width: 768px) 33vw, 50vw" }: { item: SearchItem; store: SearchStore; sizes?: string }) {
  return (
    <Link
      href={`/${store.slug}?produto=${encodeURIComponent(item.id)}`}
      className="relative flex flex-col h-full rounded-2xl bg-white p-2 ring-1 ring-transparent hover:ring-brand-line focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-dark"
    >
      <ProductImage src={item.imageUrl} sizes={sizes} discount={discountOf(item)} />
      <div className="flex flex-1 flex-col px-1.5 pt-3 pb-1">
        <h3 className="text-sm sm:text-[15px] font-medium leading-snug text-brand-dark line-clamp-2">{item.name}</h3>
        <div className="mt-auto pt-2">
          <PriceTag price={item.price} originalPrice={item.originalPrice} />
        </div>
        <p className="mt-3 pt-2.5 border-t border-brand-line flex items-center gap-2 min-w-0 text-xs">
          <StoreMark store={store} size={20} />
          <span className="min-w-0">
            <span className="block truncate font-medium text-brand-dark">{store.name}</span>
            {!store.deliveryOpen && <span className="block text-brand-muted">Retirada na loja</span>}
          </span>
        </p>
      </div>
    </Link>
  );
}
