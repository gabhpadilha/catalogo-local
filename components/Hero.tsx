import Image from "next/image";
import Link from "next/link";
import type { StoreCatalog } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { ChevronRightIcon, TruckIcon } from "./icons";

// Resumo de frete a partir das zonas cadastradas pela loja.
function deliverySummary({ zones, deliveryOpen }: StoreCatalog["store"]) {
  const fees = zones.filter((z) => !z.pickup).map((z) => z.fee);
  const pickup = zones.some((z) => z.pickup);
  if (!deliveryOpen) {
    return pickup ? "Você ainda pode pedir e combinar a retirada no WhatsApp." : "Você ainda pode pedir e combinar a entrega no WhatsApp.";
  }
  const fee = fees.length ? `Uber Flash a partir de ${formatPrice(Math.min(...fees))}.` : "Frete combinado no WhatsApp.";
  return pickup ? `${fee} Ou retire grátis na loja.` : fee;
}

export default function Hero({ store, products }: StoreCatalog) {
  const { hero } = store;
  // Sem imagem de destaque, a vitrine abre com a foto do primeiro produto.
  const cutout = hero.imageUrl;
  const photo = !cutout ? products[0]?.imageUrl : undefined;
  // O título é escrito pelo lojista: a fonte encolhe até a palavra mais longa caber inteira na linha.
  const longestWord = Math.max(6, ...`${hero.title} ${hero.highlight}`.split(/\s+/).map((w) => w.length));
  const titleSize = { fontSize: `min(var(--hero-max), calc(100cqw / ${(longestWord * 0.82).toFixed(2)}))` };

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
      <div className="grid gap-3 sm:gap-4 lg:grid-cols-[minmax(0,1fr)_19rem]">
        {/* Mobile: título na largura toda e imagem ao lado do botão. Desktop: imagem na coluna da direita. */}
        <div className="relative overflow-hidden rounded-3xl bg-brand-tint grid gap-x-4 gap-y-6 sm:gap-x-8 sm:gap-y-8 p-6 sm:p-10 lg:p-12 grid-cols-[minmax(0,1fr)_auto] sm:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] sm:grid-rows-[1fr_auto] [grid-template-areas:'text_text'_'cta_img'] sm:[grid-template-areas:'text_img'_'cta_img']">
          <div className="[grid-area:text] @container self-end">
            <h1 style={titleSize} className="headline font-bold leading-[1.02] text-brand-dark break-words [--hero-max:2.5rem] sm:[--hero-max:3.25rem] lg:[--hero-max:4rem]">
              {hero.title} {hero.highlight && <span className="text-brand-primary">{hero.highlight}</span>}
            </h1>
            {hero.text && <p className="mt-4 text-[15px] sm:text-lg text-brand-muted max-w-md leading-relaxed">{hero.text}</p>}
          </div>

          <div className="[grid-area:cta] self-center sm:self-start">
            <a
              href="#catalogo"
              className="inline-flex items-center h-12 px-6 rounded-full bg-brand-dark text-brand-light font-semibold hover:bg-brand-primary transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-dark"
            >
              Ver produtos
            </a>
          </div>

          <div className={`[grid-area:img] relative w-36 h-20 -my-4 sm:w-auto sm:h-auto sm:my-0 sm:min-h-80 ${cutout ? "" : "hidden sm:block"}`}>
            {cutout ? (
              <Image
                src={cutout}
                alt=""
                fill
                preload
                sizes="(min-width: 1024px) 420px, (min-width: 640px) 40vw, 160px"
                className="object-contain drop-shadow-[0_14px_12px_rgba(0,0,0,0.14)] scale-150 sm:scale-110"
              />
            ) : photo ? (
              <Image src={photo} alt="" fill preload sizes="(min-width: 1024px) 420px, 40vw" className="object-cover rounded-2xl" />
            ) : null}
          </div>
        </div>

        {/* O momento de cor da loja: a promessa de entrega, que leva à página de frete. */}
        <Link
          href={`/${store.slug}/entregas`}
          className="group rounded-3xl bg-brand-primary text-brand-light p-5 sm:p-8 flex lg:flex-col items-center lg:items-start justify-between gap-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-dark"
        >
          <TruckIcon className="hidden lg:block w-8 h-8 opacity-90" />
          <div className="min-w-0">
            <p className="headline font-bold text-xl sm:text-2xl lg:text-3xl leading-tight">
              {store.deliveryOpen ? `Entrega hoje em ${store.city}` : "Entregas pausadas hoje"}
            </p>
            <p className="mt-1.5 lg:mt-3 text-sm sm:text-base opacity-85 leading-snug">{deliverySummary(store)}</p>
            <span className="hidden lg:inline-block mt-6 font-semibold underline-offset-4 group-hover:underline">Ver bairros e frete</span>
          </div>
          <ChevronRightIcon className="lg:hidden w-6 h-6 shrink-0 opacity-90" />
        </Link>
      </div>
    </section>
  );
}
