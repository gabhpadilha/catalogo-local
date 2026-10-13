import type { Metadata } from "next";
import DeliverySteps from "@/components/DeliverySteps";
import DeliveryZones from "@/components/DeliveryZones";

export const metadata: Metadata = {
  title: "Entregas | Gribb",
  description: "Entrega no mesmo dia em Guaratuba via Uber Flash.",
};

export default function EntregasPage() {
  return (
    <main className="min-h-screen pt-40 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6 leading-[1.1]">
        PEDIU AGORA, <br />
        <span className="text-brand-primary">UBER NA PORTA.</span>
      </h1>

      <p className="text-lg md:text-xl text-brand-muted mb-16 max-w-2xl font-medium">
        Entregamos em Guaratuba no mesmo dia com Uber Flash. O frete é calculado pela corrida real e confirmado no WhatsApp antes do pagamento.
      </p>

      <DeliverySteps />

      <h2 className="text-3xl font-black tracking-tight text-brand-dark mt-20 mb-6">Bairros atendidos</h2>
      <DeliveryZones />
      <p className="text-sm text-brand-muted mt-4">
        Valores estimados. O preço final depende da distância e da demanda do Uber no momento do pedido.
      </p>
    </main>
  );
}
