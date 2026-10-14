import Link from "next/link";
import AdminHeader from "@/components/admin/AdminHeader";
import DeliveryToggle from "@/components/admin/DeliveryToggle";
import ProductRow from "@/components/admin/ProductRow";
import { ghostButton, primaryButton } from "@/components/admin/ui";
import { getAdminProducts, requireStore } from "@/lib/admin";

export default async function StoreDashboard({ params }: { params: Promise<{ loja: string }> }) {
  const { loja } = await params;
  const { store, role } = await requireStore(loja);
  const products = await getAdminProducts(loja);

  return (
    <main className="px-4 pb-16 max-w-2xl mx-auto">
      <AdminHeader title={store.name} subtitle={`${products.length} produto${products.length === 1 ? "" : "s"}`} />

      {!store.is_active && (
        <p className="rounded-2xl bg-amber-50 text-amber-800 text-sm font-bold p-4 mb-4">
          Sua vitrine ainda não está publicada. Fale com o suporte da plataforma para ativá-la.
        </p>
      )}

      <DeliveryToggle slug={loja} open={store.delivery_open} />

      <div className="flex flex-wrap gap-2 my-6">
        <Link href={`/admin/${loja}/produtos/novo`} className={`${primaryButton} flex-1`}>
          + Novo produto
        </Link>
        {role === "owner" && (
          <Link href={`/admin/${loja}/loja`} className={ghostButton + " h-12"}>
            Configurar loja
          </Link>
        )}
        <a href={`/${loja}`} target="_blank" rel="noopener noreferrer" className={ghostButton + " h-12"}>
          Ver vitrine ↗
        </a>
      </div>

      {products.length === 0 ? (
        <p className="text-center text-brand-muted py-12">Nenhum produto ainda. Toque em &ldquo;Novo produto&rdquo; para começar.</p>
      ) : (
        <ul className="space-y-3">
          {products.map((p) => (
            <ProductRow key={p.id} slug={loja} product={p} />
          ))}
        </ul>
      )}
    </main>
  );
}
