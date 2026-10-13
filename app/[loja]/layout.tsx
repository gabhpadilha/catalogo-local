import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import { StoreProvider } from "@/components/StoreProvider";
import { CartProvider } from "@/components/CartProvider";
import { SearchProvider } from "@/components/SearchProvider";
import { getCatalog, getStores } from "@/lib/data";

// Páginas estáticas, regeneradas no máximo a cada 60 s (poupa a cota gratuita).
export const revalidate = 60;

export async function generateStaticParams() {
  return (await getStores()).map((s) => ({ loja: s.slug }));
}

type Props = { params: Promise<{ loja: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const catalog = await getCatalog((await params).loja);
  if (!catalog) return {};
  const { store } = catalog;
  return { title: { default: store.name, template: `%s | ${store.name}` }, description: store.tagline };
}

export async function generateViewport({ params }: Props): Promise<Viewport> {
  const catalog = await getCatalog((await params).loja);
  return { themeColor: catalog?.store.theme.dark ?? "#0D0D0D" };
}

export default async function StoreLayout({ params, children }: Props & { children: React.ReactNode }) {
  const catalog = await getCatalog((await params).loja);
  if (!catalog) notFound();
  const { theme } = catalog.store;

  // As cores da loja sobrescrevem as variáveis do tema Tailwind só dentro da vitrine.
  const style = {
    "--color-brand-primary": theme.primary,
    "--color-brand-dark": theme.dark,
    "--color-brand-light": theme.light,
  } as React.CSSProperties;

  return (
    <div style={style} className="min-h-screen bg-brand-light">
      <StoreProvider catalog={catalog}>
        <CartProvider>
          <SearchProvider>
            <Navbar />
            {children}
          </SearchProvider>
        </CartProvider>
      </StoreProvider>
    </div>
  );
}
