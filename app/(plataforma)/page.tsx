import StoreCard from "@/components/StoreCard";
import MarketSearch from "@/components/market/MarketSearch";
import OpenCarts from "@/components/market/OpenCarts";
import Shelf from "@/components/market/Shelf";
import HowItWorksStrip from "@/components/market/HowItWorksStrip";
import { getSearchIndex, getStores } from "@/lib/data";
import { PLATFORM } from "@/lib/platform";
import { homeShelves, topCategories } from "@/lib/search";

export const revalidate = 60;

// Ordem: busca → produtos → como funciona → lojas. A busca substitui tudo abaixo dela.
export default async function Home() {
  const [stores, index] = await Promise.all([getStores(), getSearchIndex()]);
  const shelves = homeShelves(index.items);
  const storeBySlug = Object.fromEntries(index.stores.map((s) => [s.slug, s]));

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-14 pb-16">
      <OpenCarts stores={index.stores} />

      <MarketSearch title="Precisou? Chega hoje." tagline={PLATFORM.tagline} categories={topCategories(index.items)}>
        {shelves.map((s, i) => (
          <Shelf key={s.id} id={s.id} title={s.title} items={s.items} stores={storeBySlug} eager={i === 0} />
        ))}

        <HowItWorksStrip />

        <section aria-labelledby="lojas" className="mt-14 sm:mt-20">
          <div className="flex items-baseline justify-between gap-4 mb-5">
            <h2 id="lojas" className="headline font-bold text-2xl sm:text-3xl scroll-mt-24">Lojas</h2>
            {stores.length > 0 && (
              <p className="text-sm text-brand-muted tabular-nums">
                {stores.length} {stores.length === 1 ? "loja" : "lojas"}
              </p>
            )}
          </div>
          {stores.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {stores.map((s) => (
                <li key={s.id}>
                  <StoreCard store={s} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-brand-muted">Nenhuma loja publicada ainda.</p>
          )}
        </section>
      </MarketSearch>
    </main>
  );
}
