import AdminHeader from "@/components/admin/AdminHeader";
import ProductForm from "@/components/admin/ProductForm";
import { getAdminProducts, requireStore } from "@/lib/admin";

export default async function NewProductPage({ params }: { params: Promise<{ loja: string }> }) {
  const { loja } = await params;
  const { store } = await requireStore(loja);
  const categories = [...new Set((await getAdminProducts(loja)).map((p) => p.category))];

  return (
    <main className="px-4 pb-16 max-w-2xl mx-auto">
      <AdminHeader back={{ href: `/admin/${loja}`, label: "Produtos" }} title="Novo produto" />
      <ProductForm slug={loja} storeId={store.id} categories={categories} />
    </main>
  );
}
