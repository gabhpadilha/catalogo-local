import { notFound } from "next/navigation";
import Hero from "@/components/Hero";
import Catalog from "@/components/Catalog";
import CartButton from "@/components/CartButton";
import CartDrawer from "@/components/CartDrawer";
import CheckoutModal from "@/components/CheckoutModal";
import { getCatalog } from "@/lib/data";

export default async function StorePage({ params }: { params: Promise<{ loja: string }> }) {
  const catalog = await getCatalog((await params).loja);
  if (!catalog) notFound();

  return (
    <main className="min-h-screen overflow-x-hidden">
      <Hero store={catalog.store} />
      <Catalog />
      <CartButton />
      <CartDrawer />
      <CheckoutModal />
    </main>
  );
}
