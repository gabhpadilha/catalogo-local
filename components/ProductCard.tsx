import { memo } from "react";
import type { Product } from "@/lib/types";
import { inStock } from "@/lib/format";
import { PlusIcon } from "./icons";
import { PriceTag, ProductImage, discountOf } from "./ProductTile";

type ProductCardProps = {
  product: Product;
  onSelect: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
};

function ProductCard({ product, onSelect, onQuickAdd }: ProductCardProps) {
  const { name } = product;
  const available = inStock(product);
  const oneOption = product.variants.filter((v) => v.inStock).length === 1;

  return (
    <article className="group relative flex flex-col rounded-2xl bg-white p-2 ring-1 ring-transparent hover:ring-brand-line has-[.card-link:focus-visible]:ring-2 has-[.card-link:focus-visible]:ring-brand-dark">
      <ProductImage
        src={product.imageUrl}
        sizes="(min-width: 1024px) 270px, (min-width: 768px) 33vw, 50vw"
        soldOut={!available}
        discount={discountOf(product)}
      />

      <div className="flex flex-1 flex-col px-1.5 pt-3 pb-1">
        <h3 className="text-sm sm:text-[15px] font-medium leading-snug text-brand-dark line-clamp-2">
          {/* O botão cobre o card inteiro (::after); o "+" fica por cima dele. */}
          <button type="button" onClick={() => onSelect(product)} className="card-link text-left focus-visible:outline-none after:absolute after:inset-0 after:rounded-2xl">
            {name}
          </button>
        </h3>

        <div className="mt-auto pt-2 flex items-end justify-between gap-2">
          <PriceTag price={product.price} originalPrice={product.originalPrice} />
          {available && (
            <button
              type="button"
              onClick={() => onQuickAdd(product)}
              aria-label={oneOption ? `Adicionar ${name} à sacola` : `Escolher opção de ${name}`}
              className="relative z-10 shrink-0 grid place-items-center w-9 h-9 rounded-full bg-brand-dark text-brand-light hover:bg-brand-primary active:scale-95 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-dark"
            >
              <PlusIcon className="w-[18px] h-[18px]" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default memo(ProductCard);
