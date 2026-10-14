import StoreCard from "@/components/StoreCard";
import MarketSearch from "@/components/market/MarketSearch";
import OpenCarts from "@/components/market/OpenCarts";
import Shelf from "@/components/market/Shelf";
import { getSearchIndex, getStores } from "@/lib/data";
import { PLATFORM } from "@/lib/platform";
import { pickShelf, topCategories } from "@/lib/search";

export const revalidate = 60;

export default async function Home() {
  const [stores, index] = await Promise.all([getStores(), getSearchIndex()]);
  const shelf = pickShelf(index.items, PLATFORM.city);
  const storeBySlug = new Map(index.stores.map((s) => [s.slug, s]));

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-14 pb-16">
      <OpenCarts stores={index.stores} />

      <MarketSearch title="Precisou? Chega hoje." tagline={PLATFORM.tagline} categories={topCategories(index.items)}>
        <section aria-labelledby="lojas" className="mt-12 sm:mt-16">
          <div className="flex items-baseline justify-between gap-4 mb-5">
            <h2 id="lojas" className="headline font-bold text-2xl sm:text-3xl">Lojas em {PLATFORM.city}</h2>
            {stores.length > 0 && (
              <p className="text-sm text-brand-muted tabular-nums">
                {stores.length} {stores.length === 1 ? "loja" : "lojas"}
              </p>
            )}
          </div>
          {stores.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stores.map((s, i) => (
                <li key={s.id}>
                  {/* A primeira fileira aparece sem rolar: carrega já. */}
                  <StoreCard store={s} eager={i < 3} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-brand-muted">Nenhuma loja publicada ainda.</p>
          )}
        </section>

        {shelf.items.length > 0 && <Shelf title={shelf.title} items={shelf.items} stores={storeBySlug} />}
      </MarketSearch>
    </main>
  );
}
