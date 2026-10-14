import Image from "next/image";
import { formatPrice } from "@/lib/format";

// Peças visuais do card de produto, iguais na vitrine da loja e na busca da home.

export const discountOf = ({ price, originalPrice }: { price: number; originalPrice?: number }) =>
  originalPrice && originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

export function ProductImage({ src, sizes, soldOut = false, discount = 0 }: { src: string; sizes: string; soldOut?: boolean; discount?: number }) {
  return (
    <div className="relative aspect-square overflow-hidden rounded-xl bg-brand-soft">
      {src && <Image src={src} alt="" fill sizes={sizes} className={`object-cover ${soldOut ? "opacity-50 grayscale" : ""}`} />}
      {soldOut ? (
        <span className="absolute top-2 left-2 rounded-full bg-brand-dark text-brand-light text-xs font-medium px-2.5 py-1">Esgotado</span>
      ) : discount > 0 ? (
        <span className="absolute top-2 left-2 rounded-full bg-brand-primary text-brand-light text-xs font-semibold px-2.5 py-1 tabular-nums">-{discount}%</span>
      ) : null}
    </div>
  );
}

export function PriceTag({ price, originalPrice }: { price: number; originalPrice?: number }) {
  const onSale = !!originalPrice && originalPrice > price;
  return (
    <p className="leading-tight">
      {onSale && (
        <span className="block text-xs text-brand-muted line-through tabular-nums">
          <span className="sr-only">De </span>
          {formatPrice(originalPrice)}
        </span>
      )}
      <span className={`font-semibold tabular-nums ${onSale ? "text-brand-primary" : "text-brand-dark"}`}>
        {onSale && <span className="sr-only">por </span>}
        {formatPrice(price)}
      </span>
    </p>
  );
}
