import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import DeliverySteps from "@/components/DeliverySteps";
import DeliveryZones from "@/components/DeliveryZones";
import { WhatsAppIcon } from "@/components/icons";
import { getCatalog } from "@/lib/data";
import { whatsappUrl } from "@/lib/format";

type Props = { params: Promise<{ loja: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const catalog = await getCatalog((await params).loja);
  return { title: "Entregas", description: catalog ? `Entrega no mesmo dia em ${catalog.store.city} via Uber Flash.` : undefined };
}

export default async function EntregasPage({ params }: Props) {
  const catalog = await getCatalog((await params).loja);
  if (!catalog) notFound();
  const { store } = catalog;

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16 pb-16">
      <h1 className="headline font-bold text-4xl sm:text-5xl leading-[1.05]">Pediu agora, Uber na porta.</h1>
      <p className="mt-5 text-lg text-brand-muted max-w-2xl leading-relaxed">
        A {store.name} entrega em {store.city} no mesmo dia com Uber Flash. O frete é calculado pela corrida real e confirmado no WhatsApp antes do pagamento.
      </p>

      <h2 className="headline font-bold text-2xl mt-14 mb-4">Como funciona</h2>
      <DeliverySteps />

      {store.deliveryMode === "uber" ? (
        <>
          <h2 className="headline font-bold text-2xl mt-14 mb-4">Quanto custa o frete</h2>
          <p className="text-brand-muted leading-relaxed">
            O frete é cotado no Uber na hora em que você finaliza o pedido, pelo seu CEP e número. O valor aparece antes de enviar e vai junto na mensagem para a loja.
          </p>
          {store.zones.some((z) => z.pickup) && (
            <div className="mt-6">
              <DeliveryZones zones={store.zones.filter((z) => z.pickup)} />
            </div>
          )}
        </>
      ) : (
        store.zones.length > 0 && (
          <>
            <h2 className="headline font-bold text-2xl mt-14 mb-4">Bairros e frete</h2>
            <DeliveryZones zones={store.zones} />
            <p className="text-sm text-brand-muted mt-3">
              Valores estimados. O preço final depende da distância e da demanda do Uber no momento do pedido.
            </p>
          </>
        )
      )}

      <div className="mt-14 flex flex-col sm:flex-row gap-3">
        <Link href={`/${store.slug}`} className="inline-flex items-center justify-center h-12 px-6 rounded-full bg-brand-dark text-brand-light font-semibold hover:bg-brand-primary transition-colors">
          Ver produtos
        </Link>
        <a
          href={whatsappUrl(store.whatsapp, `Olá! Tenho uma dúvida sobre a entrega da ${store.name}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-white border border-brand-line font-semibold hover:border-brand-dark/40 transition-colors"
        >
          <WhatsAppIcon className="w-[18px] h-[18px]" />
          Tirar dúvida no WhatsApp
        </a>
      </div>
    </main>
  );
}
