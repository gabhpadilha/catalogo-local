import type { Metadata } from "next";
import DeliverySteps from "@/components/DeliverySteps";

export const metadata: Metadata = {
  title: "Como Funciona",
  description: "Escolha na vitrine, envie o pedido pelo WhatsApp, pague via Pix e receba hoje em Guaratuba.",
};

const STEPS = [
  { title: "Explore a Vitrine", text: "Escolha o produto e o tamanho direto no catálogo, sem sair da página." },
  { title: "Monte a Sacola", text: "Sem cadastro nem senha. A sacola fica salva no seu celular enquanto você navega." },
  { title: "Pedido no WhatsApp", text: "Informe nome e endereço e a mensagem chega pronta para a loja, com itens e tamanhos." },
  { title: "Pix e Entrega Hoje", text: "Confirmamos o frete do Uber Flash, você paga via Pix e o pedido sai no mesmo dia." },
];

export default function ComoFuncionaPage() {
  return (
    <main className="min-h-screen pt-40 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6 leading-[1.1]">
        COMPROU, <br />
        <span className="text-brand-primary">CHEGOU HOJE.</span>
      </h1>

      <p className="text-lg md:text-xl text-brand-muted mb-16 max-w-2xl font-medium">
        Esqueça os prazos de 7 dias úteis e fretes absurdos. Veja como é simples comprar no comércio de Guaratuba:
      </p>

      <DeliverySteps steps={STEPS} />
    </main>
  );
}
