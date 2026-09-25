import { memo } from "react";
import Image from "next/image";
import type { Product } from "@/lib/types";
import { formatPrice, isOnSale } from "@/lib/format";

type ProductCardProps = {
  product: Product;
  onSelect: (product: Product) => void;
};

function ProductCard({ product, onSelect }: ProductCardProps) {
  const { name, store, price, originalPrice, imageUrl } = product;
  const onSale = isOnSale(product);
  const discount = onSale ? Math.round(((originalPrice! - price) / originalPrice!) * 100) : 0;

  return (
    <button
      type="button"
      onClick={() => onSelect(product)}
      className="group flex flex-col text-left bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300 focus-visible:outline-2 focus-visible:outline-brand-primary"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-[#F8F8F8]">
        {onSale && (
          <div className="absolute top-4 left-4 z-10 bg-brand-primary text-brand-light text-xs font-black px-3 py-1.5 rounded-full shadow-md">
            -{discount}%
          </div>
        )}
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="p-5 flex flex-col flex-1 w-full">
        <span className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-1">{store}</span>
        <h3 className="text-lg font-bold text-brand-dark leading-tight mb-2 line-clamp-2 group-hover:text-brand-primary transition-colors">
          {name}
        </h3>

        <div className="mt-auto pt-4 flex items-end justify-between">
          <div>
            {onSale && (
              <div className="text-sm text-brand-muted line-through font-medium mb-0.5">
                {formatPrice(originalPrice!)}
              </div>
            )}
            <div className={`font-black ${onSale ? "text-2xl text-brand-primary" : "text-xl text-brand-dark"}`}>
              {formatPrice(price)}
            </div>
          </div>
          <span className="bg-gray-100 text-brand-dark px-3.5 py-2 rounded-full text-xs font-bold group-hover:bg-brand-dark group-hover:text-white transition-colors">
            Ver +
          </span>
        </div>
      </div>
    </button>
  );
}

export default memo(ProductCard);
