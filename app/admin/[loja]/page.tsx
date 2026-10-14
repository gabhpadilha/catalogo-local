import Dashboard from "@/components/admin/Dashboard";
import { getAdminProducts, getAdminZones, getStoreStats, requireStore } from "@/lib/admin";
import { setupSteps } from "@/lib/adminSetup";
import { storeShareInfo } from "@/lib/share";

export default async function StoreDashboard({ params }: { params: Promise<{ loja: string }> }) {
  const { loja } = await params;
  const { store, role } = await requireStore(loja);
  const [products, zones, stats, share] = await Promise.all([getAdminProducts(loja), getAdminZones(loja), getStoreStats(loja), storeShareInfo(loja)]);

  return (
    <Dashboard
      store={store}
      products={products}
      stats={stats}
      steps={setupSteps(store, products, zones.length, `/admin/${loja}`)}
      siteUrl={share.url}
      qrSvg={share.qrSvg}
      canConfigure={role === "owner"}
    />
  );
}
