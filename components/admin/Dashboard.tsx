import Link from "next/link";
import type { AdminProduct, AdminStore, StoreStats } from "@/lib/admin";
import type { SetupStep } from "@/lib/adminSetup";
import { PLATFORM } from "@/lib/platform";
import { whatsappUrl } from "@/lib/format";
import AdminHeader from "./AdminHeader";
import DeliveryToggle from "./DeliveryToggle";
import ProductRow from "./ProductRow";
import SetupChecklist from "./SetupChecklist";
import ShareCard from "./ShareCard";
import StatsCard from "./StatsCard";
import { ghostButton, primaryButton } from "./ui";

type Props = {
  store: AdminStore;
  products: AdminProduct[];
  stats: StoreStats;
  steps: SetupStep[];
  siteUrl: string;
  qrSvg: string;
  canConfigure: boolean;
  demo?: boolean;
};

// Painel do lojista: resultado → configuração pendente → divulgação → operação do dia → produtos.
export default function Dashboard({ store, products, stats, steps, siteUrl, qrSvg, canConfigure, demo = false }: Props) {
  const base = `/admin/${store.slug}`;
  const sales = whatsappUrl(PLATFORM.salesWhatsapp, `Olá! Vi a demonstração do painel e quero a vitrine da minha loja na ${PLATFORM.name}.`);

  return (
    <main className="px-4 pb-16 max-w-2xl mx-auto">
      <AdminHeader title={store.name} subtitle={`${products.length} produto${products.length === 1 ? "" : "s"}`} demo={demo} />

      <div className="space-y-3">
        {demo && (
          <p role="note" className="rounded-2xl bg-amber-100 text-amber-950 text-sm p-4">
            <strong className="font-semibold">Demonstração.</strong> Este é o painel de uma loja fictícia, com números de exemplo. Pode mexer à vontade: nada é salvo.{" "}
            <a href={sales} target="_blank" rel="noopener noreferrer" className="font-semibold underline underline-offset-4">
              Quero o painel da minha loja
            </a>
          </p>
        )}
        {!store.is_active && !demo && (
          <p className="rounded-2xl bg-amber-50 text-amber-800 text-sm font-medium p-4">
            Sua vitrine ainda não está publicada. Fale com o suporte da plataforma para ativá-la.
          </p>
        )}

        <StatsCard stats={stats} />
        {!demo && <SetupChecklist steps={steps} />}
        <ShareCard url={siteUrl} storeName={store.name} qrSvg={qrSvg} />
        <DeliveryToggle slug={store.slug} open={store.delivery_open} demo={demo} />
      </div>

      <div className="flex flex-wrap gap-2 mt-8 mb-4 items-center">
        <h2 className="headline font-bold text-lg mr-auto">Produtos</h2>
        <a href={`/${store.slug}`} target="_blank" rel="noopener noreferrer" className={ghostButton}>
          Ver vitrine
        </a>
        {canConfigure && !demo && (
          <Link href={`${base}/loja`} className={ghostButton}>
            Configurar loja
          </Link>
        )}
        {!demo && (
          <Link href={`${base}/produtos/novo`} className={primaryButton.replace("h-12", "h-10")}>
            Novo produto
          </Link>
        )}
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl bg-white ring-1 ring-brand-line p-8 text-center">
          <p className="font-semibold">Sua vitrine ainda está vazia</p>
          <p className="text-sm text-brand-muted mt-1">Cadastre o primeiro produto: foto, nome e preço já bastam.</p>
          <Link href={`${base}/produtos/novo`} className={`${primaryButton} mt-5`}>
            Cadastrar primeiro produto
          </Link>
        </div>
      ) : (
        <ul className="space-y-2">
          {products.map((p) => (
            <ProductRow key={p.id} slug={store.slug} product={p} demo={demo} />
          ))}
        </ul>
      )}
    </main>
  );
}
