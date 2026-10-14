import { notFound } from "next/navigation";
import Dashboard from "@/components/admin/Dashboard";
import type { AdminProduct, AdminStore } from "@/lib/admin";
import { getCatalog } from "@/lib/data";
import { storeShareInfo } from "@/lib/share";

// Painel de demonstração para a venda: loja fictícia, só leitura, sem login.
// Nada aqui chama o banco para escrever (os componentes recebem demo e mudam só a tela).
const DEMO_SLUG = "ferragem-baia";

export const metadata = { title: "Demonstração do painel" };

export default async function DemoDashboard() {
  const catalog = await getCatalog(DEMO_SLUG);
  if (!catalog) notFound();
  const { store: s, products: p } = catalog;

  const store: AdminStore = {
    id: s.id, slug: s.slug, name: s.name, segment: s.segment, tagline: s.tagline, whatsapp: s.whatsapp, instagram: s.instagram ?? null,
    address: s.address ?? null, delivery_open: s.deliveryOpen, delivery_mode: s.deliveryMode, is_active: true, theme: s.theme, hero: s.hero, logo_url: s.logoUrl ?? null,
  };
  const products: AdminProduct[] = p.map((x, i) => ({
    id: x.id, name: x.name, description: x.description, category: x.category, price: x.price, original_price: x.originalPrice ?? null,
    image_url: x.imageUrl, is_active: true, sort_order: i,
    product_variants: x.variants.map((v, j) => ({ label: v.label, stock: v.inStock ? null : 0, sort_order: j })),
  }));
  const share = await storeShareInfo(DEMO_SLUG);

  return (
    <Dashboard
      store={store}
      products={products}
      stats={{ todayOrders: 3, todayTotal: 287.4, weekOrders: 18, weekTotal: 2140.6, weekVisits: 412 }}
      steps={[]}
      siteUrl={share.url}
      qrSvg={share.qrSvg}
      canConfigure={false}
      demo
    />
  );
}
