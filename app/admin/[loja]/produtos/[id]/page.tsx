import { notFound } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import ProductForm from "@/components/admin/ProductForm";
import { getAdminProducts, requireStore } from "@/lib/admin";

export default async function EditProductPage({ params }: { params: Promise<{ loja: string; id: string }> }) {
  const { loja, id } = await params;
  const { store } = await requireStore(loja);
  const products = await getAdminProducts(loja);
  const product = products.find((p) => p.id === id);
  if (!product) notFound();

  return (
    <main className="px-4 pb-16 max-w-2xl mx-auto">
      <AdminHeader back={{ href: `/admin/${loja}`, label: "Produtos" }} title="Editar produto" />
      <ProductForm slug={loja} storeId={store.id} product={product} categories={[...new Set(products.map((p) => p.category))]} />
    </main>
  );
}
