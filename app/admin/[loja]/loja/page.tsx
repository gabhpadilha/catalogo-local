import { notFound } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import StoreForm from "@/components/admin/StoreForm";
import { getAdminZones, requireStore } from "@/lib/admin";

export default async function StoreSettingsPage({ params }: { params: Promise<{ loja: string }> }) {
  const { loja } = await params;
  const { store, role } = await requireStore(loja);
  if (role !== "owner") notFound();
  const zones = await getAdminZones(loja);

  return (
    <main className="px-4 pb-16 max-w-2xl mx-auto">
      <AdminHeader back={{ href: `/admin/${loja}`, label: "Produtos" }} title="Configurar loja" subtitle="Cores, logo, contato e entregas." />
      <StoreForm store={store} zones={zones} />
    </main>
  );
}
