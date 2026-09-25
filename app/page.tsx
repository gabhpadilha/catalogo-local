import Hero from "@/components/Hero";
import Catalog from "@/components/Catalog";
import CartButton from "@/components/CartButton";
import CartDrawer from "@/components/CartDrawer";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <Hero />
      <Catalog />
      <CartButton />
      <CartDrawer />
    </main>
  );
}
