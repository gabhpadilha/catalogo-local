import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import StoreFooter from "@/components/StoreFooter";
import CartButton from "@/components/CartButton";
import CartDrawer from "@/components/CartDrawer";
import CartToast from "@/components/CartToast";
import CheckoutModal from "@/components/CheckoutModal";
import VisitTracker from "@/components/VisitTracker";
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
    <div style={style} className="min-h-screen flex flex-col bg-brand-light text-brand-dark">
      <StoreProvider catalog={catalog}>
        <CartProvider>
          <SearchProvider>
            <Navbar />
            <div className="flex-1">{children}</div>
            <StoreFooter store={catalog.store} />
            {/* Sacola e checkout em todas as páginas da loja (o cabeçalho abre a sacola de qualquer uma). */}
            <CartButton />
            <CartToast />
            <CartDrawer />
            <CheckoutModal />
            <VisitTracker slug={catalog.store.slug} />
          </SearchProvider>
        </CartProvider>
      </StoreProvider>
    </div>
  );
}
