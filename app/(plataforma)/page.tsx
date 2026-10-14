import StoreCard from "@/components/StoreCard";
import { getStores } from "@/lib/data";
import { PLATFORM } from "@/lib/platform";

export const revalidate = 60;

export default async function Home() {
  const stores = await getStores();

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-16">
      <h1 className="headline font-bold text-5xl sm:text-7xl leading-[1]">Precisou? Chega hoje.</h1>
      <p className="mt-5 text-lg sm:text-xl text-brand-muted max-w-xl leading-relaxed">{PLATFORM.tagline}</p>

      <section aria-labelledby="lojas" className="mt-14 sm:mt-20">
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
    </main>
  );
}
