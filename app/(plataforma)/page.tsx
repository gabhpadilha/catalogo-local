import StoreCard from "@/components/StoreCard";
import { getStores } from "@/lib/data";
import { PLATFORM } from "@/lib/platform";

export const revalidate = 60;

export default async function Home() {
  const stores = await getStores();

  return (
    <main className="min-h-screen pt-40 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-[0.95]">
        PRECISOU? <br />
        <span className="text-brand-primary">CHEGA HOJE.</span>
      </h1>
      <p className="text-lg md:text-xl text-brand-muted mb-14 max-w-2xl font-medium">{PLATFORM.tagline}</p>

      <h2 className="text-2xl font-black tracking-tight mb-6">Lojas em {PLATFORM.city}</h2>
      {stores.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stores.map((s) => (
            <StoreCard key={s.id} store={s} />
          ))}
        </div>
      ) : (
        <p className="text-brand-muted">Nenhuma loja publicada ainda.</p>
      )}
    </main>
  );
}
