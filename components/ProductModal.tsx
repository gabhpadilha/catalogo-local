"use client";

import { useState } from "react";
import Image from "next/image";
import { useCart } from "./CartProvider";
import { useStore } from "./StoreProvider";
import Sheet, { SheetIconButton } from "./Sheet";
import { CloseIcon, ShareIcon, WhatsAppIcon } from "./icons";
import { formatPrice, isOnSale, whatsappUrl } from "@/lib/format";
import type { Product } from "@/lib/types";

// Parâmetro do link direto para um produto (?produto=id).
export const PRODUCT_PARAM = "produto";

type ProductModalProps = {
  product: Product;
  onClose: () => void;
};

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const { addItem } = useCart();
  const { store } = useStore();
  const options = product.variants.filter((v) => v.inStock);
  // Só pré-seleciona quando não há escolha a fazer: evita pedido no tamanho errado.
  const [selected, setSelected] = useState(options.length === 1 ? options[0].label : "");
  const [copied, setCopied] = useState(false);
  const onSale = isOnSale(product);
  const single = product.variants.length === 1 ? product.variants[0] : null;

  const handleAdd = () => {
    addItem(product, selected);
    onClose();
  };

  const share = async () => {
    const url = `${window.location.origin}/${store.slug}?${PRODUCT_PARAM}=${encodeURIComponent(product.id)}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, url });
      } catch {}
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <Sheet
      open
      onClose={onClose}
      labelledBy="product-title"
      width="54rem"
      history={`?${PRODUCT_PARAM}=${encodeURIComponent(product.id)}`}
      className="sm:h-[min(90dvh,36rem)]"
    >
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain sm:overflow-hidden sm:grid sm:grid-cols-2">
        <div className="relative aspect-square max-h-[44dvh] sm:max-h-none sm:aspect-auto sm:h-full w-full bg-brand-soft">
          <Image src={product.imageUrl} alt={product.name} fill sizes="(min-width: 640px) 432px, 100vw" className="object-cover" />
        </div>

        <div className="flex flex-col sm:min-h-0">
          <div className="flex-1 sm:overflow-y-auto overscroll-contain px-5 pt-5 pb-4 sm:px-8 sm:pt-16">
            <p className="text-sm text-brand-muted">{product.category}</p>
            <h2 id="product-title" className="headline font-bold text-2xl sm:text-3xl leading-tight mt-1">
              {product.name}
            </h2>

            <p className="mt-3 flex items-baseline flex-wrap gap-x-3 gap-y-1">
              <span className={`text-2xl font-semibold tabular-nums ${onSale ? "text-brand-primary" : "text-brand-dark"}`}>{formatPrice(product.price)}</span>
              {onSale && (
                <span className="text-brand-muted line-through tabular-nums">
                  <span className="sr-only">Antes: </span>{formatPrice(product.originalPrice!)}
                </span>
              )}
            </p>

            <p className="mt-4 text-[15px] text-brand-muted leading-relaxed">{product.description}</p>

            {product.variants.length > 1 ? (
              <fieldset className="mt-6">
                <legend className="text-sm font-medium text-brand-dark mb-2.5">Escolha uma opção</legend>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map(({ label, inStock }) => (
                    <button
                      key={label}
                      type="button"
                      aria-pressed={selected === label}
                      disabled={!inStock}
                      title={inStock ? undefined : "Esgotado"}
                      onClick={() => setSelected(label)}
                      className={`min-w-12 h-11 px-4 rounded-xl text-sm font-medium border transition-colors disabled:opacity-40 disabled:line-through disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-dark ${
                        selected === label ? "bg-brand-dark text-brand-light border-brand-dark" : "bg-white text-brand-dark border-brand-line hover:border-brand-dark/40"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </fieldset>
            ) : (
              single && single.label !== "Único" && <p className="mt-6 text-sm text-brand-dark">Opção: {single.label}</p>
            )}

            <a
              href={whatsappUrl(store.whatsapp, `Olá! Tenho uma dúvida sobre ${product.name}.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm text-brand-muted hover:text-brand-dark underline-offset-4 hover:underline"
            >
              <WhatsAppIcon className="w-4 h-4" />
              Tirar dúvida no WhatsApp
            </a>
          </div>

          <div className="sticky bottom-0 bg-white border-t border-brand-line sm:border-0 px-5 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-8 sm:pb-8">
            <button
              type="button"
              onClick={handleAdd}
              disabled={!selected}
              className="w-full h-13 rounded-full bg-brand-primary text-brand-light font-semibold text-base hover:bg-brand-dark transition-colors active:scale-[0.98] disabled:bg-brand-soft disabled:text-brand-muted disabled:active:scale-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-dark"
            >
              {options.length === 0 ? "Esgotado" : selected ? "Adicionar à sacola" : "Escolha uma opção"}
            </button>
          </div>
        </div>
      </div>

      <div className="absolute top-3 right-3 flex items-center gap-1.5">
        {copied && <span role="status" className="text-xs font-medium bg-brand-dark text-brand-light rounded-full px-3 py-1.5">Link copiado</span>}
        <SheetIconButton label="Compartilhar produto" onClick={share} className="bg-white/90 backdrop-blur shadow-sm">
          <ShareIcon className="w-[18px] h-[18px]" />
        </SheetIconButton>
        <SheetIconButton label="Fechar" onClick={onClose} className="bg-white/90 backdrop-blur shadow-sm">
          <CloseIcon />
        </SheetIconButton>
      </div>
    </Sheet>
  );
}
