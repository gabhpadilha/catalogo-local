import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DeliverySteps from "@/components/DeliverySteps";
import DeliveryZones from "@/components/DeliveryZones";
import { getCatalog } from "@/lib/data";

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
    <main className="min-h-screen pt-40 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6 leading-[1.1]">
        PEDIU AGORA, <br />
        <span className="text-brand-primary">UBER NA PORTA.</span>
      </h1>

      <p className="text-lg md:text-xl text-brand-muted mb-16 max-w-2xl font-medium">
        A {store.name} entrega em {store.city} no mesmo dia com Uber Flash. O frete é calculado pela corrida real e confirmado no WhatsApp antes do pagamento.
      </p>

      <DeliverySteps />

      <h2 className="text-3xl font-black tracking-tight text-brand-dark mt-20 mb-6">Bairros atendidos</h2>
      <DeliveryZones zones={store.zones} />
      <p className="text-sm text-brand-muted mt-4">
        Valores estimados. O preço final depende da distância e da demanda do Uber no momento do pedido.
      </p>
    </main>
  );
}
